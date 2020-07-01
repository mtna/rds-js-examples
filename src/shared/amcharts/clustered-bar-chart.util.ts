import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import { AmchartsClusteredBarChartConfig } from './amcharts-config';

/**
 * Utility to interact with the JS charting library, AmCharts.
 *
 * Specifically for creating bar charts from record level COVID-19 data and
 * displaying the total cases for the top 10 countries.
 */
export class AmChartsClusteredBarUtil {
  /** Registry of all line charts created. Keyed on the html element id. */
  private static registry: { [elementId: string]: am4charts.XYChart } = {};

  /**
   * Create a new bar chart, emdedded within a container with the given element id and populated with the given data.
   * @param elementId HTML element id of the container to embed the chart
   * @param data chart data
   */
  static createChart(config: AmchartsClusteredBarChartConfig) {
    if (!config.data) {
      return;
    }
    // If an existing amchart exists in the same container, dispose it
    this.disposeChart(config.elementId);

    // Create a new chart and add it to the registry
    const chart = am4core.create(config.elementId, am4charts.XYChart);
    chart.numberFormatter.numberFormat = '#a';
    const title = chart.titles.create();
    if (config.titleUrl) {
      title.html = '<a target="_blank" href=' + config.titleUrl + '>' + config.chartTitle + '</a>';
    } else if (config.chartTitle) {
      title.text = config.chartTitle;
    }

    if (config.titleSize) {
      switch (config.titleSize) {
        case 'small':
          title.fontSize = 15;
          title.align = 'right';
          title.marginRight = 30;
          title.marginBottom = 8;
          break;
        case 'large':
          title.fontSize = 25;
          title.marginBottom = 24;
          break;
      }
    }
    this.registry[config.elementId] = chart;

    this.createBarChart(chart, config.data, config.yTitle, config.xCategory, config.groups);
  }

  /**
   * Dispose an AmChart within an html element with the given id.
   * @param elementId ID of the container that holds the Plotly chart to dispose
   */
  static disposeChart(elementId: string): void {
    const existingChart = this.registry[elementId];
    if (existingChart && !existingChart.isDisposed()) {
      existingChart.dispose();
    }
  }

  private static createBarChart(
    chart: am4charts.XYChart,
    data: any[],
    yTitle: string | undefined,
    xCategory: string,
    groups: { value: string; title: string }[]
  ) {
    // Create axes
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = xCategory;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = yTitle ? yTitle : '';
    valueAxis.renderer.opposite = true;

    // Add the columns
    groups.forEach((group) => {
      this.addSeries(chart, group.title, group.value, xCategory);
    });

    // Pass the data to the chart
    chart.data = data;

    // Legend
    chart.legend = new am4charts.Legend();
  }

  /**
   * Adds a column series to an existing chart
   *
   * @param chart chart to add teh column series to
   * @param name name of the series
   * @param valueY name of the field in data that holds numeric value for vertical axis.
   * @param categoryX name of the field in data that holds category for horizontal axis.
   * @returns the new column series
   */
  private static addSeries(chart: am4charts.XYChart, name: string, valueY: string, categoryX: string) {
    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = valueY;
    series.dataFields.categoryX = categoryX;
    series.name = name;
    series.columns.template.tooltipText = '{name}: [bold]{valueY}[/]';
    series.columns.template.height = am4core.percent(100);
    series.sequencedInterpolation = true;
  }
}
