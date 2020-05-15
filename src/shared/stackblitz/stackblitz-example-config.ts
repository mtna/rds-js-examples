/** Simplified dependencies that can be composed for any example */
export type ChartingExampleDependency = 'AMCHARTS' | 'GCHARTS' | 'PLOTLY' | 'D3' | 'D3_FETCH' | 'TS' | 'RDS-SDK';

export interface ChartingExampleDependencies {
  [name: string]: string;
}

/** Actual dependency names and versions */
export const CHARTING_DEPENDENCIES: Record<ChartingExampleDependency, ChartingExampleDependencies> = {
  AMCHARTS: {
    '@amcharts/amcharts4': '*',
  },
  GCHARTS: {
    '@types/google.visualization': '*',
  },
  PLOTLY: {},
  D3: {
    d3: '*',
    '@types/d3': '*',
  },
  D3_FETCH: {
    'd3-fetch': '*',
    '@types/d3-fetch': '*',
  },
  TS: {
    typescript: '*',
  },
  'RDS-SDK': {
    '@rds/sdk': '*',
  },
};

export class StackBlitzExampleConfig {
  /** NPM Dependencies for the example */
  dependencies: ChartingExampleDependencies;

  /**
   * Construct the configuration object for
   * generating a stackblitz from example code.
   *
   * @param title Title for the StackBlitz
   * @param description Description for the StackBlitz
   * @param chartingExampleDependencies Array of dependencies required for the example
   * @param htmlFileContents The raw contents of the examples index.html file
   * @param tsFileContents The raw contents of the example's typescript file
   * @param chartingUtilFilePath File path for the charting util used in the example
   * @param chartingUtilFileContents Raw file contents of the charting util
   */
  constructor(
    public title: string,
    public description: string,
    chartingExampleDependencies: ChartingExampleDependency[],
    public htmlFileContents: string,
    public tsFileContents: string,
    public otherFiles: { path: string; contents: string }[]
  ) {
    this.dependencies = Object.assign(
      {},
      ...chartingExampleDependencies.map((type) => CHARTING_DEPENDENCIES[type])
    ) as ChartingExampleDependencies;
  }
}
