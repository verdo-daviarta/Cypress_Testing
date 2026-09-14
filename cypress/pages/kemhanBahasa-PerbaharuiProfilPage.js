class KemhanBahasaPerbaharuiProfilPage {
  visit() {
    cy.visit('https://siswa-ba.kemhan.go.id/');
  }

  login() {
    // Akun pertama dari Excel Generate Akun terbaru, bukan credential admin di env.
    return cy.task('readLatestGeneratedCredentials', null, { log: false })
      .then(({ username, password }) => {
        cy.get('input[name="username"]', { timeout: 20000, log: false })
          .should('be.visible').clear({ log: false })
          .type(username, { log: false, parseSpecialCharSequences: false });

        cy.get('input[name="password"]', { timeout: 20000, log: false })
          .should('be.visible').clear({ log: false })
          .type(password, { log: false, parseSpecialCharSequences: false });

        return cy.get('input[type="submit"], button[type="submit"]', { timeout: 20000 })
          .should('be.visible').click();
      });
  }
  aksesMenuProfil() {
    cy.contains('aside button', /^Profil$/, { timeout: 50000 })
      .should('be.visible').click();
  }

  EditProfil() {
    cy.contains('main button', /^Edit$/, { timeout: 20000 })
      .should('be.visible')
      .click();

    cy.contains('main h2', /^Edit$/, { timeout: 20000 }).should('be.visible');
    cy.get('main input[id="name"]').should('be.visible').and('not.be.disabled');
  }

  inputField(id, value) {
    expect(value, id).to.be.a('string');
    const selector = `main input[id="${id}"]`;
    cy.get(selector).should('have.length', 1).should('be.visible')
      .and('not.be.disabled').clear({ log: false });
    if (value !== '') {
      cy.get(selector).type(value, { parseSpecialCharSequences: false, log: false });
    }
    return cy.get(selector, { log: false }).should(($input) => {
      expect($input.val() === value, `${id} sesuai input`).to.eq(true);
    });
  }

  pilihDropdown(id, value) {
    expect(value, id).to.be.a('string').and.not.be.empty;
    const selector = `main button[id="${id}"][role="combobox"]`;
    const text = new RegExp(`^${Cypress._.escapeRegExp(value)}$`);
    cy.get(selector, { timeout: 20000 }).should('have.length', 1)
      .should('be.visible').and('not.be.disabled').click();
    cy.get('[role="listbox"]').filter(':visible').should('have.length', 1)
      .find('[role="option"]').filter((_, option) => text.test(option.textContent.trim()))
      .should('have.length', 1).scrollIntoView().should('be.visible').click();
    return cy.get(selector).should('contain.text', value);
  }

  inputNamaPengguna(namaPengguna) { return this.inputField('username', namaPengguna); }
  inputEmail(email) { return this.inputField('email', email); }
  inputKataSandi(kataSandi) { return this.inputField('password', kataSandi); }
  inputNama(nama) { return this.inputField('name', nama); }
  pilihKategori(kategori) { return this.pilihDropdown('category', kategori); }
  pilihPangkat(pangkat) { return this.pilihDropdown('rank', pangkat); }

  pilihMatra(matra) {
    expect(matra, 'matra').to.be.oneOf(['AD', 'AL', 'AU', 'PNS']);
    const text = new RegExp(`^${matra}$`);
    return cy.contains('main label', text).invoke('attr', 'for').then((id) => {
      expect(id, 'id radio Matra').to.be.a('string').and.not.be.empty;
      cy.get(`main button[id="${id}"][role="radio"]`).should('be.visible').click();
      return cy.get(`main button[id="${id}"][role="radio"]`)
        .should('have.attr', 'aria-checked', 'true');
    });
  }

  inputNrp(nrp) { return this.inputField('nrp', nrp); }
  inputPosisi(posisi) { return this.inputField('position', posisi); }
  inputUnitKerja(unitKerja) { return this.inputField('workUnit', unitKerja); }
  inputNomorTeleponKantor(nomorTeleponKantor) { return this.inputField('phoneWork', nomorTeleponKantor); }
  inputNomorTeleponRumah(nomorTeleponRumah) { return this.inputField('phoneHome', nomorTeleponRumah); }
  pilihBahasaPengajaran(bahasaPengajaran) { return this.pilihDropdown('primaryLanguage', bahasaPengajaran); }
  pilihMinatKursus(minatKursus) { return this.pilihDropdown('courseIntention', minatKursus); }
  inputInstansi(instansi) { return this.inputField('institution', instansi); }
  inputNomorTelepon(nomorTelepon) { return this.inputField('phoneCall', nomorTelepon); }

  // Field yang tidak diberikan tetap memakai nilai profil saat ini.
  // Nomor telepon dan NRP berupa string agar angka nol di depan tetap utuh.
  isiProfil(dataProfil) {
    const fields = {
      namaPengguna: 'inputNamaPengguna', email: 'inputEmail', kataSandi: 'inputKataSandi',
      nama: 'inputNama', kategori: 'pilihKategori', pangkat: 'pilihPangkat', matra: 'pilihMatra',
      nrp: 'inputNrp', posisi: 'inputPosisi', unitKerja: 'inputUnitKerja',
      nomorTeleponKantor: 'inputNomorTeleponKantor', nomorTeleponRumah: 'inputNomorTeleponRumah',
      bahasaPengajaran: 'pilihBahasaPengajaran', minatKursus: 'pilihMinatKursus',
      instansi: 'inputInstansi', nomorTelepon: 'inputNomorTelepon',
    };
    expect(dataProfil, 'dataProfil').to.be.an('object');
    Object.keys(dataProfil).forEach((key) => {
      expect(fields, `field profil: ${key}`).to.have.property(key);
    });
    Object.entries(fields).forEach(([key, method]) => {
      if (dataProfil[key] !== undefined) this[method](dataProfil[key]);
    });
  }

  simpan() {
    return cy.contains('main button', /^Simpan$/).should('be.visible')
      .and('not.be.disabled').click();
  }

  batal() {
    return cy.contains('main button', /^Batal$/).should('be.visible').click();
  }

  verifikasiProfilTersimpan(nama, email) {
    // Jangan anggap klik Simpan saja sebagai bukti data tersimpan.
    cy.location('pathname', { timeout: 20000 })
      .should('match', /^\/calon\/detil\/[^/]+\/?$/);
    cy.reload();
    this.EditProfil();
    cy.get('main input[id="name"]').should('have.value', nama);
    cy.get('main input[id="email"]').should('have.value', email);
    this.batal();
  }
}

export default new KemhanBahasaPerbaharuiProfilPage();
