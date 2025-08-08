import { Card, Button } from 'react-bootstrap';
import { ShoppingCart, Edit, Trash2 } from 'lucide-react';
import { isOutOfStock } from '../services/productService';
import Badge from './common/Badge';

const ProductCard = ({ product, onAddToCart, onEditProduct, onDeleteProduct }) => {
  
  const handleDelete = () => {
    onDeleteProduct(product.id);
  };

  return (
    <Card className="h-100">
      <Card.Body className="d-flex flex-column">
        <Card.Title className='fs-3'>{product.name}</Card.Title>
        <Card.Text className="text-muted mb-2">
          ₱{product.price?.toFixed(2)}
        </Card.Text>
        <div className="mb-2">
          <Badge bg={isOutOfStock(product) ? 'danger' : 'success'} outOfStock={isOutOfStock(product)}>
            {isOutOfStock(product) ? 'Out of Stock' : `${product.stocksLeft} in stock`}
          </Badge>
        </div>
        <Card.Text className="flex-grow-1">
          {product.description}
        </Card.Text>
        <div className="mt-auto">
          <div className="d-flex gap-2">
            <Button
              variant={isOutOfStock(product) ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => onAddToCart(product)}
              className="flex-grow-1"
              disabled={isOutOfStock(product)}
            >
              <ShoppingCart size={16} className="me-1" />
              {isOutOfStock(product) ? 'Out of Stock' : 'Add to Cart'}
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
              onClick={handleDelete}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
