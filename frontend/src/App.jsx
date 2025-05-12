import './App.css';
import { HeroHeader } from '@/components/hero5-header';
import HeroSection from './components/hero-section';
import ContentSection from './components/content-7';
import Features from './components/features-4';
import Pricing from './components/pricing';
import CallToAction from './components/call-to-action';
import FAQ from './components/faq';
import { onAuthStateChanged } from "firebase/auth";
import SignupPage from "./components/sign-up";
import LoginPage from "./components/login";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "sonner";
import { auth } from './firebase';
import FooterSection from './components/footer';
import DashboardPage from './components/dashboard';
import SettingsPage from './components/SettingsPage';
import MyPactsPage from "./components/myPacts"
import CheckInListPage from "./components/checkInList"
import AuthLayout from './components/AuthLayout'; // ✅ new layout import
import CheckinInsights from './components/CheckinInsights';
import NotesPage from './components/NotesPage'; // ✅ new page import


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      console.log("User state updated:", currentUser);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return null; // optional: add loading spinner

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Toaster 
        position="top-right" 
        theme="dark"
        closeButton
        richColors
      />
      <Routes>
        {/* Public Home Page */}
        <Route 
          path="/" 
          element={
            <>
              <div className="bg-black text-white">
                <HeroHeader />
                <HeroSection />
                <ContentSection />
                <Features />
                <Pricing />
                <CallToAction />
                <FAQ />
                <FooterSection />
              </div>
            </>
          } 
        />

        {/* Auth Routes */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" /> : <LoginPage />}  
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/" /> : <SignupPage />} 
        />

        {/* Protected Routes using layout */}
        <Route 
          path="/" 
          element={user ? <AuthLayout /> : <Navigate to="/login" />} 
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="my-pacts" element={<MyPactsPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="checkins" element={<CheckinInsights />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
