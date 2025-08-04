import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Package } from 'lucide-react';

const Layout = ({ children, cartItemCount = 0 }) => {
  const location = useLocation();

  return (
    <div className="App">
      <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <Package className="me-2" size={24} />
            SHOPEASE
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link 
              as={Link}
              to="/"
              className={location.pathname === '/' ? 'active' : ''}
            >
              PRODUCTS
            </Nav.Link>
            <Nav.Link 
              as={Link}
              to="/cart"
              className={location.pathname === '/cart' ? 'active' : ''}
            >
              <ShoppingCart className="me-1" size={20} />
              CART ({cartItemCount})
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container>
        {children}
      </Container>
    </div>
  );
};

export default Layout;
