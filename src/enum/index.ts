type Meta<T extends string> = Record<
  T,
  {
    text: string;
  }
>;

const DurationMeta: Meta<API.Duration> = {
  "24h": { text: "chart.duration.d" },
  "168h": { text: "chart.duration.w" },
  "720h": { text: "chart.duration.m" },
  "4320h": { text: "chart.duration.y" },
};

export function getDurationMeta(t: API.Duration) {
  return DurationMeta[t];
}
