import {OnlinqFormCollectionEntryButtonElement} from './entry-button';

export class OnlinqFormCollectionMoveUpButtonElement extends OnlinqFormCollectionEntryButtonElement {
  constructor() {
    const clickCallback = () => {
      if (this.collectionEntry) {
        this.collectionEntry.moveUp();
      }
    };

    super(clickCallback);
  }
}

customElements.define('onlinq-collection-move-up', OnlinqFormCollectionMoveUpButtonElement, {extends: 'button'});
