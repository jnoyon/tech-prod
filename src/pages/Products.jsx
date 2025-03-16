import { useEffect, useState } from "react";
import Heading from "../shared/Heading";
import ProductItem from "../items/ProductItem";
import { Helmet } from "react-helmet";

export default function Products() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;

    useEffect(() => {
        fetchProducts();
    }, [currentPage]);

    const fetchProducts = () => {
        setLoading(true);
        fetch(`https://tech-prod-server.vercel.app/products?search=${searchTerm}&page=${currentPage}&limit=${productsPerPage}`)
            .then(res => res.json())
            .then(data => {
                const activeProducts = data.filter(product => product.status === true);
                setProducts(activeProducts);
                setLoading(false);
            })
            .catch(error => {
                
                setLoading(false);
            });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchProducts();
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (loading) {
        return <div className="flex min-h-screen justify-center"> <div className='loading loading-spinner'></div> </div>
    }

    return (
        <div className='container mx-auto w-11/12 py-10'>
            <Helmet>
                <title> Products - TechProd </title>
            </Helmet>
            <Heading heading='All Products' subHeading='Pick from our Features'></Heading>
            <form className="mb-5 mt-5" onSubmit={handleSearchSubmit}>
                <label className="input input-bordered flex items-center gap-2">
                    <input
                        type="text"
                        className="grow"
                        placeholder="Search by tags"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <button type="submit" className="btn btn-primary">Search</button>
                </label>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                {products.map((product, index) => <ProductItem product={product} key={index}></ProductItem>)}
            </div>

            <div className="flex items-center justify-center mt-5">
                <button
                    className="btn btn-outline"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    Previous
                </button>
                <span className="mx-3">Page {currentPage}</span>
                <button
                    className="btn btn-outline"
                    disabled={products.length < productsPerPage}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
