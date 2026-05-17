const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Allow requests from any origin (needed for Railway + custom domains)
app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/tasks", require("./routes/tasks"));

app.use(express.static(path.join(__dirname, '../client/dist')));
app.get(/.*/, (req, res) => res.sendFile(path.join(__dirname, '../client/dist/index.html')));

const PORT = process.env.PORT || 5000;
// Bind to 0.0.0.0 — Railway requires this to route traffic into the container
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on 0.0.0.0:${PORT}`);
});

server.on('error', (err) => {
    console.error('Server failed to start:', err.message);
    process.exit(1);
});