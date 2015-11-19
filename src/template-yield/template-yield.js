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
        observer: '_instancePropsChanged',
        value: () => []
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
        get: () => this.instance[property],
        configurable: true,
        enumerable: true
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

    // Remove getters and setters and replace properties with actual values
    //  this means that values can be carried over when changing templates
    this._decoupleInstanceProperties();

    this.templatize(template);
    instance = this.stamp();
    this.instance = instance;
  }

  _decoupleInstanceProperties() {
    this._instanceProps.forEach(property => {
      Object.defineProperty(this, property, {
        configurable: true,
        enumerable: true,
        value: this[property]
      });
    });
  }

  _getInstanceProps(instance) {
    if (!(instance && instance._propertyEffects)) {
      return [];
    }

    return Object.keys(instance._propertyEffects)
            .filter(prop => instance._propertyEffects[prop][0].kind === 'annotation');
  }
}

Polymer(TemplateYield);
