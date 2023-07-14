export type Transaction = {
  id: number;
  merchantName: string;
  date: Date;
  amount: number;
};

export type Merchant = {
  name: string;
  isOwnedByBezos: boolean;
};
