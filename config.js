// config.js
require('dotenv').config();

const config = {
    port: process.env.PORT || 3000,
    googleScriptUrl: process.env.GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbxZLzsQOGr4ttwshKPjkp3LUkj5RYLaRdJIOGItirYjetBtN-3in3FFN__2WeMb73B7wg/exec',
    corsEnabled: true,
    requestTimeout: 10000
};

module.exports = config;