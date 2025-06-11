import { SystemClock } from "../vo/SystemClock";

export interface Session {
  id: string;
  date: SystemClock;
  duration: number;
  status: string;
} 