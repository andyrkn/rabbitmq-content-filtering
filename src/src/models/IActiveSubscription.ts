import { ISubField } from "./IField";
import { IMessage } from "./IMessage";

export interface IActiveSubscription {
    subscriptions: Array<IMessage<ISubField>>;
    replyTo: string;
}