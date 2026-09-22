export const PARKING_BUILDINGS = [
  { id: '1st-year-building', name: '1st Year Building', shortName: '1st Year', rate: 4.5 },
  { id: '2nd-year-building', name: '2nd Year Building', shortName: '2nd Year', rate: 3.75 },
  { id: 'library-building', name: 'Library Building', shortName: 'Library', rate: 2.9 }
];

export const BUILDING_LOOKUP = Object.fromEntries(
  PARKING_BUILDINGS.map((building) => [building.name, building])
);

export const BUILDING_NAMES = PARKING_BUILDINGS.map((building) => building.name);
