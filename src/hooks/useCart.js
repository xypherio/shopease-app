import { useState, useEffect } from 'react';
import * as cartService from '../services/cartService';
import * as firebaseCartService from '../services/firebaseCartService';
import * as productService from '../services/productService';

// Custom hook for managing cart state with Firebase integration
export const useCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart from Firebase on component mount
  useEffect(() => {
    loadCartFromFirebase();
  }, []);

  const loadCartFromFirebase = async () => {
    try {
      setLoading(true);
      const firebaseCart = await firebaseCartService.getFirebaseCart();
      setCart(firebaseCart);
    } catch (error) {
      console.error('Error loading cart from Firebase:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    try {
      // Check if product has sufficient stock
      if (cartService.isOutOfStock(product)) {
        alert('This product is out of stock!');
        return;
      }

      // Check if item already exists in cart
      const existingItem = cart.find(item => item.productId === product.id);
      let quantity = 1;
      
      if (existingItem) {
        // If item exists, increment quantity
        quantity = existingItem.quantity + 1;
        await firebaseCartService.updateFirebaseCartItem(existingItem.id, quantity, product.price);
      } else {
        // Add new item to Firebase cart
        await firebaseCartService.addToFirebaseCart(product, quantity);
      }

      // Update product stock
      const newStockCount = product.stocksLeft - 1;
      await productService.updateProductStock(product.id, newStockCount);

      // Reload cart to sync with Firebase
      await loadCartFromFirebase();
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding product to cart. Please try again.');
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      // Remove from local state
      setCart(prevCart => prevCart.filter(item => item.id !== cartItemId));

      // Remove from Firebase
      await firebaseCartService.removeFromFirebaseCart(cartItemId);
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Error removing item from cart. Please try again.');
    }
  };

  const updateQuantity = async (cartItemId, quantity, unitPrice) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(cartItemId);
        return;
      }

      // Update local state
      setCart(prevCart => 
        prevCart.map(item => 
          item.id === cartItemId ? { ...item, quantity, totalPayable: quantity * unitPrice } : item
        )
      );

      // Update Firebase
      await firebaseCartService.updateFirebaseCartItem(cartItemId, quantity, unitPrice);
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      alert('Error updating quantity. Please try again.');
    }
  };

  const clearCart = async () => {
    try {
      setCart([]);
      await firebaseCartService.clearFirebaseCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Error clearing cart. Please try again.');
    }
  };

  const checkout = async (customerInfo = {}) => {
    try {
      if (cart.length === 0) {
        alert('Your cart is empty!');
        return null;
      }

      const checkoutData = {
        items: cart,
        totalAmount: cartService.calculateCartTotal(cart),
        totalItems: cartService.calculateCartItemCount(cart),
        customerInfo
      };

      const order = await firebaseCartService.processCheckout(checkoutData);
      setCart([]); // Clear local cart after successful checkout
      
      return order;
    } catch (error) {
      console.error('Error processing checkout:', error);
      throw error;
    }
  };

  const cartSummary = cartService.getCartSummary(cart);

  return {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout,
    refreshCart: loadCartFromFirebase,
    ...cartSummary
  };
};
