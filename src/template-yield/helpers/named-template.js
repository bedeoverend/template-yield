let templateMap = {};

export default class NamedTemplate {

  static get(name) {
    return templateMap[name];
  }

  beforeRegister() {
    this.is = 'named-template';

    this.properties = {
      name: {
        type: String,
        observer: '_nameChanged'
      }
    };
  }

  get extends() {
    return 'template';
  }

  _nameChanged(name, oldName) {
    if (oldName && templateMap[oldName] === this) {
      delete templateMap[oldName];
    }

    if (templateMap[name]) {
      console.warn(`Template with name ${name} already exists. Aborting.`);
      return;
    }

    templateMap[name] = this;
  }
};
