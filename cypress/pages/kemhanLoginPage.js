class KemhanLoginPage {
  visit() {
    // KUNCI 1: Kita visit halaman portalnya, dan biarkan sistem melempar kita ke SSO
    cy.visit('https://portal-badiklat.kemhan.go.id/pusdiklat');
  }

  login(username, password) {
    // visit() sudah mengikuti redirect ke SSO, sehingga origin aktif adalah SSO.
    cy.get('input[name="username"]').clear().type(username);
    cy.get('input[name="password"]').clear().type(password);
    cy.get('input[type="submit"], button[type="submit"]').click();
  }
}

export default new KemhanLoginPage();