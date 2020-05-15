import { AmChartsHeatUtil } from 'shared/amcharts/heat-map.util';
import { RdsServer, RdsQueryController, HttpResponse, RdsTabulateParameters, AmchartsDataSet } from '@rds/sdk';

// Initialize the RDS Server information,
// must be called once at initalization.
// We are using the defaults, but it can be configured
// to point at any host RDS API
RdsServer.init();

const CATALOG_ID = 'covid19';
const DATA_PRODUCT_ID = 'ca_statcan';
const PARAMS: RdsTabulateParameters = {
  dims: 'gender,age_group',
  measure: 'COUNT:COUNT(*)',
  metadata: true,
  totals: true,
  inject: true,
  orderby: 'gender ASC, age_group DESC',
  format: 'amcharts',
};

// Use the sdk to tabulate
RdsQueryController.tabulate<AmchartsDataSet>(CATALOG_ID, DATA_PRODUCT_ID, PARAMS).then((res: HttpResponse<AmchartsDataSet>) =>
  AmChartsHeatUtil.createChart({
    elementId: 'chart-div',
    data: res && res.parsedBody && res.parsedBody.dataProvider,
    xCategory: 'gender',
    yCategory: 'age_group',
    valueCategory: 'COUNT',
  })
);
