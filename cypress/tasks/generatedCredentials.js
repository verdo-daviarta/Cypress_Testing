const fs = require('node:fs');
const path = require('node:path');
const ExcelJS = require('exceljs');

module.exports = (folder) => ({
  async readLatestGeneratedCredentials() {
    if (!fs.existsSync(folder)) throw new Error('Folder downloads belum tersedia. Jalankan Generate Akun dahulu.');
    const files = fs.readdirSync(folder, { withFileTypes: true })
      .filter((entry) => entry.isFile() && /^DAFTAR GENERATE AKUN .+\.xlsx$/i.test(entry.name))
      .map((entry) => ({ name: entry.name, stat: fs.statSync(path.join(folder, entry.name)) }))
      .sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs || a.name.localeCompare(b.name));
    if (!files.length) throw new Error('File Excel Generate Akun tidak ditemukan di downloads.');
    if (files.length > 1 && files[0].stat.mtimeMs === files[1].stat.mtimeMs) {
      throw new Error('Ada beberapa file Generate Akun dengan waktu terbaru yang sama. Sisakan satu file terbaru.');
    }
    const latest = files[0];
    if (!latest.stat.size) throw new Error('File Generate Akun terbaru kosong. Tunggu download selesai.');
    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.readFile(path.join(folder, latest.name));
    } catch {
      throw new Error('File Generate Akun terbaru tidak dapat dibaca. Pastikan download Excel sudah selesai.');
    }

    // Header tidak selalu pada baris pertama (export saat ini memakai baris 5).
    for (const sheet of workbook.worksheets) {
      for (let rowNumber = 1; rowNumber <= sheet.rowCount; rowNumber += 1) {
        const row = sheet.getRow(rowNumber);
        const usernameColumns = [];
        const passwordColumns = [];
        row.eachCell((cell, column) => {
          const header = cell.text.trim().toLowerCase();
          if (header === 'username') usernameColumns.push(column);
          if (header === 'password') passwordColumns.push(column);
        });
        if (!usernameColumns.length || !passwordColumns.length) continue;
        if (usernameColumns.length !== 1 || passwordColumns.length !== 1) {
          throw new Error('Kolom Username/Password duplikat pada file Generate Akun.');
        }
        for (let accountRow = rowNumber + 1; accountRow <= sheet.rowCount; accountRow += 1) {
          const data = sheet.getRow(accountRow);
          if (!data.hasValues) continue;
          const username = data.getCell(usernameColumns[0]).text;
          const password = data.getCell(passwordColumns[0]).text;
          if (!username.trim() || !password.trim()) {
            throw new Error('Credential akun pertama tidak lengkap pada file Generate Akun terbaru.');
          }
          return { username, password };
        }
        throw new Error('File Generate Akun terbaru tidak memiliki baris akun.');
      }
    }
    throw new Error('Kolom Username dan Password tidak ditemukan pada file Generate Akun terbaru.');
  },
});
