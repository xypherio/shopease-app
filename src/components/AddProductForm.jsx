import { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Plus } from 'lucide-react';

const AddProductForm = ({ onAddProduct }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.description) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onAddProduct({
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        createdAt: new Date()
      });

      // Reset form
      setFormData({
        name: '',
        price: '',
        description: ''
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Add New Product</h2>
      
      {showSuccess && (
        <Alert variant="success" className="mb-4">
          Product added successfully!
        </Alert>
      )}

      <Card>
        <Card.Body>
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

            <Button 
              variant="primary" 
              type="submit" 
              disabled={isSubmitting}
              className="w-100"
            >
              <Plus size={16} className="me-2" />
              {isSubmitting ? 'Adding Product...' : 'Add Product'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddProductForm;
