import { GoogleBubbleChartConfig } from './gcharts-config';

export class GoogleChartBubbleUtil {
  /** Registry of all line charts created. Keyed on the html element id. */
  private static registry: { [elementId: string]: google.visualization.BubbleChart } = {};

  static createChart(config: GoogleBubbleChartConfig) {
    if (!config.data) {
      return;
    }
    const existingChart = this.registry[config.elementId];
    const bubbleChartDiv = document.getElementById(config.elementId);

    /** If chart already exists in html element, clear out the html */
    if (existingChart) {
      this.disposeChart(config.elementId);
    }

    if (bubbleChartDiv) {
      const data = google.visualization.arrayToDataTable([config.data.cols, ...config.data.rows], false);
      const bubbleChart = new google.visualization.BubbleChart(bubbleChartDiv);
      this.registry[config.elementId] = bubbleChart;

      const options = {
        title: config.chartTitle,
        hAxis: { title: config.xAxisTitle },
        vAxis: { title: config.yAxisTitle },
        bubble: { textStyle: { fontSize: 11 } },
      };

      bubbleChart.draw(data, options);
    }
  }

  static disposeChart(elementId: string) {
    const chartDiv = document.getElementById(elementId);
    if (chartDiv) {
      chartDiv.innerHTML = '';
    }
  }
}
