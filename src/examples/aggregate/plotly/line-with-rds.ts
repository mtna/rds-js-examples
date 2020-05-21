import { HttpResponse, PlotlyDataSet, RdsQueryController, RdsSelectParameters, RdsServer } from '@rds/sdk';
import { PlotlyChartUtil } from 'shared/plotly/chart.util';

// Initialize the RDS Server information,
// must be called once at initalization.
// We are using the defaults, but it can be configured
// to point at any host RDS API
RdsServer.init();

const CATALOG_ID = 'int';
const DATA_PRODUCT_ID = 'jhu_country';
const PARAMS: RdsSelectParameters = {
  cols: 'date_stamp,cnt_confirmed,cnt_death,cnt_recovered',
  where: '(iso3166_1=US)',
  metadata: true,
  limit: 5000,
  format: 'plotly_scatter',
};

// Element to embed the chart
const ELEMENT_ID = 'chart-div';

// Make the select query with the sdk
RdsQueryController.select<PlotlyDataSet>(CATALOG_ID, DATA_PRODUCT_ID, PARAMS).then((res: HttpResponse<PlotlyDataSet>) =>
  PlotlyChartUtil.createChart(ELEMENT_ID, res.parsedBody)
);
