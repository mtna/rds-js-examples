import { readFileSync } from 'fs';
import { StackBlitzExampleConfig } from 'shared/stackblitz';

export const AMCHARTS_HEAT_WITH_RDS = new StackBlitzExampleConfig(
  'AmCharts Heat Map with RDS',
  `A visualization of record level data using the RDS API's tabulate query and AmChart's heat map.`,
  ['AMCHARTS', 'RDS-SDK'],
  readFileSync(__dirname + '/../../index.amcharts.html', 'utf-8'),
  readFileSync(__dirname + '/heat-with-rds.ts', 'utf-8'),
  [
    { path: 'shared/amcharts/heat-map.util.ts', contents: readFileSync(__dirname + '/../../../shared/amcharts/heat-map.util.ts', 'utf-8') },
    {
      path: 'shared/amcharts/amcharts-config.ts',
      contents: readFileSync(__dirname + '/../../../shared/amcharts/amcharts-config.ts', 'utf-8'),
    },
  ]
);
