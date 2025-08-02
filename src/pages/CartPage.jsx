import Cart from '../components/Cart';

const CartPage = ({ cart, onRemoveFromCart, onUpdateQuantity, onCheckout, loading }) => {
  return (
    <Cart 
      cart={cart}
      onRemoveFromCart={onRemoveFromCart}
      onUpdateQuantity={onUpdateQuantity}
      onCheckout={onCheckout}
      loading={loading}
    />
  );
};

export default CartPage;
