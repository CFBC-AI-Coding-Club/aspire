from dotenv import load_dotenv
from openai import OpenAI
import os
import requests
import json

load_dotenv()

# Load API key
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY not found in environment")

api_url = os.getenv("API_URL")

client = OpenAI(api_key=api_key)

# Conversation history stored here
history = [
    # Gives agent starting instructions
    {
        "role": "system",
        "content": (
            "You are the game master of a simulated stock trading market. "
            "Read the market data given and reply with one (1) output in the following format exactly with no deviations, "
            "any word surrounded by single quotes '' are the key names for the entry in the json container and the instructions following it are the instructions for the data which will fill that entry. "
            "'headline' the variable containing the News headline attributed to the scenario at least 5 characters long and at most 30. "
            "'summary' a brief summary of the scenario and what it entails must be at least 10 characters long but less than 120. "
            "'sector' the type of stock affected by the scenario, they are also found in the market data, must be output in all caps. "
            "'magnitude' the strength of the scenario's effect on that category of stock, a floating point between -1 and 1, closer to -1 marks a decrease in stock price while closer to 1 marks an increase. "
            "'duration' the length of time the scenario will affect the stock market in seconds between 600 to 3600 seconds. "
            "'sentiment' the general sentiment of the scenario, either 'positive', 'negative', or 'neutral'."
        )
    },
]

def fetch_internal_market_data(url: str) -> dict:
    #Fetch market data from an internal API and return as a JSON dictionary.
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        # Optionally save to a file
        #with open("output.json", "w") as file:
            #json.dump(data, file, indent=4)
        #print(f"Market data fetched successfully from {url}")
        return data
    except requests.RequestException as e:
        print(f"Error fetching market data: {e}")
        return {}

def send_message(user_message: str, market_data: dict):
 
    #Sends a message to the AI along with current market data.
    #The AI should generate a scenario based on the market_data.
 
    # Add message from user/admin to history
    history.append({"role": "user", "content": user_message})

    # Add market data to the AI's context
    history.append({"role": "user", "content": f"Market Data: {json.dumps(market_data)}"})

    # Call OpenAI API
    resp = client.responses.create(
        model="gpt-5.1",
        messages=history
    )

    assistant_reply = resp.output_text

    # Save assistant output so AI remembers it next turn
    history.append({"role": "assistant", "content": assistant_reply})

    return assistant_reply

if __name__ == "__main__":
    # URL of the internal API providing market data
    internal_api_url = api_url + "/stocks"
    
    # Fetch market data
    market_data = fetch_internal_market_data(internal_api_url)

    if market_data:
        # Send data to AI for a scenario
        scenario_output = send_message("Generate a market scenario based on this data", market_data)
        print("AI Scenario Output:\n", scenario_output)
