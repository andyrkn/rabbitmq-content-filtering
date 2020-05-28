import amqplib from 'amqplib';
import cfg from './../../broker-config.json';
import { MessageBroker, createQueue } from '../core';
import { v4 as uuid } from 'uuid';
/*
async function connect() {

    if (cfg.masterBroker) {
        await connectAsMaster();
    } else {
        await connectAsSlave();
    }

    // this will close the connections and the listeners
    // channel.close();
    // conn.close();
}
*/

export async function connectAsMaster() {
    const conn = await amqplib.connect(cfg.masterUrl);
    const channel: amqplib.Channel = await conn.createChannel();

    const broker: MessageBroker = new MessageBroker(channel);

    await broker.listenToSubscriptions();
    await broker.routePublications(channel, "master");
}

export async function connectAsSlave() {
    const masterConn = await amqplib.connect(cfg.masterUrl);
    const masterChannel: amqplib.Channel = await masterConn.createChannel();

    const slaveConn = await amqplib.connect(cfg.slaveUrl);
    const slaveChannel: amqplib.Channel = await slaveConn.createChannel();

    const broker: MessageBroker = new MessageBroker(slaveChannel);


    const publicationsQueue: string = uuid();
    await createQueue(masterChannel, publicationsQueue);

    await broker.listenToSubscriptionsAsASlave(masterChannel, publicationsQueue);
    await broker.routePublications(masterChannel, publicationsQueue);
}