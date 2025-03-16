import { useContext, useEffect } from "react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import AllProductItem from "../items/AllProductItem";
import { RoleContext } from "../shared/RoleContext";
export default function AllProducts() {
  
  const [products, setProducts] = useState(null);
  
    useEffect(()=> {
      fetch('https://tech-prod-server.vercel.app/products')
      .then(res=> res.json())
      .then(data => setProducts(data))
    }, [])

    const handleDeleteProduct = (id) => {
      setProducts(products.filter(product => product._id !== id));
  };

    if(!products){
      return <div className="flex justify-center min-h-screen"> <div className='loading loading-lg loading-spinner'></div> </div>
    }

    const {isAdmin, isMember} = useContext(RoleContext);
  if(!isAdmin && !isMember){
    return <p className="p-5"> You can't Access This page </p>
  }

  return (
    <div className="mx-auto w-11/12">
      <Helmet>
        <title> Products Review - TechProd </title>
      </Helmet>
      <h2 className="md:text-3xl text-center font-bold py-5">  Products Review </h2>
      <div className="overflow-x-auto">
        <table className="table my-3">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Reject</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => <AllProductItem product={product} handleDeleteProduct={handleDeleteProduct} key={index}></AllProductItem>)}
            
          </tbody>
        </table>
      </div>
    </div>
  );
}
