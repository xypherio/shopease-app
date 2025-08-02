import { useState, useEffect } from 'react';
import * as productService from '../services/productService';

// Custom hook for managing products
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const productsData = await productService.fetchProducts();
      setProducts(productsData);
    } catch (err) {
      setError(err.message);
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData) => {
    try {
      const newProduct = await productService.addProduct(productData);
      setProducts(prevProducts => [...prevProducts, newProduct]);
      return newProduct;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateProduct = async (id, updatedData) => {
    try {
      const updatedProduct = await productService.updateProduct(id, updatedData);
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === id ? { ...product, ...updatedData } : product
        )
      );
      return updatedProduct;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productService.deleteProduct(id);
      setProducts(prevProducts => 
        prevProducts.filter(product => product.id !== id)
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const refreshProducts = () => {
    loadProducts();
  };

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts
  };
};
