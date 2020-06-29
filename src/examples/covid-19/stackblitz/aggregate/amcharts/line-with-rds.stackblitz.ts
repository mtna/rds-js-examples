import { readFileSync } from 'fs';
import { StackBlitzExampleConfig } from '~/shared/stackblitz';

export const AMCHARTS_LINE_WITH_RDS = new StackBlitzExampleConfig(
  'AmCharts Line Graph with RDS',
  `A visualization of aggregate data using the RDS API's select query and AmChart's line graph.`,
  ['AMCHARTS', 'RDS-SDK'],
  readFileSync(__dirname + '/../../index.amcharts.html', 'utf-8'),
  readFileSync(__dirname + '/line-with-rds.ts', 'utf-8'),
  [
    {
      path: 'shared/amcharts/line-chart.util.ts',
      contents: readFileSync(__dirname + '/../../../../../shared/amcharts/line-chart.util.ts', 'utf-8'),
    },
    {
      path: 'shared/amcharts/amcharts-config.ts',
      contents: readFileSync(__dirname + '/../../../../../shared/amcharts/amcharts-config.ts', 'utf-8'),
    },
  ]
);
