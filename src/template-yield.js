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
      '_stamp(template, model, _insertionPoint)',
      '_callReady(model, instance)'
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
       * Model object to attach to the instance
       * @type {Object}
       */
      model: {
        type: Object,
        value: () => ({})
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

  _stamp(template, model, insertTo) {
    let instance = this._buildInstance(template, model),
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

  _buildInstance(template, model) {
    this.templatize(template);
    return this.stamp(model);
  }

  _fromChanged(name) {
    let template = NamedTemplate.get(name);
    if (!template) {
      console.warn(`Could not find '${name}' template.`);
    } else {
      this.template = template;
    }
  }

  _callReady(model, instance) {
    if (typeof model.ready === 'function') {
      model.ready.call(instance, this._insertionPoint);
    }
  }

  _computeInsertionPoint(to) {
    return to || this;
  }
}

Polymer(TemplateYield);
