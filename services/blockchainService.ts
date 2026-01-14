
import { BlockchainTransaction, LandTransaction } from '../types/blockchain';

const GENESIS_BLOCK = 18239400;

export const BlockchainService = {
  generateHash: (data: string): string => {
    // Simple mock hash generation
    let hash = '0x';
    const chars = '0123456789abcdef';
    for (let i = 0; i < 64; i++) {
        hash += chars[Math.floor(Math.random() * 16)];
    }
    return hash;
  },

  createMockTransaction: (type: string, amount: number, from: string, to: string): BlockchainTransaction => {
    return {
      hash: BlockchainService.generateHash(`${type}${amount}${Date.now()}`),
      blockNumber: GENESIS_BLOCK + Math.floor(Math.random() * 10000),
      timestamp: new Date().toISOString(),
      from: from,
      to: to,
      value: amount.toString(),
      gasUsed: 21000 + Math.floor(Math.random() * 50000),
      status: 'confirmed',
      contractAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D' // Mock Land Registry Contract
    };
  },

  verifyTransaction: async (hash: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    return hash.startsWith('0x') && hash.length === 66;
  },

  getExplorerUrl: (hash: string) => {
    return `https://etherscan.io/tx/${hash}`; // Real explorer link pattern
  }
};
