export type Model = {
  id: string;
  name: string;
  percent: string;
  days: string;
  min: string;
  max: string;
  locked?: boolean;
  lockedNote?: string;
};

export const models: Model[] = [
  { id: "trust", name: "Trust Model", percent: "+2.5%", days: "180 Days", min: "$50", max: "$200" },
  { id: "conservative", name: "Conservative Model", percent: "+3.0%", days: "240 Days", min: "$200", max: "$500" },
  {
    id: "super",
    name: "Super Model",
    percent: "+4.5%",
    days: "365 Days",
    min: "$500",
    max: "$1000",
    locked: true,
    lockedNote: "20 team members required to activate plan",
  },
];