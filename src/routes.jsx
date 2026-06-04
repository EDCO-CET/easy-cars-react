import ProtectedRoute from "./components/ProtectedRoute";
import Catalog from "./pages/Catalog/Catalog";
import Contact from "./pages/Contact/Contact";
import CreateCar from "./pages/CreateCar";
import Login from "./pages/Login";
import NotFound from "./pages/Not-found/NotFound";

const routes = [
    {
        path: "/",
        element: <Catalog />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/contact",
        element: <Contact />
    },
    {
        // Ruta para el formulario de creación de carros
        path: "/cars/new",
        element: (<ProtectedRoute requiredRole="Admin"><CreateCar /></ProtectedRoute>)
    },
    {
        path: "*",
        element: <NotFound />
    }
]

export default routes;
