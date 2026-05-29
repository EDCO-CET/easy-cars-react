import './App.css'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Catalog from './pages/Catalog/Catalog';
import Contact from './pages/Contact/Contact';

function App() {


  return (
    <>
      <main>
        <Router>
          <header>
            <Navbar />
          </header>
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Catalog />} />
          </Routes>
        </Router>
      </main>
    </>
  );
}

export default App
