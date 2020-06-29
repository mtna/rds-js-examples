import { readFileSync } from 'fs';
import { StackBlitzExampleConfig } from '~/shared/stackblitz';

export const PLOTLY_HEAT_WITH_RDS = new StackBlitzExampleConfig(
  'Plotly Heat Chart with RDS',
  `A visualization of record level data using the RDS API's tabulate query and Plotly's heat chart.`,
  ['RDS-SDK'],
  readFileSync(__dirname + '/../../index.plotly.html', 'utf-8'),
  readFileSync(__dirname + '/heat-with-rds.ts', 'utf-8'),
  [{ path: 'shared/plotly/chart.util.ts', contents: readFileSync(__dirname + '/../../../../../shared/plotly/chart.util.ts', 'utf-8') }]
);
