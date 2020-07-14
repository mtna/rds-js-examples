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
  US: true,
  UK: true,
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
let countrySelect: MDCSelect | null | undefined;
let divisionSelect: MDCSelect | null | undefined;
let countryCodes: Code[] = [];
let divisionCodes: Code[] = [];
let selectedCountry: Code | undefined;
const checkboxes: { [id: string]: boolean } = {
  date_stamp: true,
  retail_recreation_pct: true,
  grocery_pharmacy_pct: true,
  parks_pct: true,
  transit_station_pct: true,
  workplace_pct: true,
  residential_pct: true,
};

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

      if (countriesWithDivision[selectedCountry.codeValue]) {
        handleCountrySelection(selectedCountry);
      } else {
        SelectUtil.clearSelectOptions('.division-select');
        if (divisionSelect) {
          divisionSelect.value = '';
        }
      }
      countriesDataProduct.tabulate<GchartsDataSet>(generateTabulateParams(selectedCountry)).then((response) => {
        if (response.parsedBody) {
          data = response.parsedBody;
          renderChart(data, DEFAULT_CHART_OPTIONS, checkboxes);
        }
      });
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
      if (!!selectedCountry) {
        countriesDataProduct
          .tabulate<GchartsDataSet>(generateTabulateParams(selectedCountry, ['iso3166_2', selectedDivision]))
          .then((response) => {
            if (response.parsedBody) {
              renderChart(response.parsedBody, DEFAULT_CHART_OPTIONS, checkboxes);
            }
          });
      }
    });
  }
});

function handleCountrySelection(country: Code) {
  if (!!divisionSelect) {
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
          SelectUtil.addSelectOptions(
            '.division-select',
            codes.map((c) => ({ name: c.name || '', value: c.codeValue }))
          );
        }
      });
  }
}
