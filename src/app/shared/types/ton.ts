export type TWallet = {
  name: string;
  imageUrl: string;
  tondns?: string;
  aboutUrl: string;
  universalLink?: string;
  deepLink?: string;
  bridgeUrl?: string;
  jsBridgeKey?: string;
  injected?: boolean; // true if this wallet is injected to the webpage
  embedded?: boolean; // true if the dapp is opened inside this wallet's browser
};
