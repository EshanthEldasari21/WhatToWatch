import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Cards from './components/Cards';
import TopRated from './components/TopRated';
import SearchDetails from './components/SearchDetails';
import Genre from './components/Genre';
import Languages from './components/Languages';

const App = () => {

  
  return (
    <Router>
    <Header />
      <Routes>
        <Route path="/" element={<Cards />} />
        <Route path="/top-rated" element={<TopRated />} />
        <Route path="/search" element={<SearchDetails />} />
        <Route path="/genre" element={<Genre />} />
        <Route path="/languages" element={<Languages />} />
      </Routes>
  </Router>
    
  );
};

export default App;
