class FormCollectionElement extends HTMLElement {
  nextIndex = false;

  #addClickListener = null;

  constructor() {
    super();

    this.attachShadow({mode: 'open'});

    this.#addClickListener = addClickCallback.bind(this);
  }

  connectedCallback() {
    this.#renderShadowDom();
    this.#initializeButtons();
    this.#calculateNextIndex();
  }

  disconnectedCallback() {
    this.#destroyButtons();
  }

  get name() {
    return this.getAttribute('name');
  }

  get allowAdd() {
    return this.hasAttribute('allow-add');
  }

  set allowAdd(newValue) {
    if (newValue) {
      this.setAttribute('allow-add', 'allow-add');
    } else {
      this.removeAttribute('allow-add');
    }
  }

  get allowDelete() {
    return this.hasAttribute('allow-delete');
  }

  set allowDelete(newValue) {
    if (newValue) {
      this.setAttribute('allow-delete', 'allow-delete');
    } else {
      this.removeAttribute('allow-delete');
    }
  }

  get allowMove() {
    return this.hasAttribute('allow-move');
  }

  set allowMove(newValue) {
    if (newValue) {
      this.setAttribute('allow-move', 'allow-move');
    } else {
      this.removeAttribute('allow-move');
    }
  }

  get prefix() {
    return this.getAttribute('prefix');
  }

  set prefix(newValue) {
    this.setAttribute('prefix', newValue);
  }

  get prototype() {
    let template = null;

    if (this.name) {
      template = this.querySelector(`template[collection="${this.name}"][collection-prototype]`);
    }

    if (!template) {
      template = this.querySelector(`template[collection-prototype]`);
    }

    return template?.content ?? false;
  }

  get prototypeName() {
    return this.hasAttribute('prototype-name') ? this.getAttribute('prototype-name') : '__name__';
  }

  set prototypeName(newValue) {
    this.setAttribute('prototype-name', newValue);
  }

  #addButtons() {
    return [
      ...Array.from(this.shadowRoot.querySelectorAll('[collection-add]')),
      ...Array.from(this.querySelectorAll('[collection-add]')),
    ]
      .filter(button => {
        const collectionName = button.getAttribute('collection');

        return !collectionName || collectionName === this.name;
      })
    ;
  }

  entry(index) {
    return this.querySelector(`[collection-index="${index}"]`);
  }

  addEntry() {
    if (!this.allowAdd || !this.prototype) {
      return;
    }

    const nextIndex = this.nextIndex++;
    let prototype = this.prototype.cloneNode(true);

    const nextEntry = document.createElement('onlinq-collection-entry');
    nextEntry.appendChild(prototype);
    nextEntry.collection = this;
    nextEntry.index = nextIndex;

    this.querySelector('[slot="collection"]').appendChild(nextEntry);
  }

  deleteEntry(index) {
    if (!this.allowDelete) {
      return;
    }

    const entry = this.querySelector(`[slot="collection"] > [collection-index="${index}"]`);

    entry.remove();

    const remainingEntries = Array.from(this.querySelector(`[slot="collection"]`).children);

    remainingEntries.forEach(entry => {
      if (entry.index < index) {
        return;
      }

      entry.index = entry.index - 1;
    });

    this.nextIndex--;
  }

  moveEntry(index, targetIndex) {
    const sourceEntry = this.entry(index);
    const targetEntry = this.entry(targetIndex);

    if (!sourceEntry || !targetEntry) {
      return;
    }

    targetEntry.index = '__swap__';
    sourceEntry.index = targetIndex;
    targetEntry.index = index;

    if (targetIndex > index) {
      this.querySelector('[slot="collection"]').insertBefore(targetEntry, sourceEntry);
    } else {
      this.querySelector('[slot="collection"]').insertBefore(sourceEntry, targetEntry);
    }
  }

  #calculateNextIndex() {
    this.nextIndex = this.querySelector('[slot="collection"]').children.length;
  }

  #initializeButtons() {
    if (this.allowAdd) {
      this.#addButtons().forEach(button => {
        button.addEventListener('click', this.#addClickListener);
      });
    }
  }

  #destroyButtons() {
    if (this.allowAdd) {
      this.#addButtons().forEach(button => {
        button.removeEventListener('click', this.#addClickListener);
      });
    }
  }

  #renderShadowDom() {
    let content = '';

    content += '<slot name="collection">No entries</slot>';

    if (this.allowAdd) {
      content += `
        <slot name="add">
          <button collection-add>Add</button>
        </slot>
      `;
    }

    this.shadowRoot.innerHTML = content;
  }
}

function addClickCallback() {
  this.addEntry();
}

customElements.define('onlinq-collection', FormCollectionElement);
