"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pubStringtoPub = exports.subStringToISub = void 0;
function subStringToISub(sub) {
    const valuesArray = sub
        .replace(/(\()|(\))|(\})|(\{)/g, '')
        .replace(/(,)/g, ';')
        .split(';');
    const subscription = {};
    for (let i = 0; i < valuesArray.length; i += 3) {
        const field = {
            name: valuesArray[i],
            op: valuesArray[i + 1],
            value: valuesArray[i + 2]
        };
        subscription[valuesArray[i]] = field;
    }
    return subscription;
}
exports.subStringToISub = subStringToISub;
function pubStringtoPub(pub) {
    const valuesArray = pub
        .replace(/(\()|(\))|(\})|(\{)/g, '')
        .replace(/(,)/g, ';')
        .split(';');
    const publication = {};
    for (let i = 0; i < valuesArray.length; i += 2) {
        const field = {
            name: valuesArray[i],
            value: valuesArray[i + 1]
        };
        publication[valuesArray[i]] = field;
    }
    return publication;
}
exports.pubStringtoPub = pubStringtoPub;
//# sourceMappingURL=sub-to-ISub.js.map