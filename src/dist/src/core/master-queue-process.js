"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processFromMaster = void 0;
const model_converter_1 = require("../model-converter");
async function processFromMaster(channel, queues) {
    const sub_queues = queues.filter(x => x != "master");
    await channel.consume('master', (message) => {
        const pubString = message === null || message === void 0 ? void 0 : message.content.toString();
        if (pubString !== undefined) {
            const publication = model_converter_1.pubStringtoPub(pubString);
            sub_queues.forEach((queue) => {
            });
        }
    });
}
exports.processFromMaster = processFromMaster;
//# sourceMappingURL=master-queue-process.js.map