"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_converter_1 = require("./model-converter");
const subscriptionString = '{(car,=,Nissan);(speed,<=,50)}';
const publicationString = '{(car,Nissan),(speed,20),(city,Iasi)}';
function exec() {
    const x = model_converter_1.subStringToISub(subscriptionString);
    console.log(x);
}
function pub() {
    const x = model_converter_1.pubStringtoPub(publicationString);
    console.log(x);
}
exec();
pub();
//# sourceMappingURL=gen.js.map