# &lt;onlinq-collection-entry&gt;: The Dynamic Form Collection Entry element

The `<onlinq-collection-entry>` element provides special properties and methods
for  manipulating an entry in a dynamic form collection.

## Attributes

This element's attributes include the [global attributes][mdn-global-attributes].

- `collection`  
  The value of the `name` attributes of the collection this entry is part of.

- `collection-index`  
  The index of this entry.

## Properties

This element inherits properties from its ancestors [HTMLElement][mdn-htmlelement],
[Element][mdn-element], [Node][mdn-node] and [EventTarget][mdn-eventtarget].

- `collection`  
  The collection this entry is a part of.

- `collectionName`  
  The value of the `name` attributes of the collection this entry is a part of.

- `index`  
  The index of this entry.

## Methods

This element inherits methods from its ancestors [HTMLElement][mdn-htmlelement],
[Element][mdn-element], [Node][mdn-node] and [EventTarget][mdn-eventtarget].

- `deleteEntry()`
  Removes this entry from the collection.

- `moveUp()`
  Moves this entry up in the collection.

- `moveDown()`
  Moves this entry down in the collection.

- `enableDeleteButtons()`
  Removes `disabled` attributes from buttons removing this entry from the
  collection.

- `disableDeleteButtons()`
  Adds `disabled` attributes from buttons removing this entry from the
  collection.

## Events

This element inherits events from its ancestors [HTMLElement][mdn-htmlelement]
and [Element][mdn-element].

[mdn-global-attributes]: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes
[mdn-htmlelement]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
[mdn-element]: https://developer.mozilla.org/en-US/docs/Web/API/Element
[mdn-node]: https://developer.mozilla.org/en-US/docs/Web/API/Node
[mdn-eventtarget]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
