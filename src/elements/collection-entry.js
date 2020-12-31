class FormCollectionEntryElement extends HTMLElement {
  constructor() {
    super();

    this.collection = null;

    this.shadowDom = this.attachShadow({mode: 'open'});

    this.renderShadowDom();
  }

  connectedCallback() {
    if (!this.collection) {
      this.collection = this.collectionName
        ? this.closest(`onlinq-collection[name="${this.collectionName}"]`)
        : this.closest('onlinq-collection')
      ;
    }

    this.renderShadowDom();

    if (this.allowDelete) {
      const deleteButtons = [
        ...Array.from(this.shadowDom.querySelectorAll('[collection-delete]')),
        ...Array.from(this.querySelectorAll('[collection-delete]')),
      ];

      deleteButtons.forEach(button => {
        const collectionName = button.getAttribute('collection');

        if (!collectionName || collectionName === this.collectionName) {
          button.addEventListener('click', () => {
            this.deleteEntry();
          });
        }
      });
    }
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
    return this.collection ? this.collection.allowDelete : false;
  }

  deleteEntry() {
    this.collection.deleteEntry(this.index);
  }

  renderShadowDom() {
    let content = '';

    content += '<slot></slot>';

    if (this.allowDelete) {
      content += `
        <slot name="delete">
          <button collection-delete>Delete</button>
        </slot>
      `;
    }

    this.shadowDom.innerHTML = content;
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
