import SearchScreen from '../components/SearchScreen';
import CategoryTabs from '../components/CategoryTabs';
import Misc from '../components/Misc';

const LandingPage = () => {
  return (
    <main className="">
      <SearchScreen />
      <CategoryTabs />
      <Misc />
    </main>
  );
};

export default LandingPage;
