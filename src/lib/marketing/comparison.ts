export interface CompetitorComparisonRow {
  feature: string;
  linkLab: string;
  bitly: string;
  linkLabPositive: boolean;
}

// Source: the repository's “Best Bitly Alternatives in 2026” article in src/app/blog/data.ts.
export const comparisonData: CompetitorComparisonRow[] = [
  {
    feature: 'Free links / month',
    linkLab: '10',
    bitly: '10',
    linkLabPositive: true,
  },
  {
    feature: 'Ads on redirects',
    linkLab: 'No',
    bitly: 'Yes',
    linkLabPositive: true,
  },
  {
    feature: 'Custom domain on free plan',
    linkLab: 'No — available from Launch',
    bitly: 'No',
    linkLabPositive: false,
  },
  {
    feature: 'Free analytics',
    linkLab: 'Basic analytics · 30 days',
    bitly: 'Click count only',
    linkLabPositive: true,
  },
  {
    feature: 'Free QR tools',
    linkLab: 'Basic QR exports',
    bitly: '2 QR codes / month',
    linkLabPositive: true,
  },
  {
    feature: 'API access',
    linkLab: 'Included from Growth',
    bitly: 'Not on free plan',
    linkLabPositive: true,
  },
];
