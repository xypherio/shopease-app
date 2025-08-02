import * as firebaseCartService from './firebaseCartService';

// Cart service for managing cart operations with Firebase integration

// Add item to cart (local state helper)
export const addToCart = (cart, product) => {
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    return cart.map(item => 
      item.id === product.id 
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    return [...cart, { ...product, quantity: 1 }];
  }
};

// Check if product has sufficient stock
export const hasStock = (product, requestedQuantity = 1) => {
  return product.stocksLeft >= requestedQuantity;
};

// Check if product is out of stock
export const isOutOfStock = (product) => {
  return !product.stocksLeft || product.stocksLeft <= 0;
};

export const removeFromCart = (cart, productId) => {
  return cart.filter(item => item.id !== productId);
};

export const updateCartQuantity = (cart, productId, quantity) => {
  if (quantity <= 0) {
    return removeFromCart(cart, productId);
  }
  
  return cart.map(item => 
    item.id === productId ? { ...item, quantity } : item
  );
};

export const calculateCartTotal = (cart) => {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const calculateCartItemCount = (cart) => {
  return cart.reduce((total, item) => total + item.quantity, 0);
};

export const clearCart = () => {
  return [];
};

export const getCartSummary = (cart) => {
  return {
    items: cart,
    totalItems: calculateCartItemCount(cart),
    totalPrice: calculateCartTotal(cart),
    isEmpty: cart.length === 0
  };
};
