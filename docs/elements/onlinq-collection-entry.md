# &lt;onlinq-collection-entry&gt;: The Dynamic Form Collection Entry element

The `<onlinq-collection-entry>` element is the container for an entry in a form
collection. It provides special methods and properties for manipulating a
collection from inside the entry.

## Attributes

This element's attributes include the [global attributes][mdn-global-attributes].

- `collection`  
  The value of the `name` attributes of the collection this entry is part of.

- `collection-index`  
  The index of this entry.

- `actions`  
  The `actions` attribute, when specified, enables the container for collection
  entry actions.

## Properties

This element inherits properties from its ancestors [HTMLElement][mdn-htmlelement],
[Element][mdn-element], [Node][mdn-node] and [EventTarget][mdn-eventtarget].

- `collection`  
  The collection this entry is a part of.

- `collectionName`  
  The value of the `name` attribute of the collection this entry is a part of.

- `index`  
  The index of this entry.

- `actions`  
  Boolean property indicating whether the container for collection entry actions
  is enabled.

## Methods

This element inherits methods from its ancestors [HTMLElement][mdn-htmlelement],
[Element][mdn-element], [Node][mdn-node] and [EventTarget][mdn-eventtarget].

- `deleteEntry()`  
  Removes this entry from the collection.

- `moveUp()`  
  Moves this entry up in the collection.

- `moveDown()`  
  Moves this entry down in the collection.

## Events

This element inherits events from its ancestors [HTMLElement][mdn-htmlelement]
and [Element][mdn-element].

## Slots

- `_root_`  
  Direct descendents of the element are interpreted as the collection entry
  contents.
- `actions`  
  The container for all collection action buttons (*Move entry*, *Delete
  entry*). Use an empty element to hide all action buttons at once.
- `move-up`  
  The container for the *Move entry up* action button. To use a custom button,
  add this slot containing a [`button[is="onlinq-collection-move-up"]`](onlinq-collection-move-up.md)
  element. Note that this slot is part of the `actions` slot, it will not show
  up if the `actions` slot is defined.
- `move-down`  
  The container for the *Move entry down* action button. To use a custom button,
  add this slot containing a [`button[is="onlinq-collection-move-down"]`](onlinq-collection-move-down.md)
  element. Note that this slot is part of the `actions` slot, it will not show
  up if the `actions` slot is defined.
- `delete`  
  The container for the *Delete entry* action button. To use a custom button,
  add this slot containing a [`button[is="onlinq-collection-delete"]`](onlinq-collection-delete.md)
  element. Note that this slot is part of the `actions` slot, it will not show
  up if the `actions` slot is defined.

[mdn-global-attributes]: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes
[mdn-htmlelement]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
[mdn-element]: https://developer.mozilla.org/en-US/docs/Web/API/Element
[mdn-node]: https://developer.mozilla.org/en-US/docs/Web/API/Node
[mdn-eventtarget]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
