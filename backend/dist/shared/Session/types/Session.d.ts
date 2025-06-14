import { SessionId } from "../vo/SessionId";
import { SystemClock } from "../vo/SystemClock";
export type Session = {
    id: SessionId;
    date: SystemClock;
    duration: number;
    status: string;
    clientId: string;
};
