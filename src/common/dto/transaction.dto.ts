export enum TransactionCurrency {
  USD = 'USD',
  COL = 'COL',
  UYU = 'UYU',
}

export class TransactionDTO {
  id: string;
  amount: number;
  currency: TransactionCurrency;
  datetime: Date;
  description: string;
  category: string;
  userId: string;
}
