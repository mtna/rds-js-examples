/* Need for async/await, see https://github.com/parcel-bundler/parcel/issues/3375 */
import 'regenerator-runtime/runtime';

import { MDCSelect } from '@material/select';
import { StackBlitzUtil } from 'shared/stackblitz/index';

import {
  AMCHARTS_HEAT_WITH_RDS,
  AMCHARTS_HEAT_WITHOUT_RDS,
  AMCHARTS_LINE_WITH_RDS,
  AMCHARTS_LINE_WITHOUT_RDS,
  PLOTLY_SCATTER_WITH_RDS,
  PLOTLY_SCATTER_WITHOUT_RDS,
  PLOTLY_HEAT_WITH_RDS,
  PLOTLY_HEAT_WITHOUT_RDS,
  GCHARTS_LINE_WITH_RDS,
  GCHARTS_LINE_WITHOUT_RDS,
} from './examples/all-stackblitz-example-configs';
import { AMCHARTS_LINE_SERIES } from 'shared/amcharts/amcharts-config';
import { AmChartsLineUtil } from 'shared/amcharts/line-chart.util';
import { AmChartsHeatUtil } from 'shared/amcharts/heat-map.util';
import { PlotlyChartUtil } from 'shared/plotly/chart.util';
import { ChartType } from 'shared/models/chart-type';
import { GoogleChartLineUtil } from 'shared/gcharts/line-chart.util';
import {
  AmchartsDataSet,
  GchartsDataSet,
  HttpResponse,
  PlotlyDataSet,
  RdsQueryController,
  RdsSelectParameters,
  RdsServer,
  RdsTabulateParameters,
} from '@rds/sdk';

import { ButtonUtil, LINE_CHART_CONFIG, BAR_CHART_CONFIG } from 'shared/button/button-util';
import { NavBarUtil } from './shared/nav-bar-util';
import { TabBarUtil } from 'shared/tab-bar-util';

// Initialize the navbar and nav drawer
NavBarUtil.initializeNavBar();

// Initialize the RDS Server information,
// must be called once at initalization.
// We are using the defaults, but it can be configured
// to point at any host RDS API
RdsServer.init();

/** ID of the element to embed the chart to show aggregated data */
const AGGREGATE_CHART_ELEMENT_ID = 'line-chart-div';
/** ID of the element to embed the chart to show record level data */
const RECORD_CHART_ELEMENT_ID = 'bar-chart-div';

/** ID of the element to embed the stackblitz to show the aggregated data with RDS example code */
const AGGREGATE_WITH_RDS_CODE_ELEMENT_ID = 'line-stackblitz';
/** ID of the element to embed the stackblitz to show the aggregated data without RDS example code */
const AGGREGATE_WITHOUT_RDS_CODE_ELEMENT_ID = 'line-compare-stackblitz';
/** ID of the element to embed the stackblitz to show the record level data with RDS example code */
const RECORD_WITH_RDS_CODE_ELEMENT_ID = 'bar-stackblitz';
/** ID of the element to embed the stackblitz to show the record level data without RDS example code */
const RECORD_WITHOUT_RDS_CODE_ELEMENT_ID = 'bar-compare-stackblitz';

const CATALOG_ID = 'covid19';
const DATA_PRODUCT_ID = 'us_jhu_ccse_country';
const AGGREGATE_EXAMPLE_PARAMS: RdsSelectParameters = {
  cols: 'date_stamp,cnt_confirmed,cnt_death,cnt_recovered',
  where: '(iso3166_1=US)',
  metadata: true,
  limit: 5000,
};

const TABULATE_DATA_PRODUCT_ID = 'ca_statcan';
const RECORD_EXAMPLE_PARAMS: RdsTabulateParameters = {
  dims: 'gender,age_group',
  measure: 'COUNT:COUNT(*)',
  metadata: true,
  totals: true,
  inject: true,
  orderby: 'gender ASC, age_group DESC',
};

// Embed inital AmChart StackBlitz examples
StackBlitzUtil.embed(AGGREGATE_WITH_RDS_CODE_ELEMENT_ID, AMCHARTS_LINE_WITH_RDS);
StackBlitzUtil.embed(AGGREGATE_WITHOUT_RDS_CODE_ELEMENT_ID, AMCHARTS_LINE_WITHOUT_RDS);
StackBlitzUtil.embed(RECORD_WITH_RDS_CODE_ELEMENT_ID, AMCHARTS_HEAT_WITH_RDS);
StackBlitzUtil.embed(RECORD_WITHOUT_RDS_CODE_ELEMENT_ID, AMCHARTS_HEAT_WITHOUT_RDS);

// Initial chart examples
RdsQueryController.select<AmchartsDataSet>(CATALOG_ID, DATA_PRODUCT_ID, { ...AGGREGATE_EXAMPLE_PARAMS, format: 'amcharts' }).then(
  (res: HttpResponse<AmchartsDataSet>) =>
    AmChartsLineUtil.createDateLineChart({
      elementId: AGGREGATE_CHART_ELEMENT_ID,
      data: res?.parsedBody?.dataProvider,
      dateName: 'date_stamp',
      lines: AMCHARTS_LINE_SERIES,
      yTitle: 'Total Cases for U.S.',
    })
);
RdsQueryController.tabulate<AmchartsDataSet>(CATALOG_ID, TABULATE_DATA_PRODUCT_ID, { ...RECORD_EXAMPLE_PARAMS, format: 'amcharts' }).then(
  (res: HttpResponse<AmchartsDataSet>) =>
    AmChartsHeatUtil.createChart({
      elementId: RECORD_CHART_ELEMENT_ID,
      data: res?.parsedBody?.dataProvider,
      xCategory: 'gender',
      yCategory: 'age_group',
      valueCategory: 'COUNT',
    })
);

// initialize the tab bars and set up listeners
TabBarUtil.initializeTabBar(document.querySelector('.line-chart'));
TabBarUtil.initializeTabBar(document.querySelector('.bar-chart'));

ButtonUtil.initializeButton(LINE_CHART_CONFIG);
ButtonUtil.initializeButton(BAR_CHART_CONFIG);

// Initizalize the aggregate select and listen for changes
const aggregateChartTypeSelectElement = document.querySelector('.line-select');
let currentAggregateChartType: ChartType = 'AMCHARTS';
if (aggregateChartTypeSelectElement) {
  const aggregateChartTypeSelect = new MDCSelect(aggregateChartTypeSelectElement);
  aggregateChartTypeSelect.listen('MDCSelect:change', () => {
    // Dispose previous chart
    switch (currentAggregateChartType) {
      case 'AMCHARTS':
        AmChartsLineUtil.disposeChart(AGGREGATE_CHART_ELEMENT_ID);
        break;
      case 'GCHARTS':
        GoogleChartLineUtil.disposeChart(AGGREGATE_CHART_ELEMENT_ID);
        break;
      case 'PLOTLY':
        PlotlyChartUtil.disposeChart(AGGREGATE_CHART_ELEMENT_ID);
        break;
    }

    // Set current chart type
    currentAggregateChartType = aggregateChartTypeSelect.value as ChartType;

    // Update example chart and embedded stackblitzes
    switch (currentAggregateChartType) {
      case 'AMCHARTS':
        RdsQueryController.select<AmchartsDataSet>(CATALOG_ID, DATA_PRODUCT_ID, { ...AGGREGATE_EXAMPLE_PARAMS, format: 'amcharts' }).then(
          (res: HttpResponse<AmchartsDataSet>) =>
            AmChartsLineUtil.createDateLineChart({
              elementId: AGGREGATE_CHART_ELEMENT_ID,
              data: res?.parsedBody?.dataProvider,
              dateName: 'date_stamp',
              lines: AMCHARTS_LINE_SERIES,
              yTitle: 'Total Cases for U.S.',
            })
        );
        StackBlitzUtil.embed(AGGREGATE_WITH_RDS_CODE_ELEMENT_ID, AMCHARTS_LINE_WITH_RDS);
        StackBlitzUtil.embed(AGGREGATE_WITHOUT_RDS_CODE_ELEMENT_ID, AMCHARTS_LINE_WITHOUT_RDS);
        break;
      case 'GCHARTS':
        RdsQueryController.select<GchartsDataSet>(CATALOG_ID, DATA_PRODUCT_ID, { ...AGGREGATE_EXAMPLE_PARAMS, format: 'gcharts' }).then(
          (res: HttpResponse<GchartsDataSet>) =>
            GoogleChartLineUtil.createChart({
              elementId: AGGREGATE_CHART_ELEMENT_ID,
              chartTitle: 'Totals by Date',
              data: res?.parsedBody,
            })
        );
        StackBlitzUtil.embed(AGGREGATE_WITH_RDS_CODE_ELEMENT_ID, GCHARTS_LINE_WITH_RDS);
        StackBlitzUtil.embed(AGGREGATE_WITHOUT_RDS_CODE_ELEMENT_ID, GCHARTS_LINE_WITHOUT_RDS);
        break;
      case 'PLOTLY':
        RdsQueryController.select<PlotlyDataSet>(CATALOG_ID, DATA_PRODUCT_ID, {
          ...AGGREGATE_EXAMPLE_PARAMS,
          format: 'plotly_scatter',
        }).then((res: HttpResponse<PlotlyDataSet>) => PlotlyChartUtil.createChart(AGGREGATE_CHART_ELEMENT_ID, res?.parsedBody));
        StackBlitzUtil.embed(AGGREGATE_WITH_RDS_CODE_ELEMENT_ID, PLOTLY_SCATTER_WITH_RDS);
        StackBlitzUtil.embed(AGGREGATE_WITHOUT_RDS_CODE_ELEMENT_ID, PLOTLY_SCATTER_WITHOUT_RDS);
        break;
    }
  });
}
// Initialize the barSelect and listen for changes
const recordChartTypeSelectElement = document.querySelector('.bar-select');
let currentRecordChartType: ChartType = 'AMCHARTS';
if (recordChartTypeSelectElement) {
  const recordChartTypeSelect = new MDCSelect(recordChartTypeSelectElement);
  recordChartTypeSelect.listen('MDCSelect:change', () => {
    // Dispose previous chart
    switch (currentRecordChartType) {
      case 'AMCHARTS':
        AmChartsHeatUtil.disposeChart(RECORD_CHART_ELEMENT_ID);
        break;
      case 'PLOTLY':
        PlotlyChartUtil.disposeChart(RECORD_CHART_ELEMENT_ID);
        break;
    }

    // Set the current chart type
    currentRecordChartType = recordChartTypeSelect.value as ChartType;

    // Update embedded stackblitz
    switch (currentRecordChartType) {
      case 'AMCHARTS':
        RdsQueryController.tabulate<AmchartsDataSet>(CATALOG_ID, TABULATE_DATA_PRODUCT_ID, {
          ...RECORD_EXAMPLE_PARAMS,
          format: 'amcharts',
        }).then((res: HttpResponse<AmchartsDataSet>) => {
          AmChartsHeatUtil.createChart({
            elementId: RECORD_CHART_ELEMENT_ID,
            data: res?.parsedBody?.dataProvider,
            xCategory: 'gender',
            yCategory: 'age_group',
            valueCategory: 'COUNT',
          });
        });
        StackBlitzUtil.embed(RECORD_WITH_RDS_CODE_ELEMENT_ID, AMCHARTS_HEAT_WITH_RDS);
        StackBlitzUtil.embed(RECORD_WITHOUT_RDS_CODE_ELEMENT_ID, AMCHARTS_HEAT_WITHOUT_RDS);
        break;
      case 'PLOTLY':
        RdsQueryController.tabulate<PlotlyDataSet>(CATALOG_ID, TABULATE_DATA_PRODUCT_ID, {
          ...RECORD_EXAMPLE_PARAMS,
          format: 'plotly_heatmap',
        }).then((res: HttpResponse<PlotlyDataSet>) => PlotlyChartUtil.createChart(RECORD_CHART_ELEMENT_ID, res?.parsedBody));
        StackBlitzUtil.embed(RECORD_WITH_RDS_CODE_ELEMENT_ID, PLOTLY_HEAT_WITH_RDS);
        StackBlitzUtil.embed(RECORD_WITHOUT_RDS_CODE_ELEMENT_ID, PLOTLY_HEAT_WITHOUT_RDS);
        break;
    }
  });
}
