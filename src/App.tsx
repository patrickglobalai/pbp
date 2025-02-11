import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { HomePage } from './views/HomePage';
import { ExampleResults } from './views/ExampleResults';
import { QuestionnaireContainer } from './containers/QuestionnaireContainer';
import { RegistrationPage } from './views/RegistrationPage';
import { InstructionsView } from './views/InstructionsView';
import { AIAnalysisView } from './views/AIAnalysisView';
import { ResultsView } from './views/ResultsView';
import { LoginPage } from './views/LoginPage';
import { AdminDashboard } from './views/AdminDashboard';
import { CoachManagement } from './views/admin/CoachManagement';
import { PartnerManagement } from './views/admin/PartnerManagement';
import { AssessmentCodes } from './views/admin/AssessmentCodes';
import { Analytics } from './views/admin/Analytics';
import { AssessmentProvider } from './contexts/AssessmentContext';
import { ResultsProvider } from './contexts/ResultsContext';
import { RespondentDashboard } from './views/RespondentDashboard';
import { CoachDashboard } from './views/CoachDashboard';
import { RespondentsList } from './views/coach/RespondentsList';
import { RespondentResults } from './views/coach/RespondentResults';
import { ManualAIAnalysis } from './views/coach/ManualAIAnalysis';
import { PartnerDashboard } from './views/PartnerDashboard';
import { PartnerCoachManagement } from './views/partner/CoachManagement';
import { PartnerAssessmentCodes } from './views/partner/AssessmentCodes';
import { PartnerAnalytics } from './views/partner/Analytics';
import { PrivacyPage } from './views/PrivacyPage';
import { TermsPage } from './views/TermsPage';
import { DisclaimerPage } from './views/DisclaimerPage';
import { CoachRegistrationPage } from './views/CoachRegistrationPage';

export default function App() {
  return (
    <AuthProvider>
      <AssessmentProvider>
        <ResultsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/example" element={<ExampleResults />} />
              <Route path="/register" element={<RegistrationPage />} />
              <Route path="/instructions" element={<InstructionsView />} />
              <Route path="/assessment" element={<QuestionnaireContainer />} />
              <Route path="/results" element={<ResultsView />} />
              <Route path="/analysis" element={<AIAnalysisView />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<RespondentDashboard />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              <Route path="/coach-registration" element={<CoachRegistrationPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/partners" element={<PartnerManagement />} />
              <Route path="/admin/coaches" element={<CoachManagement />} />
              <Route path="/admin/codes" element={<AssessmentCodes />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              
              {/* Coach Routes */}
              <Route path="/coach" element={<CoachDashboard />} />
              <Route path="/coach/respondents" element={<RespondentsList />} />
              <Route path="/coach/results/:userId" element={<RespondentResults />} />
              <Route path="/coach/manual-analysis" element={<ManualAIAnalysis />} />

              {/* Partner Routes */}
              <Route path="/partner" element={<PartnerDashboard />} />
              <Route path="/partner/coaches" element={<PartnerCoachManagement />} />
              <Route path="/partner/codes" element={<PartnerAssessmentCodes />} />
              <Route path="/partner/analytics" element={<PartnerAnalytics />} />
            </Routes>
          </BrowserRouter>
        </ResultsProvider>
      </AssessmentProvider>
    </AuthProvider>
  );
}