import { readFileSync } from 'fs';
import { StackBlitzExampleConfig } from '~/shared/stackblitz';

export const GCHARTS_LINE_WITH_RDS = new StackBlitzExampleConfig(
  'Google Charts Line Graph with RDS',
  `A visualization of aggregate data using the RDS API's select query and Google Chart's line graph.`,
  ['GCHARTS', 'RDS-SDK'],
  readFileSync(__dirname + '/../../index.gcharts.html', 'utf-8'),
  readFileSync(__dirname + '/line-with-rds.ts', 'utf-8'),
  [
    {
      path: 'shared/gcharts/line-chart.util.ts',
      contents: readFileSync(__dirname + '/../../../../../shared/gcharts/line-chart.util.ts', 'utf-8'),
    },
  ]
);
