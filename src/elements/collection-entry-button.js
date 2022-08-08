import {attributeStateTransformers, attributeValueTransformers} from '../element-utilities';

export class OnlinqFormCollectionEntryButtonElement extends HTMLButtonElement {
  #clickCallback = null;
  #collectionEntry = null;

  #observer = null;

  constructor(clickCallback) {
    super();

    this.#clickCallback = clickCallback;
  }

  connectedCallback() {
    this.collectionName = this.getAttribute('data-collection') ?? null;

    this.#observer = new MutationObserver(this.#mutationCallback);
    this.#observer.observe(this, {
      attributes: true,
    });

    this.addEventListener('click', this.#clickCallback);
  }

  disconnectedCallback() {
    this.#observer.disconnect();

    this.removeEventListener('click', this.#clickCallback);
  }

  get collection() {
    return this.collectionEntry?.collection;
  }

  get collectionEntry() {
    return this.#collectionEntry;
  }

  set collectionEntry(collectionEntry) {
    this.#collectionEntry = collectionEntry;

    if (!this.#collectionEntry && this.isConnected) {
      const host = this.getRootNode().host ?? null;

      if (host && host.nodeName === 'ONLINQ-COLLECTION-ENTRY') {
        this.#collectionEntry = host;
      } else {
        console.error('A collection entry button was created without a matching collection entry.');
      }
    }

    const value = attributeValueTransformers.string(this.collectionName);
    const isFresh = value === this.getAttribute('data-collection');

    if (!isFresh) {
      attributeStateTransformers.string(this, 'data-collection', this.collectionName);
    }
  }

  get collectionName() {
    return this.collection?.collectionName;
  }

  set collectionName(collectionName) {
    this.collectionEntry = collectionName ?
      this.closest(`onlinq-collection[name="${collectionName}"] > onlinq-collection-entry`) :
      this.closest('onlinq-collection-entry');
  }

  #mutationCallback = records => {
    for (const record of records) {
      if ('data-collection' === record.attributeName) {
        this.collectionName = this.getAttribute('data-collection');
      }
    }
  };
}
