"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientId = void 0;
const uuid_1 = require("uuid");
class ClientId {
    value;
    constructor(value) {
        if (value && !(0, uuid_1.validate)(value)) {
            throw new Error("Invalid UUID for ClientId");
        }
        this.value = value || (0, uuid_1.v4)();
    }
}
exports.ClientId = ClientId;
//# sourceMappingURL=ClientId.js.map