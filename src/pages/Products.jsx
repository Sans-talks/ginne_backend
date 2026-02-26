import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Skeleton from "../components/Skeleton";
import "../styles/products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const [sortBy, setSortBy] = useState("Recommended");

  // Get initial categories from URL
  // Get initial categories from URL - normalize to match categoryMap keys
  const getInitialCategories = () => {
    const cats = searchParams.get("category");
    const allCats = ["Men", "Women", "Kids", "Home & Living"];
    if (cats) {
      const urlCats = cats.split(",").map(c => c.trim().toLowerCase());
      // Map URL categories back to display categories
      return allCats.filter(ac => urlCats.includes(ac.toLowerCase()));
    }
    return allCats;
  };

  const [filters, setFilters] = useState({
    categories: getInitialCategories(),
    subCategories: [],
  });

  const categoryMap = {
    "Men": ["T-Shirts", "Shirts", "Jeans", "Trousers", "Sneakers", "Accessories"],
    "Women": ["Traditional", "Western", "Bags", "Footwear", "Jewellery"],
    "Kids": ["Boys Fashion", "Girls Fashion", "Baby Care", "Toys"],
    "Home & Living": ["Bed Linen", "Kitchen & Dining", "Decor", "Bath"]
  };



  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://ginne-backend.onrender.com/api/products");
        const data = await response.json();

        if (response.ok) {
          const productsData = data.products || data; // Handle both {products: []} and [] formats
          setProducts(productsData);
        } else {
          console.error("Failed to fetch products:", data.message);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Update filters when URL change - normalize to match categoryMap keys
  useEffect(() => {
    const cats = searchParams.get("category");
    const allCats = ["Men", "Women", "Kids", "Home & Living"];
    if (cats) {
      const urlCats = cats.split(",").map(c => c.trim().toLowerCase());
      const normalizedCats = allCats.filter(ac => urlCats.includes(ac.toLowerCase()));
      setFilters(prev => ({ ...prev, categories: normalizedCats, subCategories: [] }));
    }
  }, [searchParams]);

  // ✅ Filtering & Sorting Logic
  useEffect(() => {
    let result = [...(products || [])];
    const searchQuery = searchParams.get("search")?.toLowerCase() || "";

    // Filter by search
    if (searchQuery) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchQuery) ||
        p.category.toLowerCase().includes(searchQuery)
      );
    }

    // Filter by category
    // Filter by category - case insensitive
    const selectedCats = (filters.categories || []).map(c => c.toLowerCase());
    if (selectedCats.length > 0) {
      result = result.filter(p => selectedCats.includes((p.category || "").toLowerCase()));
    }

    // Filter by subcategory - case insensitive
    const selectedSubs = (filters.subCategories || []).map(s => s.toLowerCase());
    if (selectedSubs.length > 0) {
      result = result.filter(p => selectedSubs.includes((p.subCategory || "").toLowerCase()));
    }

    // Sort result
    if (sortBy === "Price: Low to High") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High to Low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "Name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(result);
  }, [filters, sortBy, products, searchParams]);

  const handleCategoryChange = (category) => {
    const currentCats = filters.categories || [];
    const newCategories = currentCats.includes(category)
      ? currentCats.filter(c => c !== category)
      : [...currentCats, category];

    setFilters({ ...filters, categories: newCategories, subCategories: [] }); // Reset subcategories on main category change

    // Sync with URL
    if ((newCategories || []).length > 0) {
      searchParams.set("category", newCategories.join(","));
    } else {
      searchParams.delete("category");
    }
    setSearchParams(searchParams);
  };

  const handleSubCategoryChange = (sub) => {
    const currentSubs = filters.subCategories || [];
    const newSubs = currentSubs.includes(sub)
      ? currentSubs.filter(s => s !== sub)
      : [...currentSubs, sub];

    setFilters({ ...filters, subCategories: newSubs });
  };

  return (
    <div className="products-page-container fade-in">
      {/* Sidebar Filters */}
      <aside className="products-sidebar">
        <div className="sidebar-header">
          <h3>FILTERS</h3>
        </div>
        <div className="filter-section">
          <h4>CATEGORIES</h4>
          <ul className="filter-list">
            {(Object.keys(categoryMap || {}) || []).map(cat => (
              <li key={cat} className="filter-item">
                <input
                  type="checkbox"
                  checked={(filters.categories || []).some(c => c.toLowerCase() === cat.toLowerCase())}
                  onChange={() => handleCategoryChange(cat)}
                  id={`cat-${cat}`}
                />
                <label htmlFor={`cat-${cat}`}>{cat}</label>
              </li>
            ))}
          </ul>
        </div>

        {(filters.categories || []).length === 1 && (
          <div className="filter-section fade-in">
            <h4>SUB-CATEGORIES</h4>
            <ul className="filter-list">
              {/* Ensure subcategory map lookup is robust */}
              {(categoryMap?.[(filters.categories || [])[0]] || []).map(sub => (
                <li key={sub} className="filter-item">
                  <input
                    type="checkbox"
                    checked={(filters.subCategories || []).some(s => s.toLowerCase() === sub.toLowerCase())}
                    onChange={() => handleSubCategoryChange(sub)}
                    id={`sub-${sub}`}
                  />
                  <label htmlFor={`sub-${sub}`}>{sub}</label>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="products-main">
        <div className="products-top-bar">
          <div className="results-header">
            <div className="breadcrumb">Home / Products
              {searchParams.get("search") && <span className="search-breadcrumb"> / "{searchParams.get("search")}"</span>}
            </div>
            <h1 className="category-title">
              {(filters.categories || []).length === 1 ? (filters.categories || [])[0] : "All Products"}
              <span className="item-count"> - {(filteredProducts || []).length} items</span>
            </h1>
          </div>
          <div className="sort-container">
            <span>Sort by:</span>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Name</option>
            </select>
          </div>
        </div>

        <div className="product-grid">
          {loading ? (
            Array(8).fill(0).map((_, i) => <Skeleton key={i} type="product" />)
          ) : (filteredProducts || []).length > 0 ? (
            (filteredProducts || []).map((product) => (
              <ProductCard key={product?._id || product?.id} product={product} />
            ))
          ) : (
            <div className="no-products-found">
              <div className="no-results-icon">🔍</div>
              <h3>We couldn't find any matches!</h3>
              <p>Check your spelling or try different filters.</p>
              <button
                className="clear-filters-btn"
                onClick={() => {
                  setSearchParams({});
                  setFilters({ categories: ["Men", "Women", "Kids", "Home & Living"], subCategories: [] });
                }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Products;
