import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import LandingPage from './pages/LandingPage';
import HamptaPassTrek from './pages/trekks/HamptaPassTrek';
import KedarkanthaTrek from './pages/trekks/KedarkanthaTrek';
import ValleyOfFlowersTrek from './pages/trekks/ValleyOfFlowersTrek';
import KashmirGreatLakesTrek from './pages/trekks/KashmirGreatLakesTrek';
import ChadarTrek from './pages/trekks/ChadarTrek';
import RoopkundTrek from './pages/trekks/RoopkundTrek';
import SearchResults from './pages/SearchResults';
import SherpaAI from './pages/SherpaAI';
import Articles from './pages/Articles';
import ArticlePage from './pages/ArticlePage';
import AboutUs from './pages/AboutUs';
import TestPage from './pages/TestPage';
import SimpleTest from './pages/SimpleTest';
import ProfilePage from './pages/ProfilePage';
import MyBookingsPage from './pages/MyBookingsPage';
import BookingPage from './pages/BookingPage';
import EmailTestPage from './pages/EmailTestPage';
import AuthCallback from './components/AuthCallback';
import ScrollToTop from './components/common/ScrollToTop';


// App Currently Deployed on two space. One is the OG vercel - get it from uploading from github
// Second is the tpc-dev link on my vercel - ask me
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Auth callback route - outside MainLayout */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/article" element={<Articles />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/booking/:type/:id" element={<BookingPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/simple-test" element={<SimpleTest />} />
          <Route path="/email-test" element={<EmailTestPage />} />
          <Route path="/sherpa-ai" element={<SherpaAI />} />
          <Route path="/pages/HamptaPassTrek" element={<HamptaPassTrek />} />
          <Route path="/pages/KedarkanthaTrek" element={<KedarkanthaTrek />} />
          <Route
            path="/pages/ValleyOfFlowersTrek"
            element={<ValleyOfFlowersTrek />}
          />
          <Route
            path="/pages/KashmirGreatLakesTrek"
            element={<KashmirGreatLakesTrek />}
          />
          <Route path="/pages/ChadarTrek" element={<ChadarTrek />} />
          <Route path="/pages/RoopkundTrek" element={<RoopkundTrek />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
