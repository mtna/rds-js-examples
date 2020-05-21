import { GchartsDataSet, HttpResponse, RdsQueryController, RdsSelectParameters, RdsServer } from '@rds/sdk';
import { GoogleChartLineUtil } from 'shared/gcharts/line-chart.util';

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
  format: 'gcharts',
};

// Make the select query with the sdk
RdsQueryController.select<GchartsDataSet>(CATALOG_ID, DATA_PRODUCT_ID, PARAMS).then((res: HttpResponse<GchartsDataSet>) =>
  GoogleChartLineUtil.createChart({
    elementId: 'chart-div',
    chartTitle: 'Totals by Date',
    data: res.parsedBody,
  })
);
