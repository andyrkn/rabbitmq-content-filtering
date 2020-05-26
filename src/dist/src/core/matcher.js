"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicationMatchToSubscription = void 0;
async function publicationMatchToSubscription(pub, sub) {
    if (sub.car) {
        if (pub.car) {
            if (!ops[sub.car.op](sub.car.value, pub.car.value))
                return false;
        }
    }
    if (sub.city) {
        if (pub.city) {
            if (!ops[sub.city.op](sub.city.value, pub.city.value))
                return false;
        }
    }
    if (sub.speed) {
        if (pub.speed) {
            if (!ops[sub.speed.op](Number(sub.speed.value), Number(pub.speed.value)))
                return false;
        }
    }
    if (sub.time) {
        if (pub.time) {
            if (!ops[sub.time.op](Number(sub.time.value), Number(pub.time.value)))
                return false;
        }
    }
}
exports.publicationMatchToSubscription = publicationMatchToSubscription;
const ops = {
    '<=': (x, y) => x <= y ? true : false,
    '>=': (x, y) => x >= y ? true : false,
    '<': (x, y) => x < y ? true : false,
    '>': (x, y) => x > y ? true : false,
    '=': (x, y) => x === y ? true : false,
    '!=': (x, y) => x !== y ? true : false
};
//# sourceMappingURL=matcher.js.map