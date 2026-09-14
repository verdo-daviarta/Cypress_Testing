const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: '151qby',
  downloadsFolder: 'cypress/downloads',
  // Pertahankan hasil download sebelumnya saat cypress run dimulai.
  trashAssetsBeforeRuns: false,
  // Konfigurasi global
  viewportWidth: 1280,
  viewportHeight: 720,
  video: false, 
  defaultCommandTimeout: 5000, 

  e2e: {
    supportFile: false,
    injectDocumentDomain: true,
    setupNodeEvents(on, config) {
      const path = require('node:path');
      const generateDownloads = require('./cypress/tasks/generateDownloads');
      const generatedCredentials = require('./cypress/tasks/generatedCredentials');
      const downloadsFolder = path.resolve(config.projectRoot, config.downloadsFolder);
      on('task', {
        ...generateDownloads(downloadsFolder),
        ...generatedCredentials(downloadsFolder),
      });
      // Tempat untuk menginisialisasi plugin (misal: Cypress Mochawesome Reporter)
      return config;
    },
    baseUrl: 'https://portal-badiklat.kemhan.go.id/',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', 
    retries: {
      runMode: 2, 
      openMode: 0, 
    },
  },
});
