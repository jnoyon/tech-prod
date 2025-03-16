import React, { useEffect, useState } from 'react'
import Heading from '../shared/Heading'
import FeaturedProductItem from '../items/FeaturedProductItem';

export default function FeaturedProduct() {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    fetch('https://tech-prod-server.vercel.app/products')
      .then(res => res.json())
      .then(data => {
        const featuredProducts = data.filter(product => product.featured === true && product.status === true);
        setProducts(featuredProducts);
      });
  }, []);

  if (!products) {
    return (
      <div className="min-h-screen flex justify-center">
        <div className='loading loading-spinner loading-lg'></div>
      </div>
    );
  }

  return (
    <section className='py-5'>
      <div className='mx-auto container w-11/12'>
        <Heading heading='Featured Product' subHeading='Pick from our Features'></Heading>
        {products.length > 0 ? (
          <div className="grid md:grid-cols-4 gap-5 mt-5">
            {products.map((product, index) => (
              <FeaturedProductItem product={product} key={index}></FeaturedProductItem>
            ))}
          </div>
        ) : (
          <p className="text-center mt-5 text-gray-500"> No featured products available.</p>
        )}
      </div>
    </section>
  );
}
