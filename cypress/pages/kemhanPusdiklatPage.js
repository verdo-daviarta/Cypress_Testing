class KemhanPusdiklatPage {
  verifyOnDashboard() {
    cy.origin('https://portal-badiklat.kemhan.go.id', () => {
      cy.url().should('include', '/pusdiklat');
    });
  }

  verifyTautanAplikasi(namaAplikasi) {
    cy.origin(
      'https://portal-badiklat.kemhan.go.id',
      { args: { namaAplikasi } },
      ({ namaAplikasi }) => {
        cy.contains('a', namaAplikasi)
          .invoke('attr', 'href')
          .should('match', /^https?:\/\//)
          .then((urlTujuan) => {
            cy.request({
              url: urlTujuan,
              failOnStatusCode: false
            }).then((response) => {
              expect(response.status).to.eq(
                200,
                `Gagal: Server aplikasi ${namaAplikasi} merespons dengan status ${response.status}`
              );
            });
          });
      });
  }
}
export default new KemhanPusdiklatPage();