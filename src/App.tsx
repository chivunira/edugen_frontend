// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import ProtectedRoute from './components/auth/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import VerificationPage from './pages/VerificationPage';
import ClassRegistrationPage from './pages/ClassRegistrationPage';
import WelcomePage from './pages/WelcomePage';
import DashboardPage from './pages/DashboardPage';
import ContentPage from './pages/ContentPage';
import AssessmentsPage from './pages/AssessmentsPage';
import ProfilePage from './pages/ProfilePage';
import TopicPage from './pages/TopicPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={
            <ProtectedRoute requireAuth={false}>
              <LandingPage />
            </ProtectedRoute>
          } />
          <Route path="/signin" element={
            <ProtectedRoute requireAuth={false}>
              <SignInPage />
            </ProtectedRoute>
          } />
          <Route path="/signup" element={
            <ProtectedRoute requireAuth={false}>
              <SignUpPage />
            </ProtectedRoute>
          } />
          <Route path="/verify" element={<VerificationPage />} />

          {/* Protected routes */}
          <Route path="/register-class" element={
            <ProtectedRoute>
              <ClassRegistrationPage />
            </ProtectedRoute>
          } />
          <Route path="/welcome" element={
            <ProtectedRoute>
              <WelcomePage />
            </ProtectedRoute>
          } />

          {/* Dashboard routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="content" replace />} />
            <Route path="content" element={<ContentPage />} />
            <Route path="assessments" element={<AssessmentsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          <Route path="/topic/:topicId" element={
            <ProtectedRoute>
              <TopicPage />
            </ProtectedRoute>
          } />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;