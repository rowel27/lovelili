import React from 'react';
import { useLocation } from 'react-router-dom';

const DebugPage = () => {
  const location = useLocation();
  
  return (
    <div style={{ padding: '50px', fontFamily: 'monospace' }}>
      <h1>Debug Information</h1>
      <p><strong>Current Path:</strong> {location.pathname}</p>
      <p><strong>Search:</strong> {location.search}</p>
      <p><strong>Hash:</strong> {location.hash}</p>
      <p><strong>User Agent:</strong> {navigator.userAgent}</p>
      <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
      
      <h2>Test Links</h2>
      <ul>
        <li><a href="/success">Go to Success Page</a></li>
        <li><a href="/cancel">Go to Cancel Page</a></li>
        <li><a href="/test-success">Go to Test Success Page</a></li>
        <li><a href="/test-cancel">Go to Test Cancel Page</a></li>
      </ul>
    </div>
  );
};

export default DebugPage;
