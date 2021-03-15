import collectionDom from './collection.html';

class FormCollectionElement extends HTMLElement {
  nextIndex = false;

  #collectionContainer = null;
  #placeholderContainer = null;
  #actionsContainer = null;
  #addContainer = null;

  #addClickListener = null;

  constructor() {
    super();

    this.attachShadow({mode: 'open'});

    this.#addClickListener = addClickCallback.bind(this);
  }

  connectedCallback() {
    this.#renderShadowDom();
    this.#initializeButtons();

    this.nextIndex = this.entries.length;

    if (this.max > 0 && this.entries.length >= this.max) {
      this.disableAddButtons();
    }
  }

  disconnectedCallback() {
    this.#destroyButtons();
  }

  get name() {
    return this.getAttribute('name') ?? null;
  }

  set name(newValue) {
    this.setAttribute('name', newValue);
  }

  get entries() {
    return Array.from(this.querySelectorAll(':scope > onlinq-collection-entry'));
  }

  get min() {
    return +(this.getAttribute('min') ?? 0);
  }

  set min(newValue) {
    if (newValue) {
      this.setAttribute('min', newValue.toString());
    } else {
      this.removeAttribute('min');
    }
  }

  get max() {
    return +(this.getAttribute('max') ?? 0);
  }

  set max(newValue) {
    if (newValue) {
      this.setAttribute('max', newValue.toString());
    } else {
      this.removeAttribute('max');
    }
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
    return this.getAttribute('prefix') ?? this.name ?? null;
  }

  set prefix(newValue) {
    if (newValue) {
      this.setAttribute('prefix', newValue);
    } else {
      this.removeAttribute('prefix');
    }
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
    return this.entries.find(entry => {
      return entry.index === index.toString();
    });
  }

  addEntry() {
    if (!this.allowAdd || !this.prototype) {
      return;
    }

    if (this.max > 0 && this.entries.length >= this.max) {
      return;
    }

    const nextIndex = this.nextIndex++;
    let prototype = this.prototype.cloneNode(true);

    const nextEntry = document.createElement('onlinq-collection-entry');
    nextEntry.appendChild(prototype);
    nextEntry.collection = this;
    nextEntry.index = nextIndex;

    this.appendChild(nextEntry);

    this.dispatchEvent(new CustomEvent('entryAdded', {
      entry: nextEntry,
    }));

    if (this.max > 0 && this.entries.length >= this.max) {
      this.disableAddButtons();
    }

    if (this.min > 0 && this.entries.length > this.min) {
      this.entries.forEach(entry => {
        entry.enableDeleteButtons();
      });
    }

    this.#hidePlaceholder();

    return nextEntry;
  }

  deleteEntry(index) {
    if (!this.allowDelete) {
      return;
    }

    if (this.min > 0 && this.entries.length <= this.min) {
      return;
    }

    const entry = this.entry(index);

    this.dispatchEvent(new CustomEvent('beforeEntryRemoved', {
      entry: entry,
    }));

    entry.remove();

    this.entries.forEach(entry => {
      if (entry.index < index) {
        return;
      }

      entry.index = entry.index - 1;
    });

    this.nextIndex--;

    this.dispatchEvent(new CustomEvent('entryRemoved'));

    if (this.max > 0 && this.entries.length < this.max) {
      this.enableAddButtons();
    }

    if (this.min > 0 && this.entries.length <= this.min) {
      this.entries.forEach(entry => {
        entry.disableDeleteButtons();
      });
    }

    if (this.entries.length === 0) {
      this.#showPlaceholder();
    }
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
      this.insertBefore(targetEntry, sourceEntry);
    } else {
      this.insertBefore(sourceEntry, targetEntry);
    }
  }

  enableAddButtons() {
    this.#addButtons().forEach(button => {
      button.removeAttribute('disabled');
      button.classList.remove('disabled');
    });
  }

  disableAddButtons() {
    this.#addButtons().forEach(button => {
      button.setAttribute('disabled', 'disabled');
      button.classList.add('disabled');
    });
  }

  #hidePlaceholder() {
    this.#collectionContainer.style.display = 'block';
    this.#placeholderContainer.style.display = 'none';
  }

  #showPlaceholder() {
    this.#collectionContainer.style.display = 'none';
    this.#placeholderContainer.style.display = 'block';
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
    this.shadowRoot.innerHTML = collectionDom;

    this.#collectionContainer = this.shadowRoot.querySelector('[data-collection]');
    this.#placeholderContainer = this.shadowRoot.querySelector('[data-placeholder]');
    this.#actionsContainer = this.shadowRoot.querySelector('[data-actions]');
    this.#addContainer = this.shadowRoot.querySelector('[data-add]');

    if (this.entries.length > 0) {
      this.#hidePlaceholder();
    }

    if (this.allowAdd) {
      this.#addContainer.style.display = 'inline';
    }
  }
}

function addClickCallback() {
  this.addEntry();
}

customElements.define('onlinq-collection', FormCollectionElement);
