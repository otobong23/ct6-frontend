import bitcoin from "@/assets/coins/bitcoin.svg";
import ethereum from "@/assets/coins/ethereum.svg";
import band from "@/assets/coins/band.svg";
import cardano from "@/assets/coins/cardano.svg";
import tron from "@/assets/coins/tron.svg";
import tether from "@/assets/coins/tether.svg";
import doge from "@/assets/coins/doge.svg";

export type Coin = {
  icon: any,
  symbol: string;
  name: string;
  price: string;
  change?: string;
  addFunds?: boolean;
};

export const coins: Coin[] = [
  { icon: bitcoin, symbol: "BTC", name: "Bitcoin", price: "$1,760", addFunds: true },
  { icon: ethereum, symbol: "ETH", name: "Ethereum", price: "$134,876", change: "+2.30%" },
  { icon: band, symbol: "BAND", name: "Band Protocol", price: "$134,876", change: "+2.30%" },
  { icon: cardano, symbol: "ADA", name: "Cardano", price: "$134,876", change: "+2.30%" },
  { icon: tron, symbol: "TRX", name: "TRON", price: "$134,876", change: "+2.30%" },
  { icon: tether, symbol: "USDT", name: "Tether", price: "$134,876", change: "+2.30%" },
  ...Array.from({ length: 14 }, () => ({
    icon: doge,
    symbol: "DOGE",
    name: "Dogecoin",
    price: "$134,876",
    change: "+2.30%",
  })),
];

export const coinIconColors: Record<string, string> = {
  BTC: "#f7931a",
  ETH: "#8b8bf5",
  BAND: "#516aff",
  ADA: "#2461e8",
  TRX: "#e0342c",
  USDT: "#26a17b",
  DOGE: "#d4a017",
};