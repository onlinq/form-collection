import {OnlinqFormCollectionButtonElement} from './collection-button';

export class OnlinqFormCollectionAddButtonElement extends OnlinqFormCollectionButtonElement {
  constructor() {
    const clickCallback = () => {
      if (this.collection) {
        this.collection.addEntry();
      }
    };

    super(clickCallback);
  }
}

customElements.define('onlinq-collection-add', OnlinqFormCollectionAddButtonElement, {extends: 'button'});
