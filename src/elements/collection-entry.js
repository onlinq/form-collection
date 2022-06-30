import {
  attributeStateTransformers,
  attributeValueTransformers,
  disableButton,
  enableButton,
  replaceAttributeData,
} from '../element-utilities';

import collectionEntryDom from './collection-entry.html';
import {OnlinqFormCollectionDeleteButtonElement} from './delete-button';
import {OnlinqFormCollectionMoveDownButtonElement} from './move-down-button';
import {OnlinqFormCollectionMoveUpButtonElement} from './move-up-button';

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

    this.collectionName = this.getAttribute('collection') ?? this.#collection?.name;
    const index = this.getAttribute('collection-index') ?? this.#index;
    if (index) {
      this.index = index;
    }

    if (!this.#collection) {
      console.error('A collection entry was created without a matching collection.');
    } else {
      this.#connectCollection(this.#collection);
    }

    this.#observer = new MutationObserver(this.#mutationCallback);
    this.#observer.observe(this, {
      childList: true,
      subtree: true,
    });

    this.querySelectorAll('button').forEach(button => {
      if (button instanceof OnlinqFormCollectionDeleteButtonElement && !this.#deleteButtons.includes(button) && this.#isPartOfEntry(button)) {
        this.#connectDeleteButton(button);
      }

      if (button instanceof OnlinqFormCollectionMoveDownButtonElement && !this.#moveDownButtons.includes(button) && this.#isPartOfEntry(button)) {
        this.#connectMoveDownButton(button);
      }

      if (button instanceof OnlinqFormCollectionMoveUpButtonElement && !this.#moveUpButtons.includes(button) && this.#isPartOfEntry(button)) {
        this.#connectMoveUpButton(button);
      }
    });
  }

  disconnectedCallback() {
    if (this.#collection) {
      this.#disconnectCollection(this.#collection);
    }

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

    if (collection && this.#collection !== collection) {
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
      : this.closest('onlinq-collection');
  }

  get index() {
    return this.#index;
  }

  set index(nextIndex) {
    const previousIndex = this.#index || this.#collection?.prototypeName;

    if (nextIndex.toString() === previousIndex) {
      return;
    }

    this.#index = nextIndex.toString();

    if (!previousIndex) {
      return;
    }

    this.#labelContainers.forEach(container => {
      container.innerHTML = this.#index;
    });

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
    const elementCollectionName = element.getAttribute('collection') ?? element.getAttribute('data-collection');

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
  }

  #disconnectDeleteButton(button) {
    const index = this.#deleteButtons.indexOf(button);

    if (index !== -1) {
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
  }

  #disconnectMoveDownButton(button) {
    const index = this.#moveDownButtons.indexOf(button);

    if (index !== -1) {
      this.#moveDownButtons.splice(index, 1);
    }
  }

  #connectMoveUpButton(button) {
    this.#moveUpButtons.push(button);
  }

  #disconnectMoveUpButton(button) {
    const index = this.#moveUpButtons.indexOf(button);

    if (index !== -1) {
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

    this.#connectDeleteButton(this.shadowRoot.querySelector('[is="onlinq-collection-delete"]'));
    this.#connectMoveDownButton(this.shadowRoot.querySelector('[is="onlinq-collection-move-down"]'));
    this.#connectMoveUpButton(this.shadowRoot.querySelector('[is="onlinq-collection-move-up"]'));
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

  #mutationCallback = records => {
    for (const record of records) {
      if (record.type !== 'childList') {
        continue;
      }

      for (const node of record.addedNodes) {
        if (node instanceof OnlinqFormCollectionDeleteButtonElement && this.#isPartOfEntry(node)) {
          this.#connectDeleteButton(node);
        }

        if (node instanceof HTMLElement && node.hasAttribute('collection-label') && this.#isPartOfEntry(node)) {
          this.#connectLabelContainer(node);
        }

        if (node instanceof OnlinqFormCollectionMoveDownButtonElement && this.#isPartOfEntry(node)) {
          this.#connectMoveDownButton(node);
        }

        if (node instanceof OnlinqFormCollectionMoveUpButtonElement && this.#isPartOfEntry(node)) {
          this.#connectMoveUpButton(node);
        }
      }

      for (const node in record.removedNodes) {
        if (node instanceof OnlinqFormCollectionDeleteButtonElement && this.#deleteButtons.includes(node)) {
          this.#disconnectDeleteButton(node);
        }

        if (node instanceof HTMLElement && this.#labelContainers.includes(node)) {
          this.#disconnectLabelContainer(node);
        }

        if (node instanceof OnlinqFormCollectionMoveDownButtonElement && this.#moveDownButtons.includes(node)) {
          this.#disconnectMoveDownButton(node);
        }

        if (node instanceof OnlinqFormCollectionMoveUpButtonElement && this.#moveUpButtons.includes(node)) {
          this.#disconnectMoveUpButton(node);
        }
      }
    }
  };
}

customElements.define('onlinq-collection-entry', OnlinqFormCollectionEntryElement);
