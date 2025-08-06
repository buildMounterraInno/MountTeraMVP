import { useEffect } from 'react';
import SearchScreen from '../components/SearchScreen';
import CategoryTabs from '../components/CategoryTabs';
import Misc from '../components/Misc';

const LandingPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="">
      <SearchScreen />
      <CategoryTabs />
      <Misc />
    </main>
  );
};

export default LandingPage;
