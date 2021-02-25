# Getting started

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

## Basic Collections

After including the JavaScript on your page, you can start using the form
collection web components in your HTML.

```html
<form>
  <onlinq-collection name="fruits" allow-add allow-delete allow-move>
    <template collection-prototype>
      <input type="text" name="fruits[__name__]" required="required"/>
    </template>

    <onlinq-collection-entry collection-index="0">
      <input type="text" name="fruits[0]" required="required" value="Apple"/>
    </onlinq-collection-entry>
    <onlinq-collection-entry collection-index="1">
      <input type="text" name="fruits[1]" required="required" value="Banana"/>
    </onlinq-collection-entry>
    <onlinq-collection-entry collection-index="2">
      <input type="text" name="fruits[2]" required="required" value="Orange"/>
    </onlinq-collection-entry>
  </onlinq-collection>

  <button type="submit">Submit</button>
</form>
```

The above example shows a pre-filled form collection for inputs in the `fruits[]`
collection. The collection contains an entry prototype and 3 entries, each
containing an `input` element with a `name` attribute starting with `fruits`.

The `onlinq-collection` element in the above example contains multiple custom
attributes, `allow-add`, `allow-delete` and `allow-move`. Adding these
attributes enables buttons for the user to manipulate the collection.

The example also contains a `template` element with the `collection-prototype`
attribute containing a prototype entry with the `__name__` index. This is
required for allowing users to add new entries to the collection. When the user
adds a new entry to the collection, the prototype will be cloned and added as a
new entry. Any occurrences of the prototype name (by default `__name__`) will
be replaced with the proper index of the new entry.

Each `onlinq-collection-entry` element in the example contain a `collection-index`
attribute specifying the index of the entry. Making sure the index is identical
for entries and inputs inside the entries is important for generating valid HTML
forms. It's recommended to use a programming language like JavaScript or PHP to
automatically generate your entries to prevent errors when building collections.

## Customizing Collections
