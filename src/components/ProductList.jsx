import { Row, Col, Card, Button, Spinner, Badge } from 'react-bootstrap';
import { ShoppingCart, Edit, Trash2, Plus, AlertCircle } from 'lucide-react';
import { isOutOfStock, hasStock } from '../services/cartService';

const ProductList = ({ products, loading, onAddToCart, onEditProduct, onDeleteProduct, onAddProduct }) => {

  const handleDelete = (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      onDeleteProduct(product.id);
    }
  };

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
            <Card className="h-100">
              <Card.Body className="d-flex flex-column">
                <Card.Title>{product.name}</Card.Title>
                <Card.Text className="text-muted mb-2">
                  ₱{product.price?.toFixed(2)}
                </Card.Text>
                <div className="mb-2">
                  {isOutOfStock(product) ? (
                    <Badge bg="danger" className="me-2">
                      <AlertCircle size={14} className="me-1" />
                      Out of Stock
                    </Badge>
                  ) : (
                    <Badge bg="success" className="me-2 stocks-badge">
                      {product.stocksLeft} in stock
                    </Badge>
                  )}
                </div>
                <Card.Text className="flex-grow-1">
                  {product.description}
                </Card.Text>
                <div className="mt-auto">
                  <div className="d-flex gap-2">
                    <Button
                      variant={isOutOfStock(product) ? "secondary" : "primary"}
                      size="sm"
                      onClick={() => onAddToCart(product)}
                      className="flex-grow-1"
                      disabled={isOutOfStock(product)}
                    >
                      <ShoppingCart size={16} className="me-1" />
                      {isOutOfStock(product) ? "Out of Stock" : "Add to Cart"}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => onEditProduct(product)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(product)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default ProductList;
