import * as d3 from 'd3-fetch';
import { PlotlyChartUtil } from '~/shared/plotly/chart.util';

// Setup and initialize the gender data object
const genderData: {
  [gender: string]: { ageGroup: string; count: number }[];
} = {
  Male: [
    { ageGroup: '0 to 19 years', count: 0 },
    { ageGroup: '20 to 29 years', count: 0 },
    { ageGroup: '30 to 39 years', count: 0 },
    { ageGroup: '40 to 49 years', count: 0 },
    { ageGroup: '50 to 59 years', count: 0 },
    { ageGroup: '60 to 69 years', count: 0 },
    { ageGroup: '70 to 79 years', count: 0 },
    { ageGroup: '80 years or older', count: 0 },
    { ageGroup: 'Not state', count: 0 },
  ],
  Female: [
    { ageGroup: '0 to 19 years', count: 0 },
    { ageGroup: '20 to 29 years', count: 0 },
    { ageGroup: '30 to 39 years', count: 0 },
    { ageGroup: '40 to 49 years', count: 0 },
    { ageGroup: '50 to 59 years', count: 0 },
    { ageGroup: '60 to 69 years', count: 0 },
    { ageGroup: '70 to 79 years', count: 0 },
    { ageGroup: '80 years or older', count: 0 },
    { ageGroup: 'Not state', count: 0 },
  ],
  'Non-binary': [
    { ageGroup: '0 to 19 years', count: 0 },
    { ageGroup: '20 to 29 years', count: 0 },
    { ageGroup: '30 to 39 years', count: 0 },
    { ageGroup: '40 to 49 years', count: 0 },
    { ageGroup: '50 to 59 years', count: 0 },
    { ageGroup: '60 to 69 years', count: 0 },
    { ageGroup: '70 to 79 years', count: 0 },
    { ageGroup: '80 years or older', count: 0 },
    { ageGroup: 'Not state', count: 0 },
  ],
  'Not state': [
    { ageGroup: '0 to 19 years', count: 0 },
    { ageGroup: '20 to 29 years', count: 0 },
    { ageGroup: '30 to 39 years', count: 0 },
    { ageGroup: '40 to 49 years', count: 0 },
    { ageGroup: '50 to 59 years', count: 0 },
    { ageGroup: '60 to 69 years', count: 0 },
    { ageGroup: '70 to 79 years', count: 0 },
    { ageGroup: '80 years or older', count: 0 },
    { ageGroup: 'Not state', count: 0 },
  ],
};

// This information is in a separate metadata sheet
const ageGroupMap: { [id: string]: string } = {
  '1': '0 to 19 years',
  '2': '20 to 29 years',
  '3': '30 to 39 years',
  '4': '40 to 49 years',
  '5': '50 to 59 years',
  '6': '60 to 69 years',
  '7': '70 to 79 years',
  '8': '80 years or older',
  '99': 'Not state',
};

getData();

async function getData() {
  // Due to the size, this is an abridged version of the actual dataset.
  // We are displaying the first 100 cases of the data
  await processData('https://raw.githubusercontent.com/nmrichards/sample_data/master/2020-05-14.csv');

  const formattedData: {
    x: string[];
    y: string[];
    z: number[][];
    type: string;
    hoverongaps: boolean;
  } = { x: [], y: [], z: [], type: 'heatmap', hoverongaps: false };

  // Lastly, we need to format it for AmCharts
  for (const key in genderData) {
    if (key) {
      const keyData: number[] = [];
      genderData[key].forEach((x) => {
        if (!formattedData.y.includes(key)) {
          formattedData.y.push(key);
        }
        if (!formattedData.x.includes(x.ageGroup)) {
          formattedData.x.push(x.ageGroup);
        }
        keyData.push(x.count);
      });
      formattedData.z.push(keyData);
    }
  }

  PlotlyChartUtil.createChart('chart-div', formattedData);
}

async function processData(file: string) {
  const data: any[] = await d3.csv(file);

  const caseIds: { [id: string]: { gender: string; ageGroup: string } } = {};

  /**
   * First we need to group the gender and age groups together with the same Case identifier number
   */
  data.forEach((x: { 'Case identifier number': string; 'Case information': string; VALUE: string }) => {
    // If it's a new case, initialize to empty strings
    if (!caseIds[x['Case identifier number']]) {
      caseIds[x['Case identifier number']] = { gender: '', ageGroup: '' };
    }
    if (x['Case information'] === 'Gender') {
      caseIds[x['Case identifier number']].gender = x['VALUE'];
    } else if (x['Case information'] === 'Age group') {
      caseIds[x['Case identifier number']].ageGroup = x['VALUE'];
    }
  });

  /**
   * Next we need to count the totals for each category
   */
  for (const key in caseIds) {
    if (key) {
      switch (caseIds[key].gender) {
        case '1':
          // 1 is Male, read from separate metadata sheet. Sure hope they
          // don't change their codes
          genderData['Male'].forEach((x) => {
            if (x.ageGroup === ageGroupMap[caseIds[key].ageGroup]) {
              x.count += 1;
            }
          });
          break;
        case '2':
          // 2 is Female
          genderData['Female'].forEach((x) => {
            if (x.ageGroup === ageGroupMap[caseIds[key].ageGroup]) {
              x.count += 1;
            }
          });
          break;
        case '3':
          // 3 is Non-binary
          genderData['Non-binary'].forEach((x) => {
            if (x.ageGroup === ageGroupMap[caseIds[key].ageGroup]) {
              x.count += 1;
            }
          });
          break;
        case '9':
          // 9 is Not stated
          genderData['Not stated'].forEach((x) => {
            if (x.ageGroup === ageGroupMap[caseIds[key].ageGroup]) {
              x.count += 1;
            }
          });
          break;
      }
    }
  }
}
