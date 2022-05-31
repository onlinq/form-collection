import {OnlinqFormCollectionEntryButtonElement} from './entry-button';

export class OnlinqFormCollectionMoveDownButtonElement extends OnlinqFormCollectionEntryButtonElement {
  constructor() {
    const clickCallback = () => {
      if (this.collectionEntry) {
        this.collectionEntry.moveDown();
      }
    };

    super(clickCallback);
  }
}

customElements.define('onlinq-collection-move-down', OnlinqFormCollectionMoveDownButtonElement, {extends: 'button'});
