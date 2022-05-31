import {attributeStateTransformers, attributeValueTransformers} from '../element-utilities';
import {OnlinqFormCollectionEntryElement} from './collection-entry';

export class OnlinqFormCollectionEntryButtonElement extends HTMLButtonElement {
  static get observedAttributes() {
    return ['data-collection'];
  }

  #collectionEntry = null;

  #clickCallback = null;

  constructor(clickCallback) {
    super();

    this.#clickCallback = clickCallback;
  }

  connectedCallback() {
    const host = this.getRootNode().host;

    if (!host) {
      this.collectionName = this.getAttribute('data-collection') ?? this.#collectionEntry?.collectionName;
    } else {
      if (!host instanceof OnlinqFormCollectionEntryElement) {
        return;
      }

      this.collectionEntry = host;
    }

    if (!this.#collectionEntry) {
      console.error('A delete button was created without a matching collection entry.');
    }

    this.addEventListener('click', this.#clickCallback);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.#clickCallback);
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
    return this.#collectionEntry?.collection;
  }

  get collectionEntry() {
    return this.#collectionEntry;
  }

  set collectionEntry(collectionEntry) {
    this.#collectionEntry = collectionEntry;

    attributeStateTransformers.string(this, 'data-collection', this.collectionName);
  }

  get collectionName() {
    // Check both the property and DOM attribute since the property might not be initialized
    return this.#collectionEntry?.collectionName ?? this.#collectionEntry?.getAttribute('collection');
  }

  set collectionName(collectionName) {
    this.collectionEntry = collectionName
      ? this.closest(`onlinq-collection-entry[collection="${collectionName}"]`)
      : this.closest('onlinq-collection-entry')
    ;
  }
}
