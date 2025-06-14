"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
class Address {
    constructor(street, city, state, zipCode) {
        this.street = street;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        if (!street || street.length < 5) {
            throw new Error("Street must have at least 5 characters");
        }
        if (street.length > 100) {
            throw new Error("Street must have at most 100 characters");
        }
        if (!city || city.length < 2) {
            throw new Error("City must have at least 2 characters");
        }
        if (city.length > 50) {
            throw new Error("City must have at most 50 characters");
        }
        if (!state || state.length < 2) {
            throw new Error("State must have at least 2 characters");
        }
        if (state.length > 50) {
            throw new Error("State must have at most 50 characters");
        }
        if (!zipCode || !/^[\d\w-]{4,10}$/.test(zipCode)) {
            throw new Error("Invalid zip code format");
        }
    }
}
exports.Address = Address;
