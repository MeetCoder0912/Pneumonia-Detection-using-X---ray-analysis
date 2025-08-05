// /frontend/src/index.js

import React from 'react';
// The error message told us to import from 'react-dom/client' instead of just 'react-dom'.
import ReactDOM from 'react-dom/client'; 
import App from './App';

// This is the entry point of our React application.

// 1. We find the <div id="root"> element in our public/index.html file.
const rootElement = document.getElementById('root');

// 2. We create a "root" for our React application to render into.
const root = ReactDOM.createRoot(rootElement);

// 3. We render our main <App /> component inside this root.
//    React will now take control of the #root div and manage its content.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
