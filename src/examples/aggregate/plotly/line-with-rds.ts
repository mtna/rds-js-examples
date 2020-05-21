import { HttpResponse, PlotlyDataSet, RdsServer } from '@rds/sdk';
import { PlotlyChartUtil } from 'shared/plotly/chart.util';

new RdsServer('https://covid19.richdataservices.com/rds')
  .getCatalog('int')
  .getDataProduct('jhu_country')
  .select<PlotlyDataSet>({
    cols: 'date_stamp,cnt_confirmed,cnt_death,cnt_recovered',
    where: '(iso3166_1=US)',
    metadata: true,
    limit: 5000,
    format: 'plotly_scatter',
  })
  .then((res: HttpResponse<PlotlyDataSet>) => PlotlyChartUtil.createChart('chart-div', res.parsedBody));
