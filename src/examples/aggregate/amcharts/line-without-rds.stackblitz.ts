import { readFileSync } from 'fs';
import { StackBlitzExampleConfig } from 'shared/stackblitz';

export const AMCHARTS_LINE_WITHOUT_RDS = new StackBlitzExampleConfig(
  'AmCharts Line Graph without RDS',
  `A visualization of aggregate data using AmChart's line graph, without the help of the RDS API.`,
  ['AMCHARTS', 'D3_FETCH', 'TS'],
  readFileSync(__dirname + '/../../index.amcharts.html', 'utf-8'),
  readFileSync(__dirname + '/line-without-rds.ts', 'utf-8'),
  [
    {
      path: 'shared/amcharts/line-chart.util.ts',
      contents: readFileSync(__dirname + '/../../../shared/amcharts/line-chart.util.ts', 'utf-8'),
    },
    {
      path: 'shared/amcharts/amcharts-config.ts',
      contents: readFileSync(__dirname + '/../../../shared/amcharts/amcharts-config.ts', 'utf-8'),
    },
  ]
);
