const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const ExcelJS = require('exceljs');
const tasks = require('./generatedCredentials');

function tempFolder(t) {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'generated-credentials-'));
  t.after(() => fs.rmSync(folder, { recursive: true, force: true }));
  return folder;
}

async function writeGeneratedAccount(folder, fileName, namaSiswa, modifiedTime) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Akun');
  sheet.addRow(['No', 'Nama', 'Username', 'Password']);
  sheet.addRow([1, namaSiswa, `${namaSiswa}-user`, 'test-password']);
  const file = path.join(folder, fileName);
  await workbook.xlsx.writeFile(file);
  fs.utimesSync(file, modifiedTime, modifiedTime);
  return file;
}

test('folder tidak tersedia memberi pesan yang jelas', async (t) => {
  const folder = path.join(tempFolder(t), 'missing');
  await assert.rejects(tasks(folder).readLatestGeneratedCredentials(), /Folder downloads belum tersedia/);
});

test('abaikan file lain dan download parsial', async (t) => {
  const folder = tempFolder(t);
  fs.writeFileSync(path.join(folder, 'other.xlsx'), 'not an account export');
  fs.writeFileSync(path.join(folder, 'DAFTAR GENERATE AKUN TEST.xlsx.crdownload'), 'partial');
  await assert.rejects(tasks(folder).readLatestGeneratedCredentials(), /tidak ditemukan/);
});

test('pilih berdasarkan mtime, jangan fallback saat file terbaru kosong', async (t) => {
  const folder = tempFolder(t);
  const old = path.join(folder, 'DAFTAR GENERATE AKUN Z.xlsx');
  const latest = path.join(folder, 'DAFTAR GENERATE AKUN A.xlsx');
  fs.writeFileSync(old, 'invalid old file');
  fs.writeFileSync(latest, '');
  fs.utimesSync(old, 100, 100);
  fs.utimesSync(latest, 200, 200);
  await assert.rejects(tasks(folder).readLatestGeneratedCredentials(), /terbaru kosong/);
});

test('file rusak tidak membocorkan isi atau error parser', async (t) => {
  const folder = tempFolder(t);
  fs.writeFileSync(path.join(folder, 'DAFTAR GENERATE AKUN TEST.xlsx'), 'private test content');
  await assert.rejects(tasks(folder).readLatestGeneratedCredentials(), {
    message: 'File Generate Akun terbaru tidak dapat dibaca. Pastikan download Excel sudah selesai.',
  });
});

test('tolak dua file dengan waktu terbaru identik', async (t) => {
  const folder = tempFolder(t);
  for (const name of ['A', 'B']) {
    const file = path.join(folder, `DAFTAR GENERATE AKUN ${name}.xlsx`);
    fs.writeFileSync(file, 'test');
    fs.utimesSync(file, 100, 100);
  }
  await assert.rejects(tasks(folder).readLatestGeneratedCredentials(), /waktu terbaru yang sama/);
});

test('baca nama siswa dari akun pertama file Excel terbaru', async (t) => {
  const folder = tempFolder(t);
  await writeGeneratedAccount(folder, 'DAFTAR GENERATE AKUN TEST.xlsx', 'Siswa Baru 001', 100);
  const result = await tasks(folder).readLatestGeneratedCredentials();
  assert.equal(result.name, 'Siswa Baru 001');
  assert.equal(result.sourceFile, 'DAFTAR GENERATE AKUN TEST.xlsx');
});

test('nama profil hanya berlaku untuk file Generate Akun sumber yang sama', async (t) => {
  const folder = tempFolder(t);
  await writeGeneratedAccount(folder, 'DAFTAR GENERATE AKUN LAMA.xlsx', 'Siswa Lama', 100);
  const generatedTasks = tasks(folder);
  const source = await generatedTasks.readLatestGeneratedCredentials();
  assert.equal(generatedTasks.saveLatestUpdatedStudent({
    namaSiswa: source.name,
    sourceFile: source.sourceFile,
    sourceModified: source.sourceModified,
  }), true);
  assert.equal(generatedTasks.readLatestUpdatedStudentName(), 'Siswa Lama');

  await writeGeneratedAccount(folder, 'DAFTAR GENERATE AKUN BARU.xlsx', 'Siswa Baru', 200);
  assert.throws(
    () => generatedTasks.readLatestUpdatedStudentName(),
    /Ada hasil Generate Akun yang lebih baru/,
  );
});
