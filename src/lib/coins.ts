import bitcoin from "@/assets/coins/bitcoin.svg";
import ethereum from "@/assets/coins/ethereum.svg";
import band from "@/assets/coins/band.svg";
import cardano from "@/assets/coins/cardano.svg";
import tron from "@/assets/coins/tron.svg";
import tether from "@/assets/coins/tether.svg";
import doge from "@/assets/coins/doge.svg";
import type { StaticImageData } from "next/image";

export type Coin = {
  id: string;
  symbol: string;
  name: string;
  icon?: StaticImageData;
};

export const coins: Coin[] = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", icon: bitcoin },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", icon: ethereum },
  { id: "band-protocol", symbol: "BAND", name: "Band Protocol", icon: band },
  { id: "cardano", symbol: "ADA", name: "Cardano", icon: cardano },
  { id: "tron", symbol: "TRX", name: "TRON", icon: tron },
  { id: "tether", symbol: "USDT", name: "Tether", icon: tether },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin", icon: doge },
  { id: "binancecoin", symbol: "BNB", name: "BNB" },
  { id: "solana", symbol: "SOL", name: "Solana" },
  { id: "ripple", symbol: "XRP", name: "XRP" },
  { id: "usd-coin", symbol: "USDC", name: "USD Coin" },
  { id: "avalanche-2", symbol: "AVAX", name: "Avalanche" },
  { id: "chainlink", symbol: "LINK", name: "Chainlink" },
  { id: "bitcoin-cash", symbol: "BCH", name: "Bitcoin Cash" },
];
