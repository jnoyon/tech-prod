import { useEffect, useState } from "react";
import Heading from "../shared/Heading";
import ProductItem from "../items/ProductItem";
import { Helmet } from "react-helmet";

export default function Products() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTag, setSelectedTag] = useState("");
    const productsPerPage = 6;

    useEffect(() => {
        fetchProducts();
    }, [currentPage, selectedTag]);

    const fetchProducts = () => {
        setLoading(true);
        fetch(`https://tech-prod-server.vercel.app/products?page=${currentPage}&limit=${productsPerPage}`)
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

    const handleTagFilter = (tag) => {
        setSelectedTag(tag);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (loading) {
        return <div className="flex min-h-screen justify-center"> <div className='loading loading-spinner'></div> </div>
    }

    const filteredProducts = selectedTag
        ? products.filter(product => product.tags.includes(selectedTag))
        : products;

    return (
        <div className='container mx-auto w-11/12 py-10'>
            <Helmet>
                <title> Products - TechProd </title>
            </Helmet>
            <Heading heading='All Products' subHeading='Pick from our Features'></Heading>
            
            <div className="flex gap-2 mb-5 mt-5 justify-center">
                {Array.from(new Set(products.flatMap(product => product.tags))).map((tag, index) => (
                    <button key={index} className={`btn btn-outline btn-sm ${selectedTag === tag ? 'btn-primary' : ''}`} onClick={() => handleTagFilter(tag)}>
                        {tag}
                    </button>
                ))}
                {selectedTag && <button className="btn btn-sm btn-secondary" onClick={() => setSelectedTag("")}>Clear Filter</button>}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                {filteredProducts.map((product, index) => <ProductItem product={product} key={index}></ProductItem>)}
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
                    disabled={filteredProducts.length < productsPerPage}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}