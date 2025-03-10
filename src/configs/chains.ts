import { produce } from 'immer';
import { Chain } from 'viem';
import { arbitrum, arbitrumSepolia, mainnet, sepolia } from 'viem/chains';
import { Environment, environment } from './environments';

export enum ChainId {
  Mainnet = 1,
  Arbitrum = 42161,
  Sepolia = 11155111,
  ArbitrumSepolia = 421614,
  NeoXDevNet = 2407101928,
}

export const supportedChainIds = {
  [Environment.Production]: [ChainId.Mainnet, ChainId.Arbitrum],
  [Environment.Development]: [ChainId.Sepolia, ChainId.ArbitrumSepolia, ChainId.NeoXDevNet],
}[environment];

export const chains: Record<ChainId, Chain> = {
  [ChainId.Mainnet]: produce(mainnet, chain => {
    (chain.rpcUrls.default.http[0] as string) = 'https://ethereum-rpc.publicnode.com';
  }),
  [ChainId.Arbitrum]: arbitrum,
  [ChainId.Sepolia]: produce(sepolia, chain => {
    (chain.rpcUrls.default.http[0] as string) = 'https://ethereum-sepolia-rpc.publicnode.com';
  }),
  [ChainId.ArbitrumSepolia]: arbitrumSepolia,
  [ChainId.NeoXDevNet]: {
    id: ChainId.NeoXDevNet,
    name: 'Neo X DevNet',
    nativeCurrency: {
      name: 'GAS',
      symbol: 'GAS',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://t2seed1.jiuquan.tech'],
      },
      antiMev: {
        http: ['https://t2seed1.jiuquan.tech:8555'],
      },
    },
    contracts: {
      governance: { address: '0x1212000000000000000000000000000000000001' },
      governanceReward: { address: '0x1212000000000000000000000000000000000003' },
      keyManagement: { address: '0x1212000000000000000000000000000000000008' },
    },
    testnet: true,
  },
};
