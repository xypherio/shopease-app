import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProductsPage from './pages/Products';
import CartPage from './pages/Cart';
import { useCart } from './hooks/useCart';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    checkout,
    totalItems
  } = useCart();

  return (
    <Router>
      <Layout cartItemCount={totalItems}>
        <Routes>
          <Route 
            path="/" 
            element={
              <ProductsPage onAddToCart={addToCart} />
            } 
          />
          <Route 
            path="/cart" 
            element={
              <CartPage 
                cart={cart}
                onRemoveFromCart={removeFromCart}
                onUpdateQuantity={updateQuantity}
                onCheckout={checkout}
              />
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
