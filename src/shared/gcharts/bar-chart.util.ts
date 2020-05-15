export class GoogleChartBarUtil {
  /** Registry of all line charts created. Keyed on the html element id. */
  private static registry: { [elementId: string]: google.visualization.BarChart } = {};
  /** Title of chart */
  private static TITLE = 'Total By Country';

  static createChart(elementId: string, results: google.visualization.DataObject | undefined) {
    if (!results) {
      return;
    }
    const existingChart = this.registry[elementId];
    const barChartDiv = document.getElementById(elementId);

    /** If chart already exists in html element, clear out the html */
    if (existingChart) {
      this.disposeChart(elementId);
    }

    if (barChartDiv) {
      const data = google.visualization.arrayToDataTable([results.cols, ...results.rows], false);
      const barChart = new google.visualization.BarChart(barChartDiv);
      this.registry[elementId] = barChart;

      barChart.draw(data, { title: this.TITLE });
    }
  }

  static disposeChart(elementId: string) {
    const chartDiv = document.getElementById(elementId);
    if (chartDiv) {
      chartDiv.innerHTML = '';
    }
  }
}
