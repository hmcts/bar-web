import {IPayhubReference} from '../interfaces/payments-log';


export class PayhubReferenceModel implements IPayhubReference {
  id: number;
  payment_instruction_id: number;
  reference: string;
  payment_group_reference: string;
}
