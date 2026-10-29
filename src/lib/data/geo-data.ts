export interface BulkCityImportItem {
  name: string;
  slug: string;
  postal_code?: string;
  is_popular?: boolean;
}

export interface BulkRegionImportPackage {
  country_slug: string;
  region_slug: string;
  region_name: string;
  cities: BulkCityImportItem[];
}

export const GEOGRAPHIC_DATA_PACKAGES: BulkRegionImportPackage[] = [
  // Additional Pakistan Cities to import
  {
    country_slug: 'pakistan',
    region_slug: 'punjab',
    region_name: 'Punjab',
    cities: [
      { name: 'Sargodha', slug: 'sargodha', postal_code: '40100', is_popular: false },
      { name: 'Bahawalpur', slug: 'bahawalpur', postal_code: '63100', is_popular: false },
      { name: 'Sheikhupura', slug: 'sheikhupura', postal_code: '39350', is_popular: false },
      { name: 'Jhang', slug: 'jhang', postal_code: '35200', is_popular: false },
      { name: 'Rahim Yar Khan', slug: 'rahim-yar-khan', postal_code: '64200', is_popular: false },
      { name: 'Kasur', slug: 'kasur', postal_code: '55100', is_popular: false },
      { name: 'Gujrat', slug: 'gujrat', postal_code: '50700', is_popular: false },
    ],
  },
  {
    country_slug: 'pakistan',
    region_slug: 'sindh',
    region_name: 'Sindh',
    cities: [
      { name: 'Larkana', slug: 'larkana', postal_code: '77150', is_popular: false },
      { name: 'Mirpur Khas', slug: 'mirpur-khas', postal_code: '69000', is_popular: false },
      { name: 'Nawabshah', slug: 'nawabshah', postal_code: '67450', is_popular: false },
    ],
  },
  {
    country_slug: 'pakistan',
    region_slug: 'khyber-pakhtunkhwa',
    region_name: 'Khyber Pakhtunkhwa',
    cities: [
      { name: 'Mardan', slug: 'mardan', postal_code: '23200', is_popular: false },
      { name: 'Abbottabad', slug: 'abbottabad', postal_code: '22010', is_popular: false },
      { name: 'Swat', slug: 'swat', postal_code: '19130', is_popular: false },
    ],
  },
  // Additional USA Cities to import
  {
    country_slug: 'usa',
    region_slug: 'california',
    region_name: 'California',
    cities: [
      { name: 'San Jose', slug: 'san-jose', postal_code: '95101', is_popular: true },
      { name: 'Sacramento', slug: 'sacramento', postal_code: '95814', is_popular: false },
      { name: 'Oakland', slug: 'oakland', postal_code: '94601', is_popular: false },
      { name: 'Long Beach', slug: 'long-beach', postal_code: '90802', is_popular: false },
      { name: 'Fresno', slug: 'fresno', postal_code: '93701', is_popular: false },
    ],
  },
  {
    country_slug: 'usa',
    region_slug: 'texas',
    region_name: 'Texas',
    cities: [
      { name: 'San Antonio', slug: 'san-antonio', postal_code: '78201', is_popular: true },
      { name: 'Fort Worth', slug: 'fort-worth', postal_code: '76101', is_popular: false },
      { name: 'El Paso', slug: 'el-paso', postal_code: '79901', is_popular: false },
      { name: 'Arlington', slug: 'arlington', postal_code: '76001', is_popular: false },
    ],
  },
  {
    country_slug: 'usa',
    region_slug: 'florida',
    region_name: 'Florida',
    cities: [
      { name: 'Miami', slug: 'miami', postal_code: '33101', is_popular: true },
      { name: 'Orlando', slug: 'orlando', postal_code: '32801', is_popular: true },
      { name: 'Tampa', slug: 'tampa', postal_code: '33601', is_popular: false },
      { name: 'Jacksonville', slug: 'jacksonville', postal_code: '32099', is_popular: false },
    ],
  },
  // Additional UK Cities to import
  {
    country_slug: 'uk',
    region_slug: 'england',
    region_name: 'England',
    cities: [
      { name: 'Liverpool', slug: 'liverpool', postal_code: 'L1 1AA', is_popular: true },
      { name: 'Newcastle', slug: 'newcastle', postal_code: 'NE1 1AD', is_popular: false },
      { name: 'Sheffield', slug: 'sheffield', postal_code: 'S1 1AA', is_popular: false },
      { name: 'Nottingham', slug: 'nottingham', postal_code: 'NG1 1AA', is_popular: false },
      { name: 'Oxford', slug: 'oxford', postal_code: 'OX1 1AA', is_popular: true },
      { name: 'Cambridge', slug: 'cambridge', postal_code: 'CB1 1AA', is_popular: true },
    ],
  },
  {
    country_slug: 'uk',
    region_slug: 'scotland',
    region_name: 'Scotland',
    cities: [
      { name: 'Aberdeen', slug: 'aberdeen', postal_code: 'AB10 1AA', is_popular: false },
      { name: 'Dundee', slug: 'dundee', postal_code: 'DD1 1AA', is_popular: false },
      { name: 'Inverness', slug: 'inverness', postal_code: 'IV1 1AA', is_popular: false },
    ],
  },
  {
    country_slug: 'uk',
    region_slug: 'wales',
    region_name: 'Wales',
    cities: [
      { name: 'Swansea', slug: 'swansea', postal_code: 'SA1 1AA', is_popular: false },
      { name: 'Newport', slug: 'newport', postal_code: 'NP20 1AA', is_popular: false },
    ],
  },
];
