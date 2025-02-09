import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/Home';
import ArchivesPage from './pages/Archives';
import AboutPage from './pages/About';
import PrivacyPage from './pages/Privacy';
import TermsPage from './pages/Terms';
import store,{persistor} from "./store";
import { Provider } from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import { ToastContainer } from 'react-toastify';

import WagmiProvider from './providers/wagmiProvider';

function App() {
  return (
      <PersistGate loading={null} persistor={persistor} >
        <Provider store={store}>
            <WagmiProvider>
                <Router basename="/node-conf-website">
                  <Layout>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/archives" element={<ArchivesPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/privacy" element={<PrivacyPage />} />
                      <Route path="/terms" element={<TermsPage />} />
                    </Routes>
                  </Layout>
                </Router>
            </WagmiProvider>
            <ToastContainer />
        </Provider>
      </PersistGate>
  );
}

export default App;
