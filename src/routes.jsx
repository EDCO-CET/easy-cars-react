import ProtectedRoute from "./components/ProtectedRoute";
import Catalog from "./pages/Catalog/Catalog";
import CarDetails from "./pages/CarDetails";
import Contact from "./pages/Contact/Contact";
import CreateCar from "./pages/CreateCar";
import EditCar from "./pages/EditCar";
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
        // Detalle del carro: pública, todos los usuarios pueden verla
        path: "/cars/:id",
        element: <CarDetails />
    },
    {
        // Edición del carro: solo administradores
        path: "/cars/:id/edit",
        element: (<ProtectedRoute requiredRole="Admin"><EditCar /></ProtectedRoute>)
    },
    {
        path: "*",
        element: <NotFound />
    }
]

export default routes;
