import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { toast } from 'react-toastify';
import { RoleContext } from '../shared/RoleContext';

export default function Coupons() {
    const [coupons, setCoupons] = useState([]);
    const [editingCoupon, setEditingCoupon] = useState(null);
    

    const fetchCoupons = async () => {
        try {
            const response = await fetch("https://tech-prod-server.vercel.app/coupons");
            const data = await response.json();
            if (response.ok) setCoupons(data);
            else toast.error("Failed to fetch coupons");
        } catch (error) {
            toast.error("Error fetching coupons");
        }
    };

    useEffect(() => { fetchCoupons(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newCoupon = Object.fromEntries(formData);

        try {
            const response = await fetch("https://tech-prod-server.vercel.app/coupons", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCoupon),
            });

            if (response.ok) {
                toast.success("Coupon added successfully!");
                fetchCoupons();
                e.target.reset();
            } else {
                toast.error("Failed to add coupon");
            }
        } catch (error) {
            toast.error("Something went wrong!");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedCoupon = Object.fromEntries(formData);

        try {
            const response = await fetch(`https://tech-prod-server.vercel.app/coupons/${editingCoupon._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedCoupon),
            });

            if (response.ok) {
                toast.success("Coupon updated successfully!");
                fetchCoupons();
                setEditingCoupon(null);
                document.getElementById('my_modal_2').close();
            } else {
                toast.error("Failed to update coupon");
            }
        } catch (error) {
            toast.error("Error updating coupon");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this coupon?")) return;

        try {
            const response = await fetch(`https://tech-prod-server.vercel.app/coupons/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.success("Coupon deleted successfully!");
                fetchCoupons();
            } else {
                toast.error("Failed to delete coupon");
            }
        } catch (error) {
            toast.error("Error deleting coupon");
        }
    };

    const {isAdmin} = useContext(RoleContext);

    if(!isAdmin){
        return <p className='p-5'> You can not Access It </p>
    }

    return (
        <div className="mx-auto w-11/12">
            <Helmet>
                <title>Coupons - TechProd</title>
            </Helmet>
            <h2 className="text-3xl text-center font-bold py-5">All Coupons</h2>

            <div className="overflow-x-auto">
                <table className="table my-3">
                    <thead>
                        <tr>
                            <th>Coupon Code</th>
                            <th>Expire Date</th>
                            <th>Description</th>
                            <th>Discount Amount</th>
                            <th>Update</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map((coupon) => (
                            <tr key={coupon._id}>
                                <td>{coupon.couponCode}</td>
                                <td>{coupon.expireDate}</td>
                                <td>{coupon.description}</td>
                                <td>{coupon.discountAmount}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-success text-white"
                                        onClick={() => {
                                            setEditingCoupon(coupon);
                                            document.getElementById('my_modal_2').showModal();
                                        }}>
                                        <FaEdit />
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleDelete(coupon._id)}
                                        className="btn btn-sm btn-error text-white">
                                        <MdDeleteForever />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                {['couponCode', 'expireDate', 'description', 'discountAmount'].map((field) => (
                    <label key={field} className="input input-bordered flex items-center gap-2">
                        {field.replace(/([A-Z])/g, ' $1')}
                        <input
                            type={field === 'expireDate' ? 'date' : field === 'discountAmount' ? 'number' : 'text'}
                            className="grow"
                            name={field}
                            placeholder={field}
                            required
                        />
                    </label>
                ))}
                <input type="submit" className="btn btn-success text-white" value="Add Coupon" />
            </form>

            
            <dialog id="my_modal_2" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Update Coupon</h3>
                    {editingCoupon && (
                        <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
                            {['couponCode', 'expireDate', 'description', 'discountAmount'].map((field) => (
                                <label key={field} className="input input-bordered flex items-center gap-2">
                                    {field.replace(/([A-Z])/g, ' $1')}
                                    <input
                                        type={field === 'expireDate' ? 'date' : field === 'discountAmount' ? 'number' : 'text'}
                                        className="grow"
                                        name={field}
                                        defaultValue={editingCoupon[field]}
                                        required
                                    />
                                </label>
                            ))}
                            <input type="submit" className="btn btn-success text-white" value="Update Coupon" />
                        </form>
                    )}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>Close</button>
                </form>
            </dialog>
        </div>
    );
}
