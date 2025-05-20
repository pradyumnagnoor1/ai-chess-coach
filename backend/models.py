from pydantic import BaseModel, Field, validator
import chess
import chess.pgn
import io
from typing import Optional

class MoveExplanationRequest(BaseModel):
    fen: str = Field(..., description="Current board position in FEN notation")
    user_move: str = Field(..., description="The move just played in UCI or SAN notation")
    pgn: str = Field(..., description="Complete game history in PGN format")
    
    @validator('fen')
    def validate_fen(cls, v):
        try:
            chess.Board(v)
        except ValueError:
            raise ValueError('Invalid FEN notation')
        return v
    
    @validator('pgn')
    def validate_pgn(cls, v):
        try:
            pgn_io = io.StringIO(v)
            game = chess.pgn.read_game(pgn_io)
            if game is None and v.strip() != "":
                raise ValueError('Invalid PGN format')
        except Exception:
            raise ValueError('Invalid PGN format')
        return v
    
    @validator('user_move')
    def sanitize_move(cls, v):
        # Basic sanitization to prevent prompt injection
        return v.replace('\n', ' ').replace('"', '').strip()[:10]

class MoveExplanationResponse(BaseModel):
    explanation: str
    opening_name: Optional[str] = None