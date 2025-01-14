"use client"
import React, { useEffect, useState } from 'react';

interface Item {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
  _id: string;
}

interface OrderDetails {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  items: Item[];
  address: string;
  totalAmount: number;
  amountDue: number;
  amountPaid: number;
  currency: string;
  orderId: string;
  paymentStatus: string;
  status: string;
  paymentId: string;
  createdAt: string;
  updatedAt: string;
}

const ProfilePage: React.FC = () => {
  const [orders, setOrders] = useState<OrderDetails[]>([]);

  useEffect(() => {
    // Retrieve orders from localStorage and set the state
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      const parsedOrders = JSON.parse(storedOrders) as OrderDetails[];
      setOrders(parsedOrders);
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
    

      <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>

      {/* Order List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="border p-4 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">{order.customerName}</h3>

              {/* Display items (products) first */}
              <div className="mt-4">
                <h4 className="font-semibold">Products:</h4>
                <ul className="space-y-2">
                  {order.items.map((item) => (
                    <li key={item._id} className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p><strong>{item.name}</strong></p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ₹{item.price}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Order Details */}
              <p><strong>Email:</strong> {order.email}</p>
              <p><strong>Phone:</strong> {order.phone}</p>
              <p><strong>Delivery Address:</strong> {order.address}</p>
              <p><strong>Total Amount:</strong> {order.totalAmount} {order.currency}</p>
              <p><strong>Order Status:</strong> {order.status}</p>
              <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
              <p><strong>Payment ID:</strong> {order.paymentId}</p> {/* Payment ID added */}
              <p><strong>Order ID:</strong> {order.orderId}</p>

              {/* Order timestamps */}
              <div className="mt-4">
                <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                <p><strong>Updated At:</strong> {new Date(order.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
