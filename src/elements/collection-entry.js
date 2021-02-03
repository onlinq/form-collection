import collectionEntryDom from './collection-entry.html';

class FormCollectionEntryElement extends HTMLElement {
  collection = null;

  #entryContainer = null;
  #actionsContainer = null;
  #deleteContainer = null;
  #moveDownContainer = null;
  #moveUpContainer = null;

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
    return this.getAttribute('collection') ?? null;
  }

  get index() {
    return this.getAttribute('collection-index') ?? false;
  }

  set index(nextIndex) {
    const previousIndex = this.index || this.collection.prototypeName;

    this.setAttribute('collection-index', nextIndex.toString());

    const labelElement = this.querySelector('[collection-label]');

    if (labelElement) {
      labelElement.innerHTML = nextIndex;
    }

    const collectionId = this.collection.getAttribute('id');
    const collectionPrefix = this.collection.prefix;

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

  enableDeleteButtons() {
    this.#deleteButtons().forEach(button => {
      button.removeAttribute('disabled');
      button.classList.remove('disabled');
    });
  }

  disableDeleteButtons() {
    this.#deleteButtons().forEach(button => {
      button.setAttribute('disabled', 'disabled');
      button.classList.add('disabled');
    });
  }

  #initializeButtons() {
    this.#moveDownButtons().forEach(button => {
      button.addEventListener('click', this.#moveDownClickListener);
    });

    this.#moveUpButtons().forEach(button => {
      button.addEventListener('click', this.#moveUpClickListener);
    });

    this.#deleteButtons().forEach(button => {
      button.addEventListener('click', this.#deleteClickListener);
    });
  }

  #destroyButtons() {
    this.#moveDownButtons().forEach(button => {
      button.removeEventListener('click', this.#moveDownClickListener);
    });

    this.#moveUpButtons().forEach(button => {
      button.removeEventListener('click', this.#moveUpClickListener);
    });

    this.#deleteButtons().forEach(button => {
      button.removeEventListener('click', this.#deleteClickListener);
    });
  }

  #renderShadowDom() {
    this.shadowRoot.innerHTML = collectionEntryDom;

    this.#entryContainer = this.shadowRoot.querySelector('[data-entry]');
    this.#actionsContainer = this.shadowRoot.querySelector('[data-actions]');
    this.#deleteContainer = this.shadowRoot.querySelector('[data-delete]');
    this.#moveDownContainer = this.shadowRoot.querySelector('[data-move-down]');
    this.#moveUpContainer = this.shadowRoot.querySelector('[data-move-up]');

    if (this.collection) {
      if (this.collection.allowMove) {
        this.#moveUpContainer.style.display = 'inline';
        this.#moveDownContainer.style.display = 'inline';
      }

      if (this.collection.allowDelete) {
        this.#deleteContainer.style.display = 'inline';
      }
    }
  }
}

function deleteClickCallback() {
  if (this.collection.allowDelete) {
    this.deleteEntry();
  }
}

function moveDownClickCallback() {
  if (this.collection.allowMove) {
    this.moveDown();
  }
}

function moveUpClickCallback() {
  if (this.collection.allowMove) {
    this.moveUp();
  }
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
