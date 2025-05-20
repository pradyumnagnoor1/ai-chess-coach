import React from 'react';

function ExplanationPanel({ explanation, opening_name, isLoading }) {
  return (
    <div 
      className="explanation-panel"
      style={{
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        minHeight: '200px'
      }}
    >
      <h2 style={{ marginBottom: '15px', fontSize: '1.25rem', fontWeight: 'bold' }}>
        Move Analysis
      </h2>
      
      {isLoading ? (
        <p>Analyzing your move...</p>
      ) : (
        <>
          {opening_name && (
            <div style={{ 
              marginBottom: '10px', 
              padding: '8px', 
              backgroundColor: '#f0f9ff',
              borderRadius: '4px',
              color: '#1e40af'
            }}>
              <strong>Opening:</strong> {opening_name}
            </div>
          )}
          
          <div>
            <p style={{ lineHeight: '1.6' }}>{explanation}</p>
          </div>
        </>
      )}
      
      <div style={{ marginTop: '20px', fontSize: '0.875rem', color: '#6b7280' }}>
        <p>Make a move on the board to get an explanation.</p>
      </div>
    </div>
  );
}

export default ExplanationPanel;