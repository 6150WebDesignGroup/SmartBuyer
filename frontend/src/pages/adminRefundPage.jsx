import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap';

const AdminRefundPage = () => {
    const [refundOrders, setRefundOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // getAll
    useEffect(() => {
        const fetchRefundOrders = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/orders/getAllRefund');
                setRefundOrders(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch refund orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchRefundOrders();
    }, []);

    const handleRefundAction = async (orderId, action) => {
        try {
            // action: 'approve' or 'reject'
            await axios.put(`http://localhost:5001/api/orders/review-refund/${orderId}`, {
                action, // 请求体中携带 action
            });

            // 更新状态，移除处理完的订单
            setRefundOrders(prev => prev.filter(order => order._id !== orderId));
        } catch (err) {
            console.error(`Failed to ${action} refund for order ${orderId}`, err);
            alert(`Failed to ${action} refund`);
        }
    };

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" />
                <p>Loading refund requests...</p>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h3>Refund Requests Management</h3>

            {error && <Alert variant="danger">{error}</Alert>}

            {refundOrders.length === 0 ? (
                <p className="text-muted mt-3">No pending refund requests.</p>
            ) : (
                refundOrders.map(order => (
                    <Card key={order._id} className="mb-3 shadow-sm">
                        <Card.Body>
                            <Card.Title>Order ID: {order._id}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                                User: {order.userEmail || 'Unknown'} | Total: ${order.totalAmount?.toFixed(2)}
                            </Card.Subtitle>
                            <Card.Text>
                                <strong>Refund Reason:</strong> {order.refundReason || 'N/A'}
                            </Card.Text>
                            <div className="d-flex gap-2">
                                <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() => handleRefundAction(order._id, 'accept')}
                                >
                                    Accept
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleRefundAction(order._id, 'reject')}
                                >
                                    Reject
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                ))
            )}
        </Container>
    );
};

export default AdminRefundPage;
