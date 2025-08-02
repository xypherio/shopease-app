import { useState } from 'react';
import { Card, Button, Row, Col, Badge, Form, Modal, Spinner } from 'react-bootstrap';
import { Trash2, Plus, Minus, ShoppingCart, CreditCard } from 'lucide-react';

const Cart = ({ cart, onRemoveFromCart, onUpdateQuantity, onCheckout, loading }) => {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  
  // Calculate total using Firebase cart structure (totalPayable field)
  const totalPrice = cart.reduce((total, item) => total + (item.totalPayable || item.unitPrice * item.quantity), 0);

  const handleQuantityChange = (id, newQuantity, unitPrice) => {
    const quantity = parseInt(newQuantity);
    if (quantity >= 1) {
      onUpdateQuantity(id, quantity, unitPrice);
    }
  };

  const increaseQuantity = (id, currentQuantity, unitPrice) => {
    onUpdateQuantity(id, currentQuantity + 1, unitPrice);
  };

  const decreaseQuantity = (id, currentQuantity, unitPrice) => {
    if (currentQuantity > 1) {
      onUpdateQuantity(id, currentQuantity - 1, unitPrice);
    } else {
      onRemoveFromCart(id);
    }
  };

  const handleCheckout = async () => {
    try {
      setIsProcessingCheckout(true);
      const order = await onCheckout();
      if (order) {
        alert(`Order placed successfully! Order Number: ${order.orderNumber}`);
        setShowCheckoutModal(false);
      }
    } catch (error) {
      alert('Error processing checkout. Please try again.');
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-5">
        <ShoppingCart size={64} className="text-muted mb-3" />
        <h3>Your cart is empty</h3>
        <p className="text-muted">Add some products to your cart to get started!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Shopping Cart</h2>
      
      <Row>
        <Col lg={8}>
          {cart.map((item) => (
            <Card key={item.id} className="mb-3">
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={6}>
                    <h5 className="mb-1">{item.name}</h5>
                    <p className="text-muted mb-2">{item.description}</p>
                    <Badge bg="primary">₱{(item.unitPrice || item.price)?.toFixed(2)} each</Badge>
                  </Col>
                  <Col md={3}>
                    <div className="d-flex align-items-center justify-content-center">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => decreaseQuantity(item.id, item.quantity, item.unitPrice || item.price)}
                      >
                        <Minus size={14} />
                      </Button>
                      <Form.Control
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value, item.unitPrice || item.price)}
                        className="mx-2 text-center"
                        style={{ width: '70px' }}
                        min="1"
                      />
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => increaseQuantity(item.id, item.quantity, item.unitPrice || item.price)}
                      >
                        <Plus size={14} />
                      </Button>
                    </div>
                  </Col>
                  <Col md={2} className="text-center">
                    <strong>₱{(item.totalPayable || (item.unitPrice || item.price) * item.quantity).toFixed(2)}</strong>
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
          ))}
        </Col>
        
        <Col lg={4}>
          <Card className="sticky-top">
            <Card.Header>
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Items ({cart.reduce((total, item) => total + item.quantity, 0)}):</span>
                <span>₱{totalPrice.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span className="text-success">Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong>₱{totalPrice.toFixed(2)}</strong>
              </div>
              <Button 
                variant="success" 
                className="w-100" 
                size="lg"
                onClick={() => setShowCheckoutModal(true)}
                disabled={loading || cart.length === 0}
              >
                <CreditCard size={16} className="me-2" />
                Proceed to Checkout
              </Button>
              <Button 
                variant="outline-secondary" 
                className="w-100 mt-2"
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear your cart?')) {
                    cart.forEach(item => onRemoveFromCart(item.id));
                  }
                }}
                disabled={loading}
              >
                Clear Cart
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Checkout Modal */}
      <Modal show={showCheckoutModal} onHide={() => setShowCheckoutModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <CreditCard size={20} className="me-2" />
            Checkout
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Order Summary</h5>
          <div className="mb-3">
            {cart.map((item) => (
              <div key={item.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                <div>
                  <strong>{item.name}</strong>
                  <br />
                  <small className="text-muted">₱{(item.unitPrice || item.price)?.toFixed(2)} × {item.quantity}</small>
                </div>
                <div>
                  <strong>₱{(item.totalPayable || (item.unitPrice || item.price) * item.quantity).toFixed(2)}</strong>
                </div>
              </div>
            ))}
          </div>
          <div className="d-flex justify-content-between align-items-center py-2">
            <h5>Total Amount:</h5>
            <h5>₱{totalPrice.toFixed(2)}</h5>
          </div>
          <div className="mt-3">
            <p className="text-muted">
              <strong>Note:</strong> This is a demo checkout. Your order will be saved to the database.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCheckoutModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="success" 
            onClick={handleCheckout}
            disabled={isProcessingCheckout}
          >
            {isProcessingCheckout ? (
              <>
                <Spinner size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              'Confirm Order'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Cart;
