"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Phone = void 0;
class Phone {
    constructor(value) {
        this.value = value;
        // Aceita formatos internacionais e nacionais comuns
        if (!/^\+?\d{10,15}$/.test(value)) {
            throw new Error("Invalid phone number format");
        }
    }
}
exports.Phone = Phone;
