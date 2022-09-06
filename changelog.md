# Changelog

# 0.2.0 (2022-09-06)

* Rewrote web components to use mutation observers for updating state.
* Added button components for collection actions.

# 0.1.4 (2022-05-04)

* Improves matching of buttons to the collection
* Added Node exports for the element classes

# 0.1.3 (2021-09-15)

* Fixes an issue where buttons on entry elements created by the collection
  aren't recognized by the collection because the collection name wasn't
  persisted in the entry element.
* Added console errors when an invalid action is performed.

# 0.1.2 (2021-03-20)

* Fixes a whitespace issue on newly generated entries.
* Added check to disable delete buttons on initial load.
* Calling `addEntry()` now returns the newly added entry.

# 0.1.1 (2021-02-02)

* The `prefix` property now inherits the value of `name`.
* Added `min` and `max` attributes to force a specific amount of entries in the
  collection.
* Added first batch of CSS custom properties for spacing.

# 0.1.0 (2021-01-06)

* Created `<onlinq-collection>` and `<onlinq-collection-entry>` components.
* Allow adding and deleting entries from the collection with the `allow-add` and
  `allow-delete` attributes. New entries are generated from a template element
  with the `collection-prototype` attribute.
* Allow moving entries up and down in the collection with the `allow-move`
  attribute.
* Allow customization of buttons through element slots.  
