import amqpLib from 'amqplib';
import { IActiveSubscription, IQueueSubscription, IMessage, IPubField, IStatistic } from '../models';
import { subStringToISub, pubStringtoPub } from '../model-converter';
import { publicationMatchToSubscription } from './matcher';
import { SUBSCRIPTIONQUEUE } from './statics';
import { createQueue } from './create-queue';

export class MessageBroker {
    private readonly activeSubscriptions: IActiveSubscription[] = new Array<IActiveSubscription>();

    constructor(private readonly channel: amqpLib.Channel) {
        this.subscribeToQueueDeletions();
    }

    public async listenToSubscriptions(): Promise<void> {
        await this.channel.consume(SUBSCRIPTIONQUEUE, (message: amqpLib.ConsumeMessage | null) => {
            if (!message) {
                return;
            }

            this.addSubscriptionToRoutingTable(message);
            this.channel.ack(message);
        });
    }

    public async listenToSubscriptionsAsASlave(masterChannel: amqpLib.Channel, publicationsQueue: string): Promise<void> {
        await this.channel.consume(SUBSCRIPTIONQUEUE, (message: amqpLib.ConsumeMessage | null) => {
            if (!message) {
                return;
            }

            const subscriptionMessage = JSON.parse(message.content.toString()) as IQueueSubscription;
            this.addSubscriptionToRoutingTable(message);
            this.channel.ack(message);

            const brokerSubscription: IQueueSubscription = {
                replyTo: publicationsQueue,
                subscription: subscriptionMessage.subscription
            }

            masterChannel.sendToQueue(SUBSCRIPTIONQUEUE, Buffer.from(JSON.stringify(brokerSubscription)));
        });
    }

    public async routePublications(masterChannel: amqpLib.Channel, publicationQueue: string): Promise<void> {
        await masterChannel.consume(publicationQueue, (message: amqpLib.ConsumeMessage | null) => {
            if (!message) {
                return;
            }

            const pub: IMessage<IPubField> = pubStringtoPub(message.content.toString());

            let ack: boolean = false;

            this.activeSubscriptions.forEach((activeSub: IActiveSubscription) => {
                for (let i = 0; i < activeSub.subscriptions.length; i++) {
                    if (publicationMatchToSubscription(pub, activeSub.subscriptions[i])) {
                        this.channel.sendToQueue(activeSub.replyTo, message.content);
                        ack = true;
                        break;
                    }
                }
            });

            if (ack) {
                masterChannel.ack(message);
            }
        });
    }

    private addSubscriptionToRoutingTable(message: amqpLib.ConsumeMessage) {
        const subscriptionMessage = JSON.parse(message.content.toString()) as IQueueSubscription;
        const activeSub: IActiveSubscription | undefined =
            this.activeSubscriptions.find(sub => sub.replyTo === subscriptionMessage.replyTo);

        if (activeSub !== undefined) {
            activeSub.subscriptions.push(subStringToISub(subscriptionMessage.subscription));
        } else {
            this.activeSubscriptions.push({
                replyTo: subscriptionMessage.replyTo,
                subscriptions: [subStringToISub(subscriptionMessage.subscription)]
            });
        }
        this.logActiveSubscriptions();
    }

    private async subscribeToQueueDeletions(): Promise<void> {

        await createQueue(this.channel, "events");
        await this.channel.bindQueue("events", "amq.rabbitmq.event", "queue.deleted");

        await this.channel.consume("events", (message: amqpLib.ConsumeMessage | null) => {
            if (!message) {
                return;
            }
            this.channel.ack(message);
            const queueName: string = message.properties.headers.name;

            const index = this.activeSubscriptions.findIndex(sub => sub.replyTo === queueName);
            if (index === -1) {
                return;
            }

            this.activeSubscriptions.splice(index, 1);
            this.logActiveSubscriptions();
        });
    }

    private logActiveSubscriptions(): void {
        const stats: IStatistic[] = this.activeSubscriptions.map(activeSub => {
            const stat: IStatistic = { consumer: activeSub.replyTo, subscriptions: activeSub.subscriptions.length };
            return stat;
        });

        console.log("Active Subscriptions: ",JSON.stringify(stats));
    }
}