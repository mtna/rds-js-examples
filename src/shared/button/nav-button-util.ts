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
          NavButtonUtil.scrollTo(elementId);
        }
      });
    });
  }

  /**
   * Scrolls a given element into view. Can provide an extra offset if needed
   * @param selector: string - ID of the element to scroll to
   * @param yOffset: number - additional offset if needed
   */
  private static scrollTo(selector: string, yOffset = 0) {
    const el = document.getElementById(selector);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      console.warn(`[NavButtonUtil] scrollTo: cannot find element with id ${selector}`);
    }
  }
}
