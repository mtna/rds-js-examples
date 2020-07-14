import { Datum, Record } from '@mtna/data-core-ui';
import { Code } from '@mtna/pojo-consumer-ui';
import { GchartsDataSet, RdsTabulateParameters } from '@rds/sdk';
import { GoogleLineChartConfig } from '~shared/gcharts/gcharts-config';
import { GoogleChartLineUtil } from '~shared/gcharts/line-chart.util';

const VARIABLE_LABELS: { [id: string]: string } = {
  date_stamp: 'Datestamp',
  retail_recreation_pct: 'Retail and Recreation',
  grocery_pharmacy_pct: 'Grocery and Pharmacy',
  parks_pct: 'Parks',
  transit_station_pct: 'Transit Stations',
  workplace_pct: 'Workplace',
  residential_pct: 'Residential',
};

export function convertDateColumnTypeToDate(data: GchartsDataSet): GchartsDataSet {
  const dateIndex = data.cols.findIndex((c) => c.id === 'date_stamp');
  return {
    ...data,
    cols: data.cols.map((c) => (c.id === 'date_stamp' ? { ...c, type: 'date' } : c)),
    rows: data.rows.map((r: google.visualization.DataObjectRow) => ({
      ...r,
      c: r.c.map((rc, i) => (i !== dateIndex ? rc : { ...rc, v: new Date(rc.v as string) })),
    })),
  };
}

export function filterUnchecked(data: GchartsDataSet, checkboxes: { [id: string]: boolean }) {
  const indexes: { [index: number]: boolean } = {};
  data.cols.forEach((col, index) => {
    if (!checkboxes[col.id || '']) {
      indexes[index] = true;
    }
  });
  const cols = data.cols.filter((_, i) => !indexes[i]);
  const rows = data.rows.map((r) => ({ ...r, c: r.c.filter((_, i) => !indexes[i]) }));
  return { ...data, cols, rows };
}

export function isPresent<T>(obj: T | undefined | null): obj is T {
  return obj !== undefined && obj !== null;
}

export function generateTabulateParams(selected: [string, Code]): RdsTabulateParameters {
  const tabParams: RdsTabulateParameters = {
    dims: 'date_stamp',
    format: 'gcharts',
    limit: 500,
    metadata: true,
    where: `(${selected[0]}=${selected[1].codeValue})`,
    measure: `retail_recreation_pct:AVG(retail_recreation_pct),grocery_pharmacy_pct:AVG(grocery_pharmacy_pct),parks_pct:AVG(parks_pct),transit_station_pct:AVG(transit_station_pct),workplace_pct:AVG(workplace_pct),residential_pct:AVG(residential_pct)`,
    orderby: 'date_stamp',
  };

  return tabParams;
}

export function renderChart(data: GchartsDataSet, config: Omit<GoogleLineChartConfig, 'data'>, checkboxes: { [id: string]: boolean } = {}) {
  const chartConfig: GoogleLineChartConfig = {
    ...config,
    data: convertColumnLabels(filterUnchecked(convertDateColumnTypeToDate(data), checkboxes)),
  };
  if (data) {
    GoogleChartLineUtil.createChart(chartConfig);
  }
}

export function findUniqueCodes(dataSet: { records: Record[] }): Code[] {
  if (dataSet.records?.length) {
    const uniqueCodes = new Map<string, Code>();
    dataSet.records.forEach((record) => {
      if (record.unit && record.unit.data?.length) {
        record.unit.data
          .filter((datum: Datum<Code>) => datum.value?.codeValue)
          .forEach((datum: Datum<Code>) => {
            if (!uniqueCodes.has(datum.value.codeValue)) {
              uniqueCodes.set(datum.value.codeValue, datum.value);
            }
          });
      }
    });
    return Array.from(uniqueCodes.values());
  }
  return [];
}

function convertColumnLabels(data: GchartsDataSet): GchartsDataSet {
  const cols = data.cols.map((c) => ({ ...c, label: VARIABLE_LABELS[c.id || ''] }));
  return { ...data, cols };
}
