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
       * Current template instance that's been stamped into DOM
       * @type {TemplateInstance}
       */
      instance: {
        observer: '_instanceChanged'
      },

      /**
       * Array of props needed by the current instance
       * @type {Array<string>}
       */
      _instanceProps: {
        computed: '_getInstanceProps(instance)',
        observer: '_instancePropsChanged'
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

  _instancePropsChanged(properties) {
    let hostProperties = Object.keys(this.properties),
        allowedProperties = properties.filter(property => hostProperties.indexOf(property) === -1),
        passAndSet,
        passthrough;

    // Take the property and create getters and setters to pass the value
    //  to and from the current instance
    passthrough = (property) => {
      Object.defineProperty(this, property, {
        set: (value) => this.instance[property] = value,
        get: () => this.instance[property]
      });
    };

    // Get the current value before calling passthrough on the property,
    //  then restore that value
    passAndSet = (property) => {
      let valueToRestore = this[property];

      passthrough(property);

      if (valueToRestore) {
        this[property] = valueToRestore;
      }
    };

    allowedProperties.forEach(passAndSet);
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

  _getInstanceProps(instance) {
    return instance && instance._propertyEffects ? Object.keys(instance._propertyEffects) : [];
  }
}

Polymer(TemplateYield);
