class InventoryPage {
  get title() { return cy.get('.title'); }
  get inventoryItems() { return cy.get('.inventory_item'); }
  get shoppingCartBadge() { return cy.get('.shopping_cart_badge'); }

  addFirstItemToCart() {
    this.inventoryItems.first().find('button').click();
  }
}
export default new InventoryPage();