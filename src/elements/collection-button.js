import {attributeStateTransformers, attributeValueTransformers} from '../element-utilities';

export class OnlinqFormCollectionButtonElement extends HTMLButtonElement {
  #clickCallback = null;
  #collection = null;

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
    return this.#collection;
  }

  set collection(collection) {
    this.#collection = collection;

    if (!this.#collection) {
      const host = this.getRootNode().host ?? null;

      if (host && host.nodeName === 'ONLINQ-COLLECTION') {
        this.#collection = host;
      } else {
        console.error('A collection button was created without a matching collection.');
      }
    }

    const value = attributeValueTransformers.string(this.collectionName);
    const isFresh = value === this.getAttribute('data-collection');

    if (!isFresh) {
      attributeStateTransformers.string(this, 'data-collection', this.collectionName);
    }
  }

  get collectionName() {
    return this.#collection?.name;
  }

  set collectionName(collectionName) {
    this.collection = collectionName ?
      document.querySelector(`onlinq-collection[name="${collectionName}"]`) :
      this.closest('onlinq-collection');
  }

  #mutationCallback = records => {
    for (const record of records) {
      if ('data-collection' === record.attributeName) {
        this.collectionName = this.getAttribute('data-collection');
      }
    }
  };
}
