const { defineConfig } = require("cypress");

module.exports = defineConfig({
  //desabilitando segurança do chrome devido ao preenchimento do cartão de crédito
  chromeWebSecurity: false,
  e2e: {
    baseUrl: 'https://notes-serverless-app.com',
    env: {
      viewportWidthBreakpoint: 768,
    },    
    defaultCommandTimeout: 60000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
