import { MDCCheckbox } from '@material/checkbox';
import { MDCFormField } from '@material/form-field';

const IDS = ['retail_recreation_pct', 'grocery_pharmacy_pct', 'parks_pct', 'transit_station_pct', 'workplace_pct', 'residential_pct'];

export class CheckboxUtil {
  static initializeCheckboxes(containerSelector: string): { id: string; checkbox: MDCCheckbox }[] {
    const container = document.querySelector(containerSelector);
    if (container) {
      const boxes = [
        new MDCCheckbox(container.querySelector('.retail-box') as Element),
        new MDCCheckbox(container.querySelector('.grocery-box') as Element),
        new MDCCheckbox(container.querySelector('.parks-box') as Element),
        new MDCCheckbox(container.querySelector('.transit-box') as Element),
        new MDCCheckbox(container.querySelector('.work-box') as Element),
        new MDCCheckbox(container.querySelector('.resident-box') as Element),
      ];

      const fields = [
        container.querySelector('.mdc-form-field.retail') as Element,
        container.querySelector('.mdc-form-field.grocery') as Element,
        container.querySelector('.mdc-form-field.parks') as Element,
        container.querySelector('.mdc-form-field.transit') as Element,
        container.querySelector('.mdc-form-field.work') as Element,
        container.querySelector('.mdc-form-field.resident') as Element,
      ];

      return boxes.map((b, i) => {
        const field = new MDCFormField(fields[i]);
        field.input = b;
        b.checked = true;
        return { id: IDS[i], checkbox: b };
      });
    } else {
      throw new Error('[CheckboxUtil] container is null, could not intialize');
    }
  }
}
