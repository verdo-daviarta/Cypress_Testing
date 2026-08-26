const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: '151qby',
  // Konfigurasi global
  viewportWidth: 1280,
  viewportHeight: 720,
  video: false, 
  defaultCommandTimeout: 5000, 

  e2e: {
    supportFile: false,
    injectDocumentDomain: true,
    setupNodeEvents(on, config) {
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