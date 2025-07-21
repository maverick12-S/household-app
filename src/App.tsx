import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Report from './pages/Report';
import NoMatch from './pages/NoMatch';
import AppLayout from './components/layout/AppLayout';
import { theme } from './theme/theme';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { Transaction } from './types/index';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { format } from 'date-fns';
import { formatMonth } from './utils/formatting';
import { Schema } from './validations/schema';
import { AppContextProvider } from './context/AppContext';

function App() {
  
  return (
    <AppContextProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Home
                                  />}
              />
              <Route path="/report" element={<Report/>}
              />
              <Route path="*" element={<NoMatch />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AppContextProvider>
  );
}

export default App;
