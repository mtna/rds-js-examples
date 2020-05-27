import { MDCRipple } from '@material/ripple';

export class NavButtonUtil {
  static initializeButtons() {
    /* Button to setup ripple and click listener */
    const buttonElements: NodeListOf<Element> = document.querySelectorAll(`.nav-button`);

    /* Setup ripple and event listener for scroll */
    buttonElements.forEach((button) => {
      /* Initialize Ripple */
      const buttonRipple = new MDCRipple(button);
      if (!buttonRipple) {
        throw new Error('[ButtonUtil] failed to query the MDCRipple element, could not initialize');
      }

      /* Setup listener event for smooth scroll */
      button.addEventListener('click', () => {
        /* Use the button's id, slice off the '-nav' to select the element to scroll to */
        const scrollElement = document.querySelector('#' + button.id.slice(0, -4));
        if (scrollElement) {
          scrollElement.scrollIntoView({
            behavior: 'smooth',
          });
        }
      });
    });
  }
}
