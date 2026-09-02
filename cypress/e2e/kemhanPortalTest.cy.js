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


// Skenario untuk menguji akses ke halaman kemhanTekfunghanSiswa

it('kemhanTekfunghanSiswa', function() {
  cy.visit('siswa-tf.kemhan.go.id')
  // Page URL changed.
  cy.url()
    .should('eq', 'https://siswa-tf.kemhan.go.id/check-nrp')
  // The welcome message "Selamat Datang Di Sistem Informasi Siswa Pusdiklat Tekfunghan Badiklat Kemhan" is visible.
  cy.get('h3.mb-5')
    .should('contain.text', 'Selamat Datang Di Sistem Informasi Siswa Pusdiklat Tekfunghan Badiklat')
  // The NRP/NIP input field is present.
  cy.get('[name="registrationNumber"]')
    .should('have.value', '')
  // The "ajukan Pengaduan Duplikasi Akun sekarang" link is visible.
  cy.get('a.hover\\:text-blue-600')
    .should(($el) => {
      expect($el).to.have.attr('href', '/pengajuan-pengaduan')
      expect($el).to.contain.text('ajukan Pengaduan Duplikasi Akun sekarang')
    })
  // The "Masuk" button is visible.
  cy.get('div.justify-end')
    .should('contain.text', 'Masuk')
  // The "Kirim" button is present and currently disabled.
  cy.get('button.btn-disabled')
    .should(($el) => {
      expect($el).to.have.attr('disabled')
      expect($el).to.contain.text('Kirim')
    })
  
  
  cy.get('button.btn-size-lg').click();
  // The username input field is present in the login form.
  cy.get('[name="username"]')
    .should('have.value', '')
  // The login button is present in the form.
  cy.get('[name="login"]')
    .should('contain.text', 'LOGIN')
  
});