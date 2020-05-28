import amqpLib from 'amqplib';
import { IActiveSubscription, IQueueSubscription, IMessage, IPubField } from '../models';
import { subStringToISub, pubStringtoPub } from '../model-converter';
import { publicationMatchToSubscription } from './matcher';
import { SUBSCRIPTIONQUEUE } from './statics';

export class MessageBroker {
    private readonly activeSubscriptions: IActiveSubscription[] = new Array<IActiveSubscription>();

    constructor(private readonly channel: amqpLib.Channel) {

        channel.addListener("consumer.deleted", (...args) => {
            console.log(args);
        })
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

            masterChannel.sendToQueue(SUBSCRIPTIONQUEUE, new Buffer(JSON.stringify(brokerSubscription)));
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
                        console.log(`Routing from ${publicationQueue} message ${message.content.toString()} to ${activeSub.replyTo}`)
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

        console.log(`My updated routing table is: ${JSON.stringify(this.activeSubscriptions)}`)
    }
}