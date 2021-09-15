import {expect, fixture} from '@open-wc/testing';

import '../dist/onlinq-collection';

describe('onlinq-collection', () => {
  it('has default shadow dom', async () => {
    const el = await fixture('<onlinq-collection></onlinq-collection>');

    expect(getComputedStyle(el.shadowRoot.querySelector('[data-collection]')).display).to.equal('none');
    expect(getComputedStyle(el.shadowRoot.querySelector('[data-placeholder]')).display).to.equal('block');
    expect(getComputedStyle(el.shadowRoot.querySelector('[data-add]')).display).to.equal('none');
  });

  it('returns null if no name is set', async () => {
    const el = await fixture('<onlinq-collection></onlinq-collection>');

    expect(el.name).to.equal(null);
    expect(el.getAttribute('name')).to.equal(null);
  });

  it('has a name', async () => {
    const el = await fixture('<onlinq-collection name="named-collection"></onlinq-collection>');

    expect(el.name).to.equal('named-collection');

    el.name = 'renamed-collection';

    expect(el.name).to.equal('renamed-collection');
    expect(el.getAttribute('name')).to.equal('renamed-collection');
  });

  it('shows placeholder when no entries are defined on initialization', async () => {
    const el = await fixture(`<onlinq-collection></onlinq-collection>`);

    expect(getComputedStyle(el.shadowRoot.querySelector('[data-collection]')).display).to.equal('none');
    expect(getComputedStyle(el.shadowRoot.querySelector('[data-placeholder]')).display).to.equal('block');
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

  it('properly updates nextIndex', async () => {
    const el = await fixture(`
      <onlinq-collection allow-add allow-delete>
        <template collection-prototype></template>
      </onlinq-collection>
    `);

    expect(el.nextIndex).to.equal(0);

    const entry = el.addEntry();

    expect(el.nextIndex).to.equal(1);

    entry.deleteEntry();

    expect(el.nextIndex).to.equal(0);
  });

  it('prevents creating entries when the "allow-add" attribute is not set', async () => {
    const el = await fixture(`
      <onlinq-collection>
        <template collection-prototype></template>
      </onlinq-collection>
    `);

    const entry = el.addEntry();

    expect(entry).to.equal(null);
    expect(el.entries.length).to.equal(0);
  });

  it('prevents removing entries when the "allow-delete" attribute is not set', async () => {
    const el = await fixture(`
      <onlinq-collection>
        <template collection-prototype></template>
        <onlinq-collection-entry collection-index="0"></onlinq-collection-entry>
      </onlinq-collection>
    `);

    el.deleteEntry(0);

    expect(el.querySelector('onlinq-collection-entry')).to.not.equal(null);
    expect(el.entries.length).to.equal(1);
  });

  it('prevents creating more entries than specified by "max" attribute', async () => {
    const el = await fixture(`
      <onlinq-collection allow-add max="3">
        <template collection-prototype></template>
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
      <onlinq-collection allow-delete min="3">
        <template collection-prototype></template>
        <onlinq-collection-entry collection-index="0"></onlinq-collection-entry>
        <onlinq-collection-entry collection-index="1"></onlinq-collection-entry>
        <onlinq-collection-entry collection-index="2"></onlinq-collection-entry>
      </onlinq-collection>
    `);

    el.deleteEntry(0);

    expect(el.entries.length).to.equal(3);
  });
});
