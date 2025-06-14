"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Phone = void 0;
class Phone {
    value;
    constructor(value) {
        this.value = value;
        if (!/^\+?\d{10,15}$/.test(value)) {
            throw new Error("Invalid phone number format");
        }
    }
}
exports.Phone = Phone;
//# sourceMappingURL=Phone.js.map