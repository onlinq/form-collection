import {expect, fixture} from '@open-wc/testing';

import '../dist/bundle.js';

describe('onlinq-collection', () => {
  it('has default shadow dom', async () => {
    const el = await fixture('<onlinq-collection></onlinq-collection>');

    expect(el).shadowDom.to.equal(`
      <slot name="collection">
        No entries
      </slot>
    `);
  });

  it('has shadow dom containing "add" slot when "allow-add" attribute is set', async () => {
    const el = await fixture('<onlinq-collection allow-add></onlinq-collection>');

    expect(el).shadowDom.to.equal(`
      <slot name="collection">
        No entries
      </slot>
      <slot name="add">
        <button collection-add="">
          Add
        </button>
      </slot>
    `);
  });
});
