import { MDCSelect } from '@material/select';

export interface SelectOption {
  name: string;
  value: string;
}

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

  static addSelectOptions(selectElement: Element, options: SelectOption[]) {
    const ul = selectElement.querySelector('.mdc-list');

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
}
