import { cleanupPriceHistory } from "../internal/cleanupPriceHistory"; 

export const one_hour_time: number = 1000*60*60 

export async function startPriceCleanup(){
    console.log("Cleanup History Started...")
    setInterval( () => { cleanupPriceHistory();}, one_hour_time)
}