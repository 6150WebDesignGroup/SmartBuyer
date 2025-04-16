import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Collapse, Button, Modal, Form, Input, Upload, 
  notification, Card, Image, InputNumber, Select, Spin 
} from 'antd';
import { 
  PlusOutlined, 
  UploadOutlined, 
  EditOutlined, 
  DeleteOutlined,
  ExclamationCircleOutlined 
} from '@ant-design/icons';

const { Panel } = Collapse;
const { TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;

const ProductManagementPage = () => {
  // State variables
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const [activeKeys, setActiveKeys] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // 添加管理员权限检查
  useEffect(() => {
    const checkAdminAccess = () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          console.log('无用户数据，重定向到登录页');
          navigate('/login');
          return;
        }
        
        const user = JSON.parse(userStr);
        if (user.role !== 'Admin') {
          console.log('非管理员用户，重定向到首页');
          navigate('/');
          return;
        }
        
        setIsAdmin(true);
      } catch (error) {
        console.error('解析用户数据错误', error);
        navigate('/login');
      }
    };
    
    checkAdminAccess();
  }, [navigate]);

  // Fetch all categories on component mount
  useEffect(() => {
    if (isAdmin) {
      fetchCategories();
    }
  }, [isAdmin]);

  // Fetch all categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/product/getAllCategory');
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to fetch categories',
      });
      setLoading(false);
    }
  };

  // Fetch products by category
  const fetchProductsByCategory = async (categoryName) => {
    try {
      const response = await axios.post('/product/getAll', {
        categoryName,
        page: 1,
        limit: 100, // Fetch all products for this category
        sortBy: 'name'
      });
      
      setProducts(prev => ({
        ...prev,
        [categoryName]: response.data.productLists
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      notification.error({
        message: 'Error',
        description: `Failed to fetch products for ${categoryName}`,
      });
    }
  };

  // Handle panel change (expand/collapse)
  const handlePanelChange = (keys) => {
    setActiveKeys(keys);
    
    if (keys && keys.length > 0) {
      keys.forEach(categoryName => {
        if (!products[categoryName]) {
          fetchProductsByCategory(categoryName);
        }
      });
    }
  };

  // Open modal to add a new product
  const showAddModal = (categoryName) => {
    setModalVisible(true);
    setEditMode(false);
    setCurrentCategory(categoryName);
    setCurrentProduct(null);
    setFileList([]);
    
    // Find the category object to get its ID
    const category = categories.find(cat => cat.name === categoryName);
    
    form.resetFields();
    form.setFieldsValue({
      categoryId: category?._id,
    });
  };

  // Open modal to edit an existing product
  const showEditModal = (product) => {
    setModalVisible(true);
    setEditMode(true);
    setCurrentProduct(product);
    setCurrentCategory(product.categoryName);
    
    // Prepare image file list for display
    const initialFileList = product.images ? 
      product.images.map((img, index) => ({
        uid: `-${index}`,
        name: `image-${index}`,
        status: 'done',
        url: img,
      })) : [];
    
    setFileList(initialFileList);
    
    // Set form values
    form.setFieldsValue({
      name: product.name,
      categoryId: product.categoryId,
      cardDesc: product.cardDesc,
      pageDesc: product.pageDesc,
      price: product.price,
      ProductNumber: product.ProductNumber,
      deliveryTime: product.deliveryTime,
    });
  };

  // Handle modal cancel
  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  // Handle file upload change
  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  // Handle form submission (add or update product)
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Prepare form data for submission
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('categoryId', values.categoryId);
      formData.append('cardDesc', values.cardDesc);
      formData.append('pageDesc', values.pageDesc);
      formData.append('price', values.price);
      formData.append('ProductNumber', values.ProductNumber);
      formData.append('deliveryTime', values.deliveryTime || '1-3 days');
      
      // Append files if any
      fileList.forEach(file => {
        if (file.originFileObj) {
          formData.append('imgFile', file.originFileObj);
        }
      });

      if (editMode && currentProduct) {
        // Update existing product
        formData.append('id', currentProduct._id);
        await axios.put('/product/edit', formData);
        notification.success({
          message: 'Success',
          description: 'Product updated successfully',
        });
      } else {
        // Add new product
        await axios.post('/product/add', formData);
        notification.success({
          message: 'Success',
          description: 'Product added successfully',
        });
      }
      
      // Refresh products for this category
      fetchProductsByCategory(currentCategory);
      setModalVisible(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to save product',
      });
    }
  };

  // Handle product deletion with confirmation
  const showDeleteConfirm = (product) => {
    confirm({
      title: 'Are you sure you want to delete this product?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteProduct(product);
      },
    });
  };

  // Delete product API call
  const deleteProduct = async (product) => {
    try {
      await axios.delete('/product/delete', {
        data: { id: product._id }
      });
      
      notification.success({
        message: 'Success',
        description: 'Product deleted successfully',
      });
      
      // Refresh products for this category
      fetchProductsByCategory(product.categoryName);
    } catch (error) {
      console.error('Error deleting product:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to delete product',
      });
    }
  };

  // Render product items for a category
  const renderProductItems = (categoryName) => {
    if (!products[categoryName]) {
      return <Spin tip="Loading products..." />;
    }
    
    if (products[categoryName].length === 0) {
      return <div style={{ padding: 16 }}>No products found in this category</div>;
    }
    
    return products[categoryName].map(product => (
      <Card 
        key={product._id} 
        style={{ marginBottom: 16 }}
        actions={[
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => showEditModal(product)}
          >
            Edit
          </Button>,
          <Button 
            type="danger" 
            icon={<DeleteOutlined />} 
            onClick={() => showDeleteConfirm(product)}
          >
            Delete
          </Button>
        ]}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image 
            src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.png'} 
            alt={product.name}
            width={100}
            height={100}
            style={{ objectFit: 'cover', marginRight: 16 }}
            fallback="data:image/png;base64,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"
          />
          <div style={{ flex: 1 }}>
            <h3>{product.name}</h3>
            <p>Description: {product.cardDesc}</p>
            <p>Price: ${product.price}</p>
            <p>Product Number: {product.ProductNumber}</p>
            {product.deliveryTime && <p>Delivery Time: {product.deliveryTime}</p>}
          </div>
        </div>
      </Card>
    ));
  };

  // Upload button component
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  // 权限检查 - 如果不是管理员，显示加载或者空内容
  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return <Spin size="large" tip="Loading categories..." />;
  }

  return (
    <div className="product-management-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>Product Management</h1>
        <Button 
          type="primary" 
          onClick={() => fetchCategories()}
          icon={<UploadOutlined />}
        >
          Refresh Data
        </Button>
      </div>
      
      <Collapse 
        activeKey={activeKeys} 
        onChange={handlePanelChange}
      >
        {categories.map(category => (
          <Panel 
            header={`${category.name} (${products[category.name]?.length || 0} products)`}
            key={category.name}
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  showAddModal(category.name);
                }}
              >
                Add Product
              </Button>
            }
          >
            {renderProductItems(category.name)}
          </Panel>
        ))}
      </Collapse>

      {/* Add/Edit Product Modal */}
      <Modal
        title={editMode ? "Edit Product" : "Add New Product"}
        visible={modalVisible}
        onCancel={handleCancel}
        footer={editMode ? [
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button 
            key="delete" 
            danger 
            onClick={() => {
              handleCancel();
              currentProduct && showDeleteConfirm(currentProduct);
            }}
          >
            Delete
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            Update
          </Button>,
        ] : [
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            Save
          </Button>,
        ]}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Please enter product name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select disabled={!!currentCategory}>
              {categories.map(cat => (
                <Option key={cat._id} value={cat._id}>{cat.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="cardDesc"
            label="Card Description"
            rules={[{ required: true, message: 'Please enter card description' }]}
          >
            <TextArea rows={2} />
          </Form.Item>

          <Form.Item
            name="pageDesc"
            label="Page Description"
            rules={[{ required: true, message: 'Please enter page description' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please enter product price' }]}
          >
            <InputNumber 
              min={0} 
              step={0.01} 
              style={{ width: '100%' }} 
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="ProductNumber"
            label="Product Number"
            rules={[{ required: true, message: 'Please enter product number' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="deliveryTime"
            label="Delivery Time"
          >
            <Input placeholder="e.g. 1-3 days" />
          </Form.Item>

          <Form.Item
            name="imgFile"
            label="Product Images"
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false} // Prevent auto upload
              multiple
            >
              {fileList.length >= 5 ? null : uploadButton}
            </Upload>
            <div style={{ marginTop: 8, color: '#888' }}>
              You can upload up to 5 product images. The first image will be displayed as the main product image.
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagementPage;