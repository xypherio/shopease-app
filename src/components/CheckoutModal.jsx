import { Modal, Button, Spinner } from 'react-bootstrap';
import { CreditCard } from 'lucide-react';

const CheckoutModal = ({ show, onHide, cart, totalPrice, handleCheckout, isProcessingCheckout }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
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
            <div
              key={item.id}
              className="d-flex justify-content-between align-items-center py-2 border-bottom"
            >
              <div>
                <strong>{item.name}</strong>
                <br />
                <small className="text-muted">
                  ₱{(item.unitPrice || item.price)?.toFixed(2)} ×{' '}
                  {item.quantity}
                </small>
              </div>
              <div>
                <strong>
                  ₱
                  {(
                    item.totalPayable ||
                    (item.unitPrice || item.price) * item.quantity
                  ).toFixed(2)}
                </strong>
              </div>
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-between align-items-center py-2">
          <h5>Total Amount:</h5>
          <h5 className="text-muted">₱{totalPrice.toFixed(2)}</h5>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
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
  );
};

export default CheckoutModal;
