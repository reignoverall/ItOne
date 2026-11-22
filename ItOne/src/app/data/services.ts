export type ServiceId =
  'ac-repair' | 'heating' | 'installation' | 'maintenance' | 'air-quality' | 'emergency';

export interface HvacService {
  id: ServiceId;
  name: string;
  summary: string;
  /** SVG path data for a 24×24 stroke icon. */
  icon: string;
}

export const SERVICES: HvacService[] = [
  {
    id: 'ac-repair',
    name: 'AC Repair',
    summary:
      'Warm air, strange noises or a unit that won’t start — we diagnose fast and fix it right.',
    icon: 'M12 2v20M4.9 4.9l14.2 14.2M2 12h20M4.9 19.1L19.1 4.9M12 2l-2 2m2-2l2 2m-2 18l-2-2m2 2l2-2',
  },
  {
    id: 'heating',
    name: 'Heating & Furnace',
    summary:
      'Furnace, heat pump and boiler repair to keep your home warm through the coldest nights.',
    icon: 'M12 22c4 0 7-2.9 7-7 0-3.5-2.5-6-4-8-.5 2-1.5 3-3 3 0-3-1-6-4-8 0 4-3 6.5-3 11 0 5 3 9 7 9z',
  },
  {
    id: 'installation',
    name: 'New System Installation',
    summary:
      'High-efficiency AC, furnace and heat pump installs sized to your home, with financing options.',
    icon: 'M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6',
  },
  {
    id: 'maintenance',
    name: 'Maintenance Plans',
    summary:
      'Twice-yearly tune-ups, priority scheduling and 15% off repairs — fewer surprises, lower bills.',
    icon: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5z',
  },
  {
    id: 'air-quality',
    name: 'Indoor Air Quality',
    summary:
      'Filtration, purifiers, humidifiers and duct cleaning for cleaner, healthier air at home.',
    icon: 'M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h7',
  },
  {
    id: 'emergency',
    name: '24/7 Emergency Service',
    summary: 'No heat at midnight? AC out in a heatwave? A real technician answers, day or night.',
    icon: 'M12 8v5l3 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z',
  },
];
