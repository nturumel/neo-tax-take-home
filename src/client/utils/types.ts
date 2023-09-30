import { Transaction } from './../../shared/types';

export type MerchantTransaction = Transaction & { billionaireId: number | null };
