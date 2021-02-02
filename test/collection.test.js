import {expect, fixture} from '@open-wc/testing';

import '../dist/onlinq-collection';

describe('onlinq-collection', () => {
  it('has default shadow dom', async () => {
    const el = await fixture('<onlinq-collection></onlinq-collection>');

    expect(getComputedStyle(el.shadowRoot.querySelector('[data-collection]')).display).to.equal('none');
    expect(getComputedStyle(el.shadowRoot.querySelector('[data-placeholder]')).display).to.equal('block');
    expect(getComputedStyle(el.shadowRoot.querySelector('[data-add]')).display).to.equal('none');
  });

  it('hides placeholder when entries are defined on initialization', async () => {
    const el = await fixture(`
      <onlinq-collection>
        <onlinq-collection-entry></onlinq-collection-entry>
      </onlinq-collection>
    `);

    expect(getComputedStyle(el.shadowRoot.querySelector('[data-collection]')).display).to.equal('block');
    expect(getComputedStyle(el.shadowRoot.querySelector('[data-placeholder]')).display).to.equal('none');
  });

  it('displays "add" block when the "allow-add" attribute is set', async () => {
    const el = await fixture('<onlinq-collection allow-add></onlinq-collection>');

    expect(getComputedStyle(el.shadowRoot.querySelector('[data-add]')).display).to.equal('inline');
  });
});
