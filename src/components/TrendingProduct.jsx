import React, { useEffect, useState } from 'react';
import Heading from '../shared/Heading';
import TrendingProductItem from '../items/TrendingProductItem';
import { Link } from 'react-router-dom';

export default function TrendingProduct() {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    fetch('https://tech-prod-server.vercel.app/products')
      .then((res) => res.json())
      .then((productsData) =>
        Promise.all(
          productsData
          .filter((product) => product.status === true)
          .map((product) =>
            fetch(`https://tech-prod-server.vercel.app/votes/${product._id}`)
              .then((res) => res.json())
              .then((voteData) => ({ ...product, voteCount: voteData.totalVotes || 0 }))
          )
        )
      )
      .then((productsWithVotes) => {
        const sortedProducts = productsWithVotes.sort((a, b) => b.voteCount - a.voteCount);
        setProducts(sortedProducts.slice(0, 6));
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
        <Heading heading='Trending Product' subHeading='Pick from our Trending' />
        <div className="grid md:grid-cols-3 gap-5 mt-5">
          {products.map((product, index) => (
            <TrendingProductItem product={product} key={index} />
          ))}
        </div>
        <div className="text-center my-5">
          <Link to='/products' className='btn btn-error text-white'>
            Show All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
