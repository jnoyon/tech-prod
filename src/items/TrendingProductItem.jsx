import React, { useContext, useEffect, useState } from 'react';
import { BiLike } from "react-icons/bi";
import { AuthContext } from "../firebase/AuthProvider";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TrendingProductItem({ product }) {
    const { productName, productImage, tags, productDescription, ownerEmail, _id } = product;
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [vote, setVote] = useState(0);
    const [voteStatus, setVoteStatus] = useState(false);

    useEffect(() => {
        const fetchTotalVotes = async () => {
            try {
                const response = await fetch(`https://tech-prod-server.vercel.app/votes/${_id}`);
                if (response.ok) {
                    const data = await response.json();
                    setVote(data.totalVotes || 0);
                } else {
                    console.error("Failed to fetch total vote count");
                }
            } catch (error) {
                console.error("Error fetching total votes:", error);
            }
        };
    
        const fetchUserVoteStatus = async () => {
            if (!user) return;
            try {
                const response = await fetch(`https://tech-prod-server.vercel.app/votes/${_id}?userEmail=${user.email}`);
                if (response.ok) {
                    const data = await response.json();
                    setVoteStatus(data.userVoted || false);
                }
            } catch (error) {
                console.error("Error fetching user vote status:", error);
            }
        };
    
        fetchTotalVotes();
        fetchUserVoteStatus();
    }, [_id, user?.email]);
    
    

    const handleVote = async () => {
        if (!user) {
            toast.warning("Please log in to vote.");
            navigate('/login');
            return;
        }

        try {
            const newVote = {
                productId: _id,
                userEmail: user.email
            };

            const response = await fetch('https://tech-prod-server.vercel.app/votes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newVote)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setVote(vote + 1);
                setVoteStatus(true);
                toast.success(data.message || "Vote added successfully!");
            } else {
                toast.error(data.message || "Failed to add vote.");
            }
        } catch (error) {
            toast.error("An error occurred while voting.");
            console.error("Vote error:", error);
        }
    };

    function truncateToTenWords(str) {
        const words = str.split(' ');
        return words.slice(0, 20).join(' ') + (words.length > 20 ? '...' : '');
    }

    const isOwner = user?.email === ownerEmail;

    return (
        <div className='border shadow rounded-md'>
            <figure>
                <img
                    src={productImage}
                    alt="Product Image"
                    className='mb-5 w-full h-60 object-cover rounded-t-md'
                />
            </figure>
            <div className='flex gap-2 justify-center'>
                {tags.map((tag, index) => (
                    <div className="badge badge-outline text-xs" key={index}>{tag}</div>
                ))}
            </div>
            <div className="px-3 py-5">
                <h2 className="card-title text-lg font-semibold">{productName}</h2>
                <p className='text-sm mb-3 text-gray-700'>{truncateToTenWords(productDescription)}</p>
                <div className="card-actions justify-center">
                    <button
                        className="btn btn-success text-white btn-sm flex items-center gap-2"
                        disabled={isOwner || voteStatus}
                        onClick={handleVote}
                    >
                        {vote} <BiLike className='text-xl' />
                    </button>
                    <Link to={`/products/${_id}`} className="btn btn-sm btn-error text-white">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
