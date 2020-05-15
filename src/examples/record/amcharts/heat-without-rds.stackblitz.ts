import { readFileSync } from 'fs';
import { StackBlitzExampleConfig } from 'shared/stackblitz';

export const AMCHARTS_HEAT_WITHOUT_RDS = new StackBlitzExampleConfig(
  'AmCharts Heat Map without RDS',
  `A visualization of record level data using AmChart's heat map, without the help of the RDS API.`,
  ['AMCHARTS', 'D3_FETCH', 'TS'],
  readFileSync(__dirname + '/../../index.amcharts.html', 'utf-8'),
  readFileSync(__dirname + '/heat-without-rds.ts', 'utf-8'),
  [
    { path: 'shared/amcharts/heat-map.util.ts', contents: readFileSync(__dirname + '/../../../shared/amcharts/heat-map.util.ts', 'utf-8') },
    {
      path: 'shared/amcharts/amcharts-config.ts',
      contents: readFileSync(__dirname + '/../../../shared/amcharts/amcharts-config.ts', 'utf-8'),
    },
  ]
);
