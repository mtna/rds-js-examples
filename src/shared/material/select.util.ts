import { MDCSelect } from '@material/select';

/**
 * Used when creating the drop down options for select component
 */
export interface SelectOption {
  name: string;
  value: string;
}

/**
 * Initializes material select component. Will also create options if provided.
 */
export class SelectUtil {
  static initializeSelect(selectClass: string, options?: SelectOption[]) {
    const selectElement = document.querySelector(selectClass);
    if (selectElement) {
      const select = new MDCSelect(selectElement);

      if (options) {
        this.addSelectOptions(selectElement, options);
      }

      return select;
    } else {
      return null;
    }
  }

  static addSelectOptions(selectElement: Element | string, options: SelectOption[]) {
    let element: Element = selectElement as Element;
    if (typeof selectElement === 'string') {
      element = document.querySelector(selectElement) as Element;
    }
    const ul = element.querySelector('.mdc-list');

    options.forEach((option) => {
      const li = document.createElement('li');
      li.classList.add('mdc-list-item');
      li.dataset.value = option.value;
      const span = document.createElement('span');
      span.classList.add('mdc-list-item__text');
      span.appendChild(document.createTextNode(option.name));
      li.appendChild(span);
      ul?.appendChild(li);
    });
  }

  static clearSelectOptions(selectClass: string) {
    const select = document.querySelector(selectClass);
    if (select) {
      const ul = select.querySelector('.mdc-list');

      if (ul) {
        const options = ul.querySelectorAll('.mdc-list-item');
        if (options) {
          options.forEach((o) => o.remove());
        }
      }
    }
  }
}
