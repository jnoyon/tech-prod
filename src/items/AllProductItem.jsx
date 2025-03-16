import React, { useContext } from 'react'
import { MdDeleteForever } from "react-icons/md";
import { AuthContext } from '../firebase/AuthProvider';
import Swal from 'sweetalert2';

export default function AllProductItem({ product, handleDeleteProduct }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div className='loading loading-spinner'></div>;
  }

  const handlePublish = async (id) => {
    try {
      const response = await fetch(`https://tech-prod-server.vercel.app/products/publish/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: true }),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire('Published!', data.message, 'success');
      } else {
        Swal.fire('Error!', data.message, 'error');
      }
    } catch (error) {
      Swal.fire('Error!', 'Something went wrong.', 'error');
    }
  };

  const handleMakeFeatured = async (id) => {
    try {
      const response = await fetch(`https://tech-prod-server.vercel.app/products/featured/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured: true }),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire('Featured!', data.message, 'success');
      } else {
        Swal.fire('Error!', data.message, 'error');
      }
    } catch (error) {
      Swal.fire('Error!', 'Something went wrong.', 'error');
    }
  };

 
  const handleReject = async (id) => {
    try {
      const response = await fetch(`https://tech-prod-server.vercel.app/products/publish/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: false }), 
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire('Rejected!', data.message, 'success');
      } else {
        Swal.fire('Error!', data.message, 'error');
      }
    } catch (error) {
      Swal.fire('Error!', 'Something went wrong.', 'error');
    }
  };

 
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

  return (
    <tr>
      <td> {product.productName} </td>
      <td>
       
        <button
          onClick={() => handlePublish(product._id)}
          className={`btn btn-sm ${product.status ? 'btn-disable text-black' : 'btn-success'} text-white`}
        >
          {product.status ? 'Published' : 'Publish It'}
        </button>
      </td>
      <td>
        
        <button
          onClick={() => handleMakeFeatured(product._id)}
          className={`btn btn-sm ${product.featured ? 'btn-disable text-black' : 'btn-primary'} text-white`}
        >
          {product.featured ? 'Featured' : 'Make Featured'}
        </button>
      </td>
      <td>
       
        <button
          onClick={() => handleReject(product._id)}
          className={`btn btn-sm ${!product.status ? 'btn-disable text-black' : 'btn-warning'} text-white`}
        >
          {product.status ? 'Reject' : 'Rejected'}
        </button>
      </td>
      <td>
       
        <button onClick={() => handleDelete(product._id)} className="btn btn-sm btn-error text-white">
          <MdDeleteForever />
        </button>
      </td>
    </tr>
  );
}
