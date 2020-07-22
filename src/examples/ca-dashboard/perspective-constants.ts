import { RdsTabulateParameters, RdsDataProduct } from '@rds/sdk';
import { canadaCatalog } from './constants';

export const canadaPerspective = new RdsDataProduct(canadaCatalog, 'pums_cpss_01');
export const basePerspectiveUrl =
  'https://covid19.richdataservices.com/rds-tabengine/analysis/ca/pums_cpss_01/custom-tables;showTotals=true,true,true,true;sortRows=NATURAL,ASC;sortCols=NATURAL,ASC;filterEmpty=true?weights=COVID_WT&measure=COUNT:COUNT(*)&rows=';

export const PERCEIVED_SETUP: RdsTabulateParameters = {
  dims: 'BH_25',
  measure: 'COUNT:COUNT(*)',
  totals: true,
  metadata: true,
  inject: true,
  weights: ['COVID_WT'],
  orderby: 'COUNT DESC',
};

export const PERSPECTIVES = [
  {
    value: 'BH_05',
    name: 'Main source of information to find out about COVID-19',
    questionText: 'What is your main source of information to find out about COVID-19?',
  },
  {
    value: 'BH_10',
    name: 'Info source most helpful to learn about current public health measures',
    questionText: 'Which source of information is the most helpful to learn about current public health measures?',
  },
  {
    value: 'BH_25',
    name: 'Perceived health',
    questionText: 'In general, how is your health?',
  },
  {
    value: 'BH_30',
    name: 'Perceived mental health',
    questionText: 'In general, how is your mental health?',
  },
  {
    value: 'BH_45',
    name: 'Compromised immune system',
    questionText: 'Do you have a compromised immune system?',
  },
  {
    value: 'BH_15A',
    name: 'Getting enough info about COVID-19 - From municipal health agency',
    questionText: 'Are you getting enough information about COVID -19? - From your municipal healthagency',
  },
  {
    value: 'BH_15B',
    name: 'Getting enough info about COVID-19 - From federal health agencies',
    questionText: 'Are you getting enough information about COVID -19? - From federal health agencies',
  },
  {
    value: 'BH_15C',
    name: 'Getting enough info about COVID-19 - From health professionals',
    questionText: 'Are you getting enough information about COVID -19? - From health professionals',
  },
  {
    value: 'BH_15D',
    name: 'Getting enough info about COVID-19 - From news outlets',
    questionText: 'Are you getting enough information about COVID -19? - From news outlets',
  },
  {
    value: 'BH_20A',
    name: 'Precautions taken to reduce risk - Stocked up on essentials',
    questionText:
      'Which of the following precautions have you taken to reduce your risk of exposure toCOVID-19? - Stocked up on essentials at a grocery store or pharmacy',
  },
  {
    value: 'BH_20B',
    name: 'Precautions taken to reduce risk - Filled prescriptions',
    questionText: 'Which of the following precautions have you taken to reduce your risk of exposure toCOVID-19? - Filled prescriptions',
  },
  {
    value: 'BH_20C',
    name: 'Precautions taken to reduce risk - Made plan caring hhld memb are ill',
    questionText:
      'Which of the following precautions have you taken to reduce your risk of exposure toCOVID-19? - Made a plan for caring for household members who are ill',
  },
  {
    value: 'BH_20D',
    name: 'Precautions taken to reduce risk - Made a plan other non-hhld memb',
    questionText:
      'Which of the following precautions have you taken to reduce your risk of exposure toCOVID-19? - Made a plan for other non-household members',
  },
  {
    value: 'BH_20E',
    name: 'Precautions taken to reduce risk - Made a plan communicate',
    questionText:
      'Which of the following precautions have you taken to reduce your risk of exposure toCOVID-19? - Made a plan for communicating with family, friends and neighbours',
  },
  {
    value: 'BH_20F',
    name: 'Precautions taken to reduce risk - Avoided leaving the house',
    questionText:
      'Which of the following precautions have you taken to reduce your risk of exposure toCOVID-19? - Avoided leaving the house for non-essential reasons',
  },
  {
    value: 'BH_20G',
    name: 'Precautions taken to reduce risk - Used social distancing in public',
    questionText:
      'Which of the following precautions have you taken to reduce your risk of exposure toCOVID-19? - Used social distancing when out in public',
  },
  {
    value: 'BH_20H',
    name: 'Precautions taken to reduce risk - Avoided crowds and large gathering',
    questionText:
      'Which of the following precautions have you taken to reduce your risk of exposure toCOVID-19? - Avoided crowds and large gathering',
  },
  {
    value: 'BH_20I',
    name: 'Precautions taken to reduce risk - Washed your hands more regularly',
    questionText:
      'Which of the following precautions have you taken to reduce your risk of exposure toCOVID-19? - Washed your hands more regularly',
  },
  {
    value: 'BH_20J',
    name: 'Precautions taken to reduce risk - Avoided touching your face',
    questionText:
      'Which of the following precautions have you taken to reduce your risk of exposure toCOVID-19? - Avoided touching your face',
  },
  {
    value: 'BH_20K',
    name: 'Precautions taken to reduce risk - Cancelled travel',
    questionText: 'Which of the following precautions have you taken to reduce your risk of exposure toCOVID-19? - Cancelled travel',
  },
  {
    value: 'BH_20L',
    name: 'Precautions taken to reduce risk - Worked from home',
    questionText: 'Which of the following precautions have you taken to reduce your risk of exposure toCOVID-19? - Worked from home',
  },
  {
    value: 'BH_20M',
    name: 'Precautions taken to reduce risk - Other',
    questionText: 'Which of the following precautions have you taken to reduce your risk of exposure toCOVID-19? - Other',
  },
  {
    value: 'BH_20N',
    name: 'Precautions taken to reduce risk - None of the above',
    questionText: 'Which of the following precautions have you taken to reduce your risk of exposure toCOVID-19? - None of the above',
  },
  {
    value: 'BH_35A',
    name: 'Doing activities for health - Communication with friends and family',
    questionText: 'Are you doing any of the following activities for your health? - Communication withfriends and family',
  },
  {
    value: 'BH_35B',
    name: 'Doing activities for health - Meditation',
    questionText: 'Are you doing any of the following activities for your health? - Meditation',
  },
  {
    value: 'BH_35C',
    name: 'Doing activities for health - Exercise outdoors',
    questionText: 'Are you doing any of the following activities for your health? - Exercise outdoors',
  },
  {
    value: 'BH_35D',
    name: 'Doing activities for health - Exercise indoors',
    questionText: 'Are you doing any of the following activities for your health? - Exercise indoors',
  },
  {
    value: 'BH_35E',
    name: 'Doing activities for health - Changing my food choices',
    questionText: 'Are you doing any of the following activities for your health? - Changing my food choices',
  },
  {
    value: 'BH_40A',
    name: 'Change in weekly habits - Consuming alcohol',
    questionText: 'Have your weekly habits changed for any of the following activities? - Consuming alcohol',
  },
  {
    value: 'BH_40B',
    name: 'Change in weekly habits - Using tobacco products',
    questionText: 'Have your weekly habits changed for any of the following activities? - Using tobaccoproducts',
  },
  {
    value: 'BH_40C',
    name: 'Change in weekly habits - Consuming cannabis',
    questionText: 'Have your weekly habits changed for any of the following activities? - Consumingcannabis',
  },
  {
    value: 'BH_40D',
    name: 'Change in weekly habits - Eating junk food or sweets',
    questionText: 'Have your weekly habits changed for any of the following activities? - Eating junk foodor sweets',
  },
  {
    value: 'BH_40E',
    name: 'Change in weekly habits - Watching television',
    questionText: 'Have your weekly habits changed for any of the following activities? - Watching television',
  },
  {
    value: 'BH_40F',
    name: 'Change in weekly habits - Spending time on the internet',
    questionText: 'Have your weekly habits changed for any of the following activities? - Spending time onthe internet',
  },
  {
    value: 'BH_40G',
    name: 'Change in weekly habits - Playing video games',
    questionText: 'Have your weekly habits changed for any of the following activities? - Playing videogames',
  },
  {
    value: 'BH_40H',
    name: 'Change in weekly habits - Playing board games',
    questionText: 'Have your weekly habits changed for any of the following activities? - Playing boardgames',
  },
  {
    value: 'BH_55A',
    name: 'Concern about impact of COVID-19 - My own health',
    questionText: 'How concerned are you about each of the following impacts of COVID-19? - My ownhealth',
  },
  {
    value: 'BH_55B',
    name: 'Concern about impact of COVID-19 - Member of household’s health',
    questionText: 'How concerned are you about each of the following impacts of COVID-19? - Member ofthe household’s health',
  },
  {
    value: 'BH_55C',
    name: 'Concern about impact of COVID-19 - Vulnerable people’s health',
    questionText: 'How concerned are you about each of the following impacts of COVID-19? - Vulnerablepeople’s health',
  },
  {
    value: 'BH_55D',
    name: 'Concern about impact of COVID-19 - Canadian population’s health',
    questionText: 'How concerned are you about each of the following impacts of COVID-19? - Canadianpopulation’s health',
  },
  {
    value: 'BH_55E',
    name: 'Concern about impact of COVID-19 - World population’s health',
    questionText: 'How concerned are you about each of the following impacts of COVID-19? - Worldpopulation’s health',
  },
  {
    value: 'BH_55F',
    name: 'Concern about impact of COVID-19 - Overloading the health system',
    questionText: 'How concerned are you about each of the following impacts of COVID-19? - Overloadingthe health system',
  },
  {
    value: 'BH_55G',
    name: 'Concern about impact of COVID-19 - Civil disorder',
    questionText: 'How concerned are you about each of the following impacts of COVID-19? - Civil disorder',
  },
  {
    value: 'BH_55H',
    name: 'Concern about impact of COVID-19 - Maintaining social ties',
    questionText: 'How concerned are you about each of the following impacts of COVID-19? - Maintainingsocial ties',
  },
  {
    value: 'BH_55I',
    name: 'Concern about impact of COVID-19 - Able cooperate during crisis',
    questionText:
      'How concerned are you about each of the following impacts of COVID-19? - Ability tocooperate and support one another during the crisis',
  },
  {
    value: 'BH_55J',
    name: 'Concern about impact of COVID-19 - Able coop/supp after crisis',
    questionText:
      'How concerned are you about each of the following impacts of COVID-19? - Ability tocooperate and support one another after the crisis',
  },
  {
    value: 'BH_55K',
    name: 'Concern about impact of COVID-19 - Family stress from confinem',
    questionText: 'How concerned are you about each of the following impacts of COVID-19? - Familystress from confinement',
  },
  {
    value: 'BH_55L',
    name: 'Concern about impact of COVID-19 - Violence in the home',
    questionText: 'How concerned are you about each of the following impacts of COVID-19? - Violencein the home',
  },
  {
    value: 'BH_60A',
    name: 'Freq in last week - Went shopping at the grocery store or drugstore',
    questionText:
      'In the last week, that is ˆREFDATE_E, how often did you do each of the following activities?- Went shopping at the grocery store or drugstore',
  },
  {
    value: 'BH_60B',
    name: 'Freq in last week - Used delivery service for groceries or drugstore',
    questionText:
      'In the last week, that is ˆREFDATE_E, how often did you do each of the following activities?- Used a delivery service for groceries or for a drugstore',
  },
  {
    value: 'BH_60C',
    name: 'Freq in last week - Used a food delivery service for prepared food',
    questionText:
      'In the last week, that is ˆREFDATE_E, how often did you do each of the following activities?- Used a food delivery service for prepared food',
  },
  {
    value: 'BH_60D',
    name: 'Freq in last week - Ate at a restaurant',
    questionText: 'In the last week, that is ˆREFDATE_E, how often did you do each of the following activities?- Ate at a restaurant',
  },
  {
    value: 'BH_60E',
    name: 'Freq in last week - Attended a public event',
    questionText: 'In the last week, that is ˆREFDATE_E, how often did you do each of the following activities?- Attended a public event',
  },
  {
    value: 'BH_60F',
    name: 'Freq in last week - Travelled for work',
    questionText: 'In the last week, that is ˆREFDATE_E, how often did you do each of the following activities?- Travelled for work',
  },
  {
    value: 'BH_65B',
    name: 'Exposed to someone who travelled outside of Canada last 4 weeks',
    questionText:
      'Did you travel outside of Canada or were you exposed to someone who travelled outsideof Canada in the last 4 weeks? - Yes, I was exposed to someone who travelled outsideof Canada',
  },
  {
    value: 'BH_65C',
    name: 'Did not travel outside Canada/not exposed to one who did last 4 weeks',
    questionText:
      'Did you travel outside of Canada or were you exposed to someone who travelled outsideof Canada in the last 4 weeks? - No',
  },
  {
    value: 'LM_30',
    name: 'Scale - I might lose main job or main self-empl income next 4 weeks',
    questionText:
      'To what extent do you agree or disagree with the following statement?I might lose my main job or main self-employment income source in the next four weeks.',
  },
  {
    value: 'LM_40',
    name: 'COVID-19 impacts ability meet financial obligations or essential needs',
    questionText:
      'Which of the following best describes the impact of COVID-19 on your ability to meetfinancial obligations or essential needs, such as rent or mortgage payments, utilitiesand groceries?',
  },
  {
    value: 'LM_35A',
    name: 'Make new applic EI benefits - Ref week - Regular',
    questionText:
      'During the week of ˆREFDATE_E did you make a new application for any of the followingtypes of Employment Insurance benefits? - Regular',
  },
  {
    value: 'LM_35B',
    name: 'Make new applic EI benefits - Ref week - Sickness',
    questionText:
      'During the week of ˆREFDATE_E did you make a new application for any of the followingtypes of Employment Insurance benefits? - Sickness',
  },
  {
    value: 'LM_35CDE',
    name: 'Make new applic EI benefits - Ref week - Caregiv, Work-sharing, Other',
  },
  {
    value: 'LM_35F',
    name: 'Make new applic EI benefits - Ref week - Did not apply for EI benefits',
    questionText:
      'During the week of ˆREFDATE_E did you make a new application for any of the followingtypes of Employment Insurance benefits? - Did not apply for any EmploymentInsurance benefits',
  },
];
