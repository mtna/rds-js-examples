import { MDCMenuSurface } from '@material/menu-surface';
import { Corner } from '@material/menu-surface/constants';

export class MenuUtil {
  static MENU_SELECTOR = '.nav-example-menu-surface';
  static MENU_BUTTON_SELECTOR = '.nav-menu-surface-button';

  /**
   * Initialize the MDCTabBar, set up the even handlers
   * to hide inactive tab contents and show active tab contents.
   * @param tabsContainer A parent element of the MDCTabBar and tab contents
   */
  static initializeMenu() {
    const menuElement = document.querySelector(this.MENU_SELECTOR);
    const menuButton = document.querySelector(this.MENU_BUTTON_SELECTOR);
    if (menuElement) {
      const menu = new MDCMenuSurface(menuElement);
      menu.setAnchorCorner(Corner.BOTTOM_LEFT);

      // Close menu when user clicks within menu
      menu.listen('click', () => {
        menu.close();
      });

      if (menuButton) {
        // When Examples button is clicked, open menu
        menuButton.addEventListener('click', () => {
          if (!menu.isOpen()) {
            menu.open();
          }
        });
      }
    }
  }
}
