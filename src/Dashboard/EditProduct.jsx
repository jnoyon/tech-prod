import { useContext, useState } from "react";
import { AuthContext } from "../firebase/AuthProvider";
import { toast, ToastContainer } from "react-toastify"; 
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

export default function EditProduct() {
    const { user } = useContext(AuthContext);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h2 className="loading loading-infinity"></h2>
            </div>
        );
    }

    const [tags, setTags] = useState([]);

    const addTag = (e) => {
        if (e.key === "Enter" && e.target.value.trim()) {
            e.preventDefault(); 
            const newTags = e.target.value.split(",").map(tag => tag.trim()).filter(tag => tag);
            setTags([...tags, ...newTags]);
            e.target.value = ""; 
        }
    };


    const removeTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const productName = e.target.productname.value;
        const productImage = e.target.productimagelink.value;
        const productDescription = e.target.productdescription.value;
        const productExternalLink = e.target.productexternallink.value;
        const ownerName = user?.displayName;
        const ownerPhoto = user?.photoURL;
        const ownerEmail = user?.email;

        const currentTimestamp = new Date().toISOString(); 

        const newProduct = {
            productName,
            productImage,
            productDescription,
            productExternalLink,
            tags, 
            ownerName,
            ownerPhoto,
            ownerEmail,
            timeStamp: currentTimestamp, 
        };

        try {
            const response = await fetch("https://tech-prod-server.vercel.app/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Product added successfully!"); 
                setTags([]); 
                e.target.reset();
                navigate('/dashboard/my-products')
            } else {
                toast.error(data.message); 
            }
        } catch (error) {
            toast.error("Something went wrong!"); 
        }
    };

    return (
        <div className="mx-auto w-11/12 my-5">
            <Helmet>
                <title>Add New Product - TechProd</title>
            </Helmet>
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
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <label className="input input-bordered flex items-center gap-2">
                    Product Name
                    <input
                        type="text"
                        className="grow"
                        name="productname"
                        placeholder="Product Name"
                        required
                    />
                </label>

                <label className="input input-bordered flex items-center gap-2">
                    Product Image
                    <input
                        type="url"
                        className="grow"
                        name="productimagelink"
                        placeholder="Product Image Link"
                        required
                    />
                </label>

                <label className="input input-bordered flex items-center gap-2">
                    Description
                    <input
                        type="text"
                        className="grow"
                        name="productdescription"
                        placeholder="Product Description"
                    />
                </label>

                <label className="input input-bordered flex items-center gap-2">
                    External Link
                    <input
                        type="url"
                        className="grow"
                        name="productexternallink"
                        placeholder="Product External Link"
                        required
                    />
                </label>

                <div>
                    <label className="input input-bordered flex items-center gap-2">
                        Tags
                        <input
                            type="text"
                            className="grow"
                            placeholder="Enter tags separated by commas"
                            onKeyDown={addTag} 
                        />
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag, index) => (
                            <span key={index} className="badge badge-success text-white">
                                {tag}
                                <button
                                    type="button"
                                    className="ml-1 text-white"
                                    onClick={() => removeTag(tag)}
                                >
                                    ✖
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <h2 className="divider">Product Owner Information</h2>

                <label className="input input-bordered flex items-center gap-2">
                    Owner Name
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        value={user?.displayName || ""}
                        disabled
                    />
                </label>

                <label className="input input-bordered flex items-center gap-2">
                    Owner Image
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        value={user?.photoURL || ""}
                        disabled
                    />
                </label>

                <label className="input input-bordered flex items-center gap-2">
                    Owner Email
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        value={user?.email || ""}
                        disabled
                    />
                </label>

                <input type="submit" className="btn btn-success text-white" value="Add Product" />
            </form>
        </div>
    );
}
