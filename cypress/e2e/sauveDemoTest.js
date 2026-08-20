import loginPage from '../pages/LoginPage';
import inventoryPage from '../pages/InventoryPage';

describe('SauceDemo E2E Test Suite', () => {
  beforeEach(() => {
    loginPage.visit();
  });

  it('Gagal login dengan kredensial yang salah', () => {
    loginPage.login('locked_out_user', 'wrong_password');
    loginPage.errorMessage.should('be.visible')
      .and('contain', 'Username and password do not match');
  });

  it('Berhasil login dan menambahkan produk ke keranjang', () => {
    loginPage.login('standard_user', 'secret_sauce');
    
    // Verifikasi berada di halaman inventori
    cy.url().should('include', '/inventory.html');
    inventoryPage.title.should('have.text', 'Products');

    // Tambahkan item dan verifikasi keranjang belanja
    inventoryPage.addFirstItemToCart();
    inventoryPage.shoppingCartBadge.should('be.visible').and('have.text', '1');
  });
});