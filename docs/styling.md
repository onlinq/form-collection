# Styling

Appearance of the form collection elements can be altered through CSS variables.

## CSS Variables

### `<onlinq-collection>`

```
--collection-display: block;
--collection-justify-content: flex-start;
--collection-align-items: flex-start;
--collection-contents-margin: 0 0 1rem;
--collection-contents-flex-grow: 1;
--collection-actions-margin: 0 0 1rem;
--collection-actions-flex-grow: 0;
```

### `<onlinq-collection-entry>`

```
--collection-entry-display: block;
--collection-entry-justify-content: flex-start;
--collection-entry-align-items: flex-start;
--collection-entry-contents-margin: 0 0 1rem;
--collection-entry-contents-flex-grow: 1;
--collection-entry-actions-margin: 0 0 1rem;
--collection-entry-actions-flex-grow: 0;
```

## Stylesheets

Included in the package for this library are some predefined stylesheets for
specific use cases. Make sure to import the `@onlinq/form-collection/dist/onlinq-collection.css`
file in your CSS to use these configurations.

### Inline entry action buttons

To display action buttons for collection entries next to the entry rather than
below it, add the `collection-inline` class to the `<onlinq-collection>`
element. 
