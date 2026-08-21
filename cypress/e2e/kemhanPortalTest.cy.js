import kemhanLoginPage from '../pages/kemhanLoginPage';


describe('Masuk Portal Badiklat Kemhan', () => {
  it('Berhasil memuat halaman utama portal', () => {
    kemhanLoginPage.visit();
    
    // Asersi dasar: Memastikan kita berada di URL yang benar
    cy.url().should('include', 'portal-badiklat.kemhan.go.id');
    
    // Asersi dasar: Memastikan website merespons dan tidak down
    // (Cypress otomatis akan gagal jika halaman mengembalikan error 404/500)
    cy.document().should('have.property', 'charset').and('eq', 'UTF-8');
  });
});

describe('Login ke Portal Badiklat Kemhan', () => {
  it('Berhasil login dengan kredensial yang valid', () => {
    kemhanLoginPage.visit();
    const username = Cypress.env('KEMHAN_USERNAME');
    const password = Cypress.env('KEMHAN_PASSWORD');

    expect(username, 'KEMHAN_USERNAME').to.be.a('string').and.not.be.empty;
    expect(password, 'KEMHAN_PASSWORD').to.be.a('string').and.not.be.empty;

    kemhanLoginPage.login(username, password);
    cy.url().should('include', '/pusdiklat'); 
    });
})