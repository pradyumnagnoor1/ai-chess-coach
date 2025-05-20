import React from 'react';

function Layout({ children }) {
  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '20px'
    }}>
      <header style={{
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold',
          color: '#1f2937'
        }}>
          AI Chess Coach
        </h1>
        <p style={{ color: '#4b5563' }}>
          Learn chess with GPT-powered explanations
        </p>
      </header>
      
      <main>
        {children}
      </main>
      
      <footer style={{ 
        marginTop: '40px', 
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '0.875rem'
      }}>
        <p>Built with React, FastAPI, and OpenAI</p>
      </footer>
    </div>
  );
}

export default Layout;