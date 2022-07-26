import { LuaField } from '../LuaField';
import { FieldDoc, FieldDocJson } from './doc/FieldDoc';
import { Model } from './Model';

/**
 * **FieldModel**
 *
 * @author JabDoesThings
 */
export class FieldModel extends Model<FieldModelJson> {
  /** (Loaded via {@link ModelUIManager}) */
  static HTML_TEMPLATE: string = '';

  readonly doc = new FieldDoc();
  readonly types: string[] = [];
  readonly name: string;
  applyUnknownType: boolean = true;

  constructor(name: string, src?: FieldModelJson | LuaField) {
    super();
    this.name = name;
    if (src) {
      if(src instanceof LuaField) {
        this.create(src);
      } else {
        this.load(src);
      }
    }
    this.dom = this.generateDom();
  }

  generateDom(): string {
    let dom = FieldModel.HTML_TEMPLATE;

    const replaceAll = (from: string, to: string) => {
      const fromS = '${' + from + "}";
      while (dom.indexOf(fromS) !== -1) dom = dom.replace(fromS, to);
    };

    let linesS = '';

    const { doc } = this;
    if(doc) {
      const { lines } = doc;
      if (lines) {
        linesS = '';
        for (const line of lines) linesS += `${line}\n`;
        linesS = linesS.substring(0, linesS.length - 1);
      }
    }

    replaceAll('FIELD_NAME', this.name);
    replaceAll('LINES', linesS);

    return dom;
  }

  testSignature(field: LuaField): boolean {
    return field.name === this.name;
  }

  create(field: LuaField) {

  }

  load(json: FieldModelJson) {
    if(json.doc) this.doc.load(json.doc);
    for(const type of json.types) this.types.push(type);
    this.applyUnknownType = json.applyUnknownType;
  }

  save(): FieldModelJson {
    const doc = this.doc.save();
    const { types, applyUnknownType} = this;
    return { doc, types, applyUnknownType };
  }

  clear() {
    this.doc.clear();
    this.types.length = 0;
    this.applyUnknownType = true;
  }
}

/**
 * **FieldModelJson**
 * 
 * @author JabDoesThings
 */
export type FieldModelJson = {
  doc: FieldDocJson;
  types: string[];
  applyUnknownType: boolean;
};
