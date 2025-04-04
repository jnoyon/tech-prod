import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import {  FaGift } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import Lottie from 'lottie-react';
import promotion from '../assets/promotion.json'
import Heading from '../shared/Heading';

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
      <Heading heading='Promotions' subHeading='Here are our Coupons'></Heading> 
        <div className="flex gap-5 flex-col md:flex-row items-center">
          <div className="md:w-1/2">
          <Lottie animationData={promotion} loop={true} />
          </div>
          <div className="md:w-1/2">
            <div className='grid md:grid-cols-2 gap-5'>
            {coupons.length > 0 ? (
              coupons.map((coupon) => (
                <div key={coupon._id} className='bg-white shadow p-3 rounded-md text-center'>
                  <h1 className='md:2text-xl text-xl font-bold mb-3 items-center gap-3'>
                    <FaGift className='text-red-500 mx-auto mb-2' /> {coupon.description}
                  </h1>
                  <div className=' text-gray-600'>
                    <p className='mb-2'>
                      Get an exclusive <b>{coupon.discountAmount} OFF</b> on all purchases! Simply use the coupon code <b>{coupon.couponCode}</b> at checkout to claim your discount.
                      But hurry—this limited-time offer expires on <b>{coupon.expireDate}</b>! </p>
                    <button
                      className='btn btn-error text-white my-5 '
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
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
