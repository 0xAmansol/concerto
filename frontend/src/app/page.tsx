'use client';


import { usePriceStore } from '../lib/websocket';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Home() {
  const prices = usePriceStore((state) => state.prices);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Concert Price Tracker</h1>
      
      {Object.entries(prices).map(([eventId, eventPrices]) => (
        <div key={eventId} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {eventPrices[0]?.eventName}
          </h2>
          
          <div className="h-[400px] mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={eventPrices}>
                <XAxis 
                  dataKey="timestamp"
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone"
                  dataKey="price"
                  stroke="#8884d8"
                  name="Price"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(
              eventPrices.reduce((acc, price) => ({
                ...acc,
                [price.platform]: {
                  platform: price.platform,
                  latestPrice: price.price,
                  url: price.url
                }
              }), {} as Record<string, any>)
            ).map(([platform, data]) => (
              <div 
                key={platform}
                className="border rounded-lg p-4 shadow-sm"
              >
                <h3 className="font-semibold text-lg mb-2">{platform}</h3>
                <p>Price: ${(data as any).latestPrice}</p>
                <a 
                  href={(data as any).url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline mt-2 block"
                >
                  View Tickets
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}