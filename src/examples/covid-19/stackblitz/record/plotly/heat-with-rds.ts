import { HttpResponse, PlotlyDataSet, RdsServer } from '@rds/sdk';
import { PlotlyChartUtil } from '~/shared/plotly/chart.util';

new RdsServer('https://covid19.richdataservices.com/rds')
  .getCatalog('ca')
  .getDataProduct('ca_statcan_cases')
  .tabulate<PlotlyDataSet>({
    dims: 'gender,age_group',
    measure: 'COUNT:COUNT(*)',
    metadata: true,
    totals: true,
    inject: true,
    orderby: 'gender ASC, age_group DESC',
    format: 'plotly_heatmap',
  })
  .then((res: HttpResponse<PlotlyDataSet>) => PlotlyChartUtil.createChart('chart-div', res.parsedBody));
