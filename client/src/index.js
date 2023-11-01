import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from "./AppContext";

import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <AppProvider>
        <App />
      </AppProvider>
    </Router>
  </React.StrictMode>
);
