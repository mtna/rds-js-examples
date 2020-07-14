import { MDCSelect } from '@material/select';
import { Code } from '@mtna/pojo-consumer-ui';
import { GchartsDataSet, HttpUtil, RdsCatalog, RdsDataProduct, RdsServer } from '@rds/sdk';
import { GoogleLineChartConfig } from '~shared/gcharts/gcharts-config';
import { SelectUtil } from '~shared/material/select.util';

import { findUniqueCodes, generateTabulateParams, renderChart } from './functions';
import { CheckboxUtil } from './util/checkbox-util';

//#region Constants
// Initialize an RDS Server with covid data.
export const mobilityServer = new RdsServer('https://covid19.richdataservices.com/rds');
// Initialize the International Catalog
export const intCatalog = new RdsCatalog(mobilityServer, 'int');
// Initialize DataProduct for the Country Mobility Reports
export const countriesDataProduct = new RdsDataProduct(intCatalog, 'google_mobility');
const countriesWithDivision: { [code: string]: boolean } = {
  AE: true,
  AG: true,
  AO: true,
  AR: true,
  AT: true,
  AU: true,
  BB: true,
  BE: true,
  BF: true,
  BG: true,
  BJ: true,
  BO: true,
  BR: true,
  BS: true,
  BZ: true,
  CA: true,
  CH: true,
  CI: true,
  CL: true,
  CM: true,
  CO: true,
  CV: true,
  CZ: true,
  DE: true,
  DK: true,
  DO: true,
  EC: true,
  EE: true,
  EG: true,
  ES: true,
  FI: true,
  FR: true,
  GA: true,
  GB: true,
  GT: true,
  HN: true,
  HR: true,
  HT: true,
  HU: true,
  ID: true,
  IE: true,
  IL: true,
  IN: true,
  IT: true,
  JM: true,
  JO: true,
  JP: true,
  KE: true,
  KH: true,
  KG: true,
  KW: true,
  LB: true,
  LT: true,
  LV: true,
  LY: true,
  MN: true,
  MU: true,
  MX: true,
  MY: true,
  MZ: true,
  NA: true,
  NE: true,
  NG: true,
  NI: true,
  NL: true,
  NO: true,
  NZ: true,
  OM: true,
  PE: true,
  PH: true,
  PK: true,
  PL: true,
  PT: true,
  PY: true,
  RO: true,
  RW: true,
  SA: true,
  SN: true,
  SV: true,
  US: true,
};

const DEFAULT_CHART_OPTIONS: Omit<GoogleLineChartConfig, 'data'> = {
  elementId: 'line-chart-div-r-r',
  title: 'Movement Changes',
  curveType: 'function',
  explorer: { actions: ['dragToZoom', 'rightClickToReset'], axis: 'horizontal', keepInBounds: true, maxZoomOut: 1, maxZoomIn: 0.1 },
  hAxis: { format: 'dd MMM', slantedText: true },
  vAxis: { title: 'Change in percentage' },
  domainAxis: { type: 'datetime' },
};
//#endregion Constants

let data: GchartsDataSet | undefined;
// Country & Subdivision Dropdown elements
let countrySelect: MDCSelect | null | undefined;
let divisionSelect: MDCSelect | null | undefined;
// Options to populate the dropdowns
let countryCodes: Code[] = [];
let divisionCodes: Code[] = [];
// currently selected option
let selectedCountry: Code | undefined;
// tracker for toggling display of variables in chart
const checkboxes: { [id: string]: boolean } = {
  // date_stamp required for charting, can never be toggled false
  date_stamp: true,
  retail_recreation_pct: true,
  grocery_pharmacy_pct: true,
  parks_pct: true,
  transit_station_pct: true,
  workplace_pct: true,
  residential_pct: true,
};
// Initialize & listen for checkbox changes
const checkboxItems = CheckboxUtil.initializeCheckboxes('.checkbox-section');
// Re-render the chart when a checkbox is toggled
checkboxItems.forEach((c) => {
  c.checkbox.listen('click', () => {
    checkboxes[c.id] = c.checkbox.checked;
    if (data) {
      renderChart(data, DEFAULT_CHART_OPTIONS, checkboxes);
    }
  });
});
// Retrieve the data, then initialize the dropdowns & render the chart
HttpUtil.get<Code[]>(
  'https://covid19.richdataservices.com/rds/api/catalog/int/google_mobility_country/classification/iso3166_1/codes'
).then((res) => {
  countryCodes = res.parsedBody || [];

  // Initialize the Country Selector
  countrySelect = SelectUtil.initializeSelect(
    '.country-select',
    countryCodes.map((c) => ({ value: c.uri || '', name: c.name || '' }))
  );
  divisionSelect = SelectUtil.initializeSelect('.division-select');
  if (!!countrySelect) {
    countrySelect.listen('MDCSelect:change', () => {
      // We've already established that countrySelect is not null
      // tslint:disable-next-line:no-non-null-assertion
      selectedCountry = countryCodes[countrySelect!.selectedIndex];

      if (divisionSelect) {
        divisionSelect.value = '';
        SelectUtil.clearSelectOptions('.division-select');
      }

      if (!!selectedCountry) {
        handleCountrySelection(selectedCountry);
        countriesDataProduct.tabulate<GchartsDataSet>(generateTabulateParams(['iso3166_1', selectedCountry])).then((response) => {
          if (response.parsedBody) {
            data = response.parsedBody;
            renderChart(data, DEFAULT_CHART_OPTIONS, checkboxes);
          }
        });
      }
    });
    const usCodeIndex = countryCodes.findIndex((c) => c.codeValue === 'US');
    if (usCodeIndex >= 0) {
      countrySelect.selectedIndex = usCodeIndex;
      countrySelect.emit('change', {});
    }
  }

  if (!!divisionSelect) {
    divisionSelect.listen('MDCSelect:change', () => {
      // We've already established divisionSelect is not null
      // tslint:disable-next-line:no-non-null-assertion
      const selectedDivision = divisionCodes[divisionSelect!.selectedIndex];
      if (!!selectedDivision) {
        countriesDataProduct.tabulate<GchartsDataSet>(generateTabulateParams(['iso3166_2', selectedDivision])).then((response) => {
          if (response.parsedBody) {
            renderChart(response.parsedBody, DEFAULT_CHART_OPTIONS, checkboxes);
          }
        });
      }
    });
  }
});

function handleCountrySelection(country: Code) {
  if (!!divisionSelect && !!country) {
    countriesDataProduct
      .tabulate<{ records: any[] }>({
        dims: 'iso3166_2',
        where: `iso3166_1=${country.codeValue}`,
        format: 'mtna',
        inject: true,
      })
      .then((res) => {
        if (res.parsedBody) {
          const codes = findUniqueCodes(res.parsedBody);
          divisionCodes = codes;
          showHideDivisionSelect(!!codes.length);
          if (codes.length) {
            SelectUtil.addSelectOptions(
              '.division-select',
              codes.map((c) => ({ name: c.name || '', value: c.codeValue || '' }))
            );
          }
        }
      });
  }
}

function showHideDivisionSelect(hasCodes: boolean) {
  const select = document.querySelector('.division-select');
  if (select) {
    if (hasCodes && select.classList.contains('display-none')) {
      select.classList.remove('display-none');
    } else if (!select.classList.contains('display-none')) {
      select.classList.add('display-none');
    }
  }
}
