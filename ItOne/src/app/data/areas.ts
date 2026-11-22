export interface ServiceArea {
  town: string;
  region: string;
  zips: string[];
}

export type ZipLookup =
  { status: 'invalid' } | { status: 'served'; area: ServiceArea } | { status: 'not-served' };

/** Fictional towns for the demo. */
export const SERVICE_AREAS: ServiceArea[] = [
  { town: 'Pine Valley', region: 'Central', zips: ['80510', '80511'] },
  { town: 'Ridgeline', region: 'Central', zips: ['80512'] },
  { town: 'Cedar Falls', region: 'North', zips: ['80520', '80521'] },
  { town: 'Maple Hollow', region: 'North', zips: ['80522'] },
  { town: 'Brookstone', region: 'East', zips: ['80530'] },
  { town: 'Willow Creek', region: 'East', zips: ['80531', '80532'] },
  { town: 'Stonebridge', region: 'South', zips: ['80540'] },
  { town: 'Aspen Grove', region: 'South', zips: ['80541'] },
  { town: 'Harbor Point', region: 'West', zips: ['80550'] },
];

const ZIP_PATTERN = /^(\d{5})(-\d{4})?$/;

export function findAreaByZip(input: string): ZipLookup {
  const match = ZIP_PATTERN.exec(input.trim());
  if (!match) return { status: 'invalid' };
  const area = SERVICE_AREAS.find((a) => a.zips.includes(match[1]));
  return area ? { status: 'served', area } : { status: 'not-served' };
}
