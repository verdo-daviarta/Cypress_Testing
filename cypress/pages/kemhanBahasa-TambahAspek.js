class BahasaTambahAspekPage {
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

  lihatAspek(namaKursus, namaBahasa) {
    const cocokDenganKursusDanBahasa = (row) => {
      const kolom = row.querySelectorAll('td');
      const kursus = kolom[1]?.innerText.replace(/\s+/g, ' ').trim();
      const bahasa = kolom[2]?.innerText.replace(/\s+/g, ' ').trim();

      return kursus === namaKursus && bahasa === namaBahasa;
    };

    cy.get('main table tbody tr', { timeout: 20000 })
      .should(($rows) => {
        const barisYangSesuai = [...$rows].filter(cocokDenganKursusDanBahasa);

        expect(
          barisYangSesuai,
          `baris Kursus "${namaKursus}" dengan Bahasa "${namaBahasa}"`
        ).to.have.length(1);
      })
      .then(($rows) => {
        const barisKursus = [...$rows].find(cocokDenganKursusDanBahasa);

        cy.wrap(barisKursus)
          .find('a[href^="/kursus/"][href$="/aspek"]')
          .should('have.length', 1)
          .and('be.visible')
          .click();
      });

    cy.location('pathname', { timeout: 20000 })
      .should('match', /^\/kursus\/\d+\/aspek$/);
  }

  tambahAspek() {
    cy.get('main a[href^="/kursus/"][href$="/aspek/tambah"]', { timeout: 20000 })
      .should('have.length', 1)
      .and('be.visible')
      .click();

    this.namaAspekInput().should('be.visible');
  }

  inputNamaAspek(namaAspek) {
    this.namaAspekInput()
      .should('be.visible')
      .clear()
      .type(namaAspek)
      .should('have.value', namaAspek);
  }

  inputJumlahBobot(jumlahBobot) {
    cy.get('main input[name="weight"]', { timeout: 20000 })
      .should('have.length', 1)
      .and('be.visible')
      .clear()
      .type(String(jumlahBobot))
      .should('have.value', String(jumlahBobot));
  }

  tambahBarisSubjek() {
    cy.contains('main button[type="button"]', /^Add$/, { timeout: 20000 })
      .should('have.length', 1)
      .and('be.visible')
      .click();

    this.bobotSubjekInput().should('be.visible');
  }

  pilihSubjek(namaSubjek) {
    this.subjekDropdown()
      .should('be.visible')
      .click();

    cy.get('input[data-slot="command-input"][placeholder="Cari Subjek"]', {
      timeout: 20000,
    })
      .filter(':visible')
      .should('have.length', 1)
      .clear()
      .type(namaSubjek);

    cy.get('[role="option"][data-slot="command-item"]', { timeout: 20000 })
      .filter((_, option) => option.innerText.trim() === namaSubjek)
      .should('have.length', 1)
      .scrollIntoView()
      .click();

    this.subjekDropdown()
      .should('contain.text', namaSubjek);
  }

  inputBobotSubjek(bobotSubjek) {
    this.bobotSubjekInput()
      .should('be.visible')
      .clear()
      .type(String(bobotSubjek))
      .should('have.value', String(bobotSubjek));
  }

  inputTotalJP(totalJP) {
    cy.get('main input[name="subjects[0].numJp"]', { timeout: 20000 })
      .should('have.length', 1)
      .and('be.visible')
      .clear()
      .type(String(totalJP))
      .should('have.value', String(totalJP));
  }

  simpanAspek() {
    cy.contains('main button', /^Simpan$/, { timeout: 20000 })
      .should('have.length', 1)
      .and('be.visible')
      .click();
  }

  namaAspekInput() {
    return cy.get('main input[name="name"]', { timeout: 20000 })
      .should('have.length', 1);
  }

  bobotSubjekInput() {
    return cy.get('main input[name="subjects[0].numHn"]', { timeout: 20000 })
      .should('have.length', 1);
  }

  subjekDropdown() {
    return this.bobotSubjekInput()
      .closest('tr')
      .find('button[role="combobox"][data-slot="popover-trigger"]')
      .should('have.length', 1);
  }
}

export default new BahasaTambahAspekPage();
