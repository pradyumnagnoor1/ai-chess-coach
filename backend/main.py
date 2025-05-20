from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
from models import MoveExplanationRequest, MoveExplanationResponse
import chess
from openai_client import get_chess_explanation  # Add this import

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(title="AI Chess Coach API")

# Configure CORS
origins = [
    "http://localhost:3000",
    "https://ai-chess-coach.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """Health check endpoint to verify the API is running"""
    return {"status": "healthy", "message": "AI Chess Coach API is running"}

@app.post("/explain-move", response_model=MoveExplanationResponse)
async def explain_move(request: MoveExplanationRequest):
    """
    Analyzes a chess move and returns an educational explanation using GPT-4
    """
    try:
        logger.info(f"Explaining move: {request.user_move}")
        
        # Validate the move on the board
        board = chess.Board(request.fen)
        
        # Try to parse the move
        try:
            move = board.parse_san(request.user_move)
        except:
            try:
                move = board.parse_uci(request.user_move)
            except:
                raise HTTPException(status_code=400, detail="Invalid move notation")
        
        # Get explanation from GPT
        explanation, opening_name = await get_chess_explanation(
            fen=request.fen,
            user_move=request.user_move,
            pgn=request.pgn
        )
        
        return MoveExplanationResponse(
            explanation=explanation,
            opening_name=opening_name
        )
        
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error explaining move: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate explanation")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)