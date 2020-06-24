import { readFileSync } from 'fs';
import { StackBlitzExampleConfig } from '~/shared/stackblitz';

export const PLOTLY_SCATTER_WITHOUT_RDS = new StackBlitzExampleConfig(
  'Plotly Scatter Plot Graph without RDS',
  `A visualization of aggregate data using Plotly's scatter plot graph, without the help of the RDS API.`,
  ['D3_FETCH', 'TS'],
  readFileSync(__dirname + '/../../index.plotly.html', 'utf-8'),
  readFileSync(__dirname + '/line-without-rds.ts', 'utf-8'),
  [{ path: 'shared/plotly/chart.util.ts', contents: readFileSync(__dirname + '/../../../../../shared/plotly/chart.util.ts', 'utf-8') }]
);
