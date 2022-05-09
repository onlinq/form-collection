import {
  attributeStateTransformers,
  attributeValueTransformers,
  disableButton, enableButton,
  replaceAttributeData
} from '../element-utilities';

import collectionEntryDom from './collection-entry.html';

export class OnlinqFormCollectionEntryElement extends HTMLElement {
  static get observedAttributes() {
    return [
      'collection',
      'collection-index',
    ];
  }

  static observedAttributeBehaviours = {
    'collection': {
      type: 'string',
      property: 'collectionName',
    },
    'collection-index': {
      type: 'string',
      property: 'index',
    },
  };

  #collection = null;
  #index = null;

  #deleteButtons = [];
  #labelContainers = [];
  #moveDownButtons = [];
  #moveUpButtons = [];

  #deleteContainer = null;
  #moveDownContainer = null;
  #moveUpContainer = null;

  #observer = null;

  constructor() {
    super();

    this.attachShadow({mode: 'open'});
  }

  connectedCallback() {
    this.#renderShadowDom();

    this.collectionName = this.getAttribute('collection') ?? this.#collection?.name ?? null;
    this.index = this.getAttribute('collection-index') ?? this.#index;

    if (!this.#collection) {
      console.error('A collection entry was created without a matching collection.');
    }

    this.#observer = new MutationObserver(this.#mutationCallback);
    this.#observer.observe(this, {
      childList: true,
      subtree: true,
    });

    this.querySelectorAll('[collection-delete]').forEach(button => {
      if (!this.#deleteButtons.includes(button) && this.#isPartOfEntry(button)) {
        this.#connectDeleteButton(button);
      }
    });

    this.querySelectorAll('[collection-move-down]').forEach(button => {
      if (!this.#deleteButtons.includes(button) && this.#isPartOfEntry(button)) {
        this.#connectMoveDownButton(button);
      }
    });

    this.querySelectorAll('[collection-move-up]').forEach(button => {
      if (!this.#deleteButtons.includes(button) && this.#isPartOfEntry(button)) {
        this.#connectMoveUpButton(button);
      }
    });
  }

  disconnectedCallback() {
    this.#disconnectButtons();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const behaviour = OnlinqFormCollectionEntryElement.observedAttributeBehaviours[name];
    const transformer = attributeValueTransformers[behaviour.type];

    const value = transformer(newValue);
    const isFresh = value === this[behaviour.property];

    if (!isFresh) {
      this[behaviour.property] = value;
    }
  }

  get collection() {
    return this.#collection;
  }

  set collection(collection) {
    if (this.#collection && this.#collection !== collection) {
      this.#disconnectCollection(this.#collection);
    }

    this.#collection = collection;

    if (collection) {
      this.#connectCollection(collection);
    }

    this.#updateAttribute('collection');
  }

  get collectionName() {
    // Check both the property and DOM attribute since the property might not be initialized
    return this.#collection?.name ?? this.#collection?.getAttribute('name');
  }

  set collectionName(collectionName) {
    this.collection = collectionName
      ? this.closest(`onlinq-collection[name="${collectionName}"]`)
      : this.closest('onlinq-collection')
    ;
  }

  get index() {
    return this.#index;
  }

  set index(nextIndex) {
    const previousIndex = this.#index || this.#collection?.prototypeName;
    this.#index = nextIndex?.toString();

    this.#labelContainers.forEach(container => {
      container.innerHTML = this.#index;
    })

    this.#updateAttribute('collection-index');

    const collectionId = this.#collection?.getAttribute('id');
    const collectionPrefix = this.#collection?.prefix;

    if (collectionId) {
      replaceAttributeData(
        this.querySelectorAll('*'),
        `${collectionId}_${previousIndex}`,
        `${collectionId}_${nextIndex}`
      );
    }

    if (collectionPrefix) {
      replaceAttributeData(
        this.querySelectorAll('*'),
        `${collectionPrefix}[${previousIndex}]`,
        `${collectionPrefix}[${nextIndex}]`
      );
    }
  }

  deleteEntry() {
    this.#collection?.deleteEntry(this);
  }

  moveDown() {
    this.#collection?.moveEntry(+this.index, +this.index + 1);
  }

  moveUp() {
    this.#collection?.moveEntry(+this.index, +this.index - 1);
  }

  #isPartOfEntry(element) {
    const elementCollectionName = element.getAttribute('collection');

    return (this.collectionName && elementCollectionName === this.collectionName) || (!elementCollectionName && element.closest('onlinq-collection-entry') === this);
  }

  #updateAttribute(attributeName) {
    const behaviour = OnlinqFormCollectionEntryElement.observedAttributeBehaviours[attributeName];
    const transformer = attributeStateTransformers[behaviour.type];

    transformer(this, attributeName, this[behaviour.property]);
  }

  #updateDeleteButtons() {
    const collection = this.#collection;

    if (collection) {
      const disable = collection.max > 0 && collection.entries.length >= collection.max;

      this.#deleteButtons.forEach(button => {
        if (disable) {
          disableButton(button);
        } else {
          enableButton(button);
        }
      });
    }
  }

  #updateDeleteContainer() {
    if (this.#deleteContainer) {
      if (this.collection?.allowDelete) {
        this.#deleteContainer.style.display = 'inline';
      } else {
        this.#deleteContainer.style.removeProperty('display');
      }
    }
  }

  #updateMoveContainers() {
    if (this.#moveDownContainer) {
      if (this.collection?.allowMove) {
        this.#moveDownContainer.style.display = 'inline';
      } else {
        this.#moveDownContainer.style.removeProperty('display');
      }
    }

    if (this.#moveUpContainer) {
      if (this.collection?.allowMove) {
        this.#moveUpContainer.style.display = 'inline';
      } else {
        this.#moveUpContainer.style.removeProperty('display');
      }
    }
  }

  #connectCollection(collection) {
    this.#updateDeleteButtons();
    this.#updateDeleteContainer();
    this.#updateMoveContainers();

    collection.addEventListener('entryAdded', this.#collectionEntryAddedListener);
    collection.addEventListener('entryRemoved', this.#collectionEntryRemovedListener);
    collection.addEventListener('deletePolicyChanged', this.#collectionDeletePolicyChangedListener);
    collection.addEventListener('movePolicyChanged', this.#collectionMovePolicyChangedListener);
    collection.addEventListener('minEntriesChanged', this.#collectionMinEntriesChangedListener);
  }

  #disconnectCollection(collection) {
    this.#updateDeleteButtons();
    this.#updateDeleteContainer();
    this.#updateMoveContainers();

    collection.removeEventListener('entryAdded', this.#collectionEntryAddedListener);
    collection.removeEventListener('entryRemoved', this.#collectionEntryRemovedListener);
    collection.removeEventListener('deletePolicyChanged', this.#collectionDeletePolicyChangedListener);
    collection.removeEventListener('movePolicyChanged', this.#collectionMovePolicyChangedListener);
    collection.removeEventListener('minEntriesChanged', this.#collectionMinEntriesChangedListener);
  }

  #connectDeleteButton(button) {
    this.#deleteButtons.push(button);

    button.addEventListener('click', this.#deleteClickListener);
  }

  #disconnectDeleteButton(button) {
    const index = this.#deleteButtons.indexOf(button);

    if (index !== -1) {
      button.removeEventListener('click', this.#deleteClickListener);

      this.#deleteButtons.splice(index, 1);
    }
  }

  #connectLabelContainer(container) {
    this.#labelContainers.push(container);
  }

  #disconnectLabelContainer(container) {
    const index = this.#labelContainers.indexOf(container);

    if (index !== -1) {
      this.#labelContainers.splice(index, 1);
    }
  }

  #connectMoveDownButton(button) {
    this.#moveDownButtons.push(button);

    button.addEventListener('click', this.#moveDownClickListener);
  }

  #disconnectMoveDownButton(button) {
    const index = this.#moveDownButtons.indexOf(button);

    if (index !== -1) {
      button.removeEventListener('click', this.#moveDownClickListener);

      this.#moveDownButtons.splice(index, 1);
    }
  }

  #connectMoveUpButton(button) {
    this.#moveUpButtons.push(button);

    button.addEventListener('click', this.#moveUpClickListener);
  }

  #disconnectMoveUpButton(button) {
    const index = this.#moveUpButtons.indexOf(button);

    if (index !== -1) {
      button.removeEventListener('click', this.#moveUpClickListener);

      this.#moveUpButtons.splice(index, 1);
    }
  }

  #disconnectButtons() {
    this.#deleteButtons.forEach(button => {
      this.#disconnectDeleteButton(button);
    });

    this.#moveDownButtons.forEach(button => {
      this.#disconnectMoveDownButton(button);
    });

    this.#moveUpButtons.forEach(button => {
      this.#disconnectMoveUpButton(button);
    });
  }

  #renderShadowDom() {
    this.shadowRoot.innerHTML = collectionEntryDom;

    this.#deleteContainer = this.shadowRoot.querySelector('[data-delete]');
    this.#moveDownContainer = this.shadowRoot.querySelector('[data-move-down]');
    this.#moveUpContainer = this.shadowRoot.querySelector('[data-move-up]');

    this.#connectDeleteButton(this.shadowRoot.querySelector('[collection-delete]'));
    this.#connectMoveDownButton(this.shadowRoot.querySelector('[collection-move-down]'));
    this.#connectMoveUpButton(this.shadowRoot.querySelector('[collection-move-up]'));
  }

  #collectionEntryAddedListener = () => {
    this.#updateDeleteButtons();
  };

  #collectionEntryRemovedListener = () => {
    this.#updateDeleteButtons();
  };

  #collectionDeletePolicyChangedListener = () => {
    this.#updateDeleteContainer();
  };

  #collectionMovePolicyChangedListener = () => {
    this.#updateMoveContainers();
  };

  #collectionMinEntriesChangedListener = () => {
    this.#updateDeleteButtons();
  };

  #deleteClickListener = () => {
    if (this.collection.allowDelete) {
      this.deleteEntry();
    }
  };

  #moveDownClickListener = () => {
    if (this.collection.allowMove) {
      this.moveDown();
    }
  };

  #moveUpClickListener = () => {
    if (this.collection.allowMove) {
      this.moveUp();
    }
  };

  #mutationCallback = records => {
    for (const record of records) {
      if (record.type !== 'childList') {
        continue;
      }

      for (const node of record.addedNodes) {
        if (node instanceof HTMLElement && node.hasAttribute('collection-delete') && this.#isPartOfEntry(node)) {
          this.#connectDeleteButton(node);
        }

        if (node instanceof HTMLElement && node.hasAttribute('collection-label') && this.#isPartOfEntry(node)) {
          this.#connectLabelContainer(node);
        }

        if (node instanceof HTMLElement && node.hasAttribute('collection-move-down') && this.#isPartOfEntry(node)) {
          this.#connectMoveDownButton(node);
        }

        if (node instanceof HTMLElement && node.hasAttribute('collection-move-up') && this.#isPartOfEntry(node)) {
          this.#connectMoveUpButton(node);
        }
      }

      for (const node in record.removedNodes) {
        if (node instanceof HTMLElement && this.#deleteButtons.includes(node)) {
          this.#disconnectDeleteButton(node);
        }

        if (node instanceof HTMLElement && this.#labelContainers.includes(node)) {
          this.#disconnectLabelContainer(node);
        }

        if (node instanceof HTMLElement && this.#moveDownButtons.includes(node)) {
          this.#disconnectMoveDownButton(node);
        }

        if (node instanceof HTMLElement && this.#moveUpButtons.includes(node)) {
          this.#disconnectMoveUpButton(node);
        }
      }
    }
  };
}

customElements.define('onlinq-collection-entry', OnlinqFormCollectionEntryElement);
