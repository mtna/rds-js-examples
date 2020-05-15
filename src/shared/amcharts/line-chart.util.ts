import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import { AmchartsDateLineChartConfig, CommonAmChartColors } from './amcharts-config';

/**
 * Utility to interact with the JS charting library, AmCharts.
 *
 * Specifically for creating line charts from aggregated COVID-19 data and
 * displaying the count of confirmed cases, recovered cases, and total deaths over time.
 */
export class AmChartsLineUtil {
  /** Registry of all line charts created. Keyed on the html element id. */
  private static registry: { [elementId: string]: am4charts.XYChart } = {};

  /**
   * Create a new date line chart, emdedded within a container with the given element id and populated with the given data.
   * Y axis will be the date, x axis will be the passed parameter
   * @param elementId HTML element id of the container to embed the chart
   * @param data chart data
   */
  static createDateLineChart(config: AmchartsDateLineChartConfig) {
    if (!config.data) {
      return;
    }
    // If an existing amchart exists in the same container, dispose it
    this.disposeChart(config.elementId);

    // Create a new chart and add it to the registry
    const chart = am4core.create(config.elementId, am4charts.XYChart);
    this.registry[config.elementId] = chart;

    chart.dateFormatter.dateFormat = 'yyyy-MM-dd';
    chart.fontSize = '1em';
    chart.maskBullets = false;
    chart.paddingBottom = 0;
    chart.paddingLeft = 0;
    chart.paddingRight = 50;
    chart.paddingTop = 0;
    chart.zoomOutButton.disabled = true;

    // Set up x-axis which are dates
    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.stroke = am4core.color('#000000');
    dateAxis.renderer.grid.template.strokeOpacity = 0.25;
    dateAxis.renderer.labels.template.fill = am4core.color('#000');
    if (dateAxis.tooltip) {
      dateAxis.tooltip.label.fontSize = '1em';
      dateAxis.tooltip.background.fill = CommonAmChartColors.activeColor;
      dateAxis.tooltip.background.stroke = CommonAmChartColors.activeColor;
    }

    // Set up y-axis which are numeric values
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = config.yTitle;
    valueAxis.renderer.opposite = true;
    valueAxis.renderer.grid.template.stroke = am4core.color('#000000');
    valueAxis.renderer.grid.template.strokeOpacity = 0.25;
    valueAxis.renderer.minGridDistance = 30;
    valueAxis.renderer.maxLabelPosition = 0.98;
    valueAxis.renderer.baseGrid.disabled = true;
    valueAxis.renderer.inside = false;
    valueAxis.renderer.labels.template.verticalCenter = 'bottom';
    valueAxis.renderer.labels.template.fill = am4core.color('#000');
    valueAxis.renderer.labels.template.padding(2, 2, 2, 2);
    if (valueAxis.tooltip) {
      valueAxis.tooltip.disabled = true;
    }
    valueAxis.interpolationDuration = 3000;
    valueAxis.extraMax = 0.05;
    valueAxis.maxPrecision = 0;
    valueAxis.adapter.add('max', (max) => {
      if (max < 5) {
        max = 5;
      }
      return max;
    });

    // Configure cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.maxTooltipDistance = 0;
    chart.cursor.behavior = 'none';
    chart.cursor.lineY.disabled = true;
    chart.cursor.lineX.stroke = CommonAmChartColors.activeColor;
    chart.cursor.xAxis = dateAxis;

    // Set up the chart legend
    chart.legend = new am4charts.Legend();
    chart.legend.parent = chart.plotContainer;
    chart.legend.labels.template.fill = am4core.color('#000');
    chart.legend.markers.template.height = 16;
    chart.legend.contentAlign = 'left';
    chart.legend.fontSize = '1em';
    chart.legend.itemContainers.template.valign = 'middle';

    // Create each line series
    config.lines.forEach((lineSeries) => {
      this.addLineSeries(chart, lineSeries.name, lineSeries.value, config.dateName, lineSeries.color);
    });

    // Pass the data to the chart
    chart.data = config.data;
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

  /**
   * Adds a line series to an existing chart.
   *
   * @param chart chart to add a line series to
   * @param name name of the series
   * @param valueY name of the field in data that holds numeric value for vertical axis.
   * @param dateX name of the field in data that holds date for horizontal axis.
   * @param color color to render the line
   * @returns the new line series
   */
  private static addLineSeries(
    chart: am4charts.XYChart,
    name: string,
    valueY: string,
    dateX: string,
    color: am4core.Color | am4core.Pattern | am4core.LinearGradient | am4core.RadialGradient
  ): am4charts.LineSeries {
    const series = chart.series.push(new am4charts.LineSeries());
    series.name = name;
    series.dataFields.valueY = valueY;
    series.dataFields.dateX = dateX;

    series.strokeOpacity = 0.6;
    series.stroke = color;
    series.fill = color;

    // Configure tooltip
    if (series.tooltip) {
      series.tooltip.pointerOrientation = 'down';
      series.tooltip.getStrokeFromObject = true;
      series.tooltip.getFillFromObject = false;
      series.tooltip.background.fillOpacity = 0.2;
      series.tooltip.background.fill = am4core.color('#000000');
      series.tooltip.dy = -4;
      series.tooltip.fontSize = '1em';
    }
    series.tooltipText = 'Total {name}: {valueY}';

    return series;
  }
}
