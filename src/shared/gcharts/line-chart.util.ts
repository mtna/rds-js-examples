import { GoogleLineChartConfig } from './gcharts-config';

export class GoogleChartLineUtil {
  /** Registry of all line charts created. Keyed on the html element id. */
  private static registry: { [elementId: string]: google.visualization.BarChart } = {};

  static createChart(config: GoogleLineChartConfig) {
    if (!config.data) {
      return;
    }
    const existingChart = this.registry[config.elementId];
    const lineChartDiv = document.getElementById(config.elementId);

    /** If chart already exists in html element, clear out the html */
    if (existingChart) {
      this.disposeChart(config.elementId);
    }

    if (lineChartDiv) {
      const data = google.visualization.arrayToDataTable([config.data.cols, ...config.data.rows], false);
      const lineChart = new google.visualization.LineChart(lineChartDiv);
      lineChart.draw(data, { title: config.chartTitle });
    }
  }

  static disposeChart(elementId: string) {
    const chartDiv = document.getElementById(elementId);
    if (chartDiv) {
      chartDiv.innerHTML = '';
    }
  }
}
