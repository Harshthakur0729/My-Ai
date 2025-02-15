const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("./config/config");
const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
});
async function generateContent(prompt) {
    const result = await model.generateContent(prompt);
    return result.response.text()
}
module.exports = generateContent;