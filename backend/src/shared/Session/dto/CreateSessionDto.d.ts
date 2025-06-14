import "reflect-metadata";
import { ESessionStatus } from "../enums/ESessionStatus";
export declare class CreateSessionDto {
    date: string;
    duration: number;
    status: ESessionStatus;
}
