class FormCollectionElement extends HTMLElement {
  constructor() {
    super();

    this.nextIndex = false;

    this.shadowDom = this.attachShadow({mode: 'open'});

    this.renderShadowDom();
  }

  connectedCallback() {
    this.nextIndex = this.querySelector('[slot="collection"]').children.length;

    if (this.allowAdd) {
      const addButtons = [
        ...Array.from(this.shadowDom.querySelectorAll('[collection-add]')),
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

    if (!template) {
      return false;
    }

    return template.content;
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

    const newIndex = this.nextIndex++;
    let prototype = this.prototype.cloneNode(true);

    const newEntry = document.createElement('onlinq-collection-entry');
    newEntry.appendChild(prototype);

    newEntry.setAttribute('index', newIndex.toString());
    if (this.name) {
      newEntry.setAttribute('collection', this.name);
    }

    this.querySelector('[slot="collection"]').appendChild(newEntry);
  }

  deleteEntry(index) {
    if (!this.allowDelete) {
      return;
    }

    const entry = this.querySelector(`[slot="collection"] > [index="${index}"]`);

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

  renderShadowDom() {
    let content = '';

    content += '<slot name="collection">No items</slot>';

    if (this.allowAdd) {
      content += `
        <slot name="add">
          <button collection-add>Add</button>
        </slot>
      `;
    }

    this.shadowDom.innerHTML = content;
  }
}

customElements.define('onlinq-collection', FormCollectionElement);
