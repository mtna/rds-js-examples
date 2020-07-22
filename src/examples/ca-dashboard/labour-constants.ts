import { RdsDataProduct, RdsTabulateParameters } from '@rds/sdk';
import { canadaCatalog } from './constants';

export class LabourData {
  employed_at_work = 0;
  employed_absent = 0;
  unemployed = 0;
  not_in_lf = 0;

  constructor(public SURVMNTH: string) {}
}

export const canadaLabour = new RdsDataProduct(canadaCatalog, 'pums_lfs');

export const LABOUR_SETUP: RdsTabulateParameters = {
  dims: 'SURVMNTH,SURVYEAR,LFSSTAT',
  where: '(SURVYEAR=2020)',
  measure: 'COUNT:COUNT(*)',
  totals: true,
  metadata: true,
  inject: true,
  orderby: 'SURVMNTH ASC, SURVYEAR ASC',
  weights: ['FINALWT'],
};

export const LABOUR_CHART_ELEMENT_ID = 'lfs-chart';
