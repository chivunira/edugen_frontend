// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, persistor } from './store/store';
import { PersistGate } from "redux-persist/integration/react";
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
import ChatPage from './pages/ChatPage';
import TopicsPage from "./pages/TopicsPage";
import AssessmentTopicsPage from './pages/AssessmentTopicsPage';
import AssessmentPage from './pages/AssessmentPage';
import AssessmentReviewPage from "./pages/AssessmentReviewPage.tsx";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
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
              <Route path="content/:subjectId/topics" element={<TopicsPage />} />
              <Route path="assessments" element={<AssessmentsPage />} />
              <Route path="assessments/:subjectId/topics" element={<AssessmentTopicsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Chat and Assessment routes */}
            <Route path="/chat/:topicId" element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } />

            <Route path="/assessment/:topicId" element={
              <ProtectedRoute>
                <AssessmentPage />
              </ProtectedRoute>
            } />

            <Route path="/assessment-review/:assessmentId" element={
                <ProtectedRoute>
                  <AssessmentReviewPage />
                </ProtectedRoute>
            } />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;