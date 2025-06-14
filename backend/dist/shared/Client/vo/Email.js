"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
class Email {
    value;
    constructor(value) {
        this.value = value;
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
            throw new Error("Invalid email format");
        }
    }
}
exports.Email = Email;
//# sourceMappingURL=Email.js.map