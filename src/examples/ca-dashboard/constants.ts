import { RdsServer, RdsCatalog } from '@rds/sdk';

// Initialize an RDS Server with covid data.
export const covidServer = new RdsServer('https://covid19.richdataservices.com/rds');
// Initialize the Canada catalog
export const canadaCatalog = new RdsCatalog(covidServer, 'ca');

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const PROVINCES = [
  { value: '10', name: 'Newfoundland and Labrador' },
  { value: '11', name: 'Prince Edward Island' },
  { value: '12', name: 'Nova Scotia' },
  { value: '13', name: 'New Brunswick' },
  { value: '24', name: 'Quebec' },
  { value: '35', name: 'Ontario' },
  { value: '46', name: 'Manitoba' },
  { value: '47', name: 'Saskatchewan' },
  { value: '48', name: 'Alberta' },
  { value: '59', name: 'British Columbia' },
  { value: '60', name: 'Yukon' },
  { value: '61', name: 'Northwest Territories' },
  { value: '62', name: 'Nunavut' },
  { value: '99', name: 'Repatriated Travellers' },
];
