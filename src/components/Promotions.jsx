import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import {  FaGift } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';

export default function Promotions() {
  const [coupons, setCoupons] = useState([]);

  const fetchCoupons = async () => {
    try {
      const response = await fetch("https://tech-prod-server.vercel.app/coupons");
      const data = await response.json();
      if (response.ok) {
        setCoupons(data);
      } else {
        toast.error("Failed to fetch coupons");
      }
    } catch (error) {
      toast.error("Error fetching coupons");
    }
  };

  const handleCopyCoupon = (couponCode) => {
    navigator.clipboard.writeText(couponCode);
    toast.success(`Coupon code "${couponCode}" copied to clipboard!`);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <div className='bg-gradient-to-b from-red-50 to-blue-100 py-10'>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className='mx-auto w-11/12'>
        <Carousel showThumbs={false} autoPlay interval={5000} infiniteLoop>
          {coupons.length > 0 ? (
            coupons.map((coupon) => (
              <div key={coupon._id} className='bg-white p-5 rounded-md shadow-md'>
                <h1 className='md:text-5xl text-2xl font-bold mb-3 items-center gap-3'>
                  <FaGift className='text-red-500 mx-auto mb-2' /> {coupon.description}
                </h1>
                <div className='md:w-1/2 mx-auto text-gray-600'>
                  <p className='mb-2'>
                    Get an exclusive <b>{coupon.discountAmount} OFF</b> on all purchases! Simply use the coupon code <b>{coupon.couponCode}</b> at checkout to claim your discount.
                  </p>
                  <p>
                    But hurry—this limited-time offer expires on <b>{coupon.expireDate}</b>!
                  </p>
                  <button
                    className='btn btn-success text-white my-5 btn-wide'
                    onClick={() => handleCopyCoupon(coupon.couponCode)}
                  >
                    Claim Offer
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className='flex justify-center'>
              <div className="loading loading-lg loading-spinner"></div>
            </div>
          )}
        </Carousel>
      </div>
    </div>
  );
}
