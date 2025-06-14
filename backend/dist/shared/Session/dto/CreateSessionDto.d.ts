import "reflect-metadata";
import { ESessionStatus } from "../enums/ESessionStatus";
export declare class CreateSessionDto {
    clientId: string;
    date: string;
    duration: number;
    status: ESessionStatus;
}
