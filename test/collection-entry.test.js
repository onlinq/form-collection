import {expect, fixture} from '@open-wc/testing';

import '../dist/onlinq-collection';

describe('onlinq-collection-entry', () => {
  it('shows default shadow dom', async () => {
    const el = await fixture('<onlinq-collection-entry></onlinq-collection-entry>');

    expect(getComputedStyle(el.shadowRoot.querySelector('[data-actions-container]')).display).to.equal('block');
    expect(getComputedStyle(el.shadowRoot.querySelector('[data-delete-container]')).display).to.equal('inline');
    expect(getComputedStyle(el.shadowRoot.querySelector('[data-move-container]')).display).to.equal('inline');
  });

  it('doesn\'t show "actions" block when "noactions" is set.', async () => {
    const el = await fixture('<onlinq-collection-entry actions="noactions"></onlinq-collection-entry>');

    expect(getComputedStyle(el.shadowRoot.querySelector('[data-actions-container]')).display).to.equal('none');
  });

  it('shows "delete" block when deleting entries is allowed on collection', async () => {
    const collection = await fixture(`
      <onlinq-collection actions="delete">
        <onlinq-collection-entry></onlinq-collection-entry>
      </onlinq-collection>
    `);

    const el = collection.querySelector('onlinq-collection-entry');

    expect(getComputedStyle(el.shadowRoot.querySelector('[data-delete-container]')).display).to.equal('inline');
  });

  it('doesn\'t show "delete" block when deleting entries isn\'t allowed on collection', async () => {
    const collection = await fixture(`
      <onlinq-collection actions="noactions">
        <onlinq-collection-entry></onlinq-collection-entry>
      </onlinq-collection>
    `);

    const el = collection.querySelector('onlinq-collection-entry');

    expect(getComputedStyle(el.shadowRoot.querySelector('[data-delete-container]')).display).to.equal('none');
  });

  it('shows "move" block when moving entries is allowed on collection', async () => {
    const collection = await fixture(`
      <onlinq-collection allow-move>
        <onlinq-collection-entry></onlinq-collection-entry>
      </onlinq-collection>
    `);

    const el = collection.querySelector('onlinq-collection-entry');

    expect(getComputedStyle(el.shadowRoot.querySelector('[data-move-container]')).display).to.equal('inline');
  });

  it('doesn\'t show "move" block when moving entries isn\'t allowed on collection', async () => {
    const collection = await fixture(`
      <onlinq-collection actions="noactions">
        <onlinq-collection-entry></onlinq-collection-entry>
      </onlinq-collection>
    `);

    const el = collection.querySelector('onlinq-collection-entry');

    expect(getComputedStyle(el.shadowRoot.querySelector('[data-move-container]')).display).to.equal('none');
  });
});
