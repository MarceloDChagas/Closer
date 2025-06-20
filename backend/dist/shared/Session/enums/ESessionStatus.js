"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ESessionStatus = void 0;
var ESessionStatus;
(function (ESessionStatus) {
    ESessionStatus["PENDING"] = "PENDING";
    ESessionStatus["SCHEDULED"] = "SCHEDULED";
    ESessionStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ESessionStatus["COMPLETED"] = "COMPLETED";
    ESessionStatus["CANCELLED"] = "CANCELLED";
    ESessionStatus["REFUNDED"] = "REFUNDED";
})(ESessionStatus || (exports.ESessionStatus = ESessionStatus = {}));
