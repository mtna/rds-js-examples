import * as am4core from '@amcharts/amcharts4/core';

/** Config for setting up a bar chart */
export interface AmchartsBarChartConfig {
  data: any[] | undefined;
  elementId: string;
  chartTitle?: string;
  titleUrl?: string;
  titleSize?: 'small' | 'large';
  xCategory: string;
  xTitle?: string;
  yCategory: string;
  yTitle?: string;
}

/** Config for setting up a clustered bar chart */
export interface AmchartsClusteredBarChartConfig {
  data: any[] | undefined;
  elementId: string;
  chartTitle?: string;
  titleUrl?: string;
  titleSize?: 'small' | 'large';
  yTitle?: string;
  xCategory: string;
  groups: { value: string; title: string }[];
}

/** Config for setting up a stacked bar chart */
export interface AmchartsStackedBarChartConfig {
  data: any[] | undefined;
  elementId: string;
  chartTitle?: string;
  titleUrl?: string;
  titleSize?: 'small' | 'large';
  xCategory: string;
  xTitle?: string;
  categories: { key: string; title: string }[];
}

/**
 * Config for creating heat map
 */
export interface AmchartsHeatMapConfig {
  data: any[] | undefined;
  elementId: string;
  chartTitle?: string;
  valueCategory?: string;
  xCategory: string;
  yCategory: string;
}

export const CommonAmChartColors = {
  activeColor: am4core.color('#ff8726'),
  confirmedColor: am4core.color('#d21a1a'),
  recoveredColor: am4core.color('#45d21a'),
  deathsColor: am4core.color('#1c5fe5'),
};

/**
 * Config for each line series
 */
export interface AmchartsLineSeriesConfig {
  color: am4core.Color | am4core.Pattern | am4core.LinearGradient | am4core.RadialGradient;
  name: string;
  value: string;
}

/**
 * Config for creating a date line chart
 */
export interface AmchartsDateLineChartConfig {
  data: any[] | undefined;
  dateName: string;
  elementId: string;
  chartTitle?: string;
  titleUrl?: string;
  titleSize?: 'small' | 'large';
  lines: AmchartsLineSeriesConfig[];
  yTitle: string;
}

/* Line Series configuration for AmCharts*/
export const AMCHARTS_LINE_SERIES: AmchartsLineSeriesConfig[] = [
  { name: 'Confirmed Cases', value: 'cnt_confirmed', color: CommonAmChartColors.confirmedColor },
  { name: 'Total Deaths', value: 'cnt_death', color: CommonAmChartColors.deathsColor },
  { name: 'Total Recovered', value: 'cnt_recovered', color: CommonAmChartColors.recoveredColor },
];
