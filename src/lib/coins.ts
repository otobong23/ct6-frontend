import bitcoin from "@/assets/coins/bitcoin.svg";
import ethereum from "@/assets/coins/ethereum.svg";
import band from "@/assets/coins/band.svg";
import cardano from "@/assets/coins/cardano.svg";
import tron from "@/assets/coins/tron.svg";
import tether from "@/assets/coins/tether.svg";
import doge from "@/assets/coins/doge.svg";
import binance from "@/assets/coins/bnb_cryptocurrencies_icon_188408.svg";
import solana from "@/assets/coins/Solana_logo.png";
import xrp from "@/assets/coins/xrp-logo.svg";
import usdc from "@/assets/coins/Usdc--Streamline-Cryptocurrency.svg";
import avalanche from "@/assets/coins/avalanche-logo.svg";
import chainlink from "@/assets/coins/Chainlink-Symbol-Blue.svg";
import bitcoinCash from "@/assets/coins/bitcoin-cash.svg";
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
  { id: "binancecoin", symbol: "BNB", name: "BNB", icon: binance },
  { id: "solana", symbol: "SOL", name: "Solana", icon: solana },
  { id: "ripple", symbol: "XRP", name: "XRP", icon: xrp },
  { id: "usd-coin", symbol: "USDC", name: "USD Coin", icon: usdc },
  { id: "avalanche-2", symbol: "AVAX", name: "Avalanche", icon: avalanche },
  { id: "chainlink", symbol: "LINK", name: "Chainlink", icon: chainlink },
  { id: "bitcoin-cash", symbol: "BCH", name: "Bitcoin Cash", icon: bitcoinCash },
];
