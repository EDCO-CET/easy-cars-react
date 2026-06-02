import Catalog from "./pages/Catalog/Catalog";
import Contact from "./pages/Contact/Contact";
import NotFound from "./pages/Not-found/NotFound";

const routes = [
    {
        path: "/",
        element: <Catalog />
    },
    {
        path: "/contact",
        element: <Contact />
    },
    {
        path: "*",
        element: <NotFound />
    }
]

export default routes;
