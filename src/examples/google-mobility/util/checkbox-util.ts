import { MDCCheckbox } from '@material/checkbox';
import { MDCFormField } from '@material/form-field';

const IDS = ['retail_recreation_pct', 'grocery_pharmacy_pct', 'parks_pct', 'transit_station_pct', 'workplace_pct', 'residential_pct'];

export class CheckboxUtil {
  static initializeCheckboxes(containerSelector: string): { id: string; checkbox: MDCCheckbox }[] {
    const container = document.querySelector(containerSelector);
    if (container) {
      const boxes = [
        new MDCCheckbox(container.querySelector('.retail-box')!),
        new MDCCheckbox(container.querySelector('.grocery-box')!),
        new MDCCheckbox(container.querySelector('.parks-box')!),
        new MDCCheckbox(container.querySelector('.transit-box')!),
        new MDCCheckbox(container.querySelector('.work-box')!),
        new MDCCheckbox(container.querySelector('.resident-box')!),
      ];

      const fields = [
        container.querySelector('.mdc-form-field.retail') as Element,
        container.querySelector('.mdc-form-field.grocery') as Element,
        container.querySelector('.mdc-form-field.parks') as Element,
        container.querySelector('.mdc-form-field.transit') as Element,
        container.querySelector('.mdc-form-field.work') as Element,
        container.querySelector('.mdc-form-field.resident') as Element,
      ];

      // fields.forEach((e, i) => {
      //   container.appendChild(e);
      //   const field = new MDCFormField(e);
      //   field.input = boxes[i];
      // });
      // const retailField = new MDCFormField(retailElement);
      // const groceryField = new MDCFormField(groceryElement);
      // const parksField = new MDCFormField(parksElement);
      // const transitField = new MDCFormField(transitElement);
      // const workField = new MDCFormField(workElement);
      // const residentField = new MDCFormField(residentElement);

      // retailField.input = retailBox;
      // groceryField.input = groceryBox;
      // parksField.input = parksBox;
      // transitField.input = transitBox;
      // workField.input = workBox;
      // residentField.input = residentBox;

      // const nodes = [retailField, groceryField, parksField, transitField, workField, residentField];
      // for (const node of nodes) {
      //   container.appendChild(node);
      // }
      return boxes.map((b, i) => {
        // container.appendChild(f);
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
