import { readFileSync } from 'fs';
import { StackBlitzExampleConfig } from 'shared/stackblitz';

export const PLOTLY_HEAT_WITHOUT_RDS = new StackBlitzExampleConfig(
  'Plotly Heat Chart without RDS',
  `A visualization of record level data using Plotly's heat chart, without the help of the RDS API.`,
  ['D3_FETCH', 'TS'],
  readFileSync(__dirname + '/../../index.plotly.html', 'utf-8'),
  readFileSync(__dirname + '/heat-without-rds.ts', 'utf-8'),
  [{ path: 'shared/plotly/chart.util.ts', contents: readFileSync(__dirname + '/../../../shared/plotly/chart.util.ts', 'utf-8') }]
);
