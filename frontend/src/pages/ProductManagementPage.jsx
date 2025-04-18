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
    ExclamationCircleOutlined,
    ReloadOutlined
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

    // 获取所有产品并按类别整理
    const fetchAllProducts = async () => {
        setLoading(true);
        try {
            // 首先获取所有类别
            const categoriesResponse = await axios.get('/product/getAllCategory');
            let categoryData = categoriesResponse.data;
            
            if (!Array.isArray(categoryData) && categoryData.categories) {
                categoryData = categoryData.categories;
            }
            
            if (!Array.isArray(categoryData) && typeof categoryData === 'object') {
                if (Array.isArray(categoryData["categories"])) {
                    categoryData = categoryData["categories"];
                }
            }
            
            const categoriesArray = Array.isArray(categoryData) ? categoryData : [];
            setCategories(categoriesArray);
            
            // 为每个类别获取产品
            const productsByCategory = {};
            
            for (const category of categoriesArray) {
                try {
                    const response = await axios.post('/product/byCategory', {
                        categoryId: Number(category.ProductCateId),
                        page: 1,
                        limit: 100,
                        _t: new Date().getTime() // 防止缓存
                    });
                    
                    console.log(`Products for ${category.name}:`, response.data);
                    
                    let productData = response.data;
                    if (productData && productData.products) {
                        productData = productData.products;
                    }
                    
                    productsByCategory[category.name] = Array.isArray(productData) 
                        ? productData 
                        : [];
                        
                    console.log(`Saved ${productsByCategory[category.name].length} products for ${category.name}`);
                } catch (error) {
                    console.error(`Error fetching products for ${category.name}:`, error);
                    productsByCategory[category.name] = [];
                }
            }
            
            console.log('All products by category:', productsByCategory);
            setProducts(productsByCategory);
            
            // 如果有类别，自动展开第一个
            if (categoriesArray.length > 0) {
                const firstCategory = categoriesArray[0].name;
                setActiveKeys([firstCategory]);
            }
            
            setLoading(false);
            
            notification.success({
                message: '刷新成功',
                description: '所有产品数据已刷新'
            });
        } catch (error) {
            console.error('Error fetching all products:', error);
            notification.error({
                message: '刷新失败',
                description: '获取产品数据失败'
            });
            setLoading(false);
        }
    };

    // Fetch all categories
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/product/getAllCategory');
            console.log('Category response:', response);
            
            // 如果返回的数据嵌套在categories字段中
            let categoryData = response.data;
            
            // 如果数据嵌套在其他字段中，例如response.data.categories
            if (!Array.isArray(categoryData) && categoryData && categoryData.categories) {
                categoryData = categoryData.categories;
            }
            
            // 从网络请求的响应看，数据在categories字段下
            if (!Array.isArray(categoryData) && typeof categoryData === 'object') {
                if (categoryData && Array.isArray(categoryData["categories"])) {
                    categoryData = categoryData["categories"];
                }
            }
            
            console.log('Processed categories:', categoryData);
            
            // 确保它是一个数组
            const categoriesArray = Array.isArray(categoryData) ? categoryData : [];
            
            // 先设置类别数据
            setCategories(categoriesArray);
            
            // 如果有类别，自动展开第一个
            if (categoriesArray.length > 0) {
                const firstCategory = categoriesArray[0].name;
                setActiveKeys([firstCategory]);
                
                // 重要修改：使用回调函数确保数据已更新
                setCategories(categoriesArray, () => {
                    // 使用 categoriesArray，而不是通过 state 访问
                    if (firstCategory) {
                        // 改用直接传递已知的类别对象
                        const firstCategoryObj = categoriesArray[0];
                        fetchProductsByCategoryObj(firstCategoryObj);
                    }
                });
            }
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
            notification.error({
                message: 'Error',
                description: 'Failed to fetch categories',
            });
            setCategories([]);
            setLoading(false);
        }
    };

    // 添加handlePanelChange函数
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

    const fetchProductsByCategoryObj = async (categoryObj) => {
        if (!categoryObj) {
            console.error('Category object is undefined');
            return;
        }
        
        const categoryName = categoryObj.name;
        
        try {
            console.log(`Fetching products for category: ${categoryName} using direct object`);
            
            // 直接使用传入的类别对象，无需查找
            const categoryId = categoryObj.ProductCateId || categoryObj.categoryId;
            if (categoryId === undefined || categoryId === null) {
                console.error('Invalid category ID:', categoryId);
                return;
            }
            
            console.log('Using categoryId:', categoryId, 'Type:', typeof categoryId);
            
            // 调用API，传递正确类型的categoryId
            const response = await axios.post('/product/byCategory', {
                categoryId: Number(categoryId),
                page: 1,
                limit: 100,
                _t: new Date().getTime()
            });
            
            console.log('Products response:', response);
            
            let productData = response.data;
            if (productData && productData.products) {
                productData = productData.products;
            }
            
            setProducts(prev => ({
                ...prev,
                [categoryName]: Array.isArray(productData) ? productData : []
            }));
        } catch (error) {
            console.error(`Error fetching products for ${categoryName}:`, error);
            
            notification.error({
                message: 'Error',
                description: `Failed to fetch products for ${categoryName}`
            });
            
            setProducts(prev => ({
                ...prev,
                [categoryName]: []
            }));
        }
    };

    // Fetch products by category
    const fetchProductsByCategory = async (categoryName) => {
        if (!categoryName) {
            console.error('Category name is undefined');
            return;
        }
        
        // 防止在 categories 未加载时调用
        if (!categories || categories.length === 0) {
            console.error('Categories not loaded yet - deferring fetch');
            
            // 延迟重试，给类别数据加载的时间
            setTimeout(() => {
                // 再次检查类别是否已加载
                if (categories && categories.length > 0) {
                    fetchProductsByCategory(categoryName);
                } else {
                    console.error('Categories still not loaded after delay');
                }
            }, 500);
            return;
        }
        
        try {
            console.log(`Fetching products for category: ${categoryName}`);
            
            // 找到对应的类别对象
            const category = categories.find(cat => cat && cat.name === categoryName);
            if (!category) {
                console.error(`Cannot find category with name: ${categoryName}`);
                return;
            }
            
            // 使用新的函数实现
            fetchProductsByCategoryObj(category);
        } catch (error) {
            console.error(`Error in fetchProductsByCategory for ${categoryName}:`, error);
        }
    };

    // Open modal to add a new product
    const showAddModal = (categoryName) => {
        setModalVisible(true);
        setEditMode(false);
        setCurrentCategory(categoryName);
        setCurrentProduct(null);
        setFileList([]);
        
        // 找到对应类别
        const category = categories.find(cat => cat.name === categoryName);
        if (!category) {
            console.error(`Cannot find category with name: ${categoryName}`);
            notification.error({
                message: 'Error',
                description: `Category not found: ${categoryName}`
            });
            return;
        }
        
        console.log('Found category:', category);
        
        // categoryId 必须是正确的数字类型
        // 在数据结构中，这应该是 ProductCateId 字段
        const categoryId = typeof category.ProductCateId === 'number' ? category.ProductCateId : 
                          (typeof category.categoryId === 'number' ? category.categoryId : 1);
        
        console.log(`Setting categoryId to: ${categoryId} for category: ${categoryName}`);
        
        // 重置表单并设置初始值
        form.resetFields();
        form.setFieldsValue({
            categoryId: categoryId,
            name: '',
            cardDesc: '',
            pageDesc: '',
            price: 0,
            ProductNumber: `P-${Math.floor(Math.random() * 10000)}`,
            ProductDeliveryTime: '3-5 days',
            deliveryTime: 5,
            ProductQuantity: 10
        });
    };

    // Open modal to edit an existing product
    const showEditModal = (product) => {
        setModalVisible(true);
        setEditMode(true);
        setCurrentProduct(product);
        setCurrentCategory(product.categoryName);

        // Prepare image file list for display
        const initialFileList = product.ProductImages ?
            product.ProductImages.map((img, index) => ({
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
            ProductDeliveryTime: product.ProductDeliveryTime || '3-5 days',
            deliveryTime: product.deliveryTime || 5,
            ProductQuantity: product.ProductQuantity || 10
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
            console.log('提交按钮被点击');
            
            // 表单验证前先打印当前表单值
            console.log('当前表单值:', form.getFieldsValue());
            console.log('当前图片文件:', fileList);
            
            const values = await form.validateFields();
            console.log('表单验证通过，获取的值:', values);
            
            // 检查必填字段
            if (!values.name || !values.categoryId || !values.cardDesc || !values.pageDesc || 
                !values.price || !values.ProductNumber || !values.ProductDeliveryTime || 
                !values.ProductQuantity) {
                console.error('缺少必填字段');
                notification.error({
                    message: 'Missing Fields',
                    description: 'Please fill in all required fields'
                });
                return;
            }
            
            // 检查图片上传
            if (fileList.length === 0) {
                console.error('没有上传图片');
                notification.error({
                    message: 'Missing Image',
                    description: 'At least one product image is required'
                });
                return;
            }
            
            // 创建 FormData 对象
            const formData = new FormData();
            console.log('开始构建 FormData');
            
            // 添加必填字段
            formData.append('name', values.name);
            formData.append('categoryId', values.categoryId);
            formData.append('cardDesc', values.cardDesc);
            formData.append('pageDesc', values.pageDesc);
            formData.append('price', values.price);
            formData.append('ProductNumber', values.ProductNumber);
            formData.append('ProductDeliveryTime', values.ProductDeliveryTime);
            formData.append('deliveryTime', values.deliveryTime);
            formData.append('ProductQuantity', values.ProductQuantity);
            
            // 添加图片文件
            let hasValidImage = false;
            fileList.forEach(file => {
                if (file.originFileObj) {
                    formData.append('imgFile', file.originFileObj);
                    hasValidImage = true;
                    console.log(`添加图片: ${file.name}`);
                } else if (file.url) {
                    console.log(`文件已有URL，不需要重新上传: ${file.url}`);
                    // 对于编辑模式下已有的图片，可能需要添加特殊处理
                }
            });
            
            if (!hasValidImage && !editMode) {
                console.error('所有上传的图片都无效');
                notification.error({
                    message: 'Invalid Images',
                    description: 'Please upload at least one valid image'
                });
                return;
            }
            
            // 输出表单数据内容进行检查
            console.log('FormData 内容:');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value instanceof File ? `File: ${value.name}` : value}`);
            }
            
            // 显示加载状态
            notification.info({
                message: '正在处理',
                description: '正在提交产品数据，请稍候...'
            });
            
            // 发送请求
            console.log('准备发送API请求');
            let response;
            if (editMode && currentProduct) {
                formData.append('id', currentProduct._id);
                console.log(`编辑模式，产品ID: ${currentProduct._id}`);
                response = await axios.put('/product/edit', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                console.log('添加新产品');
                response = await axios.post('/product/add', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            
            console.log('API 响应:', response);
            
            // 显示成功消息
            notification.success({
                message: 'Success',
                description: editMode ? 'Product updated successfully' : 'Product added successfully'
            });
            
            // 关闭模态框
            setModalVisible(false);
            
            await fetchAllProducts(); 
        } catch (error) {
            console.error('提交表单时出错:', error);
            
            if (error.errorFields) {
                console.error('表单验证错误:', error.errorFields);
                notification.error({
                    message: 'Form Validation Error',
                    description: error.errorFields.map(field => field.errors.join(', ')).join('; ')
                });
                return;
            }
            
            if (error.response) {
                console.error('服务器响应错误:');
                console.error('状态码:', error.response.status);
                console.error('响应数据:', error.response.data);
                console.error('响应头:', error.response.headers);
            }
            
            notification.error({
                message: 'Error',
                description: error.response?.data?.error || error.message || 'Failed to save product'
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

            // 刷新所有产品数据
            fetchAllProducts();
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
            return (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin tip="Loading products..." />
                </div>
            );
        }
        
        if (Array.isArray(products[categoryName]) && products[categoryName].length === 0) {
            return <div style={{ padding: 16 }}>No products found in this category</div>;
        }
        
        return Array.isArray(products[categoryName]) ? products[categoryName].map(product => (
            <Card
                key={product._id}
                style={{ marginBottom: 16 }}
                actions={[
                    <Button
                        key="edit"
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => showEditModal(product)}
                    >
                        Edit
                    </Button>,
                    <Button
                        key="delete"
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
                        src={product.ProductImages && product.ProductImages.length > 0 
                            ? product.ProductImages[0] 
                            : '/placeholder-image.png'}
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
                        <p>Product Number: {product.ProductNumber || 'N/A'}</p>
                        <p>Quantity: {product.ProductQuantity || 'N/A'}</p>
                        {product.ProductDeliveryTime && (
                            <p>Delivery Time: {product.ProductDeliveryTime}</p>
                        )}
                    </div>
                </div>
            </Card>
        )) : <div>Error loading products</div>;
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
                <Button
                    type="primary"
                    onClick={fetchAllProducts}
                    icon={<ReloadOutlined />}
                >
                    刷新所有产品
                </Button>
                <Button
                    type="primary"
                    onClick={() => fetchCategories()}
                    icon={<UploadOutlined />}
                >
                    刷新分类
                </Button>
            </div>

            <Collapse
                activeKey={activeKeys}
                onChange={handlePanelChange}
            >
                {Array.isArray(categories) && categories.length > 0 ? (
                    categories.map(category => (
                        <Panel
                            header={`${category.name} (${products[category.name]?.length || 0} products)`}
                            key={category.name}
                            extra={
                                <div onClick={e => e.stopPropagation()}>
                                    <Button
                                        type="default"
                                        icon={<ReloadOutlined />}
                                        onClick={() => fetchProductsByCategory(category.name)}
                                        style={{ marginRight: 8 }}
                                    />
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
                                    </div>
                                }
                            >
                                {renderProductItems(category.name)}
                            </Panel>
                        ))
                    ) : (
                        <div style={{ padding: 20, textAlign: 'center' }}>
                            <p>No categories found. Please add categories first.</p>
                        </div>
                    )}
                </Collapse>
    
                {/* Add/Edit Product Modal */}
                <Modal
                    title={editMode ? "Edit Product" : "Add New Product"}
                    open={modalVisible}
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
                            label="Category ID"
                            hidden
                        >
                            <Input />
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
                            <Input placeholder="e.g. P12345" />
                        </Form.Item>
    
                        <Form.Item
                            name="ProductDeliveryTime"
                            label="Delivery Time Description"
                            rules={[{ required: true, message: 'Please enter delivery time description' }]}
                        >
                            <Input placeholder="e.g. 1-3 days" />
                        </Form.Item>
    
                        <Form.Item
                            name="deliveryTime"
                            label="Delivery Time (Days)"
                            rules={[{ required: true, message: 'Please enter delivery time in days' }]}
                        >
                            <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>
    
                        <Form.Item
                            name="ProductQuantity"
                            label="Product Quantity"
                            rules={[{ required: true, message: 'Please enter product quantity' }]}
                        >
                            <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>
    
                        <Form.Item
                            name="imgFile"
                            label="Product Images"
                        >
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                onChange={handleUploadChange}
                                beforeUpload={() => false}
                                multiple
                            >
                                {fileList.length >= 5 ? null : uploadButton}
                            </Upload>
                            <div style={{ marginTop: 8, color: '#888' }}>
                                You must upload at least one product image (up to 5).
                            </div>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    };
    
    export default ProductManagementPage;