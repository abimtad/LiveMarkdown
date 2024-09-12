/* server.js */

const express = require('express');
const app = express();
const http = require('http');
const WebSocket = require('ws');
const ShareDB = require('sharedb'); // Use ShareDB as ShareJS's replacement

// Create an HTTP server
const server = http.createServer(app);

// Initialize ShareDB server instance
const backend = new ShareDB();

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

// Function to handle new WebSocket connections
wss.on('connection', (ws) => {
  const stream = new WebSocketJSONStream(ws);
  backend.listen(stream);
});

// Serve static assets from the "public" folder
app.use(express.static(__dirname + '/public'));

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Basic routes for rendering the pad
app.get('/', function (req, res) {
  res.render('pad');
});

app.get('/:id', function (req, res) {
  res.render('pad');
});

// Start the HTTP server on port 8000 (or environment port)
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Helper function to convert WebSocket to a ShareDB-readable stream
function WebSocketJSONStream(ws) {
  this.ws = ws;
  this.on = ws.on.bind(ws);
  this.send = ws.send.bind(ws);
  this.end = ws.close.bind(ws);
}
