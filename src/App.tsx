 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { HomePage } from './pages/HomePage';
import { TournamentsPage } from './pages/TournamentsPage';
import { TournamentDetailsPage } from './pages/TournamentDetailsPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { TDMPage } from './pages/TDMPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminLogin } from './pages/AdminLogin';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tournaments" element={<TournamentsPage />} />
              <Route path="/tournament/:id" element={<TournamentDetailsPage />} />
              <Route path="/leaderboard/:tournamentId" element={<LeaderboardPage />} />
              <Route path="/tdm" element={<TDMPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;