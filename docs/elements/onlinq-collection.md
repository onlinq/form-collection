# &lt;onlinq-collection&gt;: The Dynamic Form Collection element

The `<onlinq-collection>` element provides special properties and methods for
manipulating entries in a collection.

## Attributes

This element's attributes include the [global attributes][mdn-global-attributes].

- `prefix`  
  The prefix of `name` attributes of input elements of the form collection.

- `allow-add`  
  Boolean attribute indicating whether new entries can be added to the
  collection.

- `allow-delete`  
  Boolean attribute indicating whether entries can be removed from the
  collection.

- `allow-move`  
  Boolean attribute indicating whether entries can be moved inside the
  collection.

- `prototype-name`  
  The replacement value for the entry prototype's index value.  

- `min`  
  The minimum amount of entries in the collection.

- `max`  
  The maximum amount of entries in the collection.

## Properties

This element inherits properties from its ancestors [HTMLElement][mdn-htmlelement],
[Element][mdn-element], [Node][mdn-node] and [EventTarget][mdn-eventtarget].

- `entries` (read-only)  
  An array containing the entry elements.

- `prefix`  
  The prefix of `name` attributes of input elements of the form collection.
  Defaults to its own `name` attribute value or `null`.

- `allowAdd`  
  Boolean property indicating whether new entries can be added to the
  collection.

- `allowDelete`  
  Boolean property indicating whether entries can be removed from the
  collection.

- `allowMove`  
  Boolean property indicating whether entries can be moved inside the
  collection.

- `prototype` (read-only)  
  Returns the entry prototype if it exists.

- `prototypeName`  
  The replacement value for the entry prototype's index value. Defaults to
  `__name__`.

- `min`  
  The minimum amount of entries in the collection. Defaults to `0`.

- `max`  
  The maximum amount of entries in the collection. Use `0` for unlimited
  entries. Defaults to `0`.

## Methods

This element inherits methods from its ancestors [HTMLElement][mdn-htmlelement],
[Element][mdn-element], [Node][mdn-node] and [EventTarget][mdn-eventtarget].

- `entry(index)`  
  Returns the entry with the specified index.

- `addEntry()`  
  Adds a new entry to the end of the collection.

- `deleteEntry(index)`  
  Removes the entry with the specified index.

- `moveEntry(index, targetIndex)`  
  Moves the entry with the specified index to the specified target index.

- `enableAddButtons()`  
  Removes `disabled` attributes from buttons adding a new entry to the
  collection.

- `disableAddButtons()`  
  Adds `disabled` attributes from buttons adding a new entry to the
  collection.

## Events

This element inherits events from its ancestors [HTMLElement][mdn-htmlelement]
and [Element][mdn-element].

- `entryAdded`  
  Fired when a new entry is added to the collection.

- `befireEntryRemoved`  
  Fired before an entry is removed from the collection.

- `entryRemoved`  
  Fired when an entry is removed from the collection.

## Slots

- `_root_`  
  Direct descendents of the element are embedded as entries of the collection. 
  Note that the collection can only interact with entries enclosed in the
  `onlinq-collection-entry` tag.
- `placeholder`  
  The element shown as a placeholder when the collection is empty.
- `actions`  
  The container for all collection action buttons (*Add entry*). Use an empty
  element to hide all action buttons at once.
- `add`  
  The container for the *Add entry* action button. To use a custom button, add
  this slot containing a `button` element with the `collection-add` property.
  Note that this slot is part of the `actions` slot, it will not show up if the
  `actions` slot is defined.

[mdn-global-attributes]: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes
[mdn-htmlelement]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
[mdn-element]: https://developer.mozilla.org/en-US/docs/Web/API/Element
[mdn-node]: https://developer.mozilla.org/en-US/docs/Web/API/Node
[mdn-eventtarget]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
