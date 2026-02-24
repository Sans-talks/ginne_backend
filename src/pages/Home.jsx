import { useEffect, useState } from "react";
import Banner from "../components/Banner";
import ProductCard from "../components/ProductCard";
import "../styles/products.css";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Standalone mode: Using local dummy data for featured products
    setProducts([
      { _id: "1", name: "Premium Purple Shirt", price: 1299, images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&h=533"] },
      { _id: "2", name: "White Summer Tee", price: 799, images: ["https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=400&h=533"] },
      { _id: "3", name: "Classic Chinos", price: 1599, images: ["https://images.unsplash.com/photo-1473966968600-fa804b868cca?auto=format&fit=crop&w=400&h=533"] },
      { _id: "4", name: "Designer Blazer", price: 4999, images: ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&h=533"] },
    ]);
  }, []);

  const addToCart = (product) => {
    console.log("Adding to cart:", product);
    alert(`Added ${product.name} to bag!`);
  };

  return (
    <div className="home-page">
      <Banner />

      <div className="content-container" style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 4%" }}>
        <h2 style={{ fontSize: "24px", margin: "40px 0 30px", letterSpacing: "2px" }}>FEATURED PRODUCTS</h2>

        <div className="product-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "30px" }}>
          {(products || []).map((product) => (
            <ProductCard key={product?._id || product?.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
