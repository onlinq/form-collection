import {attributeStateTransformers, attributeValueTransformers} from '../element-utilities';
import {OnlinqFormCollectionElement} from './collection';

export class OnlinqFormCollectionAddButtonElement extends HTMLButtonElement {
  static get observedAttributes() {
    return ['data-collection'];
  }

  #collection = null;

  connectedCallback() {
    const host = this.getRootNode().host;

    if (!host) {
      this.collectionName = this.getAttribute('data-collection') ?? this.#collection?.name;
    } else {
      if (!host instanceof OnlinqFormCollectionElement) {
        return;
      }

      this.collection = host;
    }

    if (!this.#collection) {
      console.error('An add button was created without a matching collection.');
    }

    this.addEventListener('click', this.#addCallback);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.#addCallback);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const transformer = attributeValueTransformers.string;

    const value = transformer(newValue);
    const isFresh = value === this.collectionName;

    if (!isFresh) {
      this.collectionName = value;
    }
  }

  get collection() {
    return this.#collection;
  }

  set collection(collection) {
    this.#collection = collection;

    attributeStateTransformers.string(this, 'data-collection', this.collectionName);
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

  #addCallback = () => {
    if (this.#collection) {
      this.#collection.addEntry();
    }
  };
}

customElements.define('onlinq-collection-add', OnlinqFormCollectionAddButtonElement, {extends: 'button'});
