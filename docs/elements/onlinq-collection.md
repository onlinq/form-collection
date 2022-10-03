# &lt;onlinq-collection&gt;: The Dynamic Form Collection element

The `<onlinq-collection>` element is the main container for a form collection.
It provides special methods and properties for manipulating entries in the DOM
positioned within the container.

## Attributes

This element's attributes include the [global attributes][mdn-global-attributes].

- `prefix`  
  The prefix of `name` attributes of input elements embedded in the collection.

- `actions`  
  The `actions` attribute, when specified, enables the container for collection
  actions.

- `actionlist`  
  A space-seperated list of allowed actions in the collection.

- `prototype-name`  
  The replacement value for the entry prototype's index value.  

- `prototype-actions`  
  The `prototype-actions` attribute, when specified, enables the container for
  actions on entries added during runtime.

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

- `actions`  
  Boolean property indicating whether the container for collection actions
  is enabled.

- `actionList`  
  A space-seperated list of allowed actions in the collection. Defaults to `all`.

- `allowAdd` (read-only)  
  Boolean property indicating whether entries can be added to the
  collection.

- `allowDelete` (read-only)  
  Boolean property indicating whether entries can be removed from the
  collection.

- `allowMove` (read-only)  
  Boolean property indicating whether entries can be moved inside the
  collection.

- `prototypeName`  
  The replacement value for the entry prototype's index value. Defaults to
  `__name__`.

- `prototypeActions`  
  Boolean property indicating whether the container for actions will be enabled
  on entries added during runtime.

- `min`  
  The minimum amount of entries in the collection. Defaults to `0`.

- `max`  
  The maximum amount of entries in the collection. Use `0` for unlimited
  entries. Defaults to `0`.

- `nextIndex` (read-only)  
  The next index for the collection.

- `prototypeTemplate`  
  The active `template` element used by the collection to create new entries.

## Methods

This element inherits methods from its ancestors [HTMLElement][mdn-htmlelement],
[Element][mdn-element], [Node][mdn-node] and [EventTarget][mdn-eventtarget].

- `entry(index)`  
  Returns the entry with the specified index.

- `addEntry()`  
  Adds a new entry to the end of the collection.

- `deleteEntry(entry)`  
  Removes the entry with the specified index.

- `moveEntry(entry, targetEntry)`  
  Moves the entry with the specified index to the specified target index.

- `swapEntry(entry, targetEntry)`  
  Swaps the entry with the specified index with the specified target index.

## Events

This element inherits events from its ancestors [HTMLElement][mdn-htmlelement]
and [Element][mdn-element].

- `entryAdded`  
  Fired when a new entry is added to the collection.

- `beforeEntryRemoved`  
  Fired before an entry is removed from the collection.

- `entryRemoved`  
  Fired when an entry is removed from the collection.

- `addPolicyChanged`  
  Fired when the action to add entries to the collection is enabled or disabled.

- `deletePolicyChanged`  
  Fired when the action to remove entries to the collection is enabled or  
  disabled.

- `movePolicyChanged`  
  Fired when the action to move entries to the collection is enabled or disabled.

## Slots

- `_root_`  
  Direct descendents of the element are embedded as entries of the collection.
  Note that the collection can only interact with entries enclosed in the
  [`onlinq-collection-entry`](onlinq-collection-entry.md) tag.
- `placeholder`  
  The element shown as a placeholder when the collection is empty.
- `actions`  
  The container for all collection action buttons (*Add entry*). Use an empty
  element to hide all action buttons at once.
- `add`  
  The container for the *Add entry* action button. To customize the look of the
  button, add this slot containing a [`button[is="onlinq-collection-add"]`](onlinq-collection-add.md).
  element. Note that this slot is part of the `actions` slot, it will not show
  up if the `actions` slot is defined.

[mdn-global-attributes]: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes
[mdn-htmlelement]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
[mdn-element]: https://developer.mozilla.org/en-US/docs/Web/API/Element
[mdn-node]: https://developer.mozilla.org/en-US/docs/Web/API/Node
[mdn-eventtarget]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
