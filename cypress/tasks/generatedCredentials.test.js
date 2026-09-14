const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const tasks = require('./generatedCredentials');

function tempFolder(t) {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'generated-credentials-'));
  t.after(() => fs.rmSync(folder, { recursive: true, force: true }));
  return folder;
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
