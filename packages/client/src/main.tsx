import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import store from './store';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <NotificationsProvider>
            <App />
          </NotificationsProvider>
        </MantineProvider>
      </Router>
    </Provider>
  </React.StrictMode>
);
