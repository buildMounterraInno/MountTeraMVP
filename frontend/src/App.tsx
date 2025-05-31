import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import LandingPage from './pages/LandingPage';
import HamptaPassTrek from './pages/HamptaPassTrek';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pages/HamptaPassTrek" element={<HamptaPassTrek />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
