# Changelog

# 0.1.1 (2021-02-02)

* Make `prefix` property inherit value of `name`.
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
