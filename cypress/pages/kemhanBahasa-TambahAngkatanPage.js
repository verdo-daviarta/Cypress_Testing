class BahasaTambahAngkatanPage {
  login() {
    cy.visit('https://akademik-ba.kemhan.go.id/');

    const username = Cypress.env('KEMHAN_USERNAME');
    const password = Cypress.env('KEMHAN_PASSWORD');

    expect(username, 'KEMHAN_USERNAME').to.be.a('string').and.not.be.empty;
    expect(password, 'KEMHAN_PASSWORD').to.be.a('string').and.not.be.empty;

    cy.get('input[name="username"]', { timeout: 20000 })
      .should('be.visible')
      .clear()
      .type(username, { log: false });

    cy.get('input[name="password"]', { timeout: 20000 })
      .should('be.visible')
      .clear()
      .type(password, { log: false });

    cy.on('uncaught:exception', (error) => {
      const exceptionLoginDariSso =
        error.name === 'ReferenceError' &&
        error.message.includes('login is not defined');

      if (exceptionLoginDariSso) {
        return false;
      }

      return undefined;
    });

    cy.contains('button', /Login/, { timeout: 20000 })
      .should('be.visible')
      .click();
  }

  aksesMenuKursus() {
    cy.get('aside a, aside button, aside [data-sidebar="menu-button"]', { timeout: 60000 })
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

  lihatAngkatan(namaKursus, namaBahasa) {
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
          .find('a[href^="/kursus/"][href$="/angkatan"]')
          .should('have.length', 1)
          .and('be.visible')
          .click();
      });

    cy.location('pathname', { timeout: 20000 })
      .should('match', /^\/kursus\/\d+\/angkatan$/);
  }

  tambahAngkatan() {
    cy.contains('main button', /Tambah/, { timeout: 20000 })
      .should('have.length', 1)
      .and('be.visible')
      .click();

    this.namaAngkatanInput().should('be.visible');
  }

  namaAngkatanInput() {
    return cy.get('[role="dialog"] input[name="name"]', { timeout: 20000 });
  }

  inputTanggalMulai(tanggalMulai) {
    this.pilihTanggal('openDate', tanggalMulai);
  }

  inputTanggalAkhir(tanggalAkhir) {
    this.pilihTanggal('closeDate', tanggalAkhir);
  }

  // Nilai tanggal dari skenario menggunakan format YYYY-MM-DD.
  pilihTanggal(fieldId, tanggal) {
    expect(tanggal, 'tanggal dalam format YYYY-MM-DD')
      .to.match(/^\d{4}-\d{2}-\d{2}$/);
    const [tahun, bulan, hari] = tanggal.split('-').map(Number);
    const date = new Date(tahun, bulan - 1, hari);
    expect(
      date.getFullYear() === tahun &&
      date.getMonth() === bulan - 1 &&
      date.getDate() === hari,
      `tanggal valid: ${tanggal}`
    ).to.eq(true);

    const trigger = `button[id="${fieldId}"]`;
    cy.get(trigger).should('be.visible').click();
    // Native select kalender transparan (opacity: 0), tetapi tetap dapat dipilih.
    cy.get('select[aria-label="Choose the Year"]')
      .should('have.length', 1)
      .and('not.be.disabled')
      .select(String(tahun));
    cy.get('select[aria-label="Choose the Year"]')
      .should('have.value', String(tahun));
    cy.get('select[aria-label="Choose the Month"]')
      .should('have.length', 1)
      .and('not.be.disabled')
      .select(String(bulan - 1));
    cy.get('select[aria-label="Choose the Month"]')
      .should('have.value', String(bulan - 1));
    // Sel kalender memakai ISO; data-day pada tombol mengikuti locale browser.
    cy.get(`[role="gridcell"][data-day="${tanggal}"]`)
      .should('have.length', 1)
      .find('button')
      .should('have.length', 1)
      .and('be.visible')
      .and('not.be.disabled')
      .click();

    const tanggalTampil = `${String(hari).padStart(2, '0')}/${String(bulan).padStart(2, '0')}/${tahun}`;
    cy.get(trigger).should('have.text', tanggalTampil);
  }
  inputNamaAngkatan(namaAngkatan) {
    this.namaAngkatanInput()
      .should('be.visible')
      .clear()
      .type(namaAngkatan)
      .should('have.value', namaAngkatan);
  }
  
  simpanAngkatan() {
    cy.contains('[role="dialog"] button', /^Simpan$/, { timeout: 20000 })
      .should('have.length', 1)
      .and('be.visible')
      .click();
  }
}

export default new BahasaTambahAngkatanPage();
