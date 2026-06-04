import styles from './Navbar.module.css';
import { NavLink } from 'react-router';
import { useAuth } from '../../hooks/useAuth';


function Navbar() {
  const { userData, logout, hasRole } = useAuth();
  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <NavLink to="/" className={({ isActive }) =>
              isActive ? styles['navActive'] : styles.navInactive
            } end>Our Cars</NavLink>
        </li>
        <li>
          <NavLink to="/contact" className={({ isActive }) =>
              isActive ? styles.navActive : styles.navInactive
            }>Contact</NavLink>
        </li>
        <li>
          {/* Enlace a la nueva ruta de creación de carros */}
          {
            hasRole('Admin') && (
              <NavLink to="/cars/new" className={({ isActive }) =>
                isActive ? styles.navActive : styles.navInactive
              }>Create Car</NavLink>
            )
          }
        </li>
        </ul>
        <ul>
          <li>

            {
              userData ? (
                <div className={styles.userSection}>
                  <span>{`Hello ${userData.user?.name}!`}</span>
                  <button className={styles.logoutButton} onClick={logout}>Logout</button>
                </div>
              ) : (
                <NavLink to="/login" className={({ isActive }) =>
                  isActive ? styles.navActive : styles.navInactive
                }>Login</NavLink>
              )
            }
          </li>
      </ul>
    </nav>
  );
}

export default Navbar;
