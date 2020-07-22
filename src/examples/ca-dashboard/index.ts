import { MDCFormField } from '@material/form-field';
import { MDCRadio } from '@material/radio';

import { AmchartsDataSet, HttpResponse } from '@rds/sdk';

import {
  AmChartsClusteredBarUtil,
  AmChartsLineUtil,
  AmChartsSimpleBarUtil,
  AmChartsStackedBarUtil,
  CommonAmChartColors,
} from '~/shared/amcharts/index';
import { SelectUtil } from '~/shared/material/select.util';

import { MONTH_NAMES, PROVINCES } from './constants';
import { LabourData, LABOUR_CHART_ELEMENT_ID, LABOUR_SETUP, canadaLabour } from './labour-constants';
import { PERSPECTIVES, canadaPerspective, PERCEIVED_SETUP } from './perspective-constants';
import { COVID_TAB_SETUP, canadaCovid, CovidData, COVID_CHART_ELEMENT_ID } from './covid-constants';

let selectedBar = 'clustered';
let selectedProvince = 'all';
let currentMonth: string;
const LABOUR_DATA: LabourData[] = [];

const stackedRadioElement = document.querySelector('.stacked-radio');
const stackedFormFieldElement = document.querySelector('.stacked-form-field');
const clusteredRadioElement = document.querySelector('.clustered-radio');
const clusteredFormFieldElement = document.querySelector('.clustered-form-field');

if (stackedRadioElement && stackedFormFieldElement) {
  const stackedRadio = new MDCRadio(stackedRadioElement);
  const stackedFormField = new MDCFormField(stackedFormFieldElement);
  stackedFormField.input = stackedRadio;
  stackedRadio.listen('change', () => {
    AmChartsClusteredBarUtil.disposeChart(LABOUR_CHART_ELEMENT_ID);
    AmChartsStackedBarUtil.disposeChart(LABOUR_CHART_ELEMENT_ID);

    selectedBar = 'stacked';

    // If we're just changing the bar chart type, we don't need to requery, we can just update the chart
    populateLabourChart(selectedBar);
  });
}

if (clusteredRadioElement && clusteredFormFieldElement) {
  const clusteredRadio = new MDCRadio(clusteredRadioElement);
  const clusteredFormField = new MDCFormField(clusteredFormFieldElement);
  clusteredFormField.input = clusteredRadio;
  clusteredRadio.listen('change', () => {
    AmChartsClusteredBarUtil.disposeChart(LABOUR_CHART_ELEMENT_ID);
    AmChartsStackedBarUtil.disposeChart(LABOUR_CHART_ELEMENT_ID);

    selectedBar = 'clustered';

    // If we're just changing the bar chart type, we don't need to requery, we can just update the chart
    populateLabourChart(selectedBar);
  });
}

// Initialize data
getCovidData(selectedProvince);
getLabourData(selectedBar, selectedProvince);

// Initialize perspective data and title
getPerspectiveData('BH_05', 'perspective-chart-1', 'What is your main source of information to find out about COVID-19?');
getPerspectiveData(
  'BH_10',
  'perspective-chart-2',
  'Which source of information is the most helpful to learn about current public health measures?'
);
getPerspectiveData('BH_25', 'perspective-chart-3', 'In general, how is your health?');

/**
 * Populate province select and setup listener
 */
const provinceSelect = SelectUtil.initializeSelect('.province-select', PROVINCES);
provinceSelect?.listen('MDCSelect:change', () => {
  selectedProvince = provinceSelect.value;
  getCovidData(selectedProvince);
  getLabourData(selectedBar, selectedProvince);
});

const perspectiveSelect = SelectUtil.initializeSelect('.perspective-select', PERSPECTIVES);
if (perspectiveSelect) {
  perspectiveSelect.selectedIndex = 0;
  perspectiveSelect.listen('MDCSelect:change', () => {
    const selectedPerspective = PERSPECTIVES.find((x) => x.value === perspectiveSelect.value);

    getPerspectiveData(perspectiveSelect.value, 'perspective-chart-1', selectedPerspective?.questionText);
  });
}

const perspectiveSelect2 = SelectUtil.initializeSelect('.perspective-select-2', PERSPECTIVES);
if (perspectiveSelect2) {
  perspectiveSelect2.selectedIndex = 1;
  perspectiveSelect2.listen('MDCSelect:change', () => {
    const selectedPerspective = PERSPECTIVES.find((x) => x.value === perspectiveSelect2.value);

    getPerspectiveData(perspectiveSelect2.value, 'perspective-chart-2', selectedPerspective?.questionText);
  });
}

const perspectiveSelect3 = SelectUtil.initializeSelect('.perspective-select-3', PERSPECTIVES);
if (perspectiveSelect3) {
  perspectiveSelect3.selectedIndex = 2;
  perspectiveSelect3.listen('MDCSelect:change', () => {
    const selectedPerspective = PERSPECTIVES.find((x) => x.value === perspectiveSelect3.value);

    getPerspectiveData(perspectiveSelect3.value, 'perspective-chart-3', selectedPerspective?.questionText);
  });
}

/**
 * gets the Canada LFS data, formats the data and creates charts
 */
function getLabourData(barType: string, province: string) {
  // add province when needed
  const where = province !== 'all' ? LABOUR_SETUP.where + `AND(PROV=${province})` : LABOUR_SETUP.where;

  canadaLabour
    .tabulate<AmchartsDataSet>({
      ...LABOUR_SETUP,
      format: 'amcharts',
      where,
    })
    .then((res: HttpResponse<AmchartsDataSet>) => {
      // format for the stacked/clustered bar charts
      res?.parsedBody?.dataProvider.forEach((x: { LFSSTAT: string; SURVMNTH: string; COUNT: number }) => {
        // Initialize a new LabourData when needed
        if (!LABOUR_DATA.find((y) => y['SURVMNTH'] === x['SURVMNTH'])) {
          LABOUR_DATA.push(new LabourData(x['SURVMNTH']));
        }
        switch (x['LFSSTAT']) {
          case 'Employed, at work':
            LABOUR_DATA.map((y) => {
              if (y['SURVMNTH'] === x['SURVMNTH']) {
                y['employed_at_work'] = x['COUNT'];
              }
            });
            break;
          case 'Employed, absent from work':
            LABOUR_DATA.map((y) => {
              if (y['SURVMNTH'] === x['SURVMNTH']) {
                y['employed_absent'] = x['COUNT'];
              }
            });
            break;
          case 'Unemployed':
            LABOUR_DATA.map((y) => {
              if (y['SURVMNTH'] === x['SURVMNTH']) {
                y['unemployed'] = x['COUNT'];
              }
            });
            break;
          case 'Not in labour force':
            LABOUR_DATA.map((y) => {
              if (y['SURVMNTH'] === x['SURVMNTH']) {
                y['not_in_lf'] = x['COUNT'];
              }
            });
            break;
        }
      });

      // When Covid data is ahead of Labour data, we need to push the latest
      // covid data month to keep the timelines the same
      if (!LABOUR_DATA.find((y) => y['SURVMNTH'] === currentMonth)) {
        LABOUR_DATA.push(new LabourData(currentMonth));
      }

      // Create chart
      populateLabourChart(barType, where);
    });
}

/**
 * Gets Canada Covid data and creates line chart
 */
function getCovidData(province: string) {
  // add province to where when needed
  const where = province !== 'all' ? COVID_TAB_SETUP.where + `AND(ca_provterr=${province})` : COVID_TAB_SETUP.where;
  canadaCovid
    .tabulate<AmchartsDataSet>({
      ...COVID_TAB_SETUP,
      format: 'amcharts',
      where,
    })
    .then((res: HttpResponse<AmchartsDataSet>) => {
      const covidData: CovidData[] = res && res.parsedBody ? res?.parsedBody?.dataProvider : [];

      currentMonth = MONTH_NAMES[new Date(covidData[covidData.length - 1]['date_stamp']).getMonth()];

      const titleUrl = `https://covid19.richdataservices.com/rds-tabengine/analysis/ca/ca_gov_cases/custom-tables;showTotals=true,true,true,true;sortRows=VALUE,ASC;sortCols=NAME,DESC;filterEmpty=true?rows=date_stamp&where=${where}&measure=cnt_confirmed:SUM(cnt_confirmed)`;

      AmChartsLineUtil.createDateLineChart({
        elementId: COVID_CHART_ELEMENT_ID,
        // Add January and last day of current month to keep same timeline for both charts
        data: [
          new CovidData('2020-01-01', 0, 0, 0),
          ...covidData,
          new CovidData(new Date(new Date().getFullYear(), MONTH_NAMES.indexOf(currentMonth) + 1, 0).toDateString()),
        ],
        dateName: 'date_stamp',
        lines: [
          { name: 'Confirmed Cases', value: 'cnt_confirmed', color: CommonAmChartColors.confirmedColor },
          { name: 'Total Deaths', value: 'cnt_death', color: CommonAmChartColors.deathsColor },
          { name: 'Total Recovered', value: 'cnt_recovered', color: CommonAmChartColors.recoveredColor },
        ],
        titleUrl,
        chartTitle: 'View Table',
        titleSize: 'small',
        yTitle: 'COVID-19 Cases',
      });
    });
}

function getPerspectiveData(dims: string, selector: string, questionText: string | undefined) {
  canadaPerspective
    .tabulate<AmchartsDataSet>({
      ...PERCEIVED_SETUP,
      format: 'amcharts',
      dims,
    })
    .then((res: HttpResponse<AmchartsDataSet>) => {
      AmChartsSimpleBarUtil.disposeChart(selector);

      const titleUrl = `https://covid19.richdataservices.com/rds-tabengine/analysis/ca/pums_cpss_01/custom-tables;showTotals=true,true,true,true;sortRows=NATURAL,ASC;sortCols=NATURAL,ASC;filterEmpty=true?rows=${dims}&weights=COVID_WT&measure=COUNT:COUNT(*)`;

      AmChartsSimpleBarUtil.createChart({
        data: res?.parsedBody?.dataProvider,
        elementId: selector,
        chartTitle: questionText,
        titleUrl,
        xCategory: dims,
        xTitle: 'Perspective',
        yCategory: 'COUNT',
      });
    });
}

/**
 * Uses the labourData from above to populate the labour chart with stacked or clustered bar chart
 * @param barType - use to determine which chart to display, user uses select to toggle between the two
 */
function populateLabourChart(barType: string, where?: string) {
  const titleUrl = where
    ? `'https://covid19.richdataservices.com/rds-tabengine/analysis/ca/pums_lfs/custom-tables;showTotals=true,true,true,true;sortRows=VALUE,ASC;sortCols=NAME,DESC;filterEmpty=true?cols=LFSSTAT&rows=SURVMNTH&weights=FINALWT&where=${where}&measure=COUNT:COUNT(*)'`
    : 'https://covid19.richdataservices.com/rds-tabengine/analysis/ca/pums_lfs/custom-tables;showTotals=true,true,true,true;sortRows=VALUE,ASC;sortCols=NAME,DESC;filterEmpty=true?cols=LFSSTAT&rows=SURVMNTH&weights=FINALWT&where=(SURVYEAR%3D2020)&measure=COUNT:COUNT(*)';

  if (barType === 'stacked') {
    AmChartsStackedBarUtil.createChart({
      elementId: LABOUR_CHART_ELEMENT_ID,
      data: LABOUR_DATA,
      titleUrl,
      chartTitle: 'View Table',
      titleSize: 'small',
      xCategory: 'SURVMNTH',
      xTitle: 'Employment Status',
      categories: [
        { key: 'employed_at_work', title: 'Employed At Work' },
        { key: 'employed_absent', title: 'Employed, absent from work' },
        { key: 'unemployed', title: 'Unemployed' },
        { key: 'not_in_lf', title: 'Not in labour force' },
      ],
    });
  } else if (barType === 'clustered') {
    AmChartsClusteredBarUtil.createChart({
      elementId: LABOUR_CHART_ELEMENT_ID,
      data: LABOUR_DATA,
      titleUrl,
      chartTitle: 'View Table',
      titleSize: 'small',
      yTitle: 'Employment Status Totals',
      xCategory: 'SURVMNTH',
      groups: [
        { value: 'employed_at_work', title: 'Employed At Work' },
        { value: 'employed_absent', title: 'Employed, absent from work' },
        { value: 'unemployed', title: 'Unemployed' },
        { value: 'not_in_lf', title: 'Not in labour force' },
      ],
    });
  }
}
