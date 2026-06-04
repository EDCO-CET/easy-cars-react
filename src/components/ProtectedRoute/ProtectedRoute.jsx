

import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router";

function ProtectedRoute({ children, requiredRole = 'admin' }) {
    const { userData, hasRole } = useAuth();
    const navigate = useNavigate();
    
    if (!userData) {
        navigate('/login');
    }

    if (!hasRole(requiredRole)) {
        return <>
            <h1>Forbidden</h1>
            <p>You do not have access to this resource</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>Go back</button>
        </>
    }

    return children;
}

export default ProtectedRoute;