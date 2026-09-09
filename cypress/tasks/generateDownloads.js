const fs = require('node:fs');
const path = require('node:path');

module.exports = (folder) => {
  const snapshot = () => {
    if (!fs.existsSync(folder)) return {};
    return Object.fromEntries(fs.readdirSync(folder).flatMap((name) => {
      const stat = fs.statSync(path.join(folder, name));
      return stat.isFile() ? [[name, `${stat.size}:${stat.mtimeMs}`]] : [];
    }));
  };

  return {
    snapshotGenerateDownloads: snapshot,
    async waitForGenerateDownload(sebelum) {
      const deadline = Date.now() + 60000;
      let previous = {};
      while (Date.now() < deadline) {
        const current = snapshot();
        const files = Object.keys(current).filter((name) =>
          !/\.(crdownload|part|tmp)$/i.test(name) &&
          current[name] !== sebelum[name] &&
          current[name] === previous[name] &&
          Number(current[name].split(':')[0]) > 0
        );
        if (files.length > 1) throw new Error('Beberapa file baru terdeteksi; unduhan Generate Akun ambigu.');
        if (files.length === 1) return path.join(folder, files[0]);
        previous = current;
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      throw new Error('Dokumen Generate Akun belum terunduh dalam 60 detik. Periksa hasil generate dan apakah unduhan dimulai.');
    },
  };
};
