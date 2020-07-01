import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { AmchartsStackedBarChartConfig } from './amcharts-config';

/**
 * Utility to interact with the JS charting library, AmCharts.
 *
 * Specifically for creating bar charts from record level COVID-19 data and
 * displaying the total cases for the top 10 countries.
 */
export class AmChartsStackedBarUtil {
  /** Registry of all line charts created. Keyed on the html element id. */
  private static registry: { [elementId: string]: am4charts.XYChart } = {};

  /**
   * Create a new bar chart, emdedded within a container with the given element id and populated with the given data.
   * @param elementId HTML element id of the container to embed the chart
   * @param data chart data
   */
  static createChart(config: AmchartsStackedBarChartConfig) {
    if (!config.data) {
      return;
    }
    // If an existing amchart exists in the same container, dispose it
    this.disposeChart(config.elementId);

    // Create a new chart and add it to the registry
    const chart = am4core.create(config.elementId, am4charts.XYChart);
    chart.numberFormatter.numberFormat = '#a';
    chart.paddingRight = 85;
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

    this.createBarChart(chart, config.data, config.xCategory, config.xTitle, config.categories);
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
    categories: { key: string; title: string }[]
  ) {
    /* Chart code */
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create axes
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    if (xTitle) {
      categoryAxis.title.text = xTitle;
    }
    categoryAxis.dataFields.category = xCategory;
    categoryAxis.renderer.grid.template.location = 0;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inside = true;
    valueAxis.renderer.labels.template.disabled = true;
    valueAxis.min = 0;

    chart.data = data;
    // Pass the data to the chart
    categories.forEach((category) => {
      this.createSeries(chart, xCategory, category.key, category.title);
    });

    // Legend
    chart.legend = new am4charts.Legend();
  }

  // Create series
  private static createSeries(chart: am4charts.XYChart, xCategory: string, field: string, name: string) {
    // Set up series
    const series = chart.series.push(new am4charts.ColumnSeries());
    series.name = name;
    series.dataFields.valueY = field;
    series.dataFields.categoryX = xCategory;
    series.sequencedInterpolation = true;

    // Make it stacked
    series.stacked = true;

    // Configure columns
    series.columns.template.width = am4core.percent(60);
    series.columns.template.tooltipText = '[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}';

    // Add label
    const labelBullet = series.bullets.push(new am4charts.LabelBullet());
    labelBullet.label.text = '{valueY}';
    labelBullet.locationY = 0.5;
    labelBullet.label.hideOversized = true;

    return series;
  }
}
