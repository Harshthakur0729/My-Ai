const express = require('express');
const app = express();
const config = require('./config/config.js');
const generateContent = require('./ai.js');
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let isAuthenticated = false;
function isLoggedIn(req, res, next) {
    if (isAuthenticated) {
        return next();
    }
    res.redirect('/');
}

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/login', (req, res) => {
    const { name, password } = req.body;
    if (name === "harsh" && password === "harsh") {
        isAuthenticated = true;
        res.redirect('/ai');
    } else {
        console.log('Invalid login attempt');
        res.redirect('/');
    }
});

app.get("/ai", isLoggedIn, (req, res) => {
    res.render('ai');
});

app.post("/ai", isLoggedIn, async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }
        const response = await generateContent(prompt);
        res.status(200).json({ response: response });
    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/logout', isLoggedIn, (req, res) => {
    isAuthenticated = false;
    res.redirect('/');
});

app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});
