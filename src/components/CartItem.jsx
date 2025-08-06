import { Card, Row, Col, Button, Badge } from 'react-bootstrap';
import { Trash2 } from 'lucide-react';

const CartItem = ({ item, onRemoveFromCart }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Row className="align-items-center">
          <Col md={6}>
            <h5 className="mb-2 text-muted fs-3">{item.name}</h5>
            <Badge className="stocks-badge">
              ₱{(item.unitPrice || item.price)?.toFixed(2)} each
            </Badge>
          </Col>
          <Col md={3} xs={6} className="text-center">
            <span
              className="fw-semibold"
              style={{ color: item.quantity > 1 ? '' : '' }}>
              {item.quantity} {item.quantity > 1 ? 'pieces' : 'piece'}
            </span>
          </Col>
          <Col md={2} className="text-center">
            <strong>
              ₱
              {(
                item.totalPayable ||
                (item.unitPrice || item.price) * item.quantity
              ).toFixed(2)}
            </strong>
          </Col>
          <Col md={1} className="text-center">
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onRemoveFromCart(item.id)}
            >
              <Trash2 size={16} />
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default CartItem;
