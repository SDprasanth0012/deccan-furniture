import { SetStateAction, useEffect, useState } from 'react';
import CustomDropdown from '@/components/customDropDown';

interface IOrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

interface Option {
  value: string;
  label: string;
}

interface IOrder {
  _id: string;
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  items: IOrderItem[];
  address: string;
  totalAmount: number;
  amountDue: number;
  amountPaid: number;
  currency: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  status: 'created' | 'pending' | 'shipped' | 'delivered' | 'canceled';
}

const statusOptions = [
  { value: 'all', label: 'All Orders' },
  { value: 'created', label: 'Created' },
  { value: 'pending', label: 'Pending' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'canceled', label: 'Canceled' },
];

const AdminOrder: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const fetchOrders = async () => {
    const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
    try {
      const response = await fetch('/api/orders', {
        headers: { 'x-api-key': API_KEY! },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data: IOrder[] = await response.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (_id: string, option: Option) => {
    const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
    try {
      const response = await fetch(`/api/orders/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY!,
        },
        body: JSON.stringify({ status: option.value }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Fetch updated orders after status change
      fetchOrders();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center text-4xl text-[#4d3d30]">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const filteredOrders = selectedStatus === 'all'
    ? orders
    : orders.filter(order => order.status === selectedStatus);

  return (
    <div className="grid place-items-center">
      <div className="w-[90%] lg:w-[50%] max-w-md px-4 py-4">
        <div className="bg-[#e8e0d4] px-4 py-4 mb-16">
          <h1 className="text-3xl font-bold text-center text-[#4d3d30] mb-8">Order List</h1>
          <div className="mb-4">
            <CustomDropdown
              options={statusOptions}
              value={selectedStatus}
              onChange={option => setSelectedStatus(option.value)}
            />
          </div>
        </div>
        {filteredOrders.length === 0 ? (
          <p className="text-center italic text-[#dfdad5]">No orders available for this status.</p>
        ) : (
          <ul className="space-y-6">
            {filteredOrders.map(order => (
              <li key={order.orderId} className="rounded-lg p-6 bg-[#e8e0d4] hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl text-[#4d3d30]">Order ID: {order.orderId}</h3>
                <p className="font-semibold">Customer Name: {order.customerName}</p>
                <p>Email: {order.email}</p>
                <p>Phone: {order.phone}</p>
                <p>Address: {order.address}</p>
                <p className="font-medium">Amount Paid: <span className="text-green-500">{order.amountPaid}</span> {order.currency}</p>
                <p className="font-medium">Amount Due: <span className="text-red-500">{order.amountDue}</span> {order.currency}</p>
                <p>Status: <span className={`font-bold ${order.status as string === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>{order.status}</span></p>
                <p>Payment Status: <span className={`font-bold ${order.paymentStatus === 'completed' ? 'text-green-600' : 'text-red-600'}`}>{order.paymentStatus}</span></p>

                <CustomDropdown
                  options={statusOptions.filter(option => option.value !== 'all')}
                  value={order.status}
                  onChange={option => handleStatusChange(order._id, option)}
                />

                <h4 className="mt-6 font-semibold text-lg">Products:</h4>
                <ul className="list-none p-0 space-y-4">
                  {order.items.map(item => (
                    <li key={item.productId} className="flex items-center bg-white rounded-lg shadow p-4 transition-transform transform hover:scale-105">
                      <img src={item.image} alt={item.name} className="w-16 h-16 mr-4 rounded shadow-md" />
                      <div className="flex flex-col">
                        <span className="text-lg font-semibold text-[#4d3d30]">{item.name}</span>
                        <span className="text-sm text-gray-600">Quantity: {item.quantity}</span>
                        <span className="text-sm text-gray-600">Price: {item.price} {order.currency}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminOrder;
