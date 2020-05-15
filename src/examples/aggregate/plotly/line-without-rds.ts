import * as d3 from 'd3-fetch';
import { DSVRowArray } from 'd3-dsv';
import { PlotlyChartUtil } from 'shared/plotly/chart.util';

const usData: { x: string[]; y: number[]; type: string; mode: string } = { x: [], y: [], type: 'scatter', mode: 'markers' };

getCountryData();

async function getCountryData() {
  const confirmedData = await processData(
    'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'
  );

  // Iterate over each date and grab the same date for the other two data variables
  // and put in AM Charts format
  for (const key in confirmedData.usDates) {
    if (confirmedData.usDates.hasOwnProperty(key)) {
      usData.x.push(key);
      usData.y.push(confirmedData.usDates[key]);
    }
  }
  PlotlyChartUtil.createChart('chart-div', usData);
}

async function processData(file: string) {
  const data: DSVRowArray = await d3.csv(file);
  // Grab all the date columns for later
  const dateKeys = Object.keys(data[0]).filter((key) => {
    // To get these headers, I have to manually inspect the CSV file. Sometimes these files
    // have hundreds of headers and have the code names not the label names. If they are
    // just the codes, that means we have to reference another document to ensure we grab
    // the right columns
    return !['Lat', 'Long', 'Province/State', 'Country/Region'].includes(key);
  });

  // Initialize the object we'll use to keep track of the counts per day
  const usDates: { [date_stamp: string]: number } = {};

  // Iterate through each row, if it is a US territory, then we have iterate
  // over each dateKey and add the total for that date for the territory
  data.forEach((x) => {
    if (x['Country/Region'] === 'US') {
      dateKeys.forEach((date) => {
        if (!usDates[date]) {
          usDates[date] = 0;
        }
        usDates[date] += Number(x[date]);
      });
    }
  });

  // Finally return the date
  return { usDates };
}
