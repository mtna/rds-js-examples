import { GchartsDataSet, HttpResponse, RdsServer } from '@rds/sdk';
import { GoogleChartLineUtil } from '~/shared/gcharts/line-chart.util';

new RdsServer('https://covid19.richdataservices.com/rds')
  .getCatalog('int')
  .getDataProduct('jhu_country')
  .select<GchartsDataSet>({
    cols: 'date_stamp,cnt_confirmed,cnt_death,cnt_recovered',
    where: '(iso3166_1=US)',
    metadata: true,
    limit: 5000,
    format: 'gcharts',
  })
  .then((res: HttpResponse<GchartsDataSet>) =>
    GoogleChartLineUtil.createChart({
      elementId: 'chart-div',
      chartTitle: 'Totals by Date',
      data: res.parsedBody,
    })
  );
