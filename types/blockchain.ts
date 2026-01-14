
export interface BlockchainTransaction {
  hash: string;
  blockNumber: number;
  timestamp: string;
  from: string;
  to: string;
  value: string; // in wei/gwei or just standard currency string
  gasUsed: number;
  status: 'confirmed' | 'pending' | 'failed';
  contractAddress?: string;
}

export interface LandTransaction {
  id: string;
  upi: string;
  type: 'transfer' | 'registration' | 'dispute_resolution';
  amount: number;
  date: string;
  blockchainData: BlockchainTransaction;
  parties: {
    seller: string;
    buyer: string;
  };
}
