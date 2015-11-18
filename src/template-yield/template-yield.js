/**
 * Element to stamp out given template, with given props.
 * Resulting stamped template is inside child Light DOM
 */
class TemplateYield {
  beforeRegister() {
    this.is = 'template-yield';
  }

  get properties() {
    return {
      /**
       * Properties to be passed to template
       * @type {Object}
       */
      props: {
        type: Object,
        value: () => ({})
      },

      /**
       * Current template instance that's been stamped into DOM
       * @type {TemplateInstance}
       */
      instance: {
        observer: '_instanceChanged'
      },

      /**
       * Template to be stamped into the DOM
       * @type {HTMLTemplateElement}
       */
      template: {
        observer: '_templateChanged'
      }
    };
  }

  get behaviors() {
    return [
      Polymer.Templatizer
    ];
  }

  get observers() {
    return [
      '_propsChanged(props.*, instance)'
    ];
  }

  _propsChanged(changeRecord, instance) {
    let path = changeRecord.path.replace('props.',''),
        value = changeRecord.value;

    if (path === '') {
      Object.keys(props).forEach((prop) => instance[prop] = props[prop]);
    } else {
      this.set(path, value, instance);
    }
  }

  _instanceChanged(instance) {
    // Remove all current nodes
    // note that this element has no shadow DOM, so its safe to not use
    // Polymer.dom
    while (this.lastChild) {
      this.lastChild.remove();
    }

    this.appendChild(instance.root);
  }

  _templateChanged(template) {
    let instance;

    this.templatize(template);
    instance = this.stamp(this.props);
    this.instance = instance;
  }
}

Polymer(TemplateYield);
