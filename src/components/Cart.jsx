import { useState } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { ShoppingCart, CreditCard } from 'lucide-react';
import CartItem from './CartItem';
import CheckoutModal from './CheckoutModal';

const Cart = ({ cart, onRemoveFromCart, onCheckout, loading }) => {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  const totalPrice = cart.reduce(
    (total, item) =>
      total + (item.totalPayable || item.unitPrice * item.quantity),
    0
  );

  const handleCheckout = async () => {
    try {
      setIsProcessingCheckout(true);
      const order = await onCheckout();
      if (order) {
        alert(`Order placed successfully! Order Number: ${order.orderNumber}`);
        setShowCheckoutModal(false);
      }
    } catch (error) {
      alert("Error processing checkout. Please try again.");
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-5">
        <ShoppingCart size={64} className="text-muted mb-3" />
        <h3>Your cart is empty</h3>
        <p className="text-muted">
          Add some products to your cart to get started!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">SHOPPING CART</h2>

      <Row>
        <Col lg={8}>
          {cart.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onRemoveFromCart={onRemoveFromCart}
            />
          ))}
        </Col>
        <Col lg={4}>
          <Card className="sticky-top">
            <Card.Header>
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>
                  Items (
                  {cart.reduce((total, item) => total + item.quantity, 0)}):
                </span>
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
                className="w-100 btn-primary"
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
                  if (
                    window.confirm("Are you sure you want to clear your cart?")
                  ) {
                    cart.forEach((item) => onRemoveFromCart(item.id));
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

      <CheckoutModal
        show={showCheckoutModal}
        onHide={() => setShowCheckoutModal(false)}
        cart={cart}
        totalPrice={totalPrice}
        handleCheckout={handleCheckout}
        isProcessingCheckout={isProcessingCheckout}
      />
    </div>
  );
};

export default Cart;
