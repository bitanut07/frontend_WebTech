// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import store from './redux/store';
const root = ReactDOM.createRoot(document.getElementById('root'));
const CLIENT_ID = '1017037354622-2rsua9tj9o91ap5aj861g4k50lovgvle.apps.googleusercontent.com';
root.render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            <Provider store={store}>
                <App />
            </Provider>
        </GoogleOAuthProvider>
    </React.StrictMode>,
);

// Optional: To measure performance in your app, pass a function
// to log results or send to an analytics endpoint.
reportWebVitals();
