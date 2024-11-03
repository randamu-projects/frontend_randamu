import { Chain, defineChain } from "viem";

export const randamu: Chain = /*#__PURE__*/ defineChain({
  id: 31337,
  name: "Randamu",
  network: "randamu",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://furnace.firepit.network"],
    },
  },

  testnet: true,
});
