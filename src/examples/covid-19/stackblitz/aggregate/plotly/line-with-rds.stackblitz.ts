import { readFileSync } from 'fs';
import { StackBlitzExampleConfig } from '~/shared/stackblitz';

export const PLOTLY_SCATTER_WITH_RDS = new StackBlitzExampleConfig(
  'Plotly Scatter Plot Graph with RDS',
  `A visualization of aggregate data using the RDS API's select query and Plotly's scatter plot graph.`,
  ['RDS-SDK'],
  readFileSync(__dirname + '/../../index.plotly.html', 'utf-8'),
  readFileSync(__dirname + '/line-with-rds.ts', 'utf-8'),
  [{ path: 'shared/plotly/chart.util.ts', contents: readFileSync(__dirname + '/../../../../../shared/plotly/chart.util.ts', 'utf-8') }]
);
