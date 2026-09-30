export type Coin = {
  symbol: string;
  name: string;
  price: string;
  change?: string;
  addFunds?: boolean;
};

export const coins: Coin[] = [
  { symbol: "BTC", name: "Bitcoin", price: "$1,760", addFunds: true },
  { symbol: "ETH", name: "Ethereum", price: "$134,876", change: "+2.30%" },
  { symbol: "BAND", name: "Band Protocol", price: "$134,876", change: "+2.30%" },
  { symbol: "ADA", name: "Cardano", price: "$134,876", change: "+2.30%" },
  { symbol: "TRX", name: "TRON", price: "$134,876", change: "+2.30%" },
  { symbol: "USDT", name: "Tether", price: "$134,876", change: "+2.30%" },
  ...Array.from({ length: 14 }, () => ({
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