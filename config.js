// config.js
require('dotenv').config();

const config = {
    port: process.env.PORT || 3000,
    googleScriptUrl: process.env.GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbxoXfyd3z-CYrsWvTbQ_pU0DuQq6IG23s4FwLmiSN5LwZn1XNGIZHBtiZi6PIGM1-4p/exec',
    corsEnabled: true,
    requestTimeout: 10000
};

module.exports = config;