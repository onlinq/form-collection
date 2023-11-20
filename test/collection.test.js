import {expect, fixture} from '@open-wc/testing';

import '../dist/onlinq-collection';

describe('onlinq-collection', () => {
  it('shows default shadow dom', async () => {
    const el = await fixture('<onlinq-collection></onlinq-collection>');

    expect(getComputedStyle(el.shadowRoot.querySelector('[data-actions-container]')).display).to.equal('none');
    expect(getComputedStyle(el.shadowRoot.querySelector('[data-add-container]')).display).to.equal('inline');
    expect(getComputedStyle(el.shadowRoot.querySelector('[data-collection-container]')).display).to.equal('none');
    expect(getComputedStyle(el.shadowRoot.querySelector('[data-placeholder-container]')).display).to.equal('block');
  });

  it('shows actions shadow dom', async () => {
    const el = await fixture('<onlinq-collection actions></onlinq-collection>');

    expect(getComputedStyle(el.shadowRoot.querySelector('[data-actions-container]')).display).to.equal('block');
  });

  it('name property returns null if no name is set', async () => {
    const el = await fixture('<onlinq-collection></onlinq-collection>');

    expect(el.name).to.equal(null);
    expect(el.getAttribute('name')).to.equal(null);
  });

  it('name property is synchronized with name attribute', async () => {
    const el = await fixture('<onlinq-collection name="named-collection"></onlinq-collection>');

    expect(el.name).to.equal('named-collection');

    el.name = 'renamed-collection';

    expect(el.name).to.equal('renamed-collection');
    expect(el.getAttribute('name')).to.equal('renamed-collection');
  });

  it('shows placeholder when no entries are defined on initialization', async () => {
    const el = await fixture(`<onlinq-collection></onlinq-collection>`);

    expect(getComputedStyle(el.shadowRoot.querySelector('[data-collection-container]')).display).to.equal('none');
    expect(getComputedStyle(el.shadowRoot.querySelector('[data-placeholder-container]')).display).to.equal('block');
  });

  it('shows entries when entries are defined on initialization', async () => {
    const el = await fixture(`
      <onlinq-collection>
        <onlinq-collection-entry></onlinq-collection-entry>
      </onlinq-collection>
    `);

    expect(getComputedStyle(el.shadowRoot.querySelector('[data-collection-container]')).display).to.equal('block');
    expect(getComputedStyle(el.shadowRoot.querySelector('[data-placeholder-container]')).display).to.equal('none');
  });

  it('shows "add" block when adding entries is allowed', async () => {
    const el = await fixture('<onlinq-collection actionlist="add"></onlinq-collection>');

    expect(getComputedStyle(el.shadowRoot.querySelector('[data-add-container]')).display).to.equal('inline');
  });

  it('doesn\'t show "add" block when adding entries is not allowed', async () => {
    const el = await fixture('<onlinq-collection actions actionlist="move,delete"></onlinq-collection>');

    expect(getComputedStyle(el.shadowRoot.querySelector('[data-add-container]')).display).to.equal('none');
  });

  it('adds new entries', async () => {
    const el = await fixture(`
      <onlinq-collection actionlist="add">
        <template data-collection-prototype></template>
      </onlinq-collection>
    `);

    const entry = el.addEntry();

    expect(entry).to.not.equal(null);
  });

  it('removes entries', async () => {
    const el = await fixture(`
      <onlinq-collection actionlist="delete">
        <onlinq-collection-entry collection-index="0"></onlinq-collection-entry>
      </onlinq-collection>
    `);

    el.deleteEntry(0);

    el.addEventListener('entryRemoved', () => {
      expect(el.entries.length).to.equal(0);
    });
  });

  it('properly updates nextIndex', async () => {
    const el = await fixture(`
      <onlinq-collection actionlist="add">
        <template data-collection-prototype></template>
      </onlinq-collection>
    `);

    expect(el.nextIndex).to.equal(0);

    el.addEventListener('entryAdded', () => {
      expect(el.nextIndex).to.equal(1);
    });

    const entry = el.addEntry();

    el.addEventListener('entryRemoved', () => {
      expect(el.nextIndex).to.equal(0);
    });

    entry.deleteEntry();
  });

  it('prevents creating entries when adding entries isn\'t allowed', async () => {
    const el = await fixture(`
      <onlinq-collection actionlist="move,delete">
        <template data-collection-prototype></template>
      </onlinq-collection>
    `);

    const entry = el.addEntry();

    expect(entry).to.equal(null);
    expect(el.entries.length).to.equal(0);
  });

  it('prevents removing entries when deleting entries isn\'t allowed', async () => {
    const el = await fixture(`
      <onlinq-collection actionlist="add,move">
        <template data-collection-prototype></template>
        <onlinq-collection-entry collection-index="0"></onlinq-collection-entry>
      </onlinq-collection>
    `);

    el.deleteEntry(0);

    expect(el.querySelector('onlinq-collection-entry')).to.not.equal(null);
    expect(el.entries.length).to.equal(1);
  });

  it('prevents creating more entries than specified by "max" attribute', async () => {
    const el = await fixture(`
      <onlinq-collection max="3">
        <template data-collection-prototype></template>
        <onlinq-collection-entry collection-index="0"></onlinq-collection-entry>
        <onlinq-collection-entry collection-index="1"></onlinq-collection-entry>
        <onlinq-collection-entry collection-index="2"></onlinq-collection-entry>
      </onlinq-collection>
    `);

    const entry = el.addEntry();

    expect(entry).to.equal(null);
    expect(el.entries.length).to.equal(3);
  });

  it('prevents removing entries if the current count is lower than the "min" attribute', async () => {
    const el = await fixture(`
      <onlinq-collection min="3">
        <template data-collection-prototype></template>
        <onlinq-collection-entry collection-index="0"></onlinq-collection-entry>
      </onlinq-collection>
    `);

    el.deleteEntry(0);

    expect(el.entries.length).to.equal(1);
  });
});
