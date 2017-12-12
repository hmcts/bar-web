export interface IFeeLog {
    id: number;
    date: Date;
    payer_name: string;
    amount: number;
    currency: string;
    status: string;
    payment_date: Date;
    site_id: string;
    daily_sequence_id: number;
    payment_type: string;
}
