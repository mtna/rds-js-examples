import { AmchartsDataSet, HttpResponse, RdsServer } from '@rds/sdk';
import { AmChartsHeatUtil } from 'shared/amcharts/heat-map.util';

new RdsServer('https://covid19.richdataservices.com/rds')
  .getCatalog('ca')
  .getDataProduct('ca_statcan_cases')
  .tabulate<AmchartsDataSet>({
    dims: 'gender,age_group',
    measure: 'COUNT:COUNT(*)',
    metadata: true,
    totals: true,
    inject: true,
    orderby: 'gender ASC, age_group DESC',
    format: 'amcharts',
  })
  .then((res: HttpResponse<AmchartsDataSet>) =>
    AmChartsHeatUtil.createChart({
      elementId: 'chart-div',
      data: res && res.parsedBody && res.parsedBody.dataProvider,
      xCategory: 'gender',
      yCategory: 'age_group',
      valueCategory: 'COUNT',
    })
  );
