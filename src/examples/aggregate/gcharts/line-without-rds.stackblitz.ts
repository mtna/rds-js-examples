import { readFileSync } from 'fs';
import { StackBlitzExampleConfig } from 'shared/stackblitz';

export const GCHARTS_LINE_WITHOUT_RDS = new StackBlitzExampleConfig(
  'Google Charts Line Graph without RDS',
  `A visualization of aggregate data using Google Chart's line graph, without the help of the RDS API.`,
  ['GCHARTS', 'D3_FETCH', 'TS'],
  readFileSync(__dirname + '/../../index.gcharts.html', 'utf-8'),
  readFileSync(__dirname + '/line-without-rds.ts', 'utf-8'),
  [
    {
      path: 'shared/gcharts/line-chart.util.ts',
      contents: readFileSync(__dirname + '/../../../shared/gcharts/line-chart.util.ts', 'utf-8'),
    },
  ]
);
