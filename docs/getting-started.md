# Getting Started

This guide is an introduction on how to use the `onlinq-collection` tags using
plain HTML forms to build input collections.

Building forms, and form collections in particular, is a very precise and
repetitive process which can be time-consuming to build and maintain. Using the
`onlinq-collection` tags allows users to manipulate repetitive input data,
removing the burden of writing client-side code. 

Note that this library does not provide any server-side validation for forms.
The web components simply provide a shell around HTML inputs that helps to
maintain a valid data structure when the user manipulates the collection.  

## Installation

If you're using a tool like Webpack to compile your assets, the easiest
way to use the form collection components is by installing the package through
NPM:

```bash
npm install @onlinq/form-collection
```

Importing the package in one of your JavaScript files will add the form
collection elements to the HTML element registry on your page:

```javascript
import '@onlinq/form-collection';
```

After including the JavaScript on your page, you can start using form
collections in your HTML-code with the `onlinq-collection` tag.

## Your First Collection

Who doesn't like fruit? It's sustainable, healthy and most of all tasty. The
following examples will guide you through the steps to create a form where
users can enter a list of their favorite fruits. Let's start with a basic
form with just a few inputs to enter the data:

```html
<form>
  <label>What are your favorite fruits?</label>
  <input type="text" name="fruits[0]" required="required" value="Apple">
  <input type="text" name="fruits[1]" required="required" value="Banana">
  <input type="text" name="fruits[2]" required="required" value="Orange">

  <button type="submit">Submit</button>
</form>
```

The above example shows the most bare-bones implementation of a form
collection possible. There are three inputs to enter a fruit, but there is no
option to add or remove fruits from the list. It's also not possible order the
fruits on the basis of deliciousness. To enable these features, we have to wrap
the inputs in the form collection components.

First, the entire collection has to be wrapped in `<onlinq-collection>` tags.
This is the container for the collection that keeps track of changes to
individual entries and propagates these changes to other entries in the
collection.

```html
<onlinq-collection name="fruits" actions>
  <!-- the inputs here -->
</onlinq-collection>
```

Note that the web component needs either a `name` or `prefix` attribute
corresponding to the prefix of the input's `name` values. In our example, the
inputs are named `fruits[x]` where `x` is the input's index. The prefix of the
entire collection is in this case `fruits`. We've also added the `actions`
attribute to the element to allow users to add new entries to the collection.

Next, each input needs to wrapped in `<onlinq-collection-entry>` tags for the
form collection to recognize each input as an individual entry. Again we've
added the `actions` attribute to allow users to move and delete the entries
from the collection.

```html
<onlinq-collection-entry actions>
  <input type="text" name="fruits[0]" required="required" value="Apple"/>
</onlinq-collection-entry>
```

For sake of completeness, each entry is going to get an `collection-index`
property which value corresponds with the input's data index.

```html
<onlinq-collection-entry collection-index="0" actions>
```

At the end of the list a button might show up to add a new entry, but it isn't
working yet. That's because for the collection to be able to generate new
entries, we need to provide a template it can use to build the HTML for the new
entry.

```html
<template data-collection-prototype>
  <input type="text" name="fruits[__name__]" required="required"/>
</template>
```

Add the template as a child to the `onlinq-collection` element in the form.

The template has an attribute `data-collection-prototype` to indicate that it's
used by the collection for new entries. Inside the template we replicate
an existing entry with one key difference, in the `name` attribute of the input
the index is indicated by the string `__name__` instead of a number. The
collection will replace this value by the next logical number in the collection
when it adds a new entry to the DOM.

That's it. We've incorporated the form collection components in our form so our
users can enter as many delicious fruits as they like, in the order they prefer.
The code should now look something like this:

```html
<form>
  <label>What are your favorite fruits?</label>
  <onlinq-collection name="fruits" actions>
    <template data-collection-prototype>
      <input type="text" name="fruits[__name__]" required="required"/>
    </template>

    <onlinq-collection-entry collection-index="0" actions>
      <input type="text" name="fruits[0]" required="required" value="Apple"/>
    </onlinq-collection-entry>
    <onlinq-collection-entry collection-index="1" actions>
      <input type="text" name="fruits[1]" required="required" value="Banana"/>
    </onlinq-collection-entry>
    <onlinq-collection-entry collection-index="2" actions>
      <input type="text" name="fruits[2]" required="required" value="Orange"/>
    </onlinq-collection-entry>
  </onlinq-collection>

  <button type="submit">Submit</button>
</form>
```

## Next Steps

Now that you know the basic workings of the form collection components, you can
start customizing your collections by utilizing slots or extending the
functionality with JavaScript.
