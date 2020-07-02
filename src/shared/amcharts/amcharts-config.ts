import * as am4core from '@amcharts/amcharts4/core';

/**
 * Base AmChart config
 */
export interface AmchartsChartConfig {
  chartTitle?: string;
  data: any[] | undefined;
  elementId: string;
  titleUrl?: string;
  titleSize?: 'small' | 'large';
}

/**
 * Base Bar Chart config
 */
export interface AmchartsBarChartConfig extends AmchartsChartConfig {
  xCategory: string;
  xTitle?: string;
}

/** Config for setting up a clustered bar chart */
export interface AmchartsClusteredBarChartConfig extends AmchartsBarChartConfig {
  groups: { value: string; title: string }[];
  yTitle?: string;
}

/**
 * Config for creating a date line chart
 */
export interface AmchartsDateLineChartConfig extends AmchartsChartConfig {
  dateName: string;
  lines: AmchartsLineSeriesConfig[];
  yTitle: string;
}

/**
 * Config for creating heat map
 */
export interface AmchartsHeatMapConfig extends AmchartsBarChartConfig {
  valueCategory?: string;
  yCategory: string;
}

/** Config for setting up a simple (not clustered, stacked, etc.) bar chart */
export interface AmchartsSimpleBarChartConfig extends AmchartsBarChartConfig {
  yCategory: string;
  yTitle?: string;
}

/** Config for setting up a stacked bar chart */
export interface AmchartsStackedBarChartConfig extends AmchartsBarChartConfig {
  categories: { key: string; title: string }[];
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

/* Line Series configuration for AmCharts*/
export const AMCHARTS_LINE_SERIES: AmchartsLineSeriesConfig[] = [
  { name: 'Confirmed Cases', value: 'cnt_confirmed', color: CommonAmChartColors.confirmedColor },
  { name: 'Total Deaths', value: 'cnt_death', color: CommonAmChartColors.deathsColor },
  { name: 'Total Recovered', value: 'cnt_recovered', color: CommonAmChartColors.recoveredColor },
];
