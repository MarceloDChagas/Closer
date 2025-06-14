"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemClock = void 0;
class SystemClock {
    constructor(value) {
        this.value = value;
        if (!(value instanceof Date) || isNaN(value.getTime())) {
            throw new Error("Invalid date");
        }
    }
}
exports.SystemClock = SystemClock;
