import os
from typing import Tuple, Optional
from dotenv import load_dotenv
import asyncio
import re
from openai import OpenAI  # Updated import

# Load environment variables
load_dotenv()

# Configure OpenAI with new client approach
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Common chess openings for pattern matching
COMMON_OPENINGS = {
    "1.e4 e5 2.Nf3 Nc6 3.Bb5": "Ruy Lopez",
    "1.e4 e5 2.Nf3 Nc6 3.Bc4": "Italian Game",
    "1.e4 c5": "Sicilian Defense",
    "1.d4 Nf6 2.c4 g6": "King's Indian Defense",
    "1.d4 d5 2.c4": "Queen's Gambit",
    "1.e4 e6": "French Defense",
    "1.e4 c6": "Caro-Kann Defense",
    "1.Nf3 Nf6 2.c4": "English Opening",
}

def detect_opening(pgn: str) -> Optional[str]:
    """
    Simple opening detection based on move patterns
    """
    moves = pgn.strip()
    for pattern, opening_name in COMMON_OPENINGS.items():
        if moves.startswith(pattern):
            return opening_name
    return None

async def get_chess_explanation(fen: str, user_move: str, pgn: str) -> Tuple[str, Optional[str]]:
    """
    Get move explanation from GPT-4 with proper prompt engineering
    """
    # Detect opening if applicable
    opening_name = detect_opening(pgn)
    
    # Construct a secure prompt
    prompt = f"""You are a friendly chess coach teaching beginners. A student just played a move and you need to explain it in simple terms.

Current position (FEN): {fen}
Move played: {user_move}
Game history: {pgn}
{f"Opening being played: {opening_name}" if opening_name else ""}

Please explain this move to a beginner by addressing:
1. What this move accomplishes (e.g., controls center, develops piece, creates threat)
2. Whether it's part of a known opening (if applicable)
3. What the opponent might do in response
4. Any tactical ideas or strategic themes

Keep the explanation friendly, encouraging, and under 150 words. Use simple chess terminology."""

    try:
        # Using the new OpenAI client API
        response = await asyncio.to_thread(
            client.chat.completions.create,
            model="gpt-4",
            messages=[
                {
                    "role": "system", 
                    "content": "You are a friendly chess coach who explains moves to beginners. Keep explanations simple and encouraging."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=200,
            temperature=0.7,
            n=1
        )
        
        # New API has a different response structure
        explanation = response.choices[0].message.content.strip()
        
        # Basic content filtering
        explanation = re.sub(r'[^\w\s\.\,\!\?\-\(\)]', '', explanation)
        
        return explanation, opening_name
        
    except Exception as e:
        # In case of an error, return a more detailed error message
        error_msg = f"Error generating explanation: {str(e)}"
        print(error_msg)  # Print to server logs
        return f"API Error: {str(e)}", None