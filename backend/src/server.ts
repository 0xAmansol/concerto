import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import cors from 'cors';
import { scrapeTicketmaster, scrapeSeatgeek, scrapeStubhub } from './scrapers';

const app = express();
app.use(cors());
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Set<WebSocket>();

// WebSocket connection handler
wss.on('connection', (ws) => {
  clients.add(ws);

  ws.on('close', () => {
    clients.delete(ws);
  });
});

// Function to broadcast price updates
const broadcastPrices = (prices: any) => {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(prices));
    }
  });
};

// Endpoint to trigger price scraping
app.get('/api/scrape', async (req, res) => {
  try {
    const eventId = req.query.eventId as string;
    
    // Scrape prices from different platforms
    const [ticketmasterPrices, seatgeekPrices, stubhubPrices] = await Promise.all([
      scrapeTicketmaster(eventId),
      scrapeSeatgeek(eventId),
      scrapeStubhub(eventId)
    ]);

    const allPrices = [...ticketmasterPrices, ...seatgeekPrices, ...stubhubPrices];
    
    // Broadcast prices to all connected clients
    broadcastPrices(allPrices);

    res.json({ success: true, prices: allPrices });
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'Failed to scrape prices' });
  }
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});