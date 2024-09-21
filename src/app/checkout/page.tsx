// 'use client';



// import React, { useState, useEffect, Suspense } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { useCart } from '@/context/cartContext';
// import { Button } from '@/components/ui/button';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import CheckoutPage1 from '@/components/checkoutPage';

// interface CartItem {
//   productId: string;
//   quantity: number;
//   price: number;
//   name?: string;
//   image?: string;
// }

// const CheckoutPage: React.FC = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { cart, removeFromCart } = useCart();

//   const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [paymentMethod, setPaymentMethod] = useState('upi');

//   const schema = z.object({
//     name: z.string().min(1, 'Name is required'),
//     email: z.string().email('Invalid email'),
//     phone: z.string().min(1, 'Phone number is required'),
//     address: z.string().min(1, 'Address is required'),
//   });

//   const { register, handleSubmit, formState: { errors } } = useForm({
//     resolver: zodResolver(schema),
//   });

//   useEffect(() => {
//     const productId = searchParams.get('productId');
//     const quantity = parseInt(searchParams.get('quantity') || '1', 10);

//     if (productId) {
//       const singleProduct = cart.find(item => item.productId === productId);
//       if (singleProduct) {
//         setCheckoutItems([{ ...singleProduct, quantity }]);
//       }
//     } else {
//       setCheckoutItems(cart);
//     }
//   }, [searchParams, cart]);

//   useEffect(() => {
//     const total = checkoutItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
//     setTotalPrice(total);
//   }, [checkoutItems]);

//   const handleRemoveItem = (productId: string) => {
//     removeFromCart(productId);
//     setCheckoutItems(prev => prev.filter(item => item.productId !== productId));
//   };

//   const loadRazorpay = () => {
//     return new Promise<void>((resolve) => {
//       if (typeof window !== 'undefined' && (window as any).Razorpay) {
//         resolve();
//       } else {
//         const script = document.createElement('script');
//         script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//         script.onload = () => {
//           resolve();
//         };
//         document.body.appendChild(script);
//       }
//     });
//   };

//   const onSubmit = async (data: any) => {
//     const orderData = {
//       ...data,
//       items: checkoutItems,
//       totalPrice,
//     };

//     const response = await fetch('/api/payment', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'x-api-key': process.env.NEXT_PUBLIC_API_KEY!,
//       },
//       body: JSON.stringify(orderData),
//     });

//     const orderResponse = await response.json();

//     if (orderResponse.status === 'success') {
//       await loadRazorpay(); // Ensure Razorpay script is loaded

//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
//         amount: totalPrice * 100, 
//         currency: 'INR',
//         name: 'DECCAN FURNITURE',
//         description: 'Order Payment',
//         order_id: orderResponse.razorpayOrderId, // Ensure you're using the correct order ID
//         handler: function (response: any) {
//           router.push('/thank-you');
//         },
//         prefill: {
//           name: data.name,
//           email: data.email,
//           contact: data.phone,
//         },
//         theme: {
//           color: '#F4F0EA',
//         },
//       };

//       const razorpay = new (window as any).Razorpay(options);
//       razorpay.open();
//     } else {
//       alert('Order creation failed! Please try again.');
//     }
//   };

//   if (checkoutItems.length === 0) return <p>Your cart is empty.</p>;

//   return (
//     <Suspense fallback={<div>Loading checkout...</div>}>


//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-4">Checkout</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
//         <div>
//           {checkoutItems.map(item => (
//             <div key={item.productId} className="flex items-center justify-between mb-4 p-4 border rounded-lg">
//               <div className="flex items-center">
//                 <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg mr-4" />
//                 <div>
//                   <p className="font-bold">{item.name}</p>
//                   <p>Quantity: {item.quantity}</p>
//                   <p>Price: ${(item.price * item.quantity).toFixed(2)}</p>
//                 </div>
//               </div>
//               <Button
//                 onClick={() => handleRemoveItem(item.productId)}
//                 className="bg-red-500 text-white hover:bg-red-700"
//               >
//                 Remove
//               </Button>
//             </div>
//           ))}
//         </div>
        
//         <div className="p-4 border rounded-lg">
//           <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
//           <p>Total Price: ${totalPrice.toFixed(2)}</p>

//           <h3 className="text-xl font-bold mb-4 mt-6">Shipping Information</h3>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Full Name</label>
//               <Input
//                 type="text"
//                 {...register('name')}
//                 className="w-full p-2 border rounded-lg"
//               />
//               {errors.name && <span className="text-red-500">{errors.name.message as string}</span>}
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Email Address</label>
//               <Input
//                 type="email"
//                 {...register('email')}
//                 className="w-full p-2 border rounded-lg"
//               />
//               {errors.email && <span className="text-red-500"> 
//                 {errors.email.message as string }</span>}
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Phone Number</label>
//               <Input
//                 type="tel"
//                 {...register('phone')}
//                 className="w-full p-2 border rounded-lg"
//               />
//               {errors.phone && <span className="text-red-500">{errors.phone.message as string }</span>}
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Shipping Address</label>
//               <Textarea
//                 {...register('address')}
//                 className="w-full p-2 border rounded-lg"
//               />
//               {errors.address && <span className="text-red-500">{errors.address.message as string}</span>}
//             </div>

          

//             <Button type="submit" className="bg-green-500 text-white hover:bg-green-700 mt-4 w-full">
//               Place Order
//             </Button>
//           </form>
//         </div>
//       </div>
//       <CheckoutPage1 />
//     </div>
//     </Suspense>
//   );
// };

// export default CheckoutPage;

import CheckoutPageWrapper from "@/components/checkoutPageWrapper"
const CheckOutPage = () => {
  return (
    <CheckoutPageWrapper />
  )
}

export default CheckOutPage