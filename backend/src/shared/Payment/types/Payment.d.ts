export interface Payment {
    id: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: Date;
}
