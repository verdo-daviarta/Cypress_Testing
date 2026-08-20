const { defineConfig } = require("cypress");

module.exports = defineConfig({
  // Konfigurasi global
  viewportWidth: 1280,
  viewportHeight: 720,
  video: false, 
  defaultCommandTimeout: 5000, 

  e2e: {
    setupNodeEvents(on, config) {
      // Tempat untuk menginisialisasi plugin (misal: Cypress Mochawesome Reporter)
      return config;
    },
    baseUrl: 'https://www.saucedemo.com',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', 
    retries: {
      runMode: 2, 
      openMode: 0, 
    },
  },
});