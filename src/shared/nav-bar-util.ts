import { MDCDrawer } from '@material/drawer';
import { MDCTopAppBar } from '@material/top-app-bar';

export class NavBarUtil {
  static APP_BAR = '.mdc-top-app-bar';
  static DRAWER_SELECTOR = '.mdc-drawer';
  static DRAWER_NAV_SELECTOR = `${NavBarUtil.DRAWER_SELECTOR} nav`;
  /**
   * Initialize the MDCTopAppBar with modal drawer for small screens
   */
  static initializeNavBar() {
    // Instantiation the nav bar with drawer
    const topAppBarElement = document.querySelector(NavBarUtil.APP_BAR) as Element;
    const topAppBar = new MDCTopAppBar(topAppBarElement);
    const drawer = MDCDrawer.attachTo(document.querySelector(NavBarUtil.DRAWER_SELECTOR) as Element);
    const listEl = document.querySelector(NavBarUtil.DRAWER_NAV_SELECTOR) as Element;

    // Listen for the menu button to be clicked
    topAppBar.listen('MDCTopAppBar:nav', () => {
      drawer.open = !drawer.open;
    });

    // Listen for a user to click on navigation within the drawer
    listEl.addEventListener('click', () => {
      drawer.open = false;
    });
  }
}
