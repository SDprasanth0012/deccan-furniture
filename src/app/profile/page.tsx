"use client"
import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react"
import Image from 'next/image';
import { redirect } from "next/navigation"

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
function UserProfile() {
  const { data: session } = useSession()
   if (!session) {

    return null;
  }
  return (
    <div>
      <div className="flex items-center gap-2">
        <Image
          src={session.user.image as string} 
          alt="User Avatar" 
          width={50}
          height={50}
          className="rounded-full w-8 h-8"
        />
        <div>
          <div>{session.user.name}</div>
          <div className="text-sm text-gray-500">{session.user.email}</div>
        </div>
      </div>
    </div>
  )
}
const ProfilePage: React.FC = () => {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const { data: session } = useSession();
  console.log(session);
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
    
       <UserProfile />
      <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>

      {/* Order List */}
  

      <div className="space-y-8">
  {orders.length === 0 ? (
    <p>No orders found.</p>
  ) : (
    orders.map((order) => (
      <div key={order._id} className="border p-6 rounded-lg shadow-lg space-y-6">
        {/* Customer Information Section */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{order.customerName}</h3>
          <p><strong>Email:</strong> {order.email}</p>
          <p><strong>Phone:</strong> {order.phone}</p>
        </div>

        {/* Order Information Section */}
        <div>
          <h4 className="text-xl font-semibold text-gray-700 mb-3">Order Information</h4>
          <p><strong>Order ID        :</strong> {order.orderId}</p>
          <p><strong>Order Status    :</strong> {order.status}</p>
          <p><strong>Ordered On      :</strong> {new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Delivery Address:</strong> {order.address}</p>
        </div>

        {/* Product Details Section */}
        <div>
          <h4 className="text-xl font-semibold text-gray-700 mb-3">Products</h4>
          <ul className="space-y-4">
            {order.items.map((item) => (
              <li key={item._id} className="flex items-center space-x-6">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={30}
                  height={30}
                  className="w-20 h-20 object-cover rounded border"
                />
                <div>
                  <p className="font-bold text-lg">{item.name}</p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                  <p><strong>Price:</strong> ₹{item.price}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Details Section */}
        <div>
          <h4 className="text-xl font-semibold text-gray-700 mb-3">Payment Details</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p><strong>Payment ID:</strong></p>
              <p>{order.paymentId}</p>
            </div>
            <div className="flex justify-between">
              <p><strong>Subtotal:</strong></p>
              <p>₹{order.totalAmount}</p>
            </div>
            <div className="flex justify-between">
              <p><strong>Delivery Fee:</strong></p>
              <p>₹0.00</p>
            </div>
            <div className="flex justify-between">
              <p><strong>Packaging Fee:</strong></p>
              <p>₹0.00</p>
            </div>
            <div className="flex justify-between font-bold">
              <p><strong>Total Amount:</strong></p>
              <p>₹{order.totalAmount} {order.currency}</p>
            </div>
            <div className="flex justify-between">
              <p><strong>Payment Status:</strong></p>
              <p>{order.paymentStatus}</p>
            </div>
          
          </div>
        </div>

   
      </div>
    ))
  )}
</div>


    </div>
  );
};

export default ProfilePage;
