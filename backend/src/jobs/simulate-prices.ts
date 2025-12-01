import { updatePrices } from '../services/price-simulator';

const one_minute_time:number = 1000 * 5

export function startPriceSimulation() {
  console.log("Market Simulation Started...");
  setInterval(() => {
    updatePrices();
  }, one_minute_time); // Updates every 1 minute
}
