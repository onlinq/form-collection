# Slots

While the contents of collection entries is not determined by the form
collection elements, any helper elements used by the collection, like
action buttons, are shown through the use of shadow DOM and can't be altered
directly. Fortunately, these helper elements can be customized by using HTML
slots.

## Collection Slots

### `placeholder`

The element shown as a placeholder when the collection is empty.

### `actions`

The container for all collection action buttons (*Add entry*). Use an empty
element to hide all action buttons at once.

### `add`

The container for the *Add entry* action button. To use a custom button, add
this slot containing a `button` element with the `collection-add` property.
Note that this slot is part of the `actions` slot, it will not show up if the
`actions` slot is defined.

## Collection Entry Slots

### `actions`

The container for all collection action buttons (*Move entry*, *Delete entry*).
Use an empty element to hide all action buttons at once.

### `move-up`

The container for the *Move entry up* action button. To use a custom button,
add this slot containing a `button` element with the `collection-move-up`
property. Note that this slot is part of the `actions` slot, it will not show
up if the `actions` slot is defined.

### `move-down`

The container for the *Move entry down* action button. To use a custom button,
add this slot containing a `button` element with the `collection-move-down`
property. Note that this slot is part of the `actions` slot, it will not show
up if the `actions` slot is defined.

### `delete`

The container for the *Delete entry* action button. To use a custom button,
add this slot containing a `button` element with the `collection-delete`
property. Note that this slot is part of the `actions` slot, it will not show
up if the `actions` slot is defined.
