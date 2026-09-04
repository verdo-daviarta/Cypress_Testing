class BahasaTambahKursusPage {
  login() {
    cy.visit('https://akademik-ba.kemhan.go.id/');

    const username = Cypress.env('KEMHAN_USERNAME');
    const password = Cypress.env('KEMHAN_PASSWORD');

    expect(username, 'KEMHAN_USERNAME').to.be.a('string').and.not.be.empty;
    expect(password, 'KEMHAN_PASSWORD').to.be.a('string').and.not.be.empty;

    cy.get('input[name="username"]', { timeout: 20000 })
      .should('be.visible')
      .clear()
      .type(username);

    cy.get('input[name="password"]', { timeout: 20000 })
      .should('be.visible')
      .clear()
      .type(password);

    cy.contains('button', /Login/, { timeout: 20000 })
      .should('be.visible')
      .click();

    this.verifyOnDashboard();
  }

  verifyOnDashboard() {
    cy.url({ timeout: 20000 }).should('include', '/dasbor');
    cy.get('h2.text-xl.font-bold', { timeout: 20000 })
      .should('be.visible')
      .and('contain.text', 'Selamat datang di Sistem Informasi Akademik');
  }

  aksesMenuKursus() {
    cy.get('aside a, aside button, aside [data-sidebar="menu-button"]', { timeout: 20000 })
      .filter(':visible')
      .then(($menuItems) => {
        const menuKursus = [...$menuItems].find((menuItem) =>
          menuItem.innerText.trim().toLowerCase() === 'kursus'
        );

        expect(menuKursus, "menu sidebar 'Kursus'").to.exist;
        cy.wrap(menuKursus).scrollIntoView().should('be.visible').click();
      });

    cy.url({ timeout: 20000 }).should('include', '/kursus');
    cy.get('main', { timeout: 20000 })
      .should('be.visible')
      .and('contain.text', 'Kursus');
  }

  tambahKursus() {
    cy.contains('main button, main [role="button"], main a', /Tambah/i, { timeout: 20000 })
      .should('be.visible')
      .click();

    this.namaKursusInput().should('be.visible');
  }

  inputNamaKursus(namaKursus) {
    this.namaKursusInput()
      .should('be.visible')
      .clear()
      .type(namaKursus)
      .should('have.value', namaKursus);
  }

  inputNamaBahasa(namaBahasa) {
    this.bahasaDropdown()
      .should('be.visible')
      .click();

    this.pilihOpsiDropdown(namaBahasa);

    this.bahasaDropdown().should('contain.text', namaBahasa);
  }

  pilihTingkat() {
    this.tingkatDropdown()
      .should('be.visible')
      .click();

    this.pilihOpsiDropdown('Elementary');

    this.tingkatDropdown().should('contain.text', 'Elementary');
  }

  bahasaDropdown() {
    return cy.get('button[role="combobox"]', { timeout: 20000 })
      .filter(':visible')
      .eq(0);
  }

  tingkatDropdown() {
    return cy.get('button[role="combobox"]', { timeout: 20000 })
      .filter(':visible')
      .eq(1);
  }

  pilihOpsiDropdown(namaOpsi) {
    cy.get('[role="listbox"]', { timeout: 20000 })
      .filter(':visible')
      .last()
      .contains('[role="option"]', namaOpsi, { matchCase: false })
      .scrollIntoView()
      .should('be.visible')
      .click();
  }

  inputDeskripsiKursus(deskripsiKursus) {
    cy.get('textarea', { timeout: 20000 })
      .filter(':visible')
      .first()
      .should('be.visible')
      .clear()
      .type(deskripsiKursus)
      .should('have.value', deskripsiKursus);
  }

  simpanKursus() {
    cy.contains('button, [role="button"]', /Simpan/, { timeout: 20000 })
      .filter(':visible')
      .first()
      .should('be.visible')
      .click();
  }

  verifikasiKursusBerhasilDibuat(namaKursus, namaBahasa) {
    cy.get('main', { timeout: 20000 })
      .should('be.visible')
      .should(($main) => {
        const kontenHalaman = $main.text();

        expect(kontenHalaman, 'nama kursus pada halaman Kursus')
          .to.include(namaKursus);
        expect(kontenHalaman, 'nama bahasa pada halaman Kursus')
          .to.include(namaBahasa);
      });
  }

  namaKursusInput() {
    return cy.get('input[data-slot="input"]', { timeout: 20000 })
      .filter(':visible')
      .first();
  }
}

export default new BahasaTambahKursusPage();
