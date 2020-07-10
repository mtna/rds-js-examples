export interface GoogleLineChartConfig extends google.visualization.LineChartOptions {
  elementId: string;
  data: google.visualization.DataObject | undefined;
  chartTitle?: string;
}

export interface GoogleBubbleChartConfig extends GoogleLineChartConfig {
  xAxisTitle: string;
  yAxisTitle: string;
}
