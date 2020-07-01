import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import { AmchartsHeatMapConfig } from './amcharts-config';

/**
 * Utility to interact with the JS charting library, AmCharts.
 *
 * Specifically for creating bar charts from record level COVID-19 data and
 * displaying the total cases for the top 10 countries.
 */
export class AmChartsHeatUtil {
  /** Registry of all line charts created. Keyed on the html element id. */
  private static registry: { [elementId: string]: am4charts.XYChart } = {};

  /**
   * Create a new heat map, emdedded within a container with the given element id and populated with the given data.
   * @param config HeatMapConfig
   * @param data chart data
   */
  static createChart(config: AmchartsHeatMapConfig) {
    if (!config.data) {
      return;
    }
    // If an existing amchart exists in the same container, dispose it
    this.disposeChart(config.elementId);

    // Create a new chart and add it to the registry
    const chart = am4core.create(config.elementId, am4charts.XYChart);
    this.registry[config.elementId] = chart;

    this.createHeatChart(chart, config.data, config.xCategory, config.yCategory, config.valueCategory);
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

  private static createHeatChart(
    chart: am4charts.XYChart,
    data: any[],
    xCategory: string,
    yCategory: string,
    valueCategory: string | undefined
  ) {
    chart.maskBullets = false;

    const xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    const yAxis = chart.yAxes.push(new am4charts.CategoryAxis());

    xAxis.dataFields.category = xCategory;
    yAxis.dataFields.category = yCategory;

    xAxis.renderer.grid.template.disabled = true;
    xAxis.renderer.minGridDistance = 40;

    yAxis.renderer.grid.template.disabled = true;
    yAxis.renderer.inversed = true;
    yAxis.renderer.minGridDistance = 30;

    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = xCategory;
    series.dataFields.categoryY = yCategory;
    series.dataFields.value = valueCategory;
    series.sequencedInterpolation = true;
    series.defaultState.transitionDuration = 3000;

    const bgColor = new am4core.InterfaceColorSet().getFor('background');

    const columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 1;
    columnTemplate.strokeOpacity = 0.2;
    columnTemplate.stroke = bgColor;
    columnTemplate.tooltipText = '{gender}, {age_group}: {value.workingValue}';
    columnTemplate.width = am4core.percent(100);
    columnTemplate.height = am4core.percent(100);

    series.heatRules.push({
      target: columnTemplate,
      property: 'fill',
      min: am4core.color(bgColor),
      max: chart.colors.getIndex(0),
    });

    // heat legend
    const heatLegend = chart.bottomAxesContainer.createChild(am4charts.HeatLegend);
    heatLegend.width = am4core.percent(100);
    heatLegend.series = series;
    heatLegend.valueAxis.renderer.labels.template.fontSize = 9;
    heatLegend.valueAxis.renderer.minGridDistance = 30;

    // heat legend behavior
    series.columns.template.events.on('over', (event) => {
      handleHover(event.target);
    });

    series.columns.template.events.on('hit', (event) => {
      handleHover(event.target);
    });

    function handleHover(column: am4charts.Column) {
      if (column && column.dataItem) {
        // tslint:disable-next-line: no-unsafe-any
        const value: number = (column.dataItem as any).value;
        if (!isNaN(value)) {
          heatLegend.valueAxis.showTooltipAt(value);
        } else {
          heatLegend.valueAxis.hideTooltip();
        }
      }
    }

    series.columns.template.events.on('out', () => {
      heatLegend.valueAxis.hideTooltip();
    });

    chart.data = data;
  }
}
