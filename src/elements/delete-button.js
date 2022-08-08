import {OnlinqFormCollectionEntryButtonElement} from './collection-entry-button';

export class OnlinqFormCollectionDeleteButtonElement extends OnlinqFormCollectionEntryButtonElement {
  constructor() {
    const clickCallback = () => {
      if (this.collectionEntry) {
        this.collectionEntry.deleteEntry();
      }
    };

    super(clickCallback);
  }
}

customElements.define('onlinq-collection-delete', OnlinqFormCollectionDeleteButtonElement, {extends: 'button'});
