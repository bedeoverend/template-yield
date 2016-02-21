import NamedTemplate from './helpers/named-template';

// Register NamedTemplate
Polymer(NamedTemplate);

/**
 * Element to stamp out given template, with given props.
 * Resulting stamped template is inside child Light DOM
 */
class TemplateYield {
  beforeRegister() {
    this.is = 'template-yield';

    this.observers = [
      '_stamp(template, _insertionPoint)'
    ];
  }

  get properties() {
    return {
      /**
       * Current template instance that's been stamped into DOM
       * @type {TemplateInstance}
       */
      instance: Object,

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
      template: Object,

      /**
       * Name of template to load. Must correspond to a named-template with same name
       * @type {String}
       */
      from: {
        type: String,
        observer: '_fromChanged'
      },

      /**
       * HTMLElement to stamp template into. If none specified, will stamp into
       * 	self
       * @type {HTMLElement}
       */
      to: {
        value: null
      },

      _insertionPoint: {
        computed: '_computeInsertionPoint(to)'
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

  _stamp(template, insertTo) {
    let instance = this._buildInstance(template),
        takeFrom = this._lastInsertionPoint;

    // Remove all current nodes
    // Note: that this element has no shadow DOM, so its safe to not use
    //  Polymer.dom
    while (takeFrom && takeFrom.lastChild) {
      takeFrom.removeChild(takeFrom.lastChild);
    }

    insertTo.appendChild(instance.root);

    // Update old insertion point
    this._lastInsertionPoint = insertTo;

    this.instance = instance;
  }

  _buildInstance(template) {
    // Remove getters and setters and replace properties with actual values
    //  this means that values can be carried over when changing templates
    this._decoupleInstanceProperties();

    this.templatize(template);
    return this.stamp();
  }

  _fromChanged(name) {
    let template = NamedTemplate.get(name);
    if (!template) {
      console.warn(`Could not find '${name}' template.`);
    } else {
      this.template = template;
    }
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

  _computeInsertionPoint(to) {
    return to || this;
  }
}

Polymer(TemplateYield);
