import {expect, fixture} from '@open-wc/testing';

import '../dist/bundle.js';

describe('onlinq-collection-entry', () => {
  it('has default shadow dom', async () => {
    const el = await fixture('<onlinq-collection-entry></onlinq-collection-entry>');

    expect(getComputedStyle(el.shadowRoot.querySelector('[data-move-up]')).display).to.equal('none');
    expect(getComputedStyle(el.shadowRoot.querySelector('[data-move-down]')).display).to.equal('none');
    expect(getComputedStyle(el.shadowRoot.querySelector('[data-delete]')).display).to.equal('none');
  });

  it('has "delete" block when allowDelete is set on collection', async () => {
    const collection = await fixture(`
      <onlinq-collection allow-delete>
        <onlinq-collection-entry></onlinq-collection-entry>
      </onlinq-collection>
    `);

    const el = collection.querySelector('onlinq-collection-entry');

    expect(getComputedStyle(el.shadowRoot.querySelector('[data-delete]')).display).to.equal('inline');
  });

  it('has "move-up" and "move-down" blocks when allowMove is set on collection', async () => {
    const collection = await fixture(`
      <onlinq-collection allow-move>
        <onlinq-collection-entry></onlinq-collection-entry>
      </onlinq-collection>
    `);

    const el = collection.querySelector('onlinq-collection-entry');

    expect(getComputedStyle(el.shadowRoot.querySelector('[data-move-up]')).display).to.equal('inline');
    expect(getComputedStyle(el.shadowRoot.querySelector('[data-move-down]')).display).to.equal('inline');
  });
});
