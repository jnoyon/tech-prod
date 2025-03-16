import { useEffect } from "react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import MyProductItem from "../items/MyProductItem";
export default function MyProducts() {

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

  return (
    <div className="mx-auto w-11/12">
      <Helmet>
        <title> My Products - TechProd </title>
      </Helmet>
      <h2 className="md:text-3xl text-center font-bold py-5"> My Products </h2>
      <div className="overflow-x-auto">
        <table className="table my-3">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Votes</th>
              <th>Status</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => <MyProductItem product={product} handleDeleteProduct={handleDeleteProduct} key={index}></MyProductItem>)}
            
          </tbody>
        </table>
      </div>
    </div>
  );
}
