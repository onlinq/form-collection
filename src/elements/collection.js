import {
  attributeStateTransformers,
  attributeValueTransformers,
} from '../element-utilities';

import collectionDom from './collection.html';

export class OnlinqFormCollectionElement extends HTMLElement {
  static get observedAttributes() {
    return [
      'actions',
      'actionlist',
      'max',
      'min',
      'name',
      'prefix',
      'prototype-actions',
      'prototype-name',
    ];
  }

  static observedAttributeBehaviours = {
    'actionlist': {
      type: 'string',
      property: 'actionList',
    },
    'actions': {
      type: 'bool',
      property: 'actions',
    },
    'max': {
      type: 'number',
      property: 'max',
      defaultValue: 0,
    },
    'min': {
      type: 'number',
      property: 'min',
      defaultValue: 0,
    },
    'name': {
      type: 'string',
      property: 'name',
    },
    'prefix': {
      type: 'string',
      property: 'prefix',
    },
    'prototype-actions': {
      type: 'bool',
      property: 'prototypeActions',
    },
    'prototype-name': {
      type: 'string',
      property: 'prototypeName',
      defaultValue: '__name__',
    },
  };

  #actionList = null;
  #actions = false;
  #max = 0;
  #min = 0;
  #name = null;
  #prefix = null;
  #prototypeActions = false;
  #prototypeName = '__name__';

  #allowAdd = true;
  #allowDelete = true;
  #allowMove = true;
  #entries = [];
  #nextIndex = 0;

  #actionsContainer = null;
  #addContainer = null;
  #collectionContainer = null;
  #placeholderContainer = null;
  #prototypeTemplate = null;

  #observer = null;

  constructor() {
    super();

    this.attachShadow({mode: 'open'});
  }

  connectedCallback() {
    // Render the Shadow DOM
    this.#renderShadowDom();

    // Update attributes if properties were changed before connecting the element to the DOM
    this.actionList = this.getAttribute('actionlist') ?? this.#actionList;
    this.actions = this.hasAttribute('actions') || this.#actions;
    this.max = this.hasAttribute('max') ? +this.getAttribute('max') : this.#max;
    this.min = this.hasAttribute('min') ? +this.getAttribute('min') : this.#min;
    this.name = this.getAttribute('name') ?? this.#name;
    this.prefix = this.getAttribute('prefix') ?? this.#prefix;
    this.prototypeActions = this.hasAttribute('prototype-actions') || this.#prototypeActions;
    this.prototypeName = this.getAttribute('prototype-name') ?? this.#prototypeName;

    // Observe changes to DOM
    this.#observer = new MutationObserver(this.#mutationCallback);
    this.#observer.observe(this, {
      childList: true,
      subtree: true,
    });

    // Index and sort entries
    this.querySelectorAll(':scope > onlinq-collection-entry').forEach(entry => {
      if (!this.#entries.includes(entry)) {
        this.#connectEntry(entry);
      }
    });

    // Find initial prototype template
    if (!this.#prototypeTemplate) {
      this.prototypeTemplate = Array.from(this.querySelectorAll('[data-collection-prototype]'))
        .filter(template => this.#isPartOfCollection(template))
        .shift() ?? null;
    }

    this.#updateActionsContainer();
    this.#updateContentContainers();
  }

  disconnectedCallback() {
    this.#observer.disconnect();
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

  get actionList() {
    return this.#actionList;
  }

  set actionList(actionList) {
    actionList = actionList?.toLowerCase();

    const changed = this.#actionList !== actionList;
    this.#actionList = actionList;

    this.#updateAttribute('actionlist');

    if (changed) {
      const actions = actionList ? actionList.split(/\W/) : ['all'];
      const all = actions.includes('all');

      this.#toggleAdd(all || actions.includes('add'));
      this.#toggleDelete(all || actions.includes('delete'));
      this.#toggleMove(all || actions.includes('move'));
    }
  }

  get actions() {
    return this.#actions;
  }

  set actions(actions) {
    const changed = this.#actions !== actions;
    this.#actions = actions;

    this.#updateAttribute('actions');

    if (changed) {
      this.#updateActionsContainer();
    }
  }

  get allowAdd() {
    return this.#allowAdd;
  }

  get allowDelete() {
    return this.#allowDelete;
  }

  get allowMove() {
    return this.#allowMove;
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
    return this.#prefix;
  }

  set prefix(prefix) {
    this.#prefix = prefix;

    this.#updateAttribute('prefix');
  }

  get prototypeActions() {
    return this.#prototypeActions;
  }

  set prototypeActions(prototypeActions) {
    this.#prototypeActions = prototypeActions;

    this.#updateAttribute('prototype-actions');
  }

  get prototypeName() {
    return this.#prototypeName;
  }

  set prototypeName(prototypeName) {
    this.#prototypeName = prototypeName;

    this.#updateAttribute('prototype-name');
  }

  get prototypeTemplate() {
    return this.#prototypeTemplate;
  }

  set prototypeTemplate(template) {
    this.#prototypeTemplate = template;
  }

  entry(index) {
    index = index.toString();

    return this.#entries.find(entry => {
      return entry.index === index;
    });
  }

  addEntry() {
    if (!this.#allowAdd) {
      console.error('Unable to create a new entry because adding entries has been disabled on this collection.');

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
    entry.appendChild(this.#createPrototype());
    entry.collection = this;
    entry.actions = this.#prototypeActions;
    this.appendChild(entry);

    this.#connectEntry(entry);

    return entry;
  }

  deleteEntry(entry) {
    if (!this.#allowDelete) {
      console.error('Unable to delete an entry because deleting entries has been disabled on this collection.');

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
      console.error('Unable to move an entry because moving entries has been disabled on this collection.');

      return;
    }

    entry = this.#matchEntry(entry);
    targetEntry = this.#matchEntry(targetEntry);

    if (!entry || !targetEntry) {
      return;
    }

    const initialIndex = +entry.index;
    const targetIndex = +targetEntry.index;

    entry.index = '__swap__';

    const entryPlaceholder = document.createElement('div');

    if (targetIndex > initialIndex) {
      targetEntry.after(entryPlaceholder);

      for (let i = initialIndex; i < targetIndex; i++) {
        const swapEntry = this.#matchEntry(i + 1);

        swapEntry.index = i;
      }
    } else {
      this.insertBefore(entryPlaceholder, targetEntry);

      for (let i = initialIndex; i > targetIndex; i--) {
        const swapEntry = this.#matchEntry(i - 1);

        swapEntry.index = i;
      }
    }

    this.insertBefore(entry, entryPlaceholder);
    entryPlaceholder.remove();

    entry.index = targetIndex;
  }

  swapEntry(entry, targetEntry) {
    if (!this.#allowMove) {
      console.error('Unable to swap an entry because moving entries has been disabled on this collection.');

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

    const entryPlaceholder = document.createElement('div');
    this.insertBefore(entryPlaceholder, entry);
    this.insertBefore(entry, targetEntry);
    this.insertBefore(targetEntry, entryPlaceholder);
    entryPlaceholder.remove();
  }

  #connectEntry(entry) {
    if (this.#entries.includes(entry)) {
      return;
    }

    let index = entry.getAttribute('collection-index');

    if (!index) {
      entry.setAttribute('collection-index', this.#nextIndex);
    }

    this.#entries.push(entry);

    this.#nextIndex++;

    this.dispatchEvent(new CustomEvent('entryAdded', {
      detail: {
        entry: entry,
      },
    }));

    this.#updateContentContainers();
  }

  #createPrototype() {
    return this.#prototypeTemplate?.content.cloneNode(true) ?? false;
  }

  #disconnectEntry(entry) {
    const index = this.#entries.indexOf(entry);

    if (index !== -1) {
      this.#entries.splice(index, 1);
    }

    this.#nextIndex--;

    this.dispatchEvent(new CustomEvent('entryRemoved'));

    this.#updateContentContainers();
  }

  #isPartOfCollection(element) {
    const collectionName = element.getAttribute('collection') ?? element.getAttribute('data-collection');

    return collectionName === this.name || (!collectionName && element.closest('onlinq-collection') === this);
  }

  #matchEntry(value) {
    if (value instanceof HTMLElement && value.tagName === 'ONLINQ-COLLECTION-ENTRY') {
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

  #renderShadowDom() {
    this.shadowRoot.innerHTML = collectionDom;

    this.#actionsContainer = this.shadowRoot.querySelector('[data-actions-container]');
    this.#addContainer = this.shadowRoot.querySelector('[data-add-container]');
    this.#collectionContainer = this.shadowRoot.querySelector('[data-collection-container]');
    this.#placeholderContainer = this.shadowRoot.querySelector('[data-placeholder-container]');
  }

  #toggleAdd(allowAdd) {
    const changed = this.#allowAdd !== allowAdd;
    this.#allowAdd = allowAdd;

    if (changed) {
      this.#updateAddContainer();

      this.dispatchEvent(new CustomEvent('addPolicyChanged'));
    }
  }

  #toggleDelete(allowDelete) {
    const changed = this.#allowDelete !== allowDelete;
    this.#allowDelete = allowDelete;

    if (changed) {
      this.dispatchEvent(new CustomEvent('deletePolicyChanged'));
    }
  }

  #toggleMove(allowMove) {
    const changed = this.#allowMove !== allowMove;
    this.#allowMove = allowMove;

    if (changed) {
      this.dispatchEvent(new CustomEvent('movePolicyChanged'));
    }
  }

  #updateActionsContainer() {
    if (this.#actionsContainer) {
      if (this.#actions) {
        this.#actionsContainer.style.display = 'block';
      } else {
        this.#actionsContainer.style.display = 'none';
      }
    }
  }

  #updateAddContainer() {
    if (this.#addContainer) {
      if (this.#allowAdd) {
        this.#addContainer.style.removeProperty('display');
      } else {
        this.#addContainer.style.display = 'none';
      }
    }
  }

  #updateAttribute(attributeName) {
    const behaviour = OnlinqFormCollectionElement.observedAttributeBehaviours[attributeName];
    const stateTransformer = attributeStateTransformers[behaviour.type];
    const valueTransformer = attributeValueTransformers[behaviour.type];

    const attributeValue = valueTransformer(this.getAttribute(attributeName) ?? null);

    if (attributeValue !== this[behaviour.property] && !(null === attributeValue && this[behaviour.property] === behaviour.defaultValue)) {
      stateTransformer(this, attributeName, this[behaviour.property]);
    }
  }

  #updateContentContainers() {
    const entryCount = this.#entries.length;

    if (entryCount) {
      this.#collectionContainer.style.display = 'block';
      this.#placeholderContainer.style.display = 'none';
    } else {
      this.#collectionContainer.style.display = 'none';
      this.#placeholderContainer.style.display = 'block';
    }
  }

  #mutationCallback = records => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (!(node instanceof HTMLElement) || !this.#isPartOfCollection(node)) {
          continue;
        }

        if (record.target === this && node.tagName === 'ONLINQ-COLLECTION-ENTRY') {
          this.#connectEntry(node);
        }

        if (node.hasAttribute('data-collection-prototype')) {
          this.#prototypeTemplate = node;
        }
      }

      for (const node of record.removedNodes) {
        if (this.#entries.includes(node)) {
          this.#disconnectEntry(node);
        }

        if (node === this.#prototypeTemplate) {
          this.#prototypeTemplate = null;
        }
      }
    }
  };
}

customElements.define('onlinq-collection', OnlinqFormCollectionElement);
