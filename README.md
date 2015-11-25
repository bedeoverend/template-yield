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

<template is="named-template" name="page">
  <section class="description">[[description]]</section>
</template>

<template is="named-template" name="footer">
  <footer>Made with ♥ from the folks at [[company]]</footer>
</template>

<template-yield from="header" title="My Site"></template-yield>
<template-yield from="page" description="A wonderful site"></template-yield>
<template-yield from="footer" company="Simpla"></template-yield>
```

The above will render as
```html
<template-yield>
  <header>
    <h1>My Site</h1>
  </header>
<template-yield>
<template-yield>
  <section class="description">A wonderful site</section>
</template-yield>
<template-yield>
  <footer>Made with ♥ from the folks at Simpla</footer>
</template-yield>
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

##### `*`: *
Any property (a part from reserved, see below) will be passed on to the given template e.g.
```html
<template is="named-template" name="page">
  <h1>[[title]]</h1>
  <section class="description">[[description]]</section>
</template>

<template-yield from="page" title="My Awesome Site" description="Man, gotta love templating"></template-yield>
```
will be rendered out into the DOM as:
```html
<template-yield>
<h1>My Awesome Site</h1>
<section class="description">Man, gotta love templating</section>
</template-yield>
```

###### Reserved properties
The following cannot be used as properties on template yield as they cause conflicts, using them may cause errors.

*template, from, to, instance, is, content, name \_*

Also any other property of `template-yield`, `template` or `named-template`.

*Note: The last \_\* means any property starting with \_, this is just a precaution to make sure it doesn't conflict with any private properties that may be undocumented*

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
