/**
 * A simple type to satisfy the typescript linter.
 *
 * Plotly has difficulty working with some bundlers.
 * We have added <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
 * to load it from a cdn and use it as a umd global.
 */
declare const Plotly: {
  newPlot(element: Element, traces: any[]): void;
  purge(elementId: string): void;
};

/**
 * Utility to interact with the JS charting library, Plotly.
 */
export class PlotlyChartUtil {
  /**
   * Create a new chart emdedded within a container with the given element id and populated with the given data.
   * @param elementId HTML element id of the container to embed the chart
   * @param data chart data
   */
  static createChart(elementId: string, data: any) {
    const element = document.getElementById(elementId);
    if (element) {
      // Dispose an existing chart
      this.disposeChart(elementId);
      // Create the new chart
      Plotly.newPlot(element, [data]);
    }
  }

  /**
   * Dispose a Plotly chart within an html element with the given id.
   * @param elementId ID of the container that holds the Plotly chart to dispose
   */
  static disposeChart(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      Plotly.purge(elementId);
    }
  }
}
