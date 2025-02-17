const express = require('express');
const app = express();
const config = require('./config/config.js');
const generateContent = require('./ai.js');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let isAuthenticated = false;  // This variable tracks if the user is authenticated

// Middleware to check if the user is logged in
function isLoggedIn(req, res, next) {
    if (isAuthenticated) {
        return next();
    }
    res.redirect('/');  // Redirect to the login page if not authenticated
}

app.get('/', (req, res) => {
    res.render('index');  // Render the login page
});

app.post('/login', (req, res) => {
    const { name, password } = req.body;
    if (name === "harsh" && password === "harsh") {
        isAuthenticated = true;  // Set the authentication state to true
        res.redirect('/ai');  // Redirect to the AI page if login is successful
    } else {
        console.log('Invalid login attempt');
        res.redirect('/');  // Redirect back to login if the credentials are incorrect
    }
});

app.get("/ai", isLoggedIn, (req, res) => {
    res.render('ai');  // Render the AI page if logged in
});

app.post("/ai", isLoggedIn, async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }
        const response = await generateContent(prompt);  // Generate AI content
        res.status(200).json({ response: response });  // Return AI response
    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/logout', (req, res) => {
    isAuthenticated = false;  // Set the authentication state to false
    res.redirect('/');  // Redirect to login page after logging out
});

app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});
