# Template Yield
![][bower-badge] [![][travis-badge]][travis-url] [![][bowerdeps-badge]][bowerdeps-url] [![][npmdevdeps-badge]][npmdevdeps-url]

Template-yield is a helper element to easily stamp a `<template>` into a document with Polymer data bindings. Templates can either be stamped as children of template-yield, or declaratively to a custom target. You can either supply a template directly to template-yield, or use the `named-template` helper to easily structure your project.

### Usage
```html
<template is="named-template" name="header">
  <header>
    <h1>[[title]]</h1>
  </header>
</template>

<template-yield from="header" model="[[header]]"></template-yield>
```

where `header` is an object that has a `title` property.

The above could render as
```html
<template-yield>
  <header>
    <h1>My Site</h1>
  </header>
<template-yield>
```

### Properties
##### `template`: HTMLTemplateElement
The template you wish to stamp into the DOM

##### `from`: String
Name of the `named-template` you'd like to use e.g.
```html
<template is="named-template" name="header">
  <h1>[[title]]</h1>
</template>

<template-yield from="header" title="My Awesome Site"></template-yield>
```

##### `to`: HTMLElement
HTMLElement you'd like to stamp the template into. If `to` is not specified (or falsey), it will default to stamping inside itself.
```html
<template-yield from="header" to="[[myContainer]]" title="My Awesome Site"></template-yield>
```

##### `model`: Object
An object that defines all the properties to be passed to the template
```html
<template is="named-template" name="page">
  <h1>[[title]]</h1>
  <section class="description">[[description]]</section>
</template>

<template-yield from="page" model="[[properties]]"></template-yield>
```

## \<template is="named-template"\>
`named-template` extends `template` and defines a template with a `name` property that identifies it to `template-yield`. See above for examples of usage with `template-yield`
### Usage
See usage of `template-yield`
### Properties
##### `name`: String
Name of template

### License

MIT © [Simpla](admin@simpla.io)

[bower-badge]: https://img.shields.io/bower/v/template-yield.svg
[travis-badge]: https://img.shields.io/travis/simplaio/template-yield.svg
[travis-url]: https://travis-ci.org/simplaio/template-yield
[bowerdeps-badge]: https://img.shields.io/gemnasium/simplaio/template-yield.svg
[bowerdeps-url]: https://gemnasium.com/bower/template-yield
[npmdeps-badge]: https://img.shields.io/david/simplaio/template-yield.svg
[npmdeps-url]: https://david-dm.org/simplaio/template-yield
[npmdevdeps-badge]: https://img.shields.io/david/dev/simplaio/template-yield.svg?theme=shields.io
[npmdevdeps-url]: https://david-dm.org/simplaio/template-yield#info=devDependencies
