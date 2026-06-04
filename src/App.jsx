import { Suspense } from 'react';
import './App.css'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import routes from './routes';
import Loading from './components/Loading';
import { AuthProvider } from './context/AuthProvider';

function App() {


  return (
    <>
      <main>
        <AuthProvider>
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
        </AuthProvider>
      </main>
    </>
  );
}

export default App
