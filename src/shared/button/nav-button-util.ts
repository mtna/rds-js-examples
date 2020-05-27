import { MDCRipple } from '@material/ripple';

export class NavButtonUtil {
  static initializeButtons() {
    /* Button to setup ripple and click listener */
    const buttonElements: NodeListOf<HTMLButtonElement> = document.querySelectorAll(`.nav-button`);

    /* Setup ripple and event listener for scroll */
    buttonElements.forEach((button: HTMLButtonElement) => {
      /* Initialize Ripple */
      const buttonRipple = new MDCRipple(button);

      if (!buttonRipple) {
        throw new Error('[ButtonUtil] failed to query the MDCRipple element, could not initialize');
      }

      /* Setup listener event for smooth scroll */
      button.addEventListener('click', () => {
        /* Grab element ID using the data-navigate-to property of button */
        const elementId = button.dataset.navigateTo;
        if (elementId) {
          const scrollElement = document.getElementById(elementId);
          if (scrollElement) {
            scrollElement.scrollIntoView({
              behavior: 'smooth',
            });
          }
        }
      });
    });
  }
}
