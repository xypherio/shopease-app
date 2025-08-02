import { useState } from 'react';
import ProductList from '../components/ProductList';
import ProductModal from '../components/ProductModal';
import { useProducts } from '../hooks/useProducts';

const ProductsPage = ({ onAddToCart }) => {
  const { products, loading, addProduct, updateProduct, deleteProduct, refreshProducts } = useProducts();
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Enhanced add to cart function that refreshes products
  const handleAddToCart = async (product) => {
    await onAddToCart(product);
    // Refresh products to update stock levels
    refreshProducts();
  };

  // Modal handlers
  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleCloseModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }
      setShowProductModal(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <>
      <ProductList
        products={products}
        loading={loading}
        onAddToCart={handleAddToCart}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        onAddProduct={handleAddProduct}
      />

      <ProductModal
        show={showProductModal}
        onHide={handleCloseModal}
        onSave={handleSaveProduct}
        product={editingProduct}
        isEditing={!!editingProduct}
      />
    </>
  );
};

export default ProductsPage;
