import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import ProductModal from "../components/ProductModal";
import { useProducts } from "../hooks/useProducts";
import { useState } from "react";

const Layout = ({ children, cartItemCount = 0 }) => {
  const location = useLocation();

  const {
    addProduct,
    updateProduct,
    fetchProducts
  } = useProducts();
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }// Refresh product list
      setShowProductModal(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

    const handleCloseModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
  };


  return (
    <div className="App">
      <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Karbon Shop
          </Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link
              as={Link}
              to="/"
              className={location.pathname === "/" ? "active" : ""}
            >
              PRODUCTS
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/cart"
              className={location.pathname === "/cart" ? "active" : ""}
            >
              CART ({cartItemCount})
            </Nav.Link>
            <Button className="add-btn" size="md" onClick={handleAddProduct}>
              Add Product
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <Container>{children}</Container>

      
      <ProductModal
        show={showProductModal}
        onHide={handleCloseModal}
        onSave={handleSaveProduct}
        product={editingProduct}
        isEditing={!!editingProduct}
        onAddProduct={handleAddProduct}
        fetchProducts={fetchProducts}
      />
    </div>
  );
};

export default Layout;
