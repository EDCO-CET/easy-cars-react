import { Suspense } from 'react';
import './App.css'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import routes from './routes';
import Loading from './components/Loading';

function App() {


  return (
    <>
      <main>
        <Router>
          <header>
            <Navbar />
          </header>
          <Suspense fallback={<Loading />}>
            <Routes>
              {routes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Routes>
          </Suspense>
        </Router>
      </main>
    </>
  );
}

export default App
