import { useReducer, useEffect } from 'react';
import * as firebaseCartService from '../services/firebaseCartService';
import * as productService from '../services/productService';
import * as cartService from '../services/cartService';
import { cartReducer, initialCartState, cartActions } from '../reducers/cartReducer';

export const useCart = () => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  useEffect(() => {
    loadCartFromFirebase();
  }, []);

  const loadCartFromFirebase = async () => {
    try {
      dispatch(cartActions.setLoading(true));
      const firebaseCart = await firebaseCartService.getFirebaseCart();
      dispatch(cartActions.setCart(firebaseCart));
    } catch (error) {
      console.error('Error loading cart from Firebase:', error);
      dispatch(cartActions.setError('Failed to load cart from Firebase'));
    }
  };

  const addToCart = async (product) => {
    try {
      dispatch(cartActions.clearError());
      
      // Check if product has sufficient stock
      if (cartService.isOutOfStock(product)) {
        dispatch(cartActions.setError('This product is out of stock!'));
        return;
      }

      dispatch(cartActions.setLoading(true));

      // Check if item already exists in cart
      const existingItem = state.items.find(item => item.productId === product.id);
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
      dispatch(cartActions.setError('Error adding product to cart. Please try again.'));
    }
  };

const removeFromCart = async (cartItemId) => {
  try {
    dispatch(cartActions.clearError());
    dispatch(cartActions.setLoading(true));

    // Find the cart item details first (to get productId and quantity)
    const cartItem = state.items.find(item => item.id === cartItemId);
    if (!cartItem) throw new Error('Cart item not found');

    // Fetch the current product stock
    const productDoc = await productService.getProductById(cartItem.productId);
    if (!productDoc) throw new Error('Product not found');

    const currentStock = productDoc.stocksLeft || 0;
    const updatedStock = currentStock + cartItem.quantity;

    // Update the product stock
    await productService.updateProductStock(cartItem.productId, updatedStock);

    // Remove the item from Firebase cart
    await firebaseCartService.removeFromFirebaseCart(cartItemId);

    // Reload cart to sync
    await loadCartFromFirebase();

  } catch (error) {
    console.error('Error removing from cart:', error);
    dispatch(cartActions.setError('Error removing item from cart. Please try again.'));
  }
};


  const updateQuantity = async (cartItemId, quantity, unitPrice) => {
    try {
      dispatch(cartActions.clearError());
      
      if (quantity <= 0) {
        await removeFromCart(cartItemId);
        return;
      }

      dispatch(cartActions.setLoading(true));

      // Update Firebase
      await firebaseCartService.updateFirebaseCartItem(cartItemId, quantity, unitPrice);
      
      // Reload cart to sync with Firebase
      await loadCartFromFirebase();
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      dispatch(cartActions.setError('Error updating quantity. Please try again.'));
    }
  };

  const clearCart = async () => {
    try {
      dispatch(cartActions.clearError());
      dispatch(cartActions.setLoading(true));
      
      await firebaseCartService.clearFirebaseCart();
      dispatch(cartActions.clearCart());
    } catch (error) {
      console.error('Error clearing cart:', error);
      dispatch(cartActions.setError('Error clearing cart. Please try again.'));
    }
  };

  const checkout = async (customerInfo = {}) => {
    try {
      dispatch(cartActions.clearError());
      
      if (state.items.length === 0) {
        dispatch(cartActions.setError('Your cart is empty!'));
        return null;
      }

      dispatch(cartActions.setLoading(true));

      const checkoutData = {
        items: state.items,
        totalAmount: state.totalPrice,
        totalItems: state.totalItems,
        customerInfo
      };

      const order = await firebaseCartService.processCheckout(checkoutData);
      dispatch(cartActions.clearCart());
      
      return order;
    } catch (error) {
      console.error('Error processing checkout:', error);
      dispatch(cartActions.setError('Error processing checkout. Please try again.'));
      throw error;
    }
  };

  return {
    cart: state.items,
    loading: state.loading,
    error: state.error,
    totalItems: state.totalItems,
    totalPrice: state.totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout
  };
};
