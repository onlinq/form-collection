import {expect, fixture} from '@open-wc/testing';

import '../dist/onlinq-collection';

describe('onlinq-collection-entry', () => {
  it('shows default shadow dom', async () => {
    const collection = await fixture(`
      <onlinq-collection>
        <onlinq-collection-entry collection-index="0"></onlinq-collection-entry>
      </onlinq-collection>
    `);

    const el = collection.querySelector('onlinq-collection-entry');

    expect(getComputedStyle(el.shadowRoot.querySelector('[data-actions-container]')).display).to.equal('none');
    expect(getComputedStyle(el.shadowRoot.querySelector('[data-delete-container]')).display).to.equal('inline');
    expect(getComputedStyle(el.shadowRoot.querySelector('[data-move-container]')).display).to.equal('inline');
  });

  it('shows actions shadow dom', async () => {
    const collection = await fixture(`
      <onlinq-collection>
        <onlinq-collection-entry collection-index="0" actions></onlinq-collection-entry>
      </onlinq-collection>
    `);

    const el = collection.querySelector('onlinq-collection-entry');

    expect(getComputedStyle(el.shadowRoot.querySelector('[data-actions-container]')).display).to.equal('block');
  });

  it('shows "delete" block when deleting entries is allowed on collection', async () => {
    const collection = await fixture(`
      <onlinq-collection actionlist="delete">
        <onlinq-collection-entry collection-index="0"></onlinq-collection-entry>
      </onlinq-collection>
    `);

    const el = collection.querySelector('onlinq-collection-entry');

    expect(getComputedStyle(el.shadowRoot.querySelector('[data-delete-container]')).display).to.equal('inline');
  });

  it('doesn\'t show "delete" block when deleting entries isn\'t allowed on collection', async () => {
    const collection = await fixture(`
      <onlinq-collection actionlist="add,move">
        <onlinq-collection-entry collection-index="0"></onlinq-collection-entry>
      </onlinq-collection>
    `);

    const el = collection.querySelector('onlinq-collection-entry');

    expect(getComputedStyle(el.shadowRoot.querySelector('[data-delete-container]')).display).to.equal('none');
  });

  it('shows "move" block when moving entries is allowed on collection', async () => {
    const collection = await fixture(`
      <onlinq-collection actionlist="move">
        <onlinq-collection-entry collection-index="0"></onlinq-collection-entry>
      </onlinq-collection>
    `);

    const el = collection.querySelector('onlinq-collection-entry');

    expect(getComputedStyle(el.shadowRoot.querySelector('[data-move-container]')).display).to.equal('inline');
  });

  it('doesn\'t show "move" block when moving entries isn\'t allowed on collection', async () => {
    const collection = await fixture(`
      <onlinq-collection actionlist="add,delete">
        <onlinq-collection-entry collection-index="0"></onlinq-collection-entry>
      </onlinq-collection>
    `);

    const el = collection.querySelector('onlinq-collection-entry');

    expect(getComputedStyle(el.shadowRoot.querySelector('[data-move-container]')).display).to.equal('none');
  });

  it('updates index when moving', async () => {
    const collection = await fixture(`
      <onlinq-collection actionlist="move">
        <onlinq-collection-entry collection-index="0"><span data-collection-label>1</span></onlinq-collection-entry>
        <onlinq-collection-entry collection-index="1"><span data-collection-label>2</span></onlinq-collection-entry>
      </onlinq-collection>
    `);

    const el = collection.querySelector('onlinq-collection-entry[collection-index="0"]');

    collection.addEventListener('entryAdded', () => {
      expect(el.index).to.equal(1);
    });

    el.moveDown();
  });

  it('updates label when moving', async () => {
    const collection = await fixture(`
      <onlinq-collection actionlist="move">
        <onlinq-collection-entry collection-index="0"><span data-collection-label>1</span></onlinq-collection-entry>
        <onlinq-collection-entry collection-index="1"><span data-collection-label>2</span></onlinq-collection-entry>
      </onlinq-collection>
    `);

    const el = collection.querySelector('onlinq-collection-entry[collection-index="0"]');

    collection.addEventListener('entryAdded', () => {
      expect(el.querySelector('[data-collection-label]').innerHTML).to.equal('2');
    });

    el.moveDown();
  });
});
