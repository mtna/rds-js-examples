import * as d3 from 'd3-fetch';
import { AmChartsHeatUtil } from '~/shared/amcharts/heat-map.util';

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

  const formattedData: { gender: string; age_group: string; COUNT: number }[] = [];

  // Lastly, we need to format it for AmCharts
  for (const key in genderData) {
    if (key) {
      genderData[key].forEach((x) => {
        formattedData.push({
          gender: key,
          age_group: x.ageGroup,
          COUNT: x.count,
        });
      });
    }
  }

  AmChartsHeatUtil.createChart({
    elementId: 'chart-div',
    data: formattedData,
    xCategory: 'gender',
    yCategory: 'age_group',
    valueCategory: 'COUNT',
  });
}

async function processData(file: string) {
  const data: any[] = await d3.csv(file);

  const caseIds: { [id: string]: { gender: string; ageGroup: string } } = {};

  /**
   * First we need to group the gender and age groups together with the same Case identifier number
   */
  data.forEach((row: { 'Case identifier number': string; 'Case information': string; VALUE: string }) => {
    // If it's a new case, initialize to empty strings
    if (!caseIds[row['Case identifier number']]) {
      caseIds[row['Case identifier number']] = { gender: '', ageGroup: '' };
    }
    if (row['Case information'] === 'Gender') {
      caseIds[row['Case identifier number']].gender = row['VALUE'];
    } else if (row['Case information'] === 'Age group') {
      caseIds[row['Case identifier number']].ageGroup = row['VALUE'];
    }
  });

  /**
   * Next we need to count the totals for each category
   */
  for (const key in caseIds) {
    if (caseIds.hasOwnProperty(key)) {
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
