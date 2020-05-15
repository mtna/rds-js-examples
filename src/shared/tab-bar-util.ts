import { MDCTabBar } from '@material/tab-bar';
import { MDCSelectEvent } from '@material/select';

export class TabBarUtil {
  static TAB_CONTENTS_SELECTOR = '.tab-contents';
  static ACTIVE_TAB_CONTENTS_CLASS_NAME = 'active';

  /**
   * Initialize the MDCTabBar, set up the even handlers
   * to hide inactive tab contents and show active tab contents.
   * @param tabsContainer A parent element of the MDCTabBar and tab contents
   */
  static initializeTabBar(tabsContainer: Element | null) {
    if (!tabsContainer) {
      throw new Error('[TabBarUtil] container is null, could not initialize');
    }

    const tabBarElement = tabsContainer.querySelector('.mdc-tab-bar');
    if (!tabBarElement) {
      throw new Error('[TabBarUtil] failed to query the MDCTabBar element, could not initialize');
    }
    const tabBar = new MDCTabBar(tabBarElement);
    tabBar.focusOnActivate = false;
    tabBar.listen('MDCTabBar:activated', (event: MDCSelectEvent) => {
      // Remove active class from previous active tab
      tabsContainer
        .querySelector(`${this.TAB_CONTENTS_SELECTOR}.${this.ACTIVE_TAB_CONTENTS_CLASS_NAME}`)
        ?.classList.remove(this.ACTIVE_TAB_CONTENTS_CLASS_NAME);
      // Add active class for the newly selected content
      const contentElements = tabsContainer.querySelectorAll(this.TAB_CONTENTS_SELECTOR);
      contentElements[event.detail.index].classList.add(this.ACTIVE_TAB_CONTENTS_CLASS_NAME);
    });
  }
}
