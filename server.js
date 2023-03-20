const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {	
    res.send("Welcome to iBukun Notes");
});

const PORT = process.env.PORT || 6090;
app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));