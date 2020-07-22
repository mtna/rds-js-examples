import { RdsTabulateParameters, RdsDataProduct } from '@rds/sdk';
import { canadaCatalog } from './constants';

export class CovidData {
  constructor(
    public date_stamp: string,
    public cnt_confirmed: number | null = null,
    public cnt_death: number | null = null,
    public cnt_recovered: number | null = null
  ) {}
}

export const canadaCovid = new RdsDataProduct(canadaCatalog, 'ca_gov_cases');

export const COVID_TAB_SETUP: RdsTabulateParameters = {
  dims: 'date_stamp',
  measure: 'cnt_confirmed:SUM(cnt_confirmed),cnt_death:SUM(cnt_death),cnt_recovered:SUM(cnt_recovered)',
  metadata: true,
  inject: true,
};

/** ID of the element to embed the chart to show aggregated data */
export const COVID_CHART_ELEMENT_ID = 'covid-chart';
