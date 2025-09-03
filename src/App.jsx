// App.jsx
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import ResultsPage from './pages/ResultsPage'; // ✅
import HistoryPage from './pages/HistoryPage';
import PredictionDetail from './pages/PredictionDetail';
import About from './pages/About';
import Gallery from './pages/Gallery';
import AuthPage from './pages/AuthPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import StyleTransferPage from './pages/StyleTransferPage';


const App = () => {
  const [theme, setTheme] = useState('light');
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const deleteItem = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      <Navbar toggleTheme={toggleTheme} theme={theme} />
      <main className="p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/upload" element={<UploadPage setHistory={setHistory} />} />
          <Route path="/about" element={<About />} />
          <Route path="/history/:id" element={<PredictionDetail />} />
          <Route path="/style-transfer" element={<StyleTransferPage />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          
          {/* ✅ Pass history to ResultsPage so it can show the latest result */}
          <Route path="/results" element={<ResultsPage history={history} />} />

          <Route
            path="/history"
            element={
              <HistoryPage
                history={history}
                deleteItem={deleteItem}
                filter={filter}
                setFilter={setFilter}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
