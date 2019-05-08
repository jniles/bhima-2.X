/* global element, by, browser, protractor */
const chai = require('chai');

const { expect } = chai;

const EC = protractor.ExpectedConditions;

const helpers = require('../shared/helpers');

describe.skip('Tree Navigation', () => {
  it('toggles the tree open and closed', async () => {
    const nav = $('#expandnav');

    // the navigation starts hidden
    await browser.wait(EC.invisbilityOf(nav), 5000, 'Navigation is never invisible.');

    // click to expand
    await nav.click();

    // the navigation should become visible
    await browser.wait(EC.visibilityOf(nav), 5000, 'Navigation is never visible after click.');
  });

  it('remembers the currently selected node', async () => {
    await helpers.navigate('#/fiscal');

    let selected = element(by.css('.flex-tree')).$('.selected');
    await expect(selected.getAttribute('data-unit-key')).to.eventually.equal('TREE.FISCAL_YEAR');

    // trigger full page reload
    await browser.refresh();

    // assert that the node is visible again
    selected = $('.flex-tree .selected');
    await expect(selected.isPresent()).to.eventually.equal(true);
    await expect(selected.getAttribute('data-unit-key')).to.eventually.equal('TREE.FISCAL_YEAR');
  });

  it('toggles tree nodes open and closed', async () => {
    const node = $('[data-unit-key="TREE.PAYROLL"]');

    // expect payroll to be closed by default
    await expect(node.$('.fa-folder').isPresent()).to.eventually.equal(true);
    await expect(node.$('fa-folder-open').isPresent()).to.eventually.equal(false);

    // click to open
    await node.click();

    // the open/closed folder icon should be updated
    await expect(node.$('fa-folder-open').isPresent()).to.eventually.equal(true);
    await expect(node.$('fa-folder').isPresent()).to.eventually.equal(false);

    // toggle to close again
    await node.click();

    await expect(node.$('fa-folder-open').isPresent()).to.eventually.equal(false);
    await expect(node.$('fa-folder').isPresent()).to.eventually.equal(true);
  });
});
