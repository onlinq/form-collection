class FormCollectionEntryElement extends HTMLElement {
  collection = null;

  #deleteClickListener = null;
  #moveDownClickListener = null;
  #moveUpClickListener = null;

  constructor() {
    super();

    this.attachShadow({mode: 'open'});

    this.#deleteClickListener = deleteClickCallback.bind(this);
    this.#moveDownClickListener = moveDownClickCallback.bind(this);
    this.#moveUpClickListener = moveUpClickCallback.bind(this);
  }

  connectedCallback() {
    if (!this.collection) {
      this.collection = this.collectionName
        ? this.closest(`onlinq-collection[name="${this.collectionName}"]`)
        : this.closest('onlinq-collection')
      ;
    }

    this.#renderShadowDom();
    this.#initializeButtons();
  }

  disconnectedCallback() {
    this.#destroyButtons();
  }

  get collectionName() {
    return this.getAttribute('collection');
  }

  get index() {
    return this.getAttribute('collection-index');
  }

  set index(nextIndex) {
    const previousIndex = this.index || this.collection.prototypeName;

    this.setAttribute('collection-index', nextIndex.toString());

    const collectionId = this.collection.getAttribute('id');
    const collectionPrefix = this.collection.prefix;

    const labelElement = this.querySelector('[collection-label]');

    if (labelElement) {
      labelElement.innerHTML = nextIndex;
    }

    replaceAttributeData(this.querySelectorAll('*'), `${collectionId}_${previousIndex}`, `${collectionId}_${nextIndex}`);
    replaceAttributeData(this.querySelectorAll('*'), `${collectionPrefix}[${previousIndex}]`, `${collectionPrefix}[${nextIndex}]`);
  }

  get allowDelete() {
    return this.collection?.allowDelete ?? false;
  }

  #deleteButtons() {
    return [
      ...Array.from(this.shadowRoot.querySelectorAll('[collection-delete]')),
      ...Array.from(this.querySelectorAll('[collection-delete]')),
    ]
      .filter(button => {
        const collectionName = button.getAttribute('collection');

        return !collectionName || collectionName === this.collectionName;
      })
    ;
  }

  #moveDownButtons() {
    return [
      ...Array.from(this.shadowRoot.querySelectorAll('[collection-move-down]')),
      ...Array.from(this.querySelectorAll('[collection-move-down]')),
    ]
      .filter(button => {
        const collectionName = button.getAttribute('collection');

        return !collectionName || collectionName === this.collectionName;
      })
    ;
  }

  #moveUpButtons() {
    return [
      ...Array.from(this.shadowRoot.querySelectorAll('[collection-move-up]')),
      ...Array.from(this.querySelectorAll('[collection-move-up]')),
    ]
      .filter(button => {
        const collectionName = button.getAttribute('collection');

        return !collectionName || collectionName === this.collectionName;
      })
    ;
  }

  deleteEntry() {
    this.collection.deleteEntry(this.index);
  }

  moveDown() {
    this.collection.moveEntry(+this.index, +this.index + 1);
  }

  moveUp() {
    this.collection.moveEntry(+this.index, +this.index - 1);
  }

  #initializeButtons() {
    if (this.collection.allowMove) {
      this.#moveDownButtons().forEach(button => {
        button.addEventListener('click', this.#moveDownClickListener);
      });

      this.#moveUpButtons().forEach(button => {
        button.addEventListener('click', this.#moveUpClickListener);
      });
    }

    if (this.allowDelete) {
      this.#deleteButtons().forEach(button => {
        button.addEventListener('click', this.#deleteClickListener);
      });
    }
  }

  #destroyButtons() {
    if (this.collection.allowMove) {
      this.#moveDownButtons().forEach(button => {
        button.removeEventListener('click', this.#moveDownClickListener);
      });

      this.#moveUpButtons().forEach(button => {
        button.removeEventListener('click', this.#moveUpClickListener);
      });
    }

    if (this.allowDelete) {
      this.#deleteButtons().forEach(button => {
        button.removeEventListener('click', this.#deleteClickListener);
      });
    }
  }

  #renderShadowDom() {
    let content = '';

    content += '<slot></slot>';

    let actionsContent = '';

    if (this.collection.allowMove) {
      actionsContent += `
        <slot name="move-up">
          <button collection-move-up>Move up</button>
        </slot>
        <slot name="move-down">
          <button collection-move-down>Move down</button>
        </slot>
      `;
    }

    if (this.allowDelete) {
      actionsContent += `
        <slot name="delete">
          <button collection-delete>Delete</button>
        </slot>
      `;
    }

    content += `<slot name="actions">${actionsContent}</slot>`;

    this.shadowRoot.innerHTML = content;
  }
}

function deleteClickCallback() {
  this.deleteEntry();
}

function moveDownClickCallback() {
  this.moveDown();
}

function moveUpClickCallback() {
  this.moveUp();
}

function replaceAttributeData(elements, toReplace, replaceWith) {
  elements.forEach(element => {
    [...element.attributes].map(attribute => {
      if (attribute.value.includes(toReplace)) {
        attribute.value = attribute.value.replace(toReplace, replaceWith);
      }
    });
  });
}

customElements.define('onlinq-collection-entry', FormCollectionEntryElement);
