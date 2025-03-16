import React, { useEffect, useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useContext } from 'react';
import { AuthContext } from '../firebase/AuthProvider';
import Swal from 'sweetalert2';

export default function MyProductItem({ product, handleDeleteProduct }) {
  const { user } = useContext(AuthContext);
  const [vote, setVote] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [updatedProduct, setUpdatedProduct] = useState({
    productName: product.productName,
    productImage: product.productImage,
    productDescription: product.productDescription,
    productExternalLink: product.productExternalLink
  });

  if (!user) {
    return <div className='loading loading-spinner'></div>;
  }

  if (user.email !== product.ownerEmail) {
    return null;
  }

  useEffect(() => {
    const fetchTotalVotes = async () => {
      try {
        const response = await fetch(`https://tech-prod-server.vercel.app/votes/${product._id}`);
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
    fetchTotalVotes();
  }, [product._id]);

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${product.productName}". This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`https://tech-prod-server.vercel.app/products/${id}`, {
            method: 'DELETE',
          });

          const data = await response.json();

          if (data.success) {
            Swal.fire('Deleted!', data.message, 'success');
            handleDeleteProduct(id);
          } else {
            Swal.fire('Error!', data.message, 'error');
          }
        } catch (error) {
          Swal.fire('Error!', 'Something went wrong.', 'error');
        }
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`https://tech-prod-server.vercel.app/products/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire('Updated!', 'Product details have been updated.', 'success');
        setIsModalOpen(false); 
      } else {
        Swal.fire('Error!', data.message, 'error');
      }
    } catch (error) {
      Swal.fire('Error!', 'Something went wrong.', 'error');
    }
  };

  return (
    <tr>
      <td>{product.productName}</td>
      <td>{vote}</td>
      <td>{product.status ? <p className='text-green-600'> Published </p> : <p className='text-yellow-600'> Pending </p>}</td>
      <td>
        <button className='btn btn-success text-white btn-sm' onClick={() => setIsModalOpen(true)}>
        <FaEdit  />   
        </button>
      </td>
      <td>
        <button onClick={() => handleDelete(product._id)} className="btn btn-sm btn-error text-white">
          <MdDeleteForever />
        </button>
      </td>

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box flex flex-col gap-5">
            <h2 className='text-center text-xl'>Edit Product</h2>

            <label className="input input-bordered flex items-center gap-2">
              Product Name
              <input
                type="text"
                name="productName"
                className="grow"
                value={updatedProduct.productName}
                onChange={handleChange}
              />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              Product Image Link
              <input
                type="url"
                name="productImage"
                className="grow"
                value={updatedProduct.productImage}
                onChange={handleChange}
              />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              Product Description
              <input
                type="text"
                name="productDescription"
                className="grow"
                value={updatedProduct.productDescription}
                onChange={handleChange}
              />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              External Link
              <input
                type="url"
                name="productExternalLink"
                className="grow"
                value={updatedProduct.productExternalLink}
                onChange={handleChange}
              />
            </label>

            <div className="modal-action">
              <button className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveChanges}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </tr>
  );
}
