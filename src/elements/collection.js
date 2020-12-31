class FormCollectionElement extends HTMLElement {
  nextIndex = false;

  constructor() {
    super();

    this.attachShadow({mode: 'open'});
  }

  connectedCallback() {
    this.#renderShadowDom();
    this.#initializeButtons();
    this.#calculateNextIndex();
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

  #calculateNextIndex() {
    this.nextIndex = this.querySelector('[slot="collection"]').children.length;
  }

  #initializeButtons() {
    if (this.allowAdd) {
      const addButtons = [
        ...Array.from(this.shadowRoot.querySelectorAll('[collection-add]')),
        ...Array.from(this.querySelectorAll('[collection-add]')),
      ];

      addButtons.forEach(button => {
        const collectionName = button.getAttribute('collection');

        if (!collectionName || collectionName === this.name) {
          button.addEventListener('click', () => {
            this.addEntry();
          });
        }
      });
    }
  }

  #renderShadowDom() {
    let content = '';

    content += '<slot name="collection">No items</slot>';

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

customElements.define('onlinq-collection', FormCollectionElement);
