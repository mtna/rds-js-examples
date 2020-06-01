import { MDCRipple } from '@material/ripple';
import { ButtonConfig } from './button-config';

export const LINE_CHART_CONFIG = new ButtonConfig(
  'line-chart-card',
  '<ol>' +
    '<li>Fetch the data from all 3 files</li>' +
    '<li>Manually parse the data to determine which rows and columns are needed.</li>' +
    '<li>Filter out unecessary headers, columns, and rows.</li>' +
    '<li>Combine and reshape the datasets into a format that the charting library accepts.</li>' +
    '</ol>',
  'number-of-cases-example'
);

export const BAR_CHART_CONFIG = new ButtonConfig(
  'bar-chart-card',
  '<ol>' +
    '<li>Download the latest zip file and extract it.</li>' +
    `<ul>
      <li>Keep in mind, this is record level data and the files tend to be very large. The data used in this example is about 60mb.</li>
      <li>This is too large to host online, make an http request to get it, and parse it on the client. Unless you just enjoy punishing your users.</li>
    </ul>` +
    '<li>Write a script to parse each record.</li>' +
    '<li>Aggregate the data by gender and age group.</li>' +
    '<li>Reshape the aggregated data into a format that the charting library accepts.</li>' +
    '<li>Upload and host your charting data with your app or where it can make a request to get it.</li>' +
    '<li><strong>Repeat the steps above every time the data is updated</strong></li>' +
    '</ol>',
  'comparison-gender-and-age-example'
);

export class ButtonUtil {
  static PATH_CARD_SELECTOR = '.path-card';
  static NEXT_STEPS_SELECTOR = '.next-steps';
  static SHOW_RDS_SELECTOR = '.show-rds';
  static CHOOSE_PATH_SELECTOR = '.path-empty-state';
  static SHOW_ME_BUTTON_SELECTED = '.show-me-button';

  /**
   * Initialize the Ripple, set up the event handlers
   * to select and deselect path cards
   * @param buttonConfig: config for initialization
   */
  static initializeButton(buttonConfig: ButtonConfig) {
    /* Button to setup ripple and click listener */
    const buttonElement: HTMLButtonElement = document.querySelector(`.${buttonConfig.cardClass} button`) as HTMLButtonElement;
    /* All the cards to remove select class from all cards when new seleciton is made */
    const cardElements = document.querySelectorAll(ButtonUtil.PATH_CARD_SELECTOR);
    /* Div of the "CHOOSE PATH ABOVE" */
    const choosePathElement = document.querySelector(`${ButtonUtil.CHOOSE_PATH_SELECTOR}`) as HTMLElement | null;
    /* All transition elements */
    const dynamicTransitions = document.querySelectorAll('.dynamic-transition .line');
    /* Card of the selected path */
    const selectedCardElement = document.querySelector(`.${buttonConfig.cardClass}`);
    /* Transitions for selected path */
    const selectedTransitions = document.querySelectorAll(`.${buttonConfig.cardClass}-transition`);
    const showMeButton = document.querySelector(ButtonUtil.SHOW_ME_BUTTON_SELECTED) as HTMLButtonElement | null;
    const showRdsElement = document.querySelector(ButtonUtil.SHOW_RDS_SELECTOR) as HTMLElement | null;
    const withoutRdsStepsElement = document.querySelector(`${ButtonUtil.NEXT_STEPS_SELECTOR}`) as HTMLElement | null;
    /* <p> element to update innerHTML on selections */
    const withoutRdsStepsCardElement = document.querySelector(`${ButtonUtil.NEXT_STEPS_SELECTOR} .mdc-card p`);

    if (!buttonElement) {
      throw new Error('[ButtonUtil] button is null, could not initialize');
    }

    if (!choosePathElement) {
      throw new Error('[ButtonUtil] choose path elemenet is null, could not initialize');
    }

    if (!selectedCardElement) {
      throw new Error('[ButtonUtil] container is null, could not initialize');
    }

    if (!showMeButton) {
      throw new Error('[ButtonUtil] show me button is null, could not initialize');
    }

    if (!showRdsElement) {
      throw new Error('[ButtonUtil] show rds elemenet is null, could not initialize');
    }

    if (!withoutRdsStepsCardElement) {
      throw new Error('[ButtonUtil] next card elemenet is null, could not initialize');
    }

    if (!withoutRdsStepsElement) {
      throw new Error('[ButtonUtil] next steps element is null, could not initialize');
    }

    const buttonRipple = new MDCRipple(buttonElement);

    if (!buttonRipple) {
      throw new Error('[ButtonUtil] failed to query the MDCRipple element, could not initialize');
    }

    buttonElement.addEventListener('click', () => {
      // Remove selected class from all path cards
      cardElements.forEach((card) => card.classList.remove('selected'));
      // Add selected class to the card
      selectedCardElement.classList.add('selected');
      // If first time selecting, show/hide the following divs
      choosePathElement.style.display = 'none';
      showRdsElement.style.display = 'grid';
      withoutRdsStepsElement.style.display = 'grid';

      // Update the link in the SHOW ME HOW button
      showMeButton.dataset.navigateTo = buttonConfig.navigateTo;

      // Remove selected from all transitions and then update class for selected path
      dynamicTransitions.forEach((tr) => tr.classList.remove('selected'));
      selectedTransitions.forEach((tr) => tr.classList.add('selected'));

      // Update the text of the Next Steps card
      withoutRdsStepsCardElement.innerHTML = buttonConfig.nextStepsText;
      // Disable both buttons and then enable the non-selected card
      const buttons: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.path-card button');
      buttons.forEach((button) => (button.disabled = false));
      buttonElement.disabled = true;
    });
  }
}
