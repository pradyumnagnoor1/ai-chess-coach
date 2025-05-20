import { useState } from 'react';
import './App.css';
import ChessGame from './components/ChessGame';
import ExplanationPanel from './components/ExplanationPanel';
import Layout from './components/Layout';

function App() {
  const [explanation, setExplanation] = useState({
    explanation: 'Make a move to get an explanation.',
    opening_name: null
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleExplanationChange = (newExplanation) => {
    setIsLoading(false);
    setExplanation(newExplanation);
  };

  const handleMoveStart = () => {
    setIsLoading(true);
  };

  return (
    <Layout>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {/* On larger screens, show side by side */}
        <div style={{
          display: 'flex',
          flexDirection: window.innerWidth > 768 ? 'row' : 'column',
          gap: '20px',
          alignItems: 'flex-start'
        }}>
          <div style={{ flex: 1 }}>
            <ChessGame 
              onExplanationChange={handleExplanationChange} 
              onMoveStart={handleMoveStart}
            />
          </div>
          
          <div style={{ flex: 1 }}>
            <ExplanationPanel 
              explanation={explanation.explanation}
              opening_name={explanation.opening_name}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;