"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = __importDefault(require("amqplib"));
const axios_1 = __importDefault(require("axios"));
const broker_config_json_1 = __importDefault(require("./../../broker-config.json"));
const master_queue_process_1 = require("../core/master-queue-process");
async function connect() {
    const conn = await amqplib_1.default.connect(broker_config_json_1.default.url);
    const channel = await conn.createChannel();
    const queues_response = await axios_1.default.get(broker_config_json_1.default.queuesEndpoint, {
        auth: { username: broker_config_json_1.default.username, password: broker_config_json_1.default.password }
    });
    const queues = queues_response.data.map((element) => element.name);
    await master_queue_process_1.processFromMaster(channel, queues);
}
connect();
//# sourceMappingURL=broker.js.map