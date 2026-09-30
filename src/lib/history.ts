export const transactions = Array.from({ length: 20 }, (_, i) => ({
  label: i % 2 === 0 ? "Deposit Successful" : "Withdrawal Successful",
  amount: "$70,000",
  time: "15:30",
  date: "26/06/25",
}));