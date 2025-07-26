import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import LandingPage from './pages/LandingPage';
import HamptaPassTrek from './pages/HamptaPassTrek';
import KedarkanthaTrek from './pages/KedarkanthaTrek';
import ValleyOfFlowersTrek from './pages/ValleyOfFlowersTrek';
import KashmirGreatLakesTrek from './pages/KashmirGreatLakesTrek';
import ChadarTrek from './pages/ChadarTrek';
import RoopkundTrek from './pages/RoopkundTrek';
import SearchResults from './pages/SearchResults';
import SherpaAI from './pages/SherpaAI';


// App Currently Deployed on two space. One is the OG vercel - get it from uploading from github
// Second is the tpc-dev link on Gyani's vercel - ask me
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/search" element={<SearchResults />} />
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
