import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'shopay_products';

// Get all products from Firebase
export const fetchProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const productsData = [];
    querySnapshot.forEach((doc) => {
      productsData.push({ id: doc.id, ...doc.data() });
    });
    return productsData;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Add a new product to Firebase
export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...productData,
      stocksLeft: productData.stocksLeft || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...productData, stocksLeft: productData.stocksLeft || 0 };
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Update product stock when item is added to cart
export const updateProductStock = async (productId, newStockCount) => {
  try {
    await updateDoc(doc(db, COLLECTION_NAME, productId), {
      stocksLeft: newStockCount,
      updatedAt: new Date()
    });
    return newStockCount;
  } catch (error) {
    console.error('Error updating product stock:', error);
    throw error;
  }
};

// Update an existing product in Firebase
export const updateProduct = async (id, updatedData) => {
  try {
    await updateDoc(doc(db, COLLECTION_NAME, id), {
      ...updatedData,
      updatedAt: new Date()
    });
    return { id, ...updatedData };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete a product from Firebase
export const deleteProduct = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return id;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Get a single product by ID
export const getProductById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};
