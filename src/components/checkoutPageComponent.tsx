'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/cartContext';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FaTrashAlt } from 'react-icons/fa';


interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name?: string;
  image?: string;
  discount?: number;
}
interface OrderDetails {
  orderId: string;
  paymentStatus: string;
  status: string;
  amount: number;
  createdAt: string;
}
const CheckoutPageComponent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, removeFromCart } = useCart();
  const [totalDiscount, setTotalDiscount ] = useState(0);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().min(1, 'Phone number is required'),
    address: z.string().min(1, 'Address is required'),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const productId = searchParams.get('productId');
    const quantity = parseInt(searchParams.get('quantity') || '1', 10);

    if (productId) {
      const singleProduct = cart.find(item => item.productId === productId);
      if (singleProduct) {
        setCheckoutItems([{ ...singleProduct, quantity }]);
      }
    } else {
      setCheckoutItems(cart);
    }
  }, [searchParams, cart]);

  useEffect(() => {
    const { total, discount  } = checkoutItems.reduce(
      (acc, item) => {
        const discountPercent = item.discount ?? 0; // Default to 0 if discount is undefined
        const discountedPrice = item.price * (1 - discountPercent / 100); // Calculate the discounted price
        
        const totalItemDiscount = item.price - discountedPrice; // Discount per item
    
        acc.total += discountedPrice * item.quantity; // Add discounted price to total
        acc.discount += totalItemDiscount * item.quantity; // Add item discount to total discount
    
        return acc;
      },
      { total: 0, discount: 0 } // Initial values for totalPrice and totalDiscount
    );
    
    setTotalPrice(total);
    setTotalDiscount(discount);
  }, [checkoutItems]);

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    setCheckoutItems(prev => prev.filter(item => item.productId !== productId));
  };

  const loadRazorpay = () => {
    return new Promise<void>((resolve) => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        resolve();
      } else {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          resolve();
        };
        document.body.appendChild(script);
      }
    });
  };

  const onSubmit = async (data: any) => {
    const orderData = {
      ...data,
      items: checkoutItems,
      totalPrice,
    };

    const response = await fetch('/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NEXT_PUBLIC_API_KEY!,
      },
      body: JSON.stringify(orderData), 
    });

    const orderResponse = await response.json();
      console.log("after creating orderin server",orderResponse.razorpayOrderId)
    if (orderResponse.status === 'success') {
      await loadRazorpay(); // Ensure Razorpay script is loaded

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: totalPrice * 100, 
        currency: 'INR',
        name: 'DECCAN FURNITURE',
        description: 'Order Payment',
        order_id: orderResponse.razorpayOrderId, // Ensure you're using the correct order ID
        handler: async function (response: any) {
          try {
            console.log(response.razorpay_order_id);
        
            // Call the verify payment API
            const verificationResponse = await fetch('/api/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.NEXT_PUBLIC_API_KEY!, // Ensure you're using the correct API key
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
        
            // Check if the response is OK
            if (!verificationResponse.ok) {
              throw new Error('Failed to verify payment');
            }
        
            const verificationResult = await verificationResponse.json();
            console.log(verificationResult.status);
        
            if (verificationResult.status === 'success') {
                // Retrieve the current orders array from localStorage, or create an empty array if none exists
                const orders: OrderDetails[] = JSON.parse(localStorage.getItem('orders') || '[]');

                // Push the new order details to the orders array
                orders.push(verificationResult.orderDetails);
              
                // Store the updated orders array back in localStorage
                localStorage.setItem('orders', JSON.stringify(orders));
              
              // Redirect to thank-you page
              router.push('/thank-you');
            } else {
              alert('Payment Verification Failed!');
            }
          } catch (error) {
            console.error('Error during payment verification:', error);
            alert('An error occurred during payment verification. Please try again.');
          }
        },
        


        prefill: {
          name: data.name,
          email: data.email,
          contact: data.phone,
        },
        theme: {
          color: '#F4F0EA',
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } else {
      alert('Order creation failed! Please try again.');
    }
  };

  if (checkoutItems.length === 0) return <p>Your cart is empty.</p>;

  return (

    <div className="container mx-auto p-6">
        <h1 className="text-3xl font-normal text-center mb-4">Checkout</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
        <div>
          {checkoutItems.map(item => (
  
  <div key={item.productId} className="flex items-center justify-between  p-4 border rounded-lg  bg-[#e8e0d4]">
  {/* Product Information */}
  <div className="flex items-center">
    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg mr-4" />
    <div>
      <p className="font-bold text-lg">{item.name}</p>
      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>

      {/* Price after discount */}
      <p className="text-xl font-semibold text-gray-800">
         ₹{(item.price * item.quantity * (1 - (item.discount ?? 0) / 100)).toFixed(2)}
      </p>

      {/* Show the original price with strikethrough */}
      {item.discount && (
        <p className="text-sm text-gray-500 line-through">
          M R P : ₹{(item.price * item.quantity).toFixed(2)}
        </p>
      )}

      {/* Show the discount percentage if available */}
      {item.discount && (
        <p className="text-sm text-green-500 font-semibold">
          {item.discount}% OFF
        </p>
      )}
    </div>
  </div>

  {/* Remove Button - Redesign */}
  <div className="flex items-center justify-end">
    <button
      onClick={() => handleRemoveItem(item.productId)}
      className="text-red-500 hover:text-red-700 focus:outline-none p-1 rounded-full transition-all duration-200"
    >
      <FaTrashAlt size={14} />
    </button>
  </div>
</div>



          ))}
        </div>
        
        

        <div className="bg-[#e8e0d4] p-6 rounded-lg shadow-sm">
  <h2 className="text-2xl font-normal text-[#4d3d30] mb-4">Order Summary</h2>

  <div className="">
    {/* Subtotal */}
    <div className="flex justify-between text-[#4d3d30]">
      <p className="text-sm font-medium">Subtotal</p>
      <p className="text-lg font-semibold text-[#4d3d30]">₹{(totalPrice + totalDiscount).toFixed(2)}</p>
    </div>

    {/* Total Discount */}
    {totalDiscount > 0 && (
      <div className="flex justify-between text-green-600">
        <p className="text-sm font-medium">Total Discount</p>
        <p className="text-lg font-semibold">- ₹{totalDiscount.toFixed(2)}</p>
      </div>
    )}

    {/* Total After Discount */}
    <div className="flex justify-between text-[#4d3d30]">
      <p className="text-sm font-medium">Discounted Price</p>
      <p className="text-lg font-semibold text-[#4d3d30]">₹{(totalPrice).toFixed(2)}</p>
    </div>

    {/* Delivery Charges */}
    <div className="flex justify-between text-[#4d3d30]">
      <p className="text-sm font-medium">Delivery Fee</p>
      <p className="text-lg font-semibold text-[#4d3d30]">₹0.00</p>
    </div>

    {/* Packaging Fee */}
    <div className="flex justify-between text-[#4d3d30]">
      <p className="text-sm font-medium">Packaging Fee</p>
      <p className="text-lg font-semibold text-[#4d3d30]">₹0.00</p>
    </div>

    {/* Grand Total */}
    <div className="flex justify-between border-t pt-4 mt-6">
      <p className="text-sm font-medium text-[#4d3d30]">Grand Total</p>
      <p className="text-xl font-bold text-[#4d3d30]">₹{(totalPrice).toFixed(2)}</p>
    </div>
  </div>
</div>

      


           
          <div className="p-4 border rounded-lg bg-[#e8e0d4]">
          <h3 className="text-2xl font-normal mb-4 mt-6">Shipping Information</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <Input
                type="text"
                {...register('name')}
                className="w-full p-2 border rounded-lg"
              />
              {errors.name && <span className="text-red-500">{errors.name.message as string}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <Input
                type="email"
                {...register('email')}
                className="w-full p-2 border rounded-lg"
              />
              {errors.email && <span className="text-red-500"> 
                {errors.email.message as string }</span>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <Input
                type="tel"
                {...register('phone')}
                className="w-full p-2 border rounded-lg"
              />
              {errors.phone && <span className="text-red-500">{errors.phone.message as string }</span>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Shipping Address</label>
              <Textarea
                {...register('address')}
                className="w-full p-2 border rounded-lg"
              />
              {errors.address && <span className="text-red-500">{errors.address.message as string}</span>}
            </div>

          

            <Button type="submit" className="bg-green-500 text-white hover:bg-green-700 mt-4 w-full">
              Place Order
            </Button>
          </form>
        </div>
      </div>
 
    </div>
    
  );
};

export default CheckoutPageComponent;
