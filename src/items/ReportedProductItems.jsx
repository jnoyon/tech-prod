import React, { useContext } from 'react'
import { MdDeleteForever } from "react-icons/md";
import { AuthContext } from '../firebase/AuthProvider';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

export default function ReportedProductItem({ product, handleDeleteProduct }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div className='loading loading-spinner'></div>;
  }

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
      <td> <Link className='btn btn-sm btn-warning text-white' to={`/products/${product._id}`}> View Product </Link> </td>

      <td>
        
        <button onClick={() => handleDelete(product._id)} className="btn btn-sm btn-error text-white">
          <MdDeleteForever />
        </button>
      </td>
    </tr>
  );
}
