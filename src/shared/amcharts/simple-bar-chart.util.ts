import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import { AmchartsSimpleBarChartConfig } from './amcharts-config';

/**
 * Utility to interact with the JS charting library, AmCharts.
 *
 * Specifically for creating bar charts from record level COVID-19 data and
 * displaying the total cases for the top 10 countries.
 */
export class AmChartsSimpleBarUtil {
  /** Registry of all line charts created. Keyed on the html element id. */
  private static registry: { [elementId: string]: am4charts.XYChart } = {};

  /**
   * Create a new bar chart, emdedded within a container with the given element id and populated with the given data.
   * @param elementId HTML element id of the container to embed the chart
   * @param data chart data
   */
  static createChart(config: AmchartsSimpleBarChartConfig) {
    if (!config.data) {
      return;
    }
    // If an existing amchart exists in the same container, dispose it
    this.disposeChart(config.elementId);

    // Create a new chart and add it to the registry
    const chart = am4core.create(config.elementId, am4charts.XYChart);
    chart.numberFormatter.numberFormat = '#a';
    const title = chart.titles.create();
    if (config.titleUrl && config.chartTitle) {
      title.html = config.chartTitle + ' (<a target="_blank" href=' + config.titleUrl + '>View Table</a>)';
      // solves an issue with short amchart titles
      title.wrap = config.chartTitle.length > 35 ? true : false;
    } else if (config.chartTitle) {
      title.text = config.chartTitle;
      title.wrap = config.chartTitle.length > 70 ? true : false;
    }

    title.fontSize = 14;
    title.marginBottom = 30;
    title.align = 'left';

    this.registry[config.elementId] = chart;

    this.createBarChart(chart, config.data, config.xCategory, config.xTitle, config.yCategory, config.yTitle);
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
    xCategory: string,
    xTitle: string | undefined,
    yCategory: string,
    yTitle: string | undefined
  ) {
    // Set up the x-axis which are countries
    const xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    xAxis.dataFields.category = xCategory;
    if (xTitle) {
      xAxis.title.text = xTitle;
    }
    xAxis.renderer.grid.template.location = 0;
    xAxis.renderer.minGridDistance = 35;
    xAxis.renderer.labels.template.adapter.add('dy', (dy, target) => {
      if (target.dataItem && target.dataItem.index === 2) {
        return (dy || 0) + 25;
      }
      return dy;
    });
    xAxis.renderer.minGridDistance = 100;

    // Ensure labels aren't too long
    const label = xAxis.renderer.labels.template;
    label.truncate = true;
    label.maxWidth = 120;

    // Set up the y-axis which are numeric values
    chart.yAxes.push(new am4charts.ValueAxis());

    // Add the three column series
    this.addColumnSeries(chart, yTitle ? yTitle : 'Total', yCategory, xCategory);

    // Pass the data to the chart
    chart.data = data;
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
  private static addColumnSeries(chart: am4charts.XYChart, name: string, valueY: string, categoryX: string): am4charts.ColumnSeries {
    const series = chart.series.push(new am4charts.ColumnSeries());
    series.name = name;
    series.dataFields.valueY = valueY;
    series.dataFields.categoryX = categoryX;
    series.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/]';

    const columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;

    return series;
  }
}
