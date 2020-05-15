import { AmchartsDataSet, HttpResponse, RdsQueryController, RdsSelectParameters, RdsServer } from '@rds/sdk';
import { AMCHARTS_LINE_SERIES } from 'shared/amcharts/amcharts-config';
import { AmChartsLineUtil } from 'shared/amcharts/line-chart.util';

// Initialize the RDS Server information,
// must be called once at initalization.
// We are using the defaults, but it can be configured
// to point at any host RDS API
RdsServer.init();

const CATALOG_ID = 'covid19';
const DATA_PRODUCT_ID = 'us_jhu_ccse_country';
const PARAMS: RdsSelectParameters = {
  cols: 'date_stamp,cnt_confirmed,cnt_death,cnt_recovered',
  where: '(iso3166_1=US)',
  metadata: true,
  limit: 5000,
  format: 'amcharts',
};

// Make the select query with the sdk
RdsQueryController.select<AmchartsDataSet>(CATALOG_ID, DATA_PRODUCT_ID, PARAMS).then((res: HttpResponse<AmchartsDataSet>) =>
  AmChartsLineUtil.createDateLineChart({
    elementId: 'chart-div',
    data: res.parsedBody && res.parsedBody.dataProvider,
    dateName: 'date_stamp',
    lines: AMCHARTS_LINE_SERIES,
    yTitle: 'Total Cases for U.S.',
  })
);
