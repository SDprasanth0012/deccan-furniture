"use client"
import { useState } from 'react';
import AddCategory from "@/components/addCategory";
import AddProductForm from "@/components/addProductForm";
import AdminAllProducts from "@/components/adminAllProducts";
import AdminOrder from "@/components/adminOrder";

const Page = () => {
  const [activeComponent, setActiveComponent] = useState<string>('orders'); // Default component

  const handleComponentChange = (component: string) => {
    setActiveComponent(component);
  };

  return (
    <div>
      <div className="mx-auto  border-b border-[#4d3d30] mb-4 md:flex md:justify-center">
      <h3
          className={`cursor-pointer text-center px-4 py-2 ${activeComponent === 'orders' ? 'bg-[#4d3d30] text-white' : ''}`}
          onClick={() => handleComponentChange('orders')}
        >
          Orders
        </h3>
        <h3
          className={`cursor-pointer text-center px-4 py-2 ${activeComponent === 'addProduct' ? 'bg-[#4d3d30] text-white' : ''}`}
          onClick={() => handleComponentChange('addProduct')}
        >
          Add Product
        </h3>
        <h3
          className={`cursor-pointer text-center px-4 py-2 ${activeComponent === 'addCategory' ? 'bg-[#4d3d30] text-white' : ''}`}
          onClick={() => handleComponentChange('addCategory')}
        >
          Add Category
        </h3>
        <h3
          className={`cursor-pointer text-center px-4 py-2 ${activeComponent === 'viewProducts' ? 'bg-[#4d3d30] text-white' : ''}`}
          onClick={() => handleComponentChange('viewProducts')}
        >
          View Products
        </h3>
       
      </div>
      {activeComponent === 'addProduct' && <AddProductForm />}
      {activeComponent === 'addCategory' && <AddCategory />}
      {activeComponent === 'viewProducts' && <AdminAllProducts />}
      {activeComponent === 'orders' && <AdminOrder  />}
    </div>
  );
};

export default Page;
