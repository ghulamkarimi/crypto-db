import axios from "axios";
import Coins from "../models/coinModel";

const URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d&locale=en";

let running = false;

// Holt die aktuellen Marktdaten und schreibt sie in die eigene Datenbank.
// Bei Fehlern (z. B. Limit des Anbieters) bleiben die alten Daten erhalten.
export const syncCoins = async (): Promise<boolean> => {
  if (running) return false;
  running = true;
  try {
    const { data } = await axios.get(URL, { timeout: 20000 });
    if (!Array.isArray(data) || data.length === 0) return false;
    await Coins.bulkWrite(
      data.map((coin: { id: string }) => ({
        updateOne: { filter: { id: coin.id }, update: { $set: coin }, upsert: true },
      }))
    );
    console.log(`Coins synced: ${data.length}`);
    return true;
  } catch (error) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    console.log(`Coin sync failed${status ? ` (HTTP ${status})` : ""}, keeping stored data`);
    return false;
  } finally {
    running = false;
  }
};

// Beim Start einmal und danach regelmäßig (Standard: alle 10 Minuten)
export const startCoinSync = () => {
  const minutes = Math.max(5, Number(process.env.COIN_SYNC_MINUTES) || 10);
  syncCoins();
  setInterval(syncCoins, minutes * 60 * 1000);
};
