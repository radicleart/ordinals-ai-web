
export type SessionStore = {
  name: string;
  loggedIn: boolean,
  modelMaev?: any;
  modelRnn?: any;
};

export type AddressObject = {
  stxAddress: string;
  cardinal: string;
  ordinal: string;
  sBTCBalance: number;
  stxBalance: number;
  stacksTokenInfo?: AddressHiroObject;
  bnsNameInfo?: any;
  cardinalInfo?: AddressMempoolObject;
  ordinalInfo?: AddressMempoolObject;
  btcPubkeySegwit0?: string;
  btcPubkeySegwit1?: string;
};

export type AddressMempoolObject = {
  address: string;
  chain_stats: {
    funded_txo_count: number;
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;
  },
  mempool_stats: {
    funded_txo_count: number;
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;
  }
}

export type AddressHiroObject = {
    stx: {
      balance: number;
      total_sent: number;
      total_received: number;
      lock_tx_id: string;
      locked:number;
      lock_height: number;
      burnchain_lock_height: number;
      burnchain_unlock_height: number;
    },
    fungible_tokens: any,
    non_fungible_tokens: any
}
