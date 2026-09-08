import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './styles/style.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);


serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    const shouldRefresh = window.confirm(
      'Une nouvelle version de TheGoodCorner est disponible. Recharger maintenant ?'
    );
    if (shouldRefresh) serviceWorkerRegistration.applyUpdate(registration);
  },
});