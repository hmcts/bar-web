export interface IPaymentStatistics {
  bgc: string;
  count: number;
  payment_type: string;
  payment_type_name?: string;
  name?: string;
  status: string;
  total_amount: number;
  user_id: string;
  _links: any;
}
