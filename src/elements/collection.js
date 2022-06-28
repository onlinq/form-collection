import {
  attributeStateTransformers,
  attributeValueTransformers,
  disableButton,
  enableButton,
} from '../element-utilities';
import {OnlinqFormCollectionEntryElement} from './collection-entry';

import collectionDom from './collection.html';
import {OnlinqFormCollectionAddButtonElement} from './add-button';

export class OnlinqFormCollectionElement extends HTMLElement {
  static get observedAttributes() {
    return [
      'allow-add',
      'allow-delete',
      'allow-move',
      'max',
      'min',
      'name',
      'prefix',
      'prototype-name',
    ];
  }

  static observedAttributeBehaviours = {
    'allow-add': {
      type: 'bool',
      property: 'allowAdd',
    },
    'allow-delete': {
      type: 'bool',
      property: 'allowDelete',
    },
    'allow-move': {
      type: 'bool',
      property: 'allowMove',
    },
    'max': {
      type: 'number',
      property: 'max',
    },
    'min': {
      type: 'number',
      property: 'min',
    },
    'name': {
      type: 'string',
      property: 'name',
    },
    'prefix': {
      type: 'string',
      property: 'prefix',
    },
    'prototype-name': {
      type: 'string',
      property: 'prototypeName',
    },
  };

  #allowAdd = false;
  #allowDelete = false;
  #allowMove = false;
  #max = 0;
  #min = 0;
  #name = null;
  #nextIndex = 0;
  #prefix = null;
  #prototypeName = '__name__';

  #addButtons = [];
  #entries = [];

  #collectionContainer = null;
  #placeholderContainer = null;
  #actionsContainer = null;
  #addContainer = null;
  #prototypeTemplate = null;

  #observer = null;

  constructor() {
    super();

    this.attachShadow({mode: 'open'});
  }

  connectedCallback() {
    this.#renderShadowDom();

    this.allowAdd = this.hasAttribute('allow-add') || this.#allowAdd;
    this.allowDelete = this.hasAttribute('allow-delete') || this.#allowDelete;
    this.allowMove = this.hasAttribute('allow-move') || this.#allowMove;
    this.max = this.hasAttribute('max') ? +this.getAttribute('max') : this.#max;
    this.min = this.hasAttribute('min') ? +this.getAttribute('min') : this.#min;
    this.name = this.getAttribute('name') ?? this.#name;
    this.prefix = this.getAttribute('prefix') ?? this.#prefix;

    this.#observer = new MutationObserver(this.#mutationCallback);
    this.#observer.observe(this, {
      childList: true,
      subtree: true,
    });

    this.querySelectorAll(':scope > onlinq-collection-entry').forEach(entry => {
      if (!this.#entries.includes(entry)) {
        this.#connectEntry(entry);
      }
    });

    this.querySelectorAll('[data-collection-prototype]').forEach(template => {
      if (!this.#prototypeTemplate && this.#isPartOfCollection(template)) {
        this.#prototypeTemplate = template;
      }
    });

    this.querySelectorAll('button').forEach(button => {
      if (button instanceof OnlinqFormCollectionAddButtonElement && !this.#addButtons.includes(button) && this.#isPartOfCollection(button)) {
        this.#connectAddButton(button);
      }
    });
  }

  disconnectedCallback() {
    this.#disconnectButtons();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const behaviour = OnlinqFormCollectionElement.observedAttributeBehaviours[name];
    const transformer = attributeValueTransformers[behaviour.type];

    const value = transformer(newValue);
    const isFresh = value === this[behaviour.property];

    if (!isFresh) {
      this[behaviour.property] = value;
    }
  }

  get allowAdd() {
    return this.#allowAdd;
  }

  set allowAdd(allowAdd) {
    const changed = this.#allowAdd !== allowAdd;
    this.#allowAdd = allowAdd;

    this.#updateAttribute('allow-add');
    this.#updateAddContainer();

    if (changed) {
      this.dispatchEvent(new CustomEvent('addPolicyChanged'));
    }
  }

  get allowDelete() {
    return this.#allowDelete;
  }

  set allowDelete(allowDelete) {
    const changed = this.#allowDelete !== allowDelete;
    this.#allowDelete = allowDelete;

    this.#updateAttribute('allow-delete');
    this.#updateAddContainer();

    if (changed) {
      this.dispatchEvent(new CustomEvent('deletePolicyChanged'));
    }
  }

  get allowMove() {
    return this.#allowMove;
  }

  set allowMove(allowMove) {
    const changed = this.#allowMove !== allowMove;
    this.#allowMove = allowMove;

    this.#updateAttribute('allow-move');

    if (changed) {
      this.dispatchEvent(new CustomEvent('movePolicyChanged'));
    }
  }

  get entries() {
    return this.#entries;
  }

  get max() {
    return this.#max;
  }

  set max(max) {
    const changed = this.#max !== max;
    this.#max = max;

    this.#updateAttribute('max');

    if (changed) {
      this.dispatchEvent(new CustomEvent('maxEntriesChanged'));
    }
  }

  get min() {
    return this.#min;
  }

  set min(min) {
    const changed = this.#min !== min;
    this.#min = min;

    this.#updateAttribute('min');

    if (changed) {
      this.dispatchEvent(new CustomEvent('minEntriesChanged'));
    }
  }

  get name() {
    return this.#name;
  }

  set name(name) {
    this.#name = name;

    this.#updateAttribute('name');
  }

  get nextIndex() {
    return this.#nextIndex;
  }

  get prefix() {
    return this.#prefix ?? this.#name;
  }

  set prefix(prefix) {
    this.#prefix = prefix;

    this.#updateAttribute('prefix');
  }

  get prototypeName() {
    return this.#prototypeName;
  }

  set prototypeName(prototypeName) {
    this.#prototypeName = prototypeName;

    this.#updateAttribute('prototype-name');
  }

  entry(index) {
    index = index.toString();

    return this.#entries.find(entry => {
      return entry.index === index;
    });
  }

  addEntry() {
    if (!this.#allowAdd) {
      console.error('Unable to create a new entry because the "allow-add" attribute is not present on the collection.');

      return null;
    }

    if (!this.#prototypeTemplate) {
      console.error('Unable to create a new entry because there is no prototype entry template present.');

      return null;
    }

    if (this.#max !== 0 && this.#entries.length >= this.#max) {
      console.error('Unable to create a new entry because the maximum amount of entries has been reached.');

      return null;
    }

    const entry = document.createElement('onlinq-collection-entry');
    entry.appendChild(this.#prototype());
    entry.collection = this;

    this.appendChild(entry);

    return entry;
  }

  deleteEntry(entry) {
    if (!this.#allowDelete) {
      console.error('Unable to delete an entry because the "allow-delete" attribute is not present on the collection.');

      return;
    }

    if (this.#min !== 0 && this.#entries.length <= this.#min) {
      console.error('Unable to delete an entry because the minimum amount of entries has been reached.');

      return;
    }

    entry = this.#matchEntry(entry);
    if (!entry) {
      return;
    }

    this.dispatchEvent(new CustomEvent('beforeEntryRemoved', {
      detail: {
        entry: entry,
      },
    }));

    entry.remove();
  }

  moveEntry(entry, targetEntry) {
    if (!this.#allowMove) {
      console.error('Unable to move an entry because the "allow-move" attribute is not present on the collection.');

      return;
    }

    entry = this.#matchEntry(entry);
    targetEntry = this.#matchEntry(targetEntry);

    if (!entry || !targetEntry) {
      return;
    }

    const swapIndex = entry.index;
    const targetIndex = targetEntry.index;

    targetEntry.index = '__swap__';
    entry.index = targetIndex;
    targetEntry.index = swapIndex;

    if (targetIndex > swapIndex) {
      this.insertBefore(targetEntry, entry);
    } else {
      this.insertBefore(entry, targetEntry);
    }
  }

  #matchEntry(value) {
    if (value instanceof OnlinqFormCollectionEntryElement) {
      if (value.collection === this) {
        return value;
      }

      console.error('Invalid collection element, it\'s not part of this collection.');
    } else {
      const entry = this.entry(value);

      if (entry) {
        return entry;
      }

      console.error('Invalid entry index: ' + value);
    }

    return null;
  }

  #isPartOfCollection(element) {
    const collectionName = element.getAttribute('collection') ?? element.getAttribute('data-collection');

    return collectionName === this.name || (!collectionName && element.closest('onlinq-collection') === this);
  }

  #prototype() {
    return this.#prototypeTemplate?.content.cloneNode(true) ?? false;
  }

  #updateAttribute(attributeName) {
    const behaviour = OnlinqFormCollectionElement.observedAttributeBehaviours[attributeName];
    const transformer = attributeStateTransformers[behaviour.type];

    transformer(this, attributeName, this[behaviour.property]);
  }

  #updateAddButtons() {
    const disable = this.#max > 0 && this.#entries.length >= this.#max;

    this.#addButtons.forEach(button => {
      if (disable) {
        disableButton(button);
      } else {
        enableButton(button);
      }
    });
  }

  #updateAddContainer() {
    if (this.#addContainer) {
      if (this.#allowAdd) {
        this.#addContainer.style.display = 'inline';
      } else {
        this.#addContainer.style.removeProperty('display');
      }
    }
  }

  #updatePlaceholder() {
    const entryCount = this.#entries.length;

    if (entryCount) {
      this.#collectionContainer.style.display = 'block';
      this.#placeholderContainer.style.display = 'none';
    } else {
      this.#collectionContainer.style.display = 'none';
      this.#placeholderContainer.style.display = 'block';
    }
  }

  #connectEntry(entry) {
    if (!entry.index) {
      entry.index = this.#nextIndex;
    } else {
      this.#entries.forEach(existingEntry => {
        if (+existingEntry.index < +entry.index) {
          return;
        }

        existingEntry.index = +existingEntry.index + 1;
      });
    }

    this.#entries.push(entry);

    this.#entries.sort((a, b) => a.index - b.index); // todo string index values?

    this.#nextIndex++;

    this.dispatchEvent(new CustomEvent('entryAdded', {
      detail: {
        entry: entry,
      },
    }));

    this.#updateAddButtons();
    this.#updatePlaceholder();
  }

  #disconnectEntry(entry) {
    const index = this.#entries.indexOf(entry);

    if (index !== -1) {
      this.#entries.splice(index, 1);
    }

    this.#entries.forEach(existingEntry => {
      if (+existingEntry.index < index) {
        return;
      }

      existingEntry.index = +existingEntry.index - 1;
    });

    this.#nextIndex--;

    this.dispatchEvent(new CustomEvent('entryRemoved'));

    this.#updateAddButtons();
    this.#updatePlaceholder();
  }

  #connectAddButton(button) {
    this.#addButtons.push(button);

    this.#updateAddButtons();
  }

  #disconnectAddButton(button) {
    const index = this.#addButtons.indexOf(button);

    if (index !== -1) {
      this.#addButtons.splice(index, 1);
    }
  }

  #disconnectButtons() {
    this.#addButtons.forEach(button => {
      this.#disconnectAddButton(button);
    });
  }

  #renderShadowDom() {
    this.shadowRoot.innerHTML = collectionDom;

    this.#collectionContainer = this.shadowRoot.querySelector('[data-collection-container]');
    this.#placeholderContainer = this.shadowRoot.querySelector('[data-placeholder-container]');
    this.#actionsContainer = this.shadowRoot.querySelector('[data-actions-container]');
    this.#addContainer = this.shadowRoot.querySelector('[data-add-container]');
  }

  #mutationCallback = records => {
    for (const record of records) {
      if (record.type !== 'childList') {
        continue;
      }

      for (const node of record.addedNodes) {
        if (node instanceof OnlinqFormCollectionEntryElement && record.target === this) {
          this.#connectEntry(node);
        }

        if (node instanceof HTMLTemplateElement && node.hasAttribute('data-collection-prototype') && this.#isPartOfCollection(node)) {
          this.#prototypeTemplate = node;
        }

        if (node instanceof OnlinqFormCollectionAddButtonElement && this.#isPartOfCollection(node)) {
          this.#connectAddButton(node);
        }
      }

      for (const node of record.removedNodes) {
        if (node instanceof OnlinqFormCollectionEntryElement && record.target === this) {
          this.#disconnectEntry(node);
        }

        if (node === this.#prototypeTemplate) {
          this.#prototypeTemplate = null;
        }

        if (node instanceof OnlinqFormCollectionAddButtonElement && this.#addButtons.includes(node)) {
          this.#disconnectAddButton(node);
        }
      }
    }
  };
}

customElements.define('onlinq-collection', OnlinqFormCollectionElement);
