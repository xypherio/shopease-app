import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase';

const CART_COLLECTION = 'cart';
const CHECKOUT_COLLECTION = 'checkout_orders';

// Add item to Firebase cart
export const addToFirebaseCart = async (product, quantity = 1) => {
  try {
    // Validate required fields
    if (
      !product ||
      !product.name ||
      !product.id ||
      (typeof product.price !== 'number' && typeof product.unitPrice !== 'number')
    ) {
      throw new Error('Invalid product: missing required fields');
    }

    const unitPrice = product.price || product.unitPrice;
    const cartData = {
      name: product.name,
      description: product.description || '',
      quantity: quantity,
      unitPrice: unitPrice,
      productId: product.id,
      totalPayable: unitPrice * quantity,
      addedAt: new Date()
    };

    const docRef = await addDoc(collection(db, CART_COLLECTION), cartData);
    return { id: docRef.id, ...cartData };
  } catch (error) {
    console.error('Error adding to Firebase cart:', error);
    throw error;
  }
};
// ...existing code...

// Get all cart items from Firebase
export const getFirebaseCart = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, CART_COLLECTION));
    const cartItems = [];
    querySnapshot.forEach((doc) => {
      cartItems.push({ id: doc.id, ...doc.data() });
    });
    return cartItems;
  } catch (error) {
    console.error('Error fetching Firebase cart:', error);
    throw error;
  }
};

// Update cart item quantity in Firebase
export const updateFirebaseCartItem = async (cartItemId, quantity, unitPrice) => {
  try {
    const totalPayable = quantity * unitPrice;
    await updateDoc(doc(db, CART_COLLECTION, cartItemId), {
      quantity,
      totalPayable,
      updatedAt: new Date()
    });
    return { quantity, totalPayable };
  } catch (error) {
    console.error('Error updating Firebase cart item:', error);
    throw error;
  }
};

// Remove item from Firebase cart
export const removeFromFirebaseCart = async (cartItemId) => {
  try {
    await deleteDoc(doc(db, CART_COLLECTION, cartItemId));
  } catch (error) {
    console.error('Error removing from Firebase cart:', error);
    throw error;
  }
};

// Clear entire Firebase cart
export const clearFirebaseCart = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, CART_COLLECTION));
    const deletePromises = [];
    querySnapshot.forEach((doc) => {
      deletePromises.push(deleteDoc(doc.ref));
    });
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error clearing Firebase cart:', error);
    throw error;
  }
};

// Checkout - save order details to Firebase
export const processCheckout = async (checkoutData) => {
  try {
    const orderData = {
      items: checkoutData.items,
      totalAmount: checkoutData.totalAmount,
      totalItems: checkoutData.totalItems,
      customerInfo: checkoutData.customerInfo || {},
      orderDate: new Date(),
      status: 'pending',
      orderNumber: `ORD-${Date.now()}`
    };

    const docRef = await addDoc(collection(db, CHECKOUT_COLLECTION), orderData);
    
    // Clear cart after successful checkout
    await clearFirebaseCart();
    
    return { id: docRef.id, ...orderData };
  } catch (error) {
    console.error('Error processing checkout:', error);
    throw error;
  }
};

// Get checkout history
export const getCheckoutHistory = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, CHECKOUT_COLLECTION));
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    return orders.sort((a, b) => b.orderDate - a.orderDate);
  } catch (error) {
    console.error('Error fetching checkout history:', error);
    throw error;
  }
};
