import { Row, Col, Button, Spinner } from 'react-bootstrap';
import { Plus } from 'lucide-react';
import ProductCard from './ProductCard';

const ProductList = ({ products, loading, onAddToCart, onEditProduct, onDeleteProduct, onAddProduct }) => {
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-5">
        <h3>No products available</h3>
        <p>Add some products to get started!</p>
      </div>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">LISTS OF PRODUCTS</h2>
        <Button variant="primary" size="md" onClick={onAddProduct}>
          <Plus size={30} className="p-1" />
        </Button>
      </div>
      <Row>
        {products.map((product) => (
          <Col key={product.id} md={6} lg={4} className="mb-4">
            <ProductCard
              product={product}
              onAddToCart={onAddToCart}
              onEditProduct={onEditProduct}
              onDeleteProduct={onDeleteProduct}
            />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default ProductList;
