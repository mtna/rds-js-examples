import { AmchartsDataSet, HttpResponse, RdsServer } from '@rds/sdk';
import { AMCHARTS_LINE_SERIES } from '~/shared/amcharts/amcharts-config';
import { AmChartsLineUtil } from '~/shared/amcharts/line-chart.util';

new RdsServer('https://covid19.richdataservices.com/rds')
  .getCatalog('int')
  .getDataProduct('jhu_country')
  .select<AmchartsDataSet>({
    cols: 'date_stamp,cnt_confirmed,cnt_death,cnt_recovered',
    where: '(iso3166_1=US)',
    metadata: true,
    limit: 5000,
    format: 'amcharts',
  })
  .then((res: HttpResponse<AmchartsDataSet>) =>
    AmChartsLineUtil.createDateLineChart({
      elementId: 'chart-div',
      data: res.parsedBody && res.parsedBody.dataProvider,
      dateName: 'date_stamp',
      lines: AMCHARTS_LINE_SERIES,
      yTitle: 'Total Cases for U.S.',
    })
  );
