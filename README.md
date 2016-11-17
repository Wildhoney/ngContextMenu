ngContextMenu
===================

![Travis](http://img.shields.io/travis/Wildhoney/ngContextMenu.svg?style=flat)
&nbsp;
![npm](http://img.shields.io/npm/v/ng-contextmenu.svg?style=flat)
&nbsp;
![License MIT](http://img.shields.io/badge/License-MIT-lightgrey.svg?style=flat)

* **Heroku**: [http://ng-contextmenu.herokuapp.com/](http://ng-contextmenu.herokuapp.com/)
* **Bower:** `bower install ng-contextmenu`

# Getting Started

Using `ngContextMenu` you can **easily** support custom context menus for your application! Custom context menus are somewhat underused, but applications such as [Gmail](http://gmail.com/) use them wisely to provide a richer UX.

First and foremost, you must add the script in your index.html and add the dependency to your module:

```javascript
var app = $angular.module('menuApp', ['ngContextMenu']);
```

Then, you must create your context menu, which should be placed into your application as a separate file &ndash; a partial.

```html
<ul class="menu">
    <li>Read Message</li>
    <li>Reply to {{from}}</li>
    <li>Delete Message</li>
</ul>
```

Once you have the partial configured you can hook up the `ngContextMenu` directive using the `data-context-menu` attribute &ndash; passing along the path to your previously crafted partial. You may also supply an *optional* `ngModel` which will be used to evaluate the template &ndash; otherwise it will be evaluated against an empty object `({})`.

```html
<li data-context-menu="context-menus/message.html" ng-model="message"></li>
```

Before you begin to test the context menu, you must ensure that your context menu is positioned absolutely, since `ngContextMenu` will apply the `top` and `left` properties to the node which will ensure it's opened where the cursor invoked the opening of the menu.

```css
ul.menu {
    position: absolute;
}
```

Now when you test your newly setup context menu, a right click on the node with the `data-context-menu` attribute will open the context menu. Voila!

## Service

`ngContextMenu` ships with a simple `contextMenu` service which creates the necessary relationship between all of the context menus &ndash; this allows the opening of another menu &mdash;or a click on the `document` node&mdash; to close the currently opened menu.

Sometimes you may wish to invoke this behaviour yourself, in which case you need to add the `contextMenu` service to your controller, directive, service, and then invoke the `cancelAll` method on it.

## Item Controllers

In some circumstances you may wish to add a controller for each context menu, in these cases it is preferrable to add the `ng-controller` attribute to the element that also has the `data-context-menu` attribute:

```html
<li class="message" ng-controller="MessageController as mc" data-context-menu="context-menus/message.html">
    /* ... */
</li>
```
