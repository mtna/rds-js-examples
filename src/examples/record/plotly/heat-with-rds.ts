import { HttpResponse, PlotlyDataSet, RdsQueryController, RdsServer, RdsTabulateParameters } from '@rds/sdk';
import { PlotlyChartUtil } from 'shared/plotly/chart.util';

// Initialize the RDS Server information,
// must be called once at initalization.
// We are using the defaults, but it can be configured
// to point at any host RDS API
RdsServer.init();

const CATALOG_ID = 'ca';
const DATA_PRODUCT_ID = 'ca_statcan_cases';
const PARAMS: RdsTabulateParameters = {
  dims: 'gender,age_group',
  measure: 'COUNT:COUNT(*)',
  metadata: true,
  totals: true,
  inject: true,
  orderby: 'gender ASC, age_group DESC',
  format: 'plotly_heatmap',
};

// Use the sdk to tabulate
RdsQueryController.tabulate<PlotlyDataSet>(CATALOG_ID, DATA_PRODUCT_ID, PARAMS).then((res: HttpResponse<PlotlyDataSet>) =>
  PlotlyChartUtil.createChart('chart-div', res.parsedBody)
);
