const express = require('express');
const app = express();
const http = require('http');
const WebSocket = require('ws');
const ShareDB = require('sharedb');
const richText = require('rich-text'); // Import the rich-text module

// Register the rich-text type with ShareDB
ShareDB.types.register(richText.type);

// Create an HTTP server
const server = http.createServer(app);

// Initialize ShareDB server instance
const backend = new ShareDB();

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

// Function to handle new WebSocket connections
wss.on('connection', (ws) => {
  console.log("New WebSocket connection");

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'update') {
      broadcastMessage(data, ws);
    }
  });

  ws.on('close', () => {
    console.log("WebSocket connection closed");
  });

  ws.on('error', (error) => {
    console.error("WebSocket error: ", error);
  });
});

// Broadcast the message to all clients except the sender
function broadcastMessage(data, sender) {
  wss.clients.forEach((client) => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

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
