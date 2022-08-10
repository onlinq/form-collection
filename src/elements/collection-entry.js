import {
  attributeStateTransformers,
  attributeValueTransformers,
  replaceAttributeData,
} from '../element-utilities';

import collectionEntryDom from './collection-entry.html';

export class OnlinqFormCollectionEntryElement extends HTMLElement {
  static get observedAttributes() {
    return [
      'actions',
      'collection',
      'collection-index',
    ];
  }

  static observedAttributeBehaviours = {
    'actions': {
      type: 'string',
      property: 'actions',
    },
    'collection': {
      type: 'string',
      property: 'collectionName',
    },
    'collection-index': {
      type: 'string',
      property: 'index',
    },
  };

  #actions = '';
  #collection = null;
  #index = null;

  #showActions = true;

  #actionsContainer;
  #deleteContainer = null;
  #labelContainers = [];
  #moveContainer = null;

  #observer = null;

  constructor() {
    super();

    this.attachShadow({mode: 'open'});
  }

  connectedCallback() {
    this.#renderShadowDom();

    this.actions = this.getAttribute('actions') ?? this.#actions;
    this.collectionName = this.getAttribute('collection') ?? this.#collection?.name;
    this.index = this.getAttribute('collection-index') ?? this.#index;

    if (this.#collection) {
      this.#connectCollection(this.#collection);
    } else {
      console.error('A collection entry was created without a matching collection.');
    }

    this.#observer = new MutationObserver(this.#mutationCallback);
    this.#observer.observe(this, {
      childList: true,
      subtree: true,
    });

    this.#updateDeleteContainer();
    this.#updateMoveContainers();
  }

  disconnectedCallback() {
    this.#observer.disconnect();

    if (this.#collection) {
      this.#disconnectCollection(this.#collection);
    }
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

  get actions() {
    return this.#actions;
  }

  set actions(actions) {
    actions = actions.toLowerCase();

    const changed = this.#actions !== actions;
    this.#actions = actions;

    this.#updateAttribute('actions');

    if (changed) {
      const actionList = actions.split(/\W/);
      this.#showActions = !actionList.includes('noactions');

      this.#updateActionsContainer();
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
    if (!nextIndex && 0 !== nextIndex) {
      return;
    }

    if (typeof nextIndex !== 'string') {
      nextIndex = nextIndex.toString();
    }

    let previousIndex = this.#index;

    if (nextIndex === previousIndex) {
      return;
    }

    this.#index = nextIndex;

    if (!this.#collection) {
      return;
    } else if (!previousIndex) {
      previousIndex = this.#collection?.prototypeName;
    }

    this.#labelContainers.forEach(container => {
      container.innerHTML = this.#index;
    });

    this.#updateAttribute('collection-index');

    if (!this.#index) {
      return;
    }

    const collectionId = this.#collection?.getAttribute('id');
    const collectionPrefix = this.#collection?.prefix || this.#collection?.name;

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
    this.#collection?.moveEntry(this, +this.index + 1);
  }

  moveUp() {
    this.#collection?.moveEntry(this, +this.index - 1);
  }

  #connectCollection(collection) {
    this.#updateDeleteContainer();
    this.#updateMoveContainers();

    collection.addEventListener('deletePolicyChanged', this.#collectionDeletePolicyChangedListener);
    collection.addEventListener('movePolicyChanged', this.#collectionMovePolicyChangedListener);
  }

  #disconnectCollection(collection) {
    this.#updateDeleteContainer();
    this.#updateMoveContainers();

    collection.removeEventListener('deletePolicyChanged', this.#collectionDeletePolicyChangedListener);
    collection.removeEventListener('movePolicyChanged', this.#collectionMovePolicyChangedListener);
  }

  #isPartOfEntry(element) {
    const elementCollectionName = element.getAttribute('collection') ?? element.getAttribute('data-collection');

    return (this.collectionName && elementCollectionName === this.collectionName) || (!elementCollectionName && element.closest('onlinq-collection-entry') === this);
  }

  #renderShadowDom() {
    this.shadowRoot.innerHTML = collectionEntryDom;

    this.#actionsContainer = this.shadowRoot.querySelector('[data-actions-container]');
    this.#deleteContainer = this.shadowRoot.querySelector('[data-delete-container]');
    this.#moveContainer = this.shadowRoot.querySelector('[data-move-container]');
  }

  #updateActionsContainer() {
    if (this.#actionsContainer) {
      if (this.#showActions) {
        this.#actionsContainer.style.display = 'block';
      } else {
        this.#actionsContainer.style.display = 'none';
      }
    }
  }

  #updateAttribute(attributeName) {
    const behaviour = OnlinqFormCollectionEntryElement.observedAttributeBehaviours[attributeName];
    const transformer = attributeStateTransformers[behaviour.type];

    transformer(this, attributeName, this[behaviour.property]);
  }

  #updateDeleteContainer() {
    if (this.#deleteContainer) {
      if (this.collection?.allowDelete ?? true) {
        this.#deleteContainer.style.removeProperty('display');
      } else {
        this.#deleteContainer.style.display = 'none';
      }
    }
  }

  #updateMoveContainers() {
    if (this.#moveContainer) {
      if (this.collection?.allowMove ?? true) {
        this.#moveContainer.style.removeProperty('display');
      } else {
        this.#moveContainer.style.display = 'none';
      }
    }
  }

  #collectionDeletePolicyChangedListener = () => {
    this.#updateDeleteContainer();
  };

  #collectionMovePolicyChangedListener = () => {
    this.#updateMoveContainers();
  };

  #mutationCallback = records => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (!(node instanceof HTMLElement) || !this.#isPartOfEntry(node)) {
          continue;
        }

        if (node.hasAttribute('data-collection-label')) {
          this.#labelContainers.push(node);
        }
      }

      for (const node in record.removedNodes) {
        if (this.#labelContainers.includes(node)) {
          const index = this.#labelContainers.indexOf(node);

          this.#labelContainers.splice(index, 1);
        }
      }
    }
  };
}

customElements.define('onlinq-collection-entry', OnlinqFormCollectionEntryElement);
