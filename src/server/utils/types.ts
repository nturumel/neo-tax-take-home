import { Merchant } from '../../shared/types';

export type PlaidTransaction = {
  id: number;
  merchant_name: string;
  category: Array<string>;
  date: string;
  amount: number;
};

export type MerchantSchema = Merchant;
