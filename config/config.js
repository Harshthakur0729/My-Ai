const dotenv = require('dotenv');
dotenv.config();
const _config ={
    PORT: process.env.PORT,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
}

module.exports = _config;