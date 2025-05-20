import React, { useState, useEffect, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { explainMove } from '../services/api';

function ChessGame({ onExplanationChange }) {
  const [game, setGame] = useState(new Chess());
  const [boardWidth, setBoardWidth] = useState(500);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Resize the board on window resize
  useEffect(() => {
    function handleResize() {
      const display = window.innerWidth;
      if (display < 600) {
        setBoardWidth(350);
      } else {
        setBoardWidth(500);
      }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to make a move
  const makeMove = useCallback(async (move) => {
    const gameCopy = new Chess(game.fen());
    
    try {
      // Make the move
      const result = gameCopy.move(move);
      
      if (result) {
        setGame(gameCopy);
        
        // Only explain user moves, not computer responses
        if (!move.color || move.color === 'w') {
          setIsLoading(true);
          setErrorMessage('');
          
          try {
            // Get explanation from API
            const explanation = await explainMove(
              game.fen(),
              move.san || `${move.from}${move.to}`,
              game.pgn()
            );
            
            // Update the explanation in the parent component
            if (onExplanationChange) {
              onExplanationChange(explanation);
            }
          } catch (error) {
            console.error('Error getting move explanation:', error);
            setErrorMessage('Failed to get move explanation. Please try again.');
          } finally {
            setIsLoading(false);
          }
        }
        
        return true;
      }
    } catch (e) {
      return false;
    }
    
    return false;
  }, [game, onExplanationChange]);

  // Handle piece drop for drag and drop
  function onDrop(sourceSquare, targetSquare) {
    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // Always promote to queen for simplicity
    };
    
    return makeMove(move);
  }

  // Reset the game
  function resetGame() {
    setGame(new Chess());
    if (onExplanationChange) {
      onExplanationChange({ explanation: 'Game reset. Make a move to get an explanation.', opening_name: null });
    }
  }

  return (
    <div className="chess-game">
      <Chessboard
        id="BasicBoard"
        position={game.fen()}
        onPieceDrop={onDrop}
        boardWidth={boardWidth}
        areArrowsAllowed={true}
        customBoardStyle={{
          borderRadius: '4px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
        }}
      />
      
      <div className="game-controls" style={{ marginTop: '20px' }}>
        <button
          onClick={resetGame}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4b5563',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset Game
        </button>
        
        {isLoading && <p>Analyzing move...</p>}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>
    </div>
  );
}

export default ChessGame;