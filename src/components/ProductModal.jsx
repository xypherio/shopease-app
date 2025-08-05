import { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { Plus, Edit } from 'lucide-react';

const ProductModal = ({ show, onHide, onSave, product, isEditing }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    stocksLeft: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (show) {
      if (isEditing && product) {
        setFormData({
          name: product.name || '',
          price: product.price?.toString() || '',
          description: product.description || '',
          stocksLeft: product.stocksLeft?.toString() || ''
        });
      } else {
        setFormData({
          name: '',
          price: '',
          description: '',
          stocksLeft: ''
        });
      }
      setShowSuccess(false);
    }
  }, [show, isEditing, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.description || !formData.stocksLeft) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        stocksLeft: parseInt(formData.stocksLeft)
      };

      if (isEditing && product) {
        await onSave(productData);
      } else {
        await onSave(productData);
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onHide();
      }, 1500);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', price: '', description: '' });
    setShowSuccess(false);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing ? (
            <>
              <Edit size={30} className="p-1 mx-2" />
              Edit Product
            </>
          ) : (
            <>
              <Plus size={30} className="p-1 mx-2" />
              Add New Product
            </>
          )}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {showSuccess && (
          <Alert variant="success" className="mb-4">
            Product {isEditing ? 'updated' : 'added'} successfully!
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Product Name *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price *</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              step="0.01"
              min="0"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Stock Quantity *</Form.Label>
            <Form.Control
              type="number"
              name="stocksLeft"
              value={formData.stocksLeft}
              onChange={handleChange}
              placeholder="Enter stock quantity"
              min="0"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? (isEditing ? 'Updating...' : 'Adding...') 
            : (isEditing ? 'Update Product' : 'Add Product')
          }
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;
