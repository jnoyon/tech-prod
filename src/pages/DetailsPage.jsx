import { useContext, useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { AuthContext } from '../firebase/AuthProvider';
import { Helmet } from 'react-helmet';
import Rating from 'react-rating';
import Swal from 'sweetalert2';

export default function DetailsPage() {
  const product = useLoaderData();
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  const userName = user?.displayName || 'Anonymous';
  const userPhoto = user?.photoURL || 'https://via.placeholder.com/100';

  useEffect(() => {
    if (product?._id) {
      fetch(`https://tech-prod-server.vercel.app/reviews?productId=${product._id}`)
        .then((res) => res.json())
        .then((data) => {
          const filteredReviews = data.filter((review) => review.productId === product._id);
          setReviews(filteredReviews);
        })
        .catch((err) => console.error('Failed to load reviews:', err));
    }
  }, [product._id]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const reviewText = e.target.reviewText.value;

    if (!reviewText.trim() || rating === 0) {
      Swal.fire('Error', 'Please write a review and select a rating.', 'error');
      return;
    }

    const newReview = {
      name: userName,
      photo: userPhoto,
      reviewText,
      rating,
      productId: product._id, 
      date: new Date().toISOString(),
    };

    fetch('https://tech-prod-server.vercel.app/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReview),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.insertedId) {
          Swal.fire('Success!', 'Review submitted successfully.', 'success');
          setReviews((prev) => [newReview, ...prev]); 
          e.target.reset();
          setRating(0);
        } else {
          Swal.fire('Error', 'Failed to post review.', 'error');
        }
      })
      .catch((err) => {
       
        Swal.fire('Error', 'Failed to post review.', 'error');
      });
  };

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 py-5">
      <Helmet>
        <title>{product.productName} - TechProd</title>
      </Helmet>

      <div className="mx-auto w-11/12">
        <h2 className="md:text-3xl text-center font-bold mb-5">{product.productName}</h2>

        <div className="flex gap-5 bg-white p-5 shadow rounded-md">
          <img src={product.productImage} alt={product.productName} className="md:w-1/2 rounded-md" />

          <div className="flex flex-col gap-2 md:w-1/2">
            <p>{product.productDescription}</p>
            <p>
              <b>External Link:</b>{' '}
              <a href={product.productExternalLink} className="text-blue-500 underline">
                Click Here
              </a>
            </p>
            <p>
              <b>Tags:</b>{' '}
              {product.tags.map((tag, index) => (
                <span key={index} className="badge badge-outline text-xs mb-3 mr-2">
                  {tag}
                </span>
              ))}
            </p>
            <button className="btn btn-sm btn-error text-white">Report the Product</button>
          </div>
        </div>

     
        <div className="flex gap-10 mt-5">
        
          <div className="post-review bg-white p-5 rounded-md shadow-md md:w-1/3">
            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-2">
              <h2 className="divider font-bold">Post Your Review</h2>

              <label className="input input-bordered flex items-center gap-2">
                <b>Name:</b>
                <input type="text" value={userName} disabled className="grow" />
              </label>

              <div className="chat chat-start w-full">
                <div className="chat-image avatar">
                  <div className="w-16 rounded-full">
                    <img src={userPhoto} alt="User Avatar" />
                  </div>
                </div>
                <textarea
                  className="textarea textarea-bordered w-full mb-5"
                  name="reviewText"
                  placeholder="Write your review here"
                ></textarea>
              </div>

              <div className="flex flex-col items-center">
                <p className="font-semibold">Your Rating:</p>
                <Rating
                  initialRating={rating}
                  onChange={(rate) => setRating(rate)}
                 
                />
              </div>

              <input type="submit" value="Post Review" className="btn btn-success btn-sm text-white mt-5" />
            </form>
          </div>

          <div className="all md:w-2/3 bg-white p-5 rounded-md shadow-md">
            <h2 className="divider font-bold">All Reviews</h2>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="flex items-start gap-3 border-b pb-3 mb-3">
                  <img src={review.photo} alt="User" className="w-12 h-12 rounded-full" />
                  <div>
                    <h3 className="font-bold">{review.name}</h3>
                    <Rating
                      initialRating={review.rating}
                      readonly
                      
                    />
                    <p>{review.reviewText}</p>
                    <small className="text-gray-500">Posted on {new Date(review.date).toLocaleDateString()}</small>
                  </div>
                </div>
              ))
            ) : (
              <p>No reviews posted.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
