---
title: Coffeescript's existential operator
date: 2013-08-24 14:43 +02:00
---

Love it or hate it, coffeescript does make your front-end javascript code more concise. And one of its great features is existential operator, which helps to remove most of `null` and `undefined` checks. Let's see how it works:

In its basic form, it's pretty self-explainatory.

``` coffeescript
if variable?
  # do something
```

``` javascript
if (typeof variable !== "undefined" && variable !== null) {
  // do something
}
```

You can chain these checks for deep object lookup:

``` coffeescript
object?.property?.subproperty?
```

But there's more. Run a function only if it's defined:

``` coffeescript
object.function?()
```

``` javascript
if (typeof object.property === "function") {
  object.property();
}
```

Or lookup an array ony if it's defined: (this one does not check if property is an array though)

``` coffeescript
object.property?[1]
```

``` javascript
var _ref;
if ((_ref = object.property) != null) {
  _ref[1];
}
```

Existential operator can be used in assignment:

``` coffeescript
object.property ?= 'value'
```

``` javascript
if (object.property == null) {
  object.property = 'value';
}
```

It only assigns when property is not defined. It's especially handy for boolean variables - let's compare this to `||=` operator:

``` coffeescript
# ||= operator
variable = false
variable ||= 'value'
variable # => 'value'

# ?= operator
variable2 = false
variable2 ?= 'value'
variable2 # => false
```
