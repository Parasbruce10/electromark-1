const App = () => {
  const [year] = React.useState(2023);
  const [currentPage, setCurrentPage] = React.useState('home');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
const [sortOrder, setSortOrder] = React.useState('default');
  const [error, setError] = React.useState('');
  const [products, setProducts] = React.useState([]);
  const [adminTab, setAdminTab] = React.useState('dashboard');
  const [editingId, setEditingId] = React.useState(null);
  const [adminPassword, setAdminPassword] = React.useState('0000');
  const [passForm, setPassForm] = React.useState({ currentPass: '', newPass: '', confirmPass: '' });
  const [isAdmin, setIsAdmin] = React.useState(false);
  // --- CART STATES ---
  const [cartItems, setCartItems] = React.useState([]);
  const [selectedCartIds, setSelectedCartIds] = React.useState([]);

  // Add to Cart Handler
  const handleAddToCart = (product) => {
    const existing = cartItems.find(item => item._id === product._id);
    if (existing) {
      setCartItems(cartItems.map(item => 
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
    alert(`${product.name} added to cart!`);
  };

  // Checkbox Selection Toggle
  const toggleCartSelect = (id) => {
    if (selectedCartIds.includes(id)) {
      setSelectedCartIds(selectedCartIds.filter(i => i !== id));
    } else {
      setSelectedCartIds([...selectedCartIds, id]);
    }
  };

  // Quantity Modifier
  const updateQuantity = (id, delta) => {
    setCartItems(cartItems.map(item => {
      if (item._id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };
const [selectedProduct, setSelectedProduct] = React.useState(null);
// --- HOME SLIDER STATE & AUTO-SLIDE LOGIC ---
const [currentSlide, setCurrentSlide] = React.useState(0);
const slidesData = [
  {
    title: "Next-Gen Mobile Technology",
    subtitle: "Experience lightning performance, futuristic displays, and flagship mobile devices.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600&auto=format&fit=crop"
  },
  {
    title: "Power Packed Laptops",
    subtitle: "Unleash ultimate productivity and high-performance gaming with ultra-slim designs.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop"
  },
  {
    title: "Pro Tablets & Accessories",
    subtitle: "Versatile, portable, and built for creativity on the go. Discover premium gear today.",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1600&auto=format&fit=crop"
  }
];

React.useEffect(() => {
  if (currentPage !== 'home') return;
  const timer = setInterval(() => {
    setCurrentSlide((prevIndex) => (prevIndex + 1) % slidesData.length);
  }, 4000); // 4 Seconds Auto Slide
  return () => clearInterval(timer);
}, [currentPage]);
// Reviews State
  const [reviews, setReviews] = React.useState([
    { id: 1, productId: 'all', name: "Ali Ahmed", rating: 5, comment: "Zabardast quality hai, totally premium feel!", date: "12 Sep 2026" },
    { id: 2, productId: 'all', name: "Sana", rating: 4, comment: "Delivery thori late thi lekin product genuine hai.", date: "10 Sep 2026" }
  ]);
  const [reviewForm, setReviewForm] = React.useState({ name: '', comment: '', rating: 5 });
  
  // Product Form State
  const [formData, setFormData] = React.useState({
  name: '', 
  description: '', 
  regularPrice: '', 
  discountPrice: '', 
  category: 'Mobiles', 
  stockStatus: 'in_stock', 
  images: []
});

  // Login Handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'parashamza955@gmail.com' && password === adminPassword) {
      setCurrentPage('dashboard');
      setIsAdmin(true); // <--- Yeh add karein
      setError('');
    } else {
      setError('Invalid email or password!');
    }
  };
const handlePasswordUpdate = async (e) => {
  e.preventDefault();
  
  if (passForm.currentPass !== adminPassword) {
    alert("Purana password galat hai!");
    return;
  }
  
  if (passForm.newPass !== passForm.confirmPass) {
    alert("Naya password aur Confirm Password match nahi kar rahe!");
    return;
  }
  
  // Backend API Call
  try {
    const res = await fetch('http://127.0.0.1:5000/api/update-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword: passForm.newPass })
    });

    if (res.ok) {
      setAdminPassword(passForm.newPass);
      setPassForm({ currentPass: '', newPass: '', confirmPass: '' });
      alert("Password MongoDB Database me permanently update ho gaya!");
    } else {
      alert("Failed to update password!");
    }
  } catch (error) {
    console.error(error);
    alert("Server error, backend check karein!");
  }
};

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const res = await fetch(`http://127.0.0.1:5000/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p._id !== id));
      }
    }
  };

  // Edit Product Click
  const handleEditClick = (product) => {
  setFormData({
    name: product.name,
    description: product.description,
    regularPrice: product.regularPrice,
    discountPrice: product.discountPrice,
    category: product.category || 'Mobiles',
    stockStatus: product.stockStatus || 'in_stock',
    images: product.images || []
  });
  setEditingId(product._id);
  setCurrentPage('dashboard');
  setAdminTab('upload-product');
};

  // Upload or Update Product Submit
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const url = editingId 
      ? `http://127.0.0.1:5000/api/products/${editingId}`
      : 'http://127.0.0.1:5000/api/products';
    
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      alert(editingId ? "Product Updated Successfully!" : "Product Uploaded Successfully!");
      setFormData({ 
  name: '', 
  description: '', 
  regularPrice: '', 
  discountPrice: '', 
  category: 'Mobiles', 
  stockStatus: 'in_stock', 
  images: [] 
});
      setEditingId(null);
      // Fetch fresh products list
      const updated = await fetch('http://127.0.0.1:5000/api/products').then(r => r.json());
      setProducts(updated);
      // setCurrentPage('products'); // Redirect to products page beautifully
      setCurrentPage('dashboard');
setAdminTab('dashboard');
    }
  };

  // Fetch Products on Initial Load
  React.useEffect(() => {
  // Fetch Products
  fetch('http://127.0.0.1:5000/api/products')
    .then(res => res.json())
    .then(data => setProducts(data))
    .catch(err => console.error(err));

  // Fetch Latest Password from Backend
  fetch('http://127.0.0.1:5000/api/get-password')
    .then(res => res.json())
    .then(data => {
      if (data.password) setAdminPassword(data.password);
    })
    .catch(err => console.error(err));
}, []);
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const promises = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    });
    Promise.all(promises).then(base64Images => {
      setFormData({...formData, images: base64Images});
    });
  };

  return (
  <div className="layout-container" style={{ position: 'relative', minHeight: '100vh', overflowX: 'hidden', background: 'transparent' }}>
    
    {/* CSS override to force body transparent */}
    <style>{`
      body, html, .layout-container {
        background-color: transparent !important;
      }
    `}</style>

    {/* --- GLOBAL KHOOBSURAT BACKGROUND IMAGE --- */}
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.55), rgba(2, 6, 23, 0.75)), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        opacity: 0.5, // Brightness increase kar di hai taake image saaf nazar aaye
        pointerEvents: 'none'
      }}
    />
      {/* Header */}
      {/* --- ULTRA CLEAN TRANSPARENT PREMIUM HEADER --- */}
<header className="premium-header-wrapper">
  
  <style>{`
    .premium-header-wrapper {
      position: sticky;
      top: 1.5rem;
      zIndex: 1000;
      maxWidth: 1200px;
      margin: 0 auto 2rem auto;
      padding: 0 1.5rem;
      transform: translateZ(0); 
    }

    /* 🔥 Main Glass Container - FIXED LAYOUT */
    .glass-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 0.75rem;
      background: rgba(15, 23, 42, 0.5); /* Sleek dark slate */
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 99px;
      box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3),
                  inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .glass-nav:hover {
      border-color: rgba(56, 189, 248, 0.25);
      box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.4),
                  0 0 24px rgba(56, 189, 248, 0.15);
    }

    /* ✨ 1. Left Section (Logo) - Takes equal width */
    .brand-section {
      display: flex;
      flex: 1;
      justify-content: flex-start;
      padding-left: 0.5rem;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      font-size: 1.15rem;
      font-weight: 800;
      letter-spacing: 0.5px;
      background: linear-gradient(135deg, #ffffff 0%, #93c5fd 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .brand-icon {
      width: 24px;
      height: 24px;
      fill: #38bdf8;
      filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.5));
    }

    /* 🧭 2. Center Section (Navigation) - Stays in perfect center */
    .center-nav {
      display: flex;
      justify-content: center;
      gap: 0.25rem;
      background: rgba(0, 0, 0, 0.2);
      padding: 0.35rem;
      border-radius: 99px;
      border: 1px solid rgba(255, 255, 255, 0.03);
    }

    .nav-link {
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 600;
      padding: 0.5rem 1.25rem;
      border-radius: 99px;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .nav-link:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.05);
    }

    .nav-link.active {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.1);
      box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
    }

    .nav-link.admin-link {
      color: #38bdf8;
    }
    .nav-link.admin-link:hover, .nav-link.admin-link.active {
      background: rgba(56, 189, 248, 0.15);
      color: #7dd3fc;
    }

    /* ⚡ 3. Right Section (Actions) - Takes equal width, aligns right */
    .nav-actions {
      display: flex;
      flex: 1;
      justify-content: flex-end;
      align-items: center;
      gap: 0.75rem;
    }

    /* Cart Icon Button */
    .icon-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #cbd5e1;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .icon-btn:hover, .icon-btn.active {
      background: rgba(56, 189, 248, 0.1);
      border-color: rgba(56, 189, 248, 0.4);
      color: #38bdf8;
      transform: translateY(-2px);
    }

    .icon-btn svg {
      width: 20px;
      height: 20px;
    }

    /* Cart Badge */
    .cart-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      background: linear-gradient(135deg, #ef4444, #f43f5e);
      color: white;
      font-size: 0.65rem;
      font-weight: 800;
      min-width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #0f172a; 
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.6);
    }

    /* Premium Checkout CTA */
    .cta-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, #38bdf8 0%, #2563eb 100%);
      color: #ffffff;
      font-weight: 600;
      font-size: 0.9rem;
      padding: 0.6rem 1.4rem;
      border-radius: 99px;
      text-decoration: none;
      border: none;
      box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3),
                  inset 0 1px 0 rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
    }

    .cta-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4),
                  inset 0 1px 0 rgba(255, 255, 255, 0.3);
      filter: brightness(1.1);
    }

    .cta-btn svg {
      width: 18px;
      height: 18px;
    }

    /* 📱 Responsive Adjustments */
    @media (max-width: 850px) {
      .brand-text {
        display: none; 
      }
      .cta-btn span {
        display: none; 
      }
      .cta-btn {
        padding: 0.6rem;
      }
      .nav-link {
        padding: 0.5rem 0.75rem;
      }
    }

    @media (max-width: 640px) {
      .glass-nav {
        flex-wrap: wrap;
        border-radius: 20px;
        padding: 1rem;
        gap: 1rem;
      }
      .brand-section, .nav-actions {
        flex: unset;
        width: auto;
      }
      .center-nav {
        order: 3;
        width: 100%;
        justify-content: center;
      }
      .nav-actions {
        flex: 1;
      }
    }
  `}</style>

  <nav className="glass-nav">
    
    {/* 1. Left - Premium Logo Section */}
    <div className="brand-section">
      <a href="#home" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }} className="brand-logo">
        <svg className="brand-icon" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
        <span className="brand-text">Electro MARK. </span>
      </a>
    </div>

    {/* 2. Center - Navigation (Properly Centered Now) */}
    <div className="center-nav">
      <a 
        href="#home" 
        onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }} 
        className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
      >
        Home
      </a>
      <a 
        href="#products" 
        onClick={(e) => { e.preventDefault(); setCurrentPage('products'); }} 
        className={`nav-link ${currentPage === 'products' ? 'active' : ''}`}
      >
        Products
      </a>

      {isAdmin && (
        <a 
          href="#dashboard" 
          onClick={(e) => { e.preventDefault(); setCurrentPage('dashboard'); }} 
          className={`nav-link admin-link ${currentPage === 'dashboard' ? 'active' : ''}`}
        >
          ⚡ Admin
        </a>
      )}
    </div>

    {/* 3. Right - Action Buttons */}
    <div className="nav-actions">
      
      {/* Sleek Icon Cart Button */}
      <a 
        href="#cart" 
        onClick={(e) => { e.preventDefault(); setCurrentPage('cart'); }} 
        className={`icon-btn ${currentPage === 'cart' ? 'active' : ''}`}
        title="View Cart"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
        
        {cartItems.length > 0 && (
          <span className="cart-badge">
            {cartItems.reduce((total, i) => total + i.quantity, 0)}
          </span>
        )}
      </a>

      {/* Primary CTA (Gradient Button) for Checkout */}
      <a 
        href="#checkout" 
        onClick={(e) => { e.preventDefault(); setCurrentPage('checkout'); }} 
        className="cta-btn"
      >
        <span>Checkout</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>

    </div>

  </nav>
</header>

      {/* Main Content Area */}
      <main className="main-content">
        
        {/* Home Page */}
        {/* Home Page - Modern Auto-Sliding Hero Carousel */}
{currentPage === 'home' && (
  <div className="home-wrapper" style={{ padding: '0 1.5rem', maxWidth: '1350px', margin: '2.5rem auto 0 auto' }}> 
    {/* Inline Styles for Glassmorphism & Animations */}
    <style>{`
      @keyframes zoomIn {
        from { transform: scale(1.08); opacity: 0.8; }
        to { transform: scale(1); opacity: 1; }
      }
      .slide-content-anim {
        animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      .dot-indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .dot-indicator.active {
        width: 35px;
        border-radius: 10px;
        background: #38bdf8;
        box-shadow: 0 0 15px rgba(56, 189, 248, 0.8);
      }
    `}</style>

    {/* Hero Slider Container */}
    <div style={{
      position: 'relative',
      height: '650px',
      borderRadius: '32px',
      overflow: 'hidden',
      border: '1px solid rgba(56, 189, 248, 0.3)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85)'
    }}>
      
      {/* Background Image Slides */}
      {slidesData.map((slide, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: currentSlide === index ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            zIndex: currentSlide === index ? 1 : 0,
            backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.95) 10%, rgba(15, 23, 42, 0.4) 60%, rgba(15, 23, 42, 0.8) 100%), url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            padding: '0 4rem'
          }}
        >
          {/* Slide Text Content */}
          {currentSlide === index && (
            <div className="slide-content-anim" style={{ maxWidth: '650px', color: '#fff', zIndex: 2 }}>
              
              <span style={{
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                padding: '6px 18px',
                borderRadius: '30px',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                display: 'inline-block',
                marginBottom: '1rem'
              }}>
                ⚡ Electro Mark Featured
              </span>

              <h1 style={{
                fontSize: '3.8rem',
                fontWeight: '900',
                lineHeight: '1.1',
                margin: '0 0 1.2rem 0',
                background: 'linear-gradient(to right, #ffffff, #38bdf8, #818cf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {slide.title}
              </h1>

              <p style={{
                fontSize: '1.2rem',
                color: '#cbd5e1',
                lineHeight: '1.7',
                marginBottom: '2.5rem'
              }}>
                {slide.subtitle}
              </p>

              {/* 2 Interactive Buttons */}
              <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
                
                {/* 1. Explore Products Button */}
                <button
                  onClick={() => setCurrentPage('products')}
                  style={{
                    padding: '1.1rem 2.2rem',
                    background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '16px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 0 25px rgba(56, 189, 248, 0.5)',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Explore Products 🛍️
                </button>

                {/* 2. Learn More Button (Scrolls Down) */}
                <button
                  onClick={() => {
                    const el = document.getElementById('about-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    padding: '1.1rem 2.2rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(10px)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '16px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Learn More ↓
                </button>

              </div>
            </div>
          )}
        </div>
      ))}

      {/* Dots Indicator Controls */}
      <div style={{
        position: 'absolute',
        bottom: '25px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
        zIndex: 5,
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(10px)',
        padding: '10px 20px',
        borderRadius: '30px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        {slidesData.map((_, idx) => (
          <div
            key={idx}
            className={`dot-indicator ${currentSlide === idx ? 'active' : ''}`}
            onClick={() => setCurrentSlide(idx)}
          />
        ))}
      </div>

    </div>
    {/* Ultra-Premium Infinite Electronic Products Circle Slider */}
<div style={{ marginTop: '5rem', overflow: 'hidden', padding: '2.5rem 0', position: 'relative' }}>
  <style>{`
    @keyframes infiniteScroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    @keyframes prismGlowRing {
      0%, 100% { 
        border-color: rgba(56, 189, 248, 0.8); 
        box-shadow: 0 0 25px rgba(56, 189, 248, 0.4), inset 0 0 15px rgba(56, 189, 248, 0.3); 
      }
      50% { 
        border-color: rgba(129, 140, 248, 0.9); 
        box-shadow: 0 0 35px rgba(129, 140, 248, 0.6), inset 0 0 20px rgba(129, 140, 248, 0.4); 
      }
    }

    .slider-track {
      display: flex;
      gap: 3.5rem;
      width: max-content;
      animation: infiniteScroll 30s linear infinite;
    }

    .slider-track:hover {
      animation-play-state: paused;
    }

    .circle-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
    }

    /* Bada Size & High-End Glass Prism Circle Frame */
    .circle-img-box {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      padding: 6px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.03) 100%), rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(25px) saturate(200%);
      -webkit-backdrop-filter: blur(25px) saturate(200%);
      border: 2px solid rgba(56, 189, 248, 0.5);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.12);
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
    }

    .circle-img-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      border: 2px solid rgba(15, 23, 42, 0.95);
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Premium Hover Animation */
    .circle-item:hover .circle-img-box {
      transform: translateY(-12px) scale(1.12);
      animation: prismGlowRing 2.5s infinite ease-in-out;
    }

    .circle-item:hover .circle-img-box img {
      transform: scale(1.08);
    }

    /* High Visibility Text Badge (Fixes White Background Issue) */
    .circle-label {
      color: #ffffff;
      font-size: 0.95rem;
      font-weight: 800;
      letter-spacing: 0.6px;
      text-align: center;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      padding: 6px 16px;
      border-radius: 30px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.6), 0 0 12px rgba(56, 189, 248, 0.2);
      transition: all 0.3s ease;
      white-space: nowrap;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
    }

    .circle-item:hover .circle-label {
      color: #38bdf8;
      border-color: rgba(56, 189, 248, 0.6);
      background: rgba(15, 23, 42, 0.95);
      box-shadow: 0 12px 25px rgba(0, 0, 0, 0.8), 0 0 20px rgba(56, 189, 248, 0.4);
      transform: translateY(-2px);
    }
  `}</style>

  {/* Left & Right Glass Gradient Fade Mask */}
  <div style={{ position: 'absolute', top: 0, left: 0, width: '140px', height: '100%', background: 'linear-gradient(to right, #0f172a 20%, transparent)', zIndex: 2, pointerEvents: 'none' }}></div>
  <div style={{ position: 'absolute', top: 0, right: 0, width: '140px', height: '100%', background: 'linear-gradient(to left, #0f172a 20%, transparent)', zIndex: 2, pointerEvents: 'none' }}></div>

  <div className="slider-track">
    {[
      { name: 'Smartphones', img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=500&auto=format&fit=crop' },
      { name: 'Pro Laptops', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=500&auto=format&fit=crop' },
      { name: 'Ultra Tablets', img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=500&auto=format&fit=crop' },
      { name: 'Chromebooks', img: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=500&auto=format&fit=crop' },
      { name: 'Studio Audio', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500&auto=format&fit=crop' },
      { name: 'Smartwatches', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500&auto=format&fit=crop' },
      { name: 'Drones & Tech', img: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=500&auto=format&fit=crop' },
      { name: 'TWS Earbuds', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=500&auto=format&fit=crop' },
      { name: 'Gaming Gear', img: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=500&auto=format&fit=crop' },

      // Duplicate Loop Copy
      { name: 'Smartphones', img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=500&auto=format&fit=crop' },
      { name: 'Pro Laptops', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=500&auto=format&fit=crop' },
      { name: 'Ultra Tablets', img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=500&auto=format&fit=crop' },
      { name: 'Chromebooks', img: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=500&auto=format&fit=crop' },
      { name: 'Studio Audio', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500&auto=format&fit=crop' },
      { name: 'Smartwatches', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500&auto=format&fit=crop' },
      { name: 'Drones & Tech', img: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=500&auto=format&fit=crop' },
      { name: 'TWS Earbuds', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=500&auto=format&fit=crop' },
      { name: 'Gaming Gear', img: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=500&auto=format&fit=crop' }
    ].map((item, idx) => (
      <div key={idx} className="circle-item">
        <div className="circle-img-box">
          <img src={item.img} alt={item.name} />
        </div>
        <span className="circle-label">{item.name}</span>
      </div>
    ))}
  </div>
</div>
{/* Glassmorphism Section - Left Text & Right Glass Art */}
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '2rem',
  marginTop: '3.5rem'
}}>

  {/* Styles & Glassmorphism Animation */}
  <style>{`
    .glass-outer-card {
      position: relative;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%), rgba(15, 23, 42, 0.4);
      backdrop-filter: blur(25px) saturate(180%);
      -webkit-backdrop-filter: blur(25px) saturate(180%);
      border: 1px solid rgba(56, 189, 248, 0.2);
      border-radius: 28px;
      padding: 1.5rem;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    }

    .glass-outer-card:hover {
      transform: translateY(-8px);
      border-color: rgba(56, 189, 248, 0.5);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(56, 189, 248, 0.25);
    }

    .glass-inner-container {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.2rem;
    }

    /* Right Side Glass Art Wrapper — ab yeh ek "image/art piece" jaisa lagega */
    .glass-art-box {
      width: 85px;
      height: 85px;
      min-width: 85px;
      border-radius: 24px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.03));
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4), inset 0 0 30px rgba(255, 255, 255, 0.06);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      transition: all 0.4s ease;
    }

    /* Shine / reflection line (image jaisa gloss) */
    .glass-art-box::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -20%;
      width: 60%;
      height: 200%;
      background: linear-gradient(
        115deg,
        rgba(255, 255, 255, 0.35) 0%,
        rgba(255, 255, 255, 0.05) 40%,
        transparent 60%
      );
      transform: rotate(15deg);
      pointer-events: none;
      opacity: 0.7;
      transition: opacity 0.4s ease;
    }

    .glass-outer-card:hover .glass-art-box::before {
      opacity: 1;
    }

    /* Inner ring / border glow (jaise glass ke andar light) */
    .glass-art-box::after {
      content: '';
      position: absolute;
      inset: 6px;
      border-radius: 18px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      pointer-events: none;
    }

    /* Inner Glowing Glass Shape — 3D orb jaisa */
    .glass-floating-shape {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      animation: floatGlow 3s ease-in-out infinite alternate;
      position: relative;
      z-index: 2;
      transform-style: preserve-3d;
    }

    /* Inner highlight on shape (3D feel) */
    .glass-floating-shape::after {
      content: '';
      position: absolute;
      top: 12%;
      left: 15%;
      width: 30%;
      height: 25%;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.7);
      filter: blur(2px);
      opacity: 0.8;
    }

    .shape-cyan {
      background: linear-gradient(145deg, #00d8f6, #38bdf8);
      box-shadow: 0 0 20px #00d8f6, 0 0 40px rgba(0, 216, 246, 0.35);
    }

    .shape-purple {
      background: linear-gradient(145deg, #a855f7, #c084fc);
      box-shadow: 0 0 20px #a855f7, 0 0 40px rgba(168, 85, 247, 0.35);
    }

    .shape-green {
      background: linear-gradient(145deg, #22c55e, #4ade80);
      box-shadow: 0 0 20px #22c55e, 0 0 40px rgba(34, 197, 94, 0.35);
    }

    .glass-outer-card:hover .glass-floating-shape {
      transform: scale(1.25) rotate(12deg) translateZ(10px);
    }

    @keyframes floatGlow {
      0% { transform: translateY(-4px) rotate(0deg); }
      100% { transform: translateY(4px) rotate(8deg); }
    }

    /* Text styling inside cards */
    .glass-card-title {
      color: #00d8f6;
      font-size: 1.2rem;
      font-weight: 800;
      margin: 0 0 0.4rem 0;
      letter-spacing: -0.01em;
    }

    .glass-card-desc {
      color: #94a3b8;
      font-size: 0.9rem;
      margin: 0;
      line-height: 1.5;
      font-weight: 400;
    }
  `}</style>

  {/* Card 1 */}
  <div className="glass-outer-card">
    <div className="glass-inner-container">
      {/* Left Text */}
      <div>
        <h4 className="glass-card-title">Official Warranties</h4>
        <p className="glass-card-desc">
          Full brand protection & hassle-free claim guarantees on all orders.
        </p>
      </div>
      {/* Right Glass Art */}
      <div className="glass-art-box">
        <div className="glass-floating-shape shape-cyan" />
      </div>
    </div>
  </div>

  {/* Card 2 */}
  <div className="glass-outer-card">
    <div className="glass-inner-container">
      {/* Left Text */}
      <div>
        <h4 className="glass-card-title">100% Genuine Tech</h4>
        <p className="glass-card-desc">
          Directly imported, factory-sealed flagship inventory guaranteed.
        </p>
      </div>
      {/* Right Glass Art */}
      <div className="glass-art-box">
        <div className="glass-floating-shape shape-purple" />
      </div>
    </div>
  </div>

  {/* Card 3 */}
  <div className="glass-outer-card">
    <div className="glass-inner-container">
      {/* Left Text */}
      <div>
        <h4 className="glass-card-title">Fastest COD Delivery</h4>
        <p className="glass-card-desc">
          Safe doorstep payment & rapid nationwide tracking updates.
        </p>
      </div>
      {/* Right Glass Art */}
      <div className="glass-art-box">
        <div className="glass-floating-shape shape-green" />
      </div>
    </div>
  </div>

</div>
{/* Glassmorphism Section - Left Text & Right Glass Mockup */}
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '3rem',
  alignItems: 'center',
  marginTop: '3.5rem',
  padding: '2rem 0'
}}>

  {/* Styles */}
  <style>{`
    /* ---------- LEFT SIDE TEXT ---------- */
    .ux-left-heading {
      font-size: clamp(1.8rem, 3.5vw, 2.8rem);
      font-weight: 800;
      color: #ffffff;
      line-height: 1.15;
      letter-spacing: -0.02em;
      margin: 0 0 1.2rem 0;
    }

    .ux-left-text {
      font-size: 1rem;
      line-height: 1.75;
      color: #94a3b8;
      font-weight: 400;
      max-width: 520px;
      margin: 0;
    }

    /* ---------- RIGHT SIDE GLASS MOCKUP ---------- */
    .mockup-outer {
      position: relative;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.01) 100%), rgba(15, 23, 42, 0.5);
      backdrop-filter: blur(25px) saturate(180%);
      -webkit-backdrop-filter: blur(25px) saturate(180%);
      border: 1px solid rgba(56, 189, 248, 0.18);
      border-radius: 28px;
      padding: 2rem;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.55);
      overflow: hidden;
      animation: mockupFloat 5s ease-in-out infinite alternate;
    }

    /* subtle shine sweep across the mockup */
    .mockup-outer::before {
      content: '';
      position: absolute;
      top: -60%;
      left: -30%;
      width: 60%;
      height: 220%;
      background: linear-gradient(
        115deg,
        rgba(255, 255, 255, 0.10) 0%,
        rgba(255, 255, 255, 0.02) 40%,
        transparent 65%
      );
      transform: rotate(12deg);
      pointer-events: none;
    }

    .mockup-outer:hover {
      transform: translateY(-6px);
      border-color: rgba(56, 189, 248, 0.45);
      box-shadow: 0 28px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(56, 189, 248, 0.22);
    }

    @keyframes mockupFloat {
      0%   { transform: translateY(0px); }
      100% { transform: translateY(-8px); }
    }

    /* ---------- INNER GLASS CARD ---------- */
    .mockup-inner {
      position: relative;
      z-index: 2;
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.10);
      border-radius: 20px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    /* header row: icon + title */
    .mockup-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .mockup-icon {
      width: 34px;
      height: 34px;
      min-width: 34px;
      border-radius: 10px;
      background: linear-gradient(145deg, #00d8f6, #0284c7);
      box-shadow: 0 0 20px rgba(0, 216, 246, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: iconPulse 3s ease-in-out infinite alternate;
    }

    .mockup-icon svg {
      width: 18px;
      height: 18px;
      stroke: #0b1220;
      stroke-width: 2.2;
      fill: none;
    }

    @keyframes iconPulse {
      0%   { transform: scale(1);    box-shadow: 0 0 18px rgba(0, 216, 246, 0.5); }
      100% { transform: scale(1.08); box-shadow: 0 0 28px rgba(0, 216, 246, 0.85); }
    }

    .mockup-title {
      font-size: 1.15rem;
      font-weight: 800;
      color: #00d8f6;
      letter-spacing: -0.01em;
      margin: 0;
      white-space: nowrap;
    }

    /* skeleton lines */
    .skeleton-line {
      height: 10px;
      border-radius: 6px;
      background: linear-gradient(90deg, rgba(148, 163, 184, 0.35), rgba(148, 163, 184, 0.15));
      position: relative;
      overflow: hidden;
    }

    .skeleton-line::after {
      content: '';
      position: absolute;
      top: 0;
      left: -150%;
      width: 150%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.18),
        transparent
      );
      animation: shimmer 2.4s infinite;
    }

    .skeleton-line.full  { width: 100%; }
    .skeleton-line.short { width: 70%; }

    @keyframes shimmer {
      0%   { left: -150%; }
      100% { left: 150%; }
    }

    /* small decorative corner glow inside mockup */
    .mockup-inner::after {
      content: '';
      position: absolute;
      bottom: -30px;
      right: -30px;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%);
      pointer-events: none;
    }
  `}</style>

  {/* ---------- LEFT SIDE ---------- */}
  <div>
    <h2 className="ux-left-heading">
      High-Converting UI Experience
    </h2>
    <p className="ux-left-text">
      Hum aisi websites design karte hain jo na sirf dikhne mein khoobsurat hain
      balki unka UX user retention ko barha deta hai. Glassmorphism styling aur
      ultra-smooth animations ke sath customer loyalty aur business growth dono
      double ho jati hain.
    </p>
  </div>



  {/* ---------- RIGHT SIDE GLASS MOCKUP ---------- */}
  <div className="mockup-outer">
    <div className="mockup-inner">

      {/* Header: globe icon + title */}
      <div className="mockup-header">
        <div className="mockup-icon">
          {/* globe svg */}
          <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </div>
        <h4 className="mockup-title">Responsive Layout Mockup</h4>
      </div>

      {/* Skeleton lines (as in image) */}
      <div className="skeleton-line full" />
      <div className="skeleton-line short" />

    </div>
  </div>


</div>
{/* Glassmorphism Section - Variant 3: Glass Mockup LEFT, Text RIGHT */}
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '3rem',
  alignItems: 'center',
  marginTop: '3.5rem',
  padding: '2rem 0'
}}>

  <style>{`
    /* ---------- RIGHT SIDE TEXT ---------- */
    .v3-right-heading {
      font-size: clamp(1.8rem, 3.5vw, 2.8rem);
      font-weight: 800;
      color: #ffffff;
      line-height: 1.15;
      letter-spacing: -0.02em;
      margin: 0 0 1.2rem 0;
    }

    .v3-right-text {
      font-size: 1rem;
      line-height: 1.75;
      color: #94a3b8;
      font-weight: 400;
      max-width: 520px;
      margin: 0;
    }

    /* ---------- LEFT SIDE GLASS MOCKUP ---------- */
    .v3-mockup-outer {
      position: relative;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.01) 100%), rgba(15, 23, 42, 0.5);
      backdrop-filter: blur(25px) saturate(180%);
      -webkit-backdrop-filter: blur(25px) saturate(180%);
      border: 1px solid rgba(251, 146, 60, 0.22);
      border-radius: 28px;
      padding: 2rem;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.55);
      overflow: hidden;
      animation: v3Float 5s ease-in-out infinite alternate;
    }

    .v3-mockup-outer::before {
      content: '';
      position: absolute;
      top: -60%;
      left: -30%;
      width: 60%;
      height: 220%;
      background: linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 40%, transparent 65%);
      transform: rotate(12deg);
      pointer-events: none;
    }

    .v3-mockup-outer:hover {
      transform: translateY(-6px);
      border-color: rgba(251, 146, 60, 0.55);
      box-shadow: 0 28px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(251, 146, 60, 0.28);
    }

    @keyframes v3Float {
      0%   { transform: translateY(0px); }
      100% { transform: translateY(-8px); }
    }

    .v3-mockup-inner {
      position: relative;
      z-index: 2;
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.10);
      border-radius: 20px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .v3-mockup-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .v3-mockup-icon {
      width: 34px;
      height: 34px;
      min-width: 34px;
      border-radius: 10px;
      background: linear-gradient(145deg, #fb923c, #ea580c);
      box-shadow: 0 0 20px rgba(251, 146, 60, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: v3IconPulse 3s ease-in-out infinite alternate;
    }

    .v3-mockup-icon svg {
      width: 18px;
      height: 18px;
      stroke: #0b1220;
      stroke-width: 2.2;
      fill: none;
    }

    @keyframes v3IconPulse {
      0%   { transform: scale(1);    box-shadow: 0 0 18px rgba(251, 146, 60, 0.5); }
      100% { transform: scale(1.08); box-shadow: 0 0 28px rgba(251, 146, 60, 0.85); }
    }

    .v3-mockup-title {
      font-size: 1.15rem;
      font-weight: 800;
      color: #fb923c;
      letter-spacing: -0.01em;
      margin: 0;
      white-space: nowrap;
    }

    .v3-skeleton-line {
      height: 10px;
      border-radius: 6px;
      background: linear-gradient(90deg, rgba(148, 163, 184, 0.35), rgba(148, 163, 184, 0.15));
      position: relative;
      overflow: hidden;
    }

    .v3-skeleton-line::after {
      content: '';
      position: absolute;
      top: 0;
      left: -150%;
      width: 150%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
      animation: v3Shimmer 2.4s infinite;
    }

    .v3-skeleton-line.full  { width: 100%; }
    .v3-skeleton-line.short { width: 70%; }

    @keyframes v3Shimmer {
      0%   { left: -150%; }
      100% { left: 150%; }
    }

    .v3-mockup-inner::after {
      content: '';
      position: absolute;
      bottom: -30px;
      right: -30px;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(251, 146, 60, 0.25) 0%, transparent 70%);
      pointer-events: none;
    }

    /* Mobile par text pehle aaye, image baad me */
    @media (max-width: 768px) {
      .v3-text-col { order: -1; }
    }
  `}</style>

  {/* ---------- LEFT SIDE: GLASS MOCKUP ---------- */}
  <div className="v3-mockup-outer">
    <div className="v3-mockup-inner">
      <div className="v3-mockup-header">
        <div className="v3-mockup-icon">
          {/* layers/stack svg */}
          <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </div>
        <h4 className="v3-mockup-title">Conversion Optimized Layout</h4>
      </div>
      <div className="v3-skeleton-line full" />
      <div className="v3-skeleton-line short" />
    </div>
  </div>

  {/* ---------- RIGHT SIDE: TEXT ---------- */}
  <div className="v3-text-col">
    <h2 className="v3-right-heading">
      Conversion-Focused Design
    </h2>
    <p className="v3-right-text">
      Har section strategically place kiya jata hai taake visitor ka attention
      sahi jagah jaye. Clear CTAs, trust badges aur psychological triggers
      ke sath aapki website sirf dikhne mein hi nahi, kaam karne mein bhi
      khoobsurat hoti hai — jo sales ko directly barhati hai.
    </p>
  </div>

</div>
{/* Glassmorphism Section - Variant 1: Performance */}
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '3rem',
  alignItems: 'center',
  marginTop: '3.5rem',
  padding: '2rem 0'
}}>

  <style>{`
    .v1-left-heading {
      font-size: clamp(1.8rem, 3.5vw, 2.8rem);
      font-weight: 800;
      color: #ffffff;
      line-height: 1.15;
      letter-spacing: -0.02em;
      margin: 0 0 1.2rem 0;
    }

    .v1-left-text {
      font-size: 1rem;
      line-height: 1.75;
      color: #94a3b8;
      font-weight: 400;
      max-width: 520px;
      margin: 0;
    }

    .v1-mockup-outer {
      position: relative;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.01) 100%), rgba(15, 23, 42, 0.5);
      backdrop-filter: blur(25px) saturate(180%);
      -webkit-backdrop-filter: blur(25px) saturate(180%);
      border: 1px solid rgba(168, 85, 247, 0.22);
      border-radius: 28px;
      padding: 2rem;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.55);
      overflow: hidden;
      animation: v1Float 5s ease-in-out infinite alternate;
    }

    .v1-mockup-outer::before {
      content: '';
      position: absolute;
      top: -60%;
      left: -30%;
      width: 60%;
      height: 220%;
      background: linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 40%, transparent 65%);
      transform: rotate(12deg);
      pointer-events: none;
    }

    .v1-mockup-outer:hover {
      transform: translateY(-6px);
      border-color: rgba(168, 85, 247, 0.55);
      box-shadow: 0 28px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(168, 85, 247, 0.28);
    }

    @keyframes v1Float {
      0%   { transform: translateY(0px); }
      100% { transform: translateY(-8px); }
    }

    .v1-mockup-inner {
      position: relative;
      z-index: 2;
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.10);
      border-radius: 20px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .v1-mockup-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .v1-mockup-icon {
      width: 34px;
      height: 34px;
      min-width: 34px;
      border-radius: 10px;
      background: linear-gradient(145deg, #a855f7, #7c3aed);
      box-shadow: 0 0 20px rgba(168, 85, 247, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: v1IconPulse 3s ease-in-out infinite alternate;
    }

    .v1-mockup-icon svg {
      width: 18px;
      height: 18px;
      stroke: #0b1220;
      stroke-width: 2.2;
      fill: none;
    }

    @keyframes v1IconPulse {
      0%   { transform: scale(1);    box-shadow: 0 0 18px rgba(168, 85, 247, 0.5); }
      100% { transform: scale(1.08); box-shadow: 0 0 28px rgba(168, 85, 247, 0.85); }
    }

    .v1-mockup-title {
      font-size: 1.15rem;
      font-weight: 800;
      color: #c084fc;
      letter-spacing: -0.01em;
      margin: 0;
      white-space: nowrap;
    }

    .v1-skeleton-line {
      height: 10px;
      border-radius: 6px;
      background: linear-gradient(90deg, rgba(148, 163, 184, 0.35), rgba(148, 163, 184, 0.15));
      position: relative;
      overflow: hidden;
    }

    .v1-skeleton-line::after {
      content: '';
      position: absolute;
      top: 0;
      left: -150%;
      width: 150%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
      animation: v1Shimmer 2.4s infinite;
    }

    .v1-skeleton-line.full  { width: 100%; }
    .v1-skeleton-line.short { width: 70%; }

    @keyframes v1Shimmer {
      0%   { left: -150%; }
      100% { left: 150%; }
    }

    .v1-mockup-inner::after {
      content: '';
      position: absolute;
      bottom: -30px;
      right: -30px;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%);
      pointer-events: none;
    }
  `}</style>

  {/* LEFT */}
  <div>
    <h2 className="v1-left-heading">
      Blazing Fast Performance
    </h2>
    <p className="v1-left-text">
      Hamari websites 90+ PageSpeed score ke sath load hoti hain. Optimized
      images, lazy loading aur lightweight code ki wajah se aapke customers
      ko ek smooth aur instant experience milta hai — jo directly conversions
      ko boost karta hai.
    </p>
  </div>

  {/* RIGHT */}
  <div className="v1-mockup-outer">
    <div className="v1-mockup-inner">
      <div className="v1-mockup-header">
        <div className="v1-mockup-icon">
          {/* lightning bolt svg */}
          <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        <h4 className="v1-mockup-title">Speed Optimized Layout</h4>
      </div>
      <div className="v1-skeleton-line full" />
      <div className="v1-skeleton-line short" />
    </div>
  </div>

</div>
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '4.5rem',
  alignItems: 'center',
  marginTop: '6rem',
  padding: '3rem 1rem',
  position: 'relative'
}}>

  <style>{`
    @keyframes proGlowRotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes proPulseGlow {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 0.75; transform: scale(1.08); }
    }

    @keyframes proFloatAnim {
      0% { transform: translateY(0px); }
      100% { transform: translateY(-12px); }
    }

    .pro-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.45rem 1rem;
      border-radius: 100px;
      background: rgba(168, 85, 247, 0.08);
      border: 1px solid rgba(168, 85, 247, 0.3);
      backdrop-filter: blur(12px);
      color: #e9d5ff;
      font-size: 0.825rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 1.5rem;
      box-shadow: 0 0 20px rgba(168, 85, 247, 0.15);
    }

    .pro-badge-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #c084fc;
      box-shadow: 0 0 10px #c084fc;
    }

    .pro-heading {
      font-size: clamp(2.2rem, 4.5vw, 3.6rem);
      font-weight: 900;
      line-height: 1.1;
      letter-spacing: -0.03em;
      margin: 0 0 1.8rem 0;
      background: linear-gradient(135deg, #ffffff 20%, #e9d5ff 60%, #a855f7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .pro-para-wrapper {
      position: relative;
      padding-left: 1.5rem;
      border-left: 2px solid rgba(168, 85, 247, 0.25);
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .pro-paragraph {
      font-size: 1.05rem;
      line-height: 1.85;
      color: #94a3b8;
      font-weight: 400;
      margin: 0;
      letter-spacing: 0.01em;
    }

    .pro-paragraph strong {
      color: #f1f5f9;
      font-weight: 600;
    }

    /* RIGHT SIDE: Animated Glassmorphic Image Frame */
    .pro-image-card {
      position: relative;
      border-radius: 30px;
      padding: 1px;
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.5), rgba(255, 255, 255, 0.05), rgba(124, 58, 237, 0.4));
      box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.8), 0 0 50px rgba(168, 85, 247, 0.2);
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .pro-image-card:hover {
      transform: translateY(-8px) scale(1.01);
      box-shadow: 0 40px 100px -15px rgba(0, 0, 0, 0.9), 0 0 70px rgba(168, 85, 247, 0.35);
    }

    .pro-image-inner {
      position: relative;
      background: #0b0f19;
      border-radius: 29px;
      padding: 1.25rem;
      overflow: hidden;
    }

    .pro-tall-img {
      width: 100%;
      height: 620px;
      object-fit: cover;
      border-radius: 20px;
      display: block;
      filter: contrast(1.12) brightness(0.95);
      transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .pro-image-card:hover .pro-tall-img {
      transform: scale(1.03);
    }

    /* Overlay Floating Stat Box */
    .pro-floating-stat {
      position: absolute;
      bottom: 2.5rem;
      left: -1.5rem;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(168, 85, 247, 0.3);
      border-radius: 18px;
      padding: 1.1rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.2rem;
      box-shadow: 0 20px 40px rgba(0,0,0,0.6);
      animation: proFloatAnim 4s ease-in-out infinite alternate;
      z-index: 10;
    }

    .pro-stat-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: linear-gradient(135deg, #a855f7, #6366f1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }

    .pro-stat-val {
      font-size: 1.25rem;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.1;
    }

    .pro-stat-lbl {
      font-size: 0.8rem;
      color: #94a3b8;
      margin-top: 0.2rem;
    }

    /* Ambient background glowing orbs */
    .pro-glow-orb {
      position: absolute;
      top: 20%;
      right: 10%;
      width: 350px;
      height: 350px;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%);
      filter: blur(60px);
      z-index: -1;
      pointer-events: none;
      animation: proPulseGlow 6s infinite alternate;
    }
  `}</style>

  {/* Ambient Back Glow */}
  <div className="pro-glow-orb"></div>

  {/* LEFT SIDE: Content */}
  <div>
    <div className="pro-badge">
      <span className="pro-badge-dot"></span>
      Next-Gen Architecture
    </div>

    <h2 className="pro-heading">
      Architecting Unrivaled Digital Excellence
    </h2>

    <div className="pro-para-wrapper">
      <p className="pro-paragraph">
        We specialize in engineering <strong>high-performance web solutions</strong> that seamlessly fuse aesthetic sophistication with rock-solid reliability. Every line of code is optimized to deliver flawless responsiveness across all modern devices and screen resolutions.
      </p>

      <p className="pro-paragraph">
        Our front-end design philosophy centers around <strong>fluid motion physics</strong> and precise visual hierarchy. By applying advanced layer depth and glassmorphism, we craft interfaces that draw users in and transform passive viewers into highly engaged, loyal customers.
      </p>

      <p className="pro-paragraph">
        Beyond raw speed, our architecture prioritizes <strong>modular scalability and security</strong>. Built using cutting-edge standards, your web ecosystem remains future-proof, easily adaptative to rapid business expansion, and capable of handling peak traffic effortlessly.
      </p>

      <p className="pro-paragraph">
        Experience a digital presence where <strong>innovation meets craftsmanship</strong>. From subtle micro-interactions to lightning-fast render cycles, every single detail is strategically orchestrated to elevate your brand far beyond industry benchmarks.
      </p>
    </div>
  </div>

  {/* RIGHT SIDE: Ultra-Pro Image Card with Floating Stat */}
  <div style={{ position: 'relative' }}>
    <div className="pro-image-card">
      <div className="pro-image-inner">
        <img
          className="pro-tall-img"
          src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80"
          alt="Modern Developer Workspace Laptop"
        />
      </div>
    </div>

    {/* Floating Glass Widget */}
    <div className="pro-floating-stat">
      <div className="pro-stat-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      </div>
      <div>
        <div className="pro-stat-val">120 FPS</div>
        <div className="pro-stat-lbl">Ultra-Fluid Render Speed</div>
      </div>
    </div>
  </div>

</div>
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '4.5rem',
  alignItems: 'center',
  marginTop: '6rem',
  padding: '3rem 1rem',
  position: 'relative'
}}>

  <style>{`
    @keyframes audioPulse {
      0%, 100% { transform: scale(1); opacity: 0.4; }
      50% { transform: scale(1.08); opacity: 0.8; }
    }

    @keyframes audioFloat {
      0% { transform: translateY(0px); }
      100% { transform: translateY(-12px); }
    }

    .audio-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.45rem 1rem;
      border-radius: 100px;
      background: rgba(168, 85, 247, 0.08);
      border: 1px solid rgba(168, 85, 247, 0.3);
      backdrop-filter: blur(12px);
      color: #e9d5ff;
      font-size: 0.825rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 1.5rem;
      box-shadow: 0 0 20px rgba(168, 85, 247, 0.15);
    }

    .audio-badge-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #a855f7;
      box-shadow: 0 0 10px #a855f7;
    }

    .audio-heading {
      font-size: clamp(2.2rem, 4.5vw, 3.6rem);
      font-weight: 900;
      line-height: 1.1;
      letter-spacing: -0.03em;
      margin: 0 0 1.8rem 0;
      background: linear-gradient(135deg, #ffffff 20%, #e9d5ff 60%, #a855f7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .audio-para-wrapper {
      position: relative;
      padding-left: 1.5rem;
      border-left: 2px solid rgba(168, 85, 247, 0.25);
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .audio-paragraph {
      font-size: 1.05rem;
      line-height: 1.85;
      color: #94a3b8;
      font-weight: 400;
      margin: 0;
      letter-spacing: 0.01em;
    }

    .audio-paragraph strong {
      color: #f1f5f9;
      font-weight: 600;
    }

    /* LEFT SIDE: Image Frame */
    .audio-image-card {
      position: relative;
      border-radius: 30px;
      padding: 1px;
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.5), rgba(255, 255, 255, 0.05), rgba(124, 58, 237, 0.4));
      box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.8), 0 0 50px rgba(168, 85, 247, 0.2);
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .audio-image-card:hover {
      transform: translateY(-8px) scale(1.01);
      box-shadow: 0 40px 100px -15px rgba(0, 0, 0, 0.9), 0 0 70px rgba(168, 85, 247, 0.35);
    }

    .audio-image-inner {
      position: relative;
      background: #0b0f19;
      border-radius: 29px;
      padding: 1.25rem;
      overflow: hidden;
    }

    .audio-tall-img {
      width: 100%;
      height: 620px;
      object-fit: cover;
      border-radius: 20px;
      display: block;
      filter: contrast(1.1) brightness(0.95);
      transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .audio-image-card:hover .audio-tall-img {
      transform: scale(1.03);
    }

    /* Floating Widget on Image Right Edge */
    .audio-floating-stat {
      position: absolute;
      top: 3.5rem;
      right: -1.5rem;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(168, 85, 247, 0.3);
      border-radius: 18px;
      padding: 1.1rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.2rem;
      box-shadow: 0 20px 40px rgba(0,0,0,0.6);
      animation: audioFloat 4s ease-in-out infinite alternate;
      z-index: 10;
    }

    .audio-stat-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: linear-gradient(135deg, #a855f7, #6366f1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }

    .audio-stat-val {
      font-size: 1.2rem;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.1;
    }

    .audio-stat-lbl {
      font-size: 0.8rem;
      color: #94a3b8;
      margin-top: 0.2rem;
    }

    /* Ambient background glowing orbs */
    .audio-glow-orb {
      position: absolute;
      bottom: 10%;
      left: 5%;
      width: 380px;
      height: 380px;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.22) 0%, transparent 70%);
      filter: blur(60px);
      z-index: -1;
      pointer-events: none;
      animation: audioPulse 6s infinite alternate;
    }
  `}</style>

  {/* Ambient Back Glow */}
  <div className="audio-glow-orb"></div>

  {/* LEFT SIDE: Image Frame & Floating Widget */}
  <div style={{ position: 'relative' }}>
    <div className="audio-image-card">
      <div className="audio-image-inner">
        <img
          className="audio-tall-img"
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"
          alt="Studio Grade Wireless Headphones"
        />
      </div>
    </div>

    {/* Floating Glass Widget */}
    <div className="audio-floating-stat">
      <div className="audio-stat-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"></path>
          <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
        </svg>
      </div>
      <div>
        <div className="audio-stat-val">-45 dB ANC</div>
        <div className="audio-stat-lbl">Active Noise Cancellation</div>
      </div>
    </div>
  </div>

  {/* RIGHT SIDE: Audio Content */}
  <div>
    <div className="audio-badge">
      <span className="audio-badge-dot"></span>
      Acoustic Precision
    </div>

    <h2 className="audio-heading">
      Immersive Acoustic Engineering Redefined
    </h2>

    <div className="audio-para-wrapper">
      <p className="audio-paragraph">
        Step into an realm of pure audio clarity with our <strong>next-generation sound architecture</strong>. Engineered with custom-tuned 40mm titanium drivers, these headphones deliver ultra-deep bass response, lush midrange, and crystalline highs across every genre.
      </p>

      <p className="audio-paragraph">
        Equipped with <strong>adaptive spatial audio tracking</strong>, the soundscape dynamically adjusts to your physical movement. This creates an unparalleled 3D stage effect that puts you right at the center of live studio recordings and cinema-grade soundtracks.
      </p>

      <p className="audio-paragraph">
        Our proprietary <strong>Hybrid Active Noise Cancellation (ANC)</strong> continuously samples ambient noise 50,000 times per second. It suppresses environmental distractions seamlessly, ensuring completely uninterrupted focus whether you are commuting or in a busy workspace.
      </p>

      <p className="audio-paragraph">
        Crafted for end-to-end luxury, the chassis combines <strong>lightweight aerospace aluminum with memory foam ear cushions</strong> wrapped in breathable leather. Designed for zero-fatigue sessions, it offers up to 60 hours of continuous wireless listening on a single charge.
      </p>
    </div>
  </div>

</div>
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '4.5rem',
  alignItems: 'center',
  marginTop: '6rem',
  padding: '3rem 1rem',
  position: 'relative'
}}>

  <style>{`
    @keyframes watchPulse {
      0%, 100% { transform: scale(1); opacity: 0.35; }
      50% { transform: scale(1.08); opacity: 0.75; }
    }

    @keyframes watchFloat {
      0% { transform: translateY(0px); }
      100% { transform: translateY(-12px); }
    }

    .watch-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.45rem 1rem;
      border-radius: 100px;
      background: rgba(168, 85, 247, 0.08);
      border: 1px solid rgba(168, 85, 247, 0.3);
      backdrop-filter: blur(12px);
      color: #e9d5ff;
      font-size: 0.825rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 1.5rem;
      box-shadow: 0 0 20px rgba(168, 85, 247, 0.15);
    }

    .watch-badge-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #c084fc;
      box-shadow: 0 0 10px #c084fc;
    }

    .watch-heading {
      font-size: clamp(2.2rem, 4.5vw, 3.6rem);
      font-weight: 900;
      line-height: 1.1;
      letter-spacing: -0.03em;
      margin: 0 0 1.8rem 0;
      background: linear-gradient(135deg, #ffffff 20%, #e9d5ff 60%, #a855f7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .watch-para-wrapper {
      position: relative;
      padding-left: 1.5rem;
      border-left: 2px solid rgba(168, 85, 247, 0.25);
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .watch-paragraph {
      font-size: 1.05rem;
      line-height: 1.85;
      color: #94a3b8;
      font-weight: 400;
      margin: 0;
      letter-spacing: 0.01em;
    }

    .watch-paragraph strong {
      color: #f1f5f9;
      font-weight: 600;
    }

    /* RIGHT SIDE: Image Frame */
    .watch-image-card {
      position: relative;
      border-radius: 30px;
      padding: 1px;
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.5), rgba(255, 255, 255, 0.05), rgba(124, 58, 237, 0.4));
      box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.8), 0 0 50px rgba(168, 85, 247, 0.2);
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .watch-image-card:hover {
      transform: translateY(-8px) scale(1.01);
      box-shadow: 0 40px 100px -15px rgba(0, 0, 0, 0.9), 0 0 70px rgba(168, 85, 247, 0.35);
    }

    .watch-image-inner {
      position: relative;
      background: #0b0f19;
      border-radius: 29px;
      padding: 1.25rem;
      overflow: hidden;
    }

    .watch-tall-img {
      width: 100%;
      height: 620px;
      object-fit: cover;
      border-radius: 20px;
      display: block;
      filter: contrast(1.1) brightness(0.95);
      transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .watch-image-card:hover .watch-tall-img {
      transform: scale(1.03);
    }

    /* Floating Glass Widget on Left Edge */
    .watch-floating-stat {
      position: absolute;
      bottom: 3.5rem;
      left: -1.5rem;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(168, 85, 247, 0.3);
      border-radius: 18px;
      padding: 1.1rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.2rem;
      box-shadow: 0 20px 40px rgba(0,0,0,0.6);
      animation: watchFloat 4s ease-in-out infinite alternate;
      z-index: 10;
    }

    .watch-stat-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: linear-gradient(135deg, #a855f7, #ec4899);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }

    .watch-stat-val {
      font-size: 1.2rem;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.1;
    }

    .watch-stat-lbl {
      font-size: 0.8rem;
      color: #94a3b8;
      margin-top: 0.2rem;
    }

    /* Ambient background glowing orbs */
    .watch-glow-orb {
      position: absolute;
      top: 15%;
      right: 5%;
      width: 380px;
      height: 380px;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.22) 0%, transparent 70%);
      filter: blur(60px);
      z-index: -1;
      pointer-events: none;
      animation: watchPulse 6s infinite alternate;
    }
  `}</style>

  {/* Ambient Back Glow */}
  <div className="watch-glow-orb"></div>

  {/* LEFT SIDE: Smartwatch Content */}
  <div>
    <div className="watch-badge">
      <span className="watch-badge-dot"></span>
      Biometric Precision
    </div>

    <h2 className="watch-heading">
      Next-Gen Wearable Intelligence
    </h2>

    <div className="watch-para-wrapper">
      <p className="watch-paragraph">
        Experience the pinnacle of personal health monitoring with our <strong>flagship Smartwatch ecosystem</strong>. Featuring an ultra-bright Sapphire Crystal AMOLED display with 3000 nits peak brightness, every metric remains perfectly crisp even under direct sunlight.
      </p>

      <p className="watch-paragraph">
        Powered by an advanced <strong>multi-channel optical sensor array</strong>, it tracks real-time heart rate variability, SpO2 blood oxygen saturation, and continuous stress levels with clinical-grade accuracy to give you actionable health insights throughout the day.
      </p>

      <p className="watch-paragraph">
        Designed for extreme performance, the <strong>aerospace-grade titanium chassis</strong> is rated for 10 ATM water resistance. Dual-frequency GPS navigation ensures pinpoint route tracking through dense urban environments or remote mountain trails.
      </p>

      <p className="watch-paragraph">
        Stay effortlessly connected with <strong>on-device neural processing</strong>. From predictive sleep coaching to seamless contactless payments and 14-day battery life, it harmonizes intelligent connectivity with everyday endurance.
      </p>
    </div>
  </div>

  {/* RIGHT SIDE: Smartwatch Image Frame & Floating Widget */}
  <div style={{ position: 'relative' }}>
    <div className="watch-image-card">
      <div className="watch-image-inner">
        <img
          className="watch-tall-img"
          src="https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=80"
          alt="Modern Premium Smartwatch"
        />
      </div>
    </div>

    {/* Floating Glass Widget */}
    <div className="watch-floating-stat">
      <div className="watch-stat-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l.77.78L12 21.35l7.95-7.95.77-.78a5.4 5.4 0 0 0 0-7.64z"></path>
        </svg>
      </div>
      <div>
        <div className="watch-stat-val">72 BPM</div>
        <div className="watch-stat-lbl">Real-time Heart Rate</div>
      </div>
    </div>
  </div>

</div>
    
{/* --- BHAR BHAR KE STORE DETAILS & FEATURES SECTION --- */}
<div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

  {/* 1. Feature Cards Grid (4 Columns) */}
<div className="features-grid-wrapper">

  <style>{`
    .features-grid-wrapper {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 0;
    }

    /* 💎 Premium Animated Glassmorphic Card Body */
    .feature-card {
      position: relative;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.01) 100%), rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(25px) saturate(200%);
      -webkit-backdrop-filter: blur(25px) saturate(200%);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 28px;
      padding: 2.2rem 1.8rem;
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
      box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.5),
                  inset 0 0 20px rgba(255, 255, 255, 0.03);
    }

    /* 🌈 Moving Dynamic Gradient Background Mesh */
    .feature-card::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.15), rgba(129, 140, 248, 0.08), transparent 60%);
      opacity: 0;
      transition: opacity 0.6s ease, transform 0.6s ease;
      transform: scale(0.8);
      pointer-events: none;
      z-index: 0;
    }

    /* ⚡ Top Border Highlight Ray Animation */
    .feature-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, #38bdf8, #818cf8, transparent);
      transition: left 0.7s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 2;
    }

    .feature-card:hover {
      transform: translateY(-12px) scale(1.02);
      border-color: rgba(56, 189, 248, 0.45);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7),
                  0 0 40px -5px rgba(56, 189, 248, 0.25),
                  inset 0 0 25px rgba(56, 189, 248, 0.1);
    }

    .feature-card:hover::after {
      opacity: 1;
      transform: scale(1) rotate(10deg);
    }

    .feature-card:hover::before {
      left: 100%;
    }

    /* 🎨 Ultra-Glossy Animated Icon Box */
    .icon-wrapper {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      border-radius: 20px;
      background: linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(37, 99, 235, 0.1));
      border: 1px solid rgba(56, 189, 248, 0.3);
      margin-bottom: 1.5rem;
      color: #38bdf8;
      box-shadow: 0 10px 25px -5px rgba(56, 189, 248, 0.3),
                  inset 0 1px 1px rgba(255, 255, 255, 0.4);
      transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .feature-card:hover .icon-wrapper {
      transform: scale(1.15) rotate(-6deg);
      background: linear-gradient(135deg, #38bdf8 0%, #2563eb 100%);
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.6);
      box-shadow: 0 15px 30px rgba(56, 189, 248, 0.5),
                  0 0 20px rgba(255, 255, 255, 0.4);
    }

    /* 🌟 CSS Keyframe Animations for SVGs */
    .icon-wrapper svg {
      width: 28px;
      height: 28px;
      transition: all 0.4s ease;
    }

    /* Delivery Pulse Animation */
    @keyframes pulse-lightning {
      0%, 100% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(56,189,248,0.5)); }
      50% { transform: scale(1.18); filter: drop-shadow(0 0 10px rgba(56,189,248,0.9)); }
    }
    .feature-card:hover .delivery-icon {
      animation: pulse-lightning 1.2s infinite ease-in-out;
    }

    /* Authenticity Shield Pulse Animation */
    @keyframes shield-bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px) scale(1.05); }
    }
    .feature-card:hover .shield-icon {
      animation: shield-bounce 1s infinite ease-in-out;
    }

    /* Cash Card Float Animation */
    @keyframes card-flip {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(12deg) scale(1.1); }
    }
    .feature-card:hover .cash-icon {
      animation: card-flip 1s infinite ease-in-out;
    }

    /* Support Headset Ripple Animation */
    @keyframes headset-wiggle {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-8deg); }
      75% { transform: rotate(8deg); }
    }
    .feature-card:hover .support-icon {
      animation: headset-wiggle 0.8s infinite ease-in-out;
    }

    /* 📝 Typography & Layering */
    .card-content-box {
      position: relative;
      z-index: 1;
    }

    .card-title {
      color: #f8fafc;
      font-size: 1.25rem;
      font-weight: 800;
      margin: 0 0 0.6rem 0;
      letter-spacing: -0.01em;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }

    .card-description {
      color: #94a3b8;
      font-size: 0.93rem;
      line-height: 1.65;
      margin: 0;
      font-weight: 400;
    }
  `}</style>

  {/* Card 1: Delivery */}
  <div className="feature-card">
    <div className="icon-wrapper">
      <svg className="delivery-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    </div>
    <div className="card-content-box">
      <h3 className="card-title">Nationwide Express Delivery</h3>
      <p className="card-description">
        Get your favorite gadgets delivered directly to your doorstep in 2 to 4 business days with real-time tracking updates.
      </p>
    </div>
  </div>

  {/* Card 2: Authenticity */}
  <div className="feature-card">
    <div className="icon-wrapper">
      <svg className="shield-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    </div>
    <div className="card-content-box">
      <h3 className="card-title">100% Brand Authenticity</h3>
      <p className="card-description">
        All products are sourced directly from official manufacturers, fully backed by valid official brand warranties.
      </p>
    </div>
  </div>

  {/* Card 3: Cash on Delivery */}
  <div className="feature-card">
    <div className="icon-wrapper">
      <svg className="cash-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    </div>
    <div className="card-content-box">
      <h3 className="card-title">Safe Cash on Delivery</h3>
      <p className="card-description">
        Pay conveniently upon package arrival. Verify your order details before handing over cash with full peace of mind.
      </p>
    </div>
  </div>

  {/* Card 4: Support */}
  <div className="feature-card">
    <div className="icon-wrapper">
      <svg className="support-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    </div>
    <div className="card-content-box">
      <h3 className="card-title">24/7 Expert Support</h3>
      <p className="card-description">
        Our dedicated tech customer care team is available around the clock to assist you with order queries and technical setup.
      </p>
    </div>
  </div>


</div>
<div style={{
  position: 'relative',
  width: '100%',
  maxWidth: '1200px',
  margin: '6rem auto',
  padding: '4rem 1.5rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden'
}}>

  <style>{`
    /* Background Cyberpunk Grid Floor Effect */
    .super-grid-bg {
      position: absolute;
      top: -20%;
      left: -20%;
      width: 140%;
      height: 140%;
      background-image: 
        linear-gradient(rgba(168, 85, 247, 0.07) 1px, transparent 1px),
        linear-gradient(90deg, rgba(168, 85, 247, 0.07) 1px, transparent 1px);
      background-size: 40px 40px;
      transform: perspective(600px) rotateX(60deg);
      pointer-events: none;
      z-index: 0;
    }

    @keyframes superGlowPulse {
      0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
      50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.8; }
    }

    @keyframes superBorderRotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes superFloatCenter {
      0% { transform: translateY(0px) scale(1); }
      100% { transform: translateY(-12px) scale(1.01); }
    }

    @keyframes superFloatSmall {
      0% { transform: translateY(0px) rotate(0deg); }
      100% { transform: translateY(-8px) rotate(0.8deg); }
    }

    /* Outer Container Grid */
    .super-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: auto auto;
      gap: 3rem;
      align-items: center;
      width: 100%;
      position: relative;
      z-index: 2;
    }

    /* Main Card Shell */
    .super-card {
      position: relative;
      border-radius: 28px;
      padding: 1.5px;
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(25px) saturate(200%);
      -webkit-backdrop-filter: blur(25px) saturate(200%);
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(168, 85, 247, 0.2);
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
    }

    /* Animated Neon Gradient Border Beam */
    .super-card::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: conic-gradient(from 0deg, transparent 0 300deg, #a855f7 320deg, #ec4899 340deg, #3b82f6 360deg);
      animation: superBorderRotate 8s linear infinite;
      z-index: 1;
    }

    .super-card-inner {
      position: relative;
      z-index: 2;
      background: #090d16;
      border-radius: 26px;
      overflow: hidden;
      height: 100%;
    }

    .super-card:hover {
      transform: translateY(-12px) scale(1.03) !important;
      box-shadow: 0 35px 80px rgba(0, 0, 0, 0.95), 0 0 60px rgba(168, 85, 247, 0.45);
    }

    .super-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      filter: contrast(1.15) brightness(0.92);
      transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .super-card:hover .super-img {
      transform: scale(1.08);
    }

    /* Ultra Badge with Glow Dot */
    .super-badge {
      position: absolute;
      bottom: 1.25rem;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(168, 85, 247, 0.4);
      border-radius: 100px;
      padding: 0.65rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      color: #ffffff;
      font-size: 0.9rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      white-space: nowrap;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.7);
      z-index: 5;
    }

    .super-badge-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #a855f7;
      box-shadow: 0 0 10px #a855f7, 0 0 20px #a855f7;
    }

    /* Center Main Laptop Styling */
    .super-center-card {
      grid-column: 2;
      grid-row: 1 / span 2;
      height: 520px;
      animation: superFloatCenter 4s ease-in-out infinite alternate;
    }

    .super-center-card .super-badge {
      font-size: 1.05rem;
      padding: 0.8rem 2rem;
      border-color: rgba(168, 85, 247, 0.6);
      background: rgba(15, 23, 42, 0.92);
    }

    /* Corner Small Cards */
    .super-small-card {
      height: 235px;
      animation: superFloatSmall 5s ease-in-out infinite alternate;
    }

    /* Ambient Background Glow */
    .super-glow-orb {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 550px;
      height: 550px;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.28) 0%, rgba(124, 58, 237, 0.12) 50%, transparent 70%);
      filter: blur(90px);
      z-index: 1;
      pointer-events: none;
      animation: superGlowPulse 6s infinite alternate;
    }

    /* Responsive Design */
    @media (max-width: 900px) {
      .super-container {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto;
      }
      .super-center-card {
        grid-column: 1 / span 2;
        grid-row: auto;
        height: 400px;
      }
      .super-small-card {
        height: 210px;
      }
    }
  `}</style>

  {/* Ambient Floor Grid & Glow */}
  <div className="super-grid-bg"></div>
  <div className="super-glow-orb"></div>

  <div className="super-container">

    {/* TOP LEFT: Smartphone */}
    <div className="super-card super-small-card" style={{ animationDelay: '0s' }}>
      <div className="super-card-inner">
        <img
          className="super-img"
          src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"
          alt="Smartphone"
        />
        <div className="super-badge">
          <span className="super-badge-dot"></span>
          Smartphone
        </div>
      </div>
    </div>

    {/* CENTER: Main Laptop */}
    <div className="super-card super-center-card">
      <div className="super-card-inner">
        <img
          className="super-img"
          src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80"
          alt="Pro Laptop"
        />
        <div className="super-badge">
          <span className="super-badge-dot"></span>
          Pro Laptop
        </div>
      </div>
    </div>

    {/* TOP RIGHT: Tablet */}
    <div className="super-card super-small-card" style={{ animationDelay: '1s' }}>
      <div className="super-card-inner">
        <img
          className="super-img"
          src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80"
          alt="Tablet"
        />
        <div className="super-badge">
          <span className="super-badge-dot"></span>
          Tablet
        </div>
      </div>
    </div>

    {/* BOTTOM LEFT: Chromebook */}
    <div className="super-card super-small-card" style={{ animationDelay: '1.5s' }}>
      <div className="super-card-inner">
        <img
          className="super-img"
          src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=600&q=80"
          alt="Chromebook"
        />
        <div className="super-badge">
          <span className="super-badge-dot"></span>
          Chromebook
        </div>
      </div>
    </div>

    {/* BOTTOM RIGHT: Smartwatch */}
    <div className="super-card super-small-card" style={{ animationDelay: '2s' }}>
      <div className="super-card-inner">
        <img
          className="super-img"
          src="https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80"
          alt="Smartwatch"
        />
        <div className="super-badge">
          <span className="super-badge-dot"></span>
          Smartwatch
        </div>
      </div>
    </div>

  </div>

</div>
  

</div>

{/* --- HOME PAGE UPLOADED PRODUCTS SHOWCASE --- */}
<div className="showcase-section">
  
  {/* Section Heading */}
  <div className="showcase-heading">
    <span className="showcase-badge">Fresh Arrivals</span>
    <h2 className="showcase-title">Premium Showcase ⚡</h2>
    <p className="showcase-description">
      Discover our top-tier inventory, carefully categorized for your ultimate tech upgrade.
    </p>
  </div>

  {/* Dynamic Categories & Products Showcase */}
  {products.length === 0 ? (
    <div className="showcase-empty">
      <p>Abhi tak koi product upload nahi hua. Admin Panel se naya product upload karein! 🚀</p>
    </div>
  ) : (
    <div>
      {(() => {
        const uniqueCategories = [...new Set(products.map(p => p.category || 'Mobiles'))];

        return uniqueCategories.map(category => {
          const categoryProducts = products.filter(p => (p.category || 'Mobiles') === category).slice(0, 3);

          if (categoryProducts.length === 0) return null;

          return (
            <div key={category} className="showcase-category-block">
              
              {/* Premium Category Heading */}
              <div className="showcase-category-heading">
                <h3 className="showcase-category-title">
                  <span className="emoji">✨</span> 
                  {category}
                </h3>
                <span className="showcase-category-tag">Top 3 Picks</span>
              </div>

              {/* Products Grid */}
              <div className="showcase-products-grid">
                {categoryProducts.map(product => (
                  <div className="showcase-product-card" key={product._id}>
                    
                    {/* Image Box */}
                    <div 
                      className="showcase-image-box"
                      onClick={() => { setSelectedProduct(product); window.scrollTo({ top: 0, behavior: 'smooth' }); setCurrentPage('product-detail'); }}
                    >
                      <img 
                        src={(product.images && product.images[0]) || 'https://via.placeholder.com/400'} 
                        alt={product.name} 
                      />
                    </div>

                    {/* Content */}
                    <div className="showcase-product-content">
                      
                      {/* Product Name */}
                      <h3 
                        className="showcase-product-name"
                        onClick={() => { setSelectedProduct(product); window.scrollTo({ top: 0, behavior: 'smooth' }); setCurrentPage('product-detail'); }}
                      >
                        {product.name}
                      </h3>

                      {/* Rating */}
                      {(() => {
                        const reviews = product.reviews || [];
                        const totalReviews = reviews.length;
                        const avgRating = totalReviews > 0 
                          ? (reviews.reduce((acc, item) => acc + Number(item.rating || 0), 0) / totalReviews).toFixed(1)
                          : (product.rating || 0).toFixed(1);
                        const numericRating = Number(avgRating);

                        return (
                          <div className="showcase-ratings">
                            <div className="showcase-stars">
                              {'★'.repeat(Math.floor(numericRating))}
                              {numericRating % 1 >= 0.5 ? '½' : ''}
                              {'☆'.repeat(Math.max(0, 5 - Math.ceil(numericRating)))}
                            </div>
                            <span className="showcase-rating-number">
                              {numericRating > 0 ? numericRating : '0.0'}
                            </span>
                            <span className="showcase-reviews-count">
                              ({totalReviews})
                            </span>
                          </div>
                        );
                      })()}

                      {/* Price */}
                      <div className="showcase-price-row">
                        <span className="showcase-currency">PKR</span>
                        <span className="showcase-price">
                          {product.discountPrice || product.regularPrice}
                        </span>
                        {product.discountPrice && (
                          <span className="showcase-old-price">{product.regularPrice}</span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="showcase-actions">
                        <button 
                          className="showcase-btn-cart"
                          onClick={() => handleAddToCart(product)}
                        >
                          Add to Cart
                        </button>
                        <button 
                          className="showcase-btn-details"
                          onClick={() => { setSelectedProduct(product); window.scrollTo({ top: 0, behavior: 'smooth' }); setCurrentPage('product-detail'); }}
                        >
                          Details →
                        </button>
                      </div>

                    </div>

                  </div>
                ))}
              </div>

            </div>
          );
        });
      })()}
    </div>
  )}

  {/* View All Products Button */}
  <div className="showcase-view-all-wrap">
    <button
      className="showcase-view-all-btn"
      onClick={() => setCurrentPage('products')}
    >
      View Full Catalog ({products.length}) 🛍️
    </button>
  </div>

</div>
{/* --- BHAR BHAR KE RICH DETAILS SECTION (5 ZIG-ZAG IMAGES & TEXT) --- */}
<div style={{ marginTop: '6rem', display: 'flex', flexDirection: 'column', gap: '5rem' }}>

  {/* 1. Feature Row 1 (Image Left, Text Right) */}
  <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '4rem',
    background: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(56, 189, 248, 0.2)',
    borderRadius: '32px',
    padding: '3rem',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
  }}>
    <div style={{ flex: '1 1 450px', borderRadius: '24px', overflow: 'hidden', height: '380px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <img src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1200&auto=format&fit=crop" alt="Flagship Smartphones" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <div style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '6px 16px', borderRadius: '20px', border: '1px solid rgba(56, 189, 248, 0.3)', fontSize: '0.85rem', fontWeight: 'bold', width: 'fit-content', textTransform: 'uppercase' }}>
        📱 Mobile Innovation
      </span>
      <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', margin: 0, lineHeight: '1.2' }}>
        Flagship Smartphones Engineered for Perfection
      </h2>
      <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.8', margin: 0 }}>
        Discover our ultra-high definition OLED screens, aerospace-grade titanium framing, and multi-lens camera setups designed to capture life's purest moments. Built with industry-leading processors to guarantee zero latency and blistering fast multi-tasking performance.
      </p>
      <div style={{ display: 'flex', gap: '1.5rem', color: '#38bdf8', fontWeight: 'bold', fontSize: '0.95rem' }}>
        <span>✔ 120Hz Fluid Displays</span>
        <span>✔ 100x Optical Zoom</span>
      </div>
    </div>
  </div>

  {/* 2. Feature Row 2 (Text Left, Image Right) */}
  <div style={{
    display: 'flex',
    flexWrap: 'wrap-reverse',
    alignItems: 'center',
    gap: '4rem',
    background: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(129, 140, 248, 0.2)',
    borderRadius: '32px',
    padding: '3rem',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
  }}>
    <div style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      <span style={{ background: 'rgba(129, 140, 248, 0.15)', color: '#818cf8', padding: '6px 16px', borderRadius: '20px', border: '1px solid rgba(129, 140, 248, 0.3)', fontSize: '0.85rem', fontWeight: 'bold', width: 'fit-content', textTransform: 'uppercase' }}>
        💻 Next-Gen Workstations
      </span>
      <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', margin: 0, lineHeight: '1.2' }}>
        Powerhouse Laptops for Creators & Professionals
      </h2>
      <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.8', margin: 0 }}>
        Unleash pure creative freedom with workstation-grade graphics processing, liquid cooling thermals, and all-day battery efficiency. Whether rendering intensive 3D models or editing 8K video timelines, Electro Mark laptops deliver uncompromised computing speed.
      </p>
      <div style={{ display: 'flex', gap: '1.5rem', color: '#818cf8', fontWeight: 'bold', fontSize: '0.95rem' }}>
        <span>✔ Up to 64GB DDR5 RAM</span>
        <span>✔ Thunderbolt 4 Ports</span>
      </div>
    </div>
    <div style={{ flex: '1 1 450px', borderRadius: '24px', overflow: 'hidden', height: '380px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <img src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1200&auto=format&fit=crop" alt="High Performance Laptops" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  </div>

  {/* 3. Feature Row 3 (Image Left, Text Right) */}
  <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '4rem',
    background: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(74, 222, 128, 0.2)',
    borderRadius: '32px',
    padding: '3rem',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
  }}>
    <div style={{ flex: '1 1 450px', borderRadius: '24px', overflow: 'hidden', height: '380px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop" alt="Audiophile Headsets" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <div style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      <span style={{ background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', padding: '6px 16px', borderRadius: '20px', border: '1px solid rgba(74, 222, 128, 0.3)', fontSize: '0.85rem', fontWeight: 'bold', width: 'fit-content', textTransform: 'uppercase' }}>
        🎧 Studio Fidelity Audio
      </span>
      <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', margin: 0, lineHeight: '1.2' }}>
        Immersive Active Noise Cancelling Sound
      </h2>
      <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.8', margin: 0 }}>
        Step into acoustic perfection with custom dynamic drivers, spatial 3D audio isolation, and active noise cancellation that silences background ambient noise. Enjoy studio-quality bass, crystalline highs, and continuous 40-hour playback stamina.
      </p>
      <div style={{ display: 'flex', gap: '1.5rem', color: '#4ade80', fontWeight: 'bold', fontSize: '0.95rem' }}>
        <span>✔ Lossless Audio Codecs</span>
        <span>✔ Hybrid Noise Isolation</span>
      </div>
    </div>
  </div>

  {/* 4. Feature Row 4 (Text Left, Image Right) */}
  <div style={{
    display: 'flex',
    flexWrap: 'wrap-reverse',
    alignItems: 'center',
    gap: '4rem',
    background: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(251, 146, 60, 0.2)',
    borderRadius: '32px',
    padding: '3rem',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
  }}>
    <div style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      <span style={{ background: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', padding: '6px 16px', borderRadius: '20px', border: '1px solid rgba(251, 146, 60, 0.3)', fontSize: '0.85rem', fontWeight: 'bold', width: 'fit-content', textTransform: 'uppercase' }}>
        ⌚ Smart Wearables
      </span>
      <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', margin: 0, lineHeight: '1.2' }}>
        Smartwatches Designed for Health & Fitness Tracking
      </h2>
      <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.8', margin: 0 }}>
        Monitor real-time heart metrics, oxygen saturation, sleep cycles, and daily caloric burn with surgical precision. Encased in sapphire crystal glass with 50-meter water resistance, our wearables combine sleek elegance with rugged sports durability.
      </p>
      <div style={{ display: 'flex', gap: '1.5rem', color: '#fb923c', fontWeight: 'bold', fontSize: '0.95rem' }}>
        <span>✔ Always-On AMOLED</span>
        <span>✔ Dual-Frequency GPS</span>
      </div>
    </div>
    <div style={{ flex: '1 1 450px', borderRadius: '24px', overflow: 'hidden', height: '380px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop" alt="Smartwatches & Wearables" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  </div>

  {/* 5. Feature Row 5 (Image Left, Text Right) */}
  <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '4rem',
    background: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(236, 72, 153, 0.2)',
    borderRadius: '32px',
    padding: '3rem',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
  }}>
    <div style={{ flex: '1 1 450px', borderRadius: '24px', overflow: 'hidden', height: '380px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <img src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1200&auto=format&fit=crop" alt="Pro Tablets" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <div style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      <span style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', padding: '6px 16px', borderRadius: '20px', border: '1px solid rgba(236, 72, 153, 0.3)', fontSize: '0.85rem', fontWeight: 'bold', width: 'fit-content', textTransform: 'uppercase' }}>
        🎨 Pro Digital Canvas
      </span>
      <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', margin: 0, lineHeight: '1.2' }}>
        Versatile Tablets & Accessories for Ultimate Productivity
      </h2>
      <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.8', margin: 0 }}>
        Transform your workflow into a digital studio with stylus-enabled pressure sensitivity, magnetic keyboard dock support, and ultra-wide camera lenses. Designed for designers, students, and remote professionals who demand mobility without compromise.
      </p>
      <div style={{ display: 'flex', gap: '1.5rem', color: '#ec4899', fontWeight: 'bold', fontSize: '0.95rem' }}>
        <span>✔ Stylus Pen Precision</span>
        <span>✔ Wi-Fi 6E Connectivity</span>
      </div>
    </div>
  </div>

</div>
{/* --- ULTRA PREMIUM UNIQUE EXTENDED SECTIONS --- */}
<div style={{ marginTop: '7rem', display: 'flex', flexDirection: 'column', gap: '6rem' }}>

  {/* 1. INTERACTIVE TECH ECOSYSTEM CARDS */}
  <div style={{ textAlign: 'center' }}>
    <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '6px 18px', borderRadius: '30px', border: '1px solid rgba(56, 189, 248, 0.3)', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>
      Unified Standard
    </span>
    <h2 style={{ fontSize: '3rem', fontWeight: '900', color: '#fff', margin: '0.8rem 0 0.5rem 0' }}>
      The Electro Mark Architecture ⚡
    </h2>
    <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto 3rem auto' }}>
      Every gadget in our catalog adheres to strict performance, durability, and safety standards.
    </p>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
      
      {/* Box 1 */}
      <div style={{
        background: 'linear-gradient(160deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '28px',
        padding: '2.5rem 2rem',
        textAlign: 'left',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1.2rem' }}>⚡</div>
        <h3 style={{ color: '#f8fafc', fontSize: '1.4rem', fontWeight: '800', margin: '0 0 0.8rem 0' }}>Zero-Latency Sync</h3>
        <p style={{ color: '#cbd5e1', fontSize: '0.98rem', lineHeight: '1.7', margin: 0 }}>
          Hardware optimized for instant Bluetooth 5.3 auto-pairing, ultra-wideband audio streaming, and lag-free wireless file sharing across all your devices.
        </p>
      </div>

      {/* Box 2 */}
      <div style={{
        background: 'linear-gradient(160deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '28px',
        padding: '2.5rem 2rem',
        textAlign: 'left',
        position: 'relative',
        boxShadow: '0 15px 30px -10px rgba(56, 189, 248, 0.2)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1.2rem' }}>🛡️</div>
        <h3 style={{ color: '#38bdf8', fontSize: '1.4rem', fontWeight: '800', margin: '0 0 0.8rem 0' }}>Military-Grade Testing</h3>
        <p style={{ color: '#cbd5e1', fontSize: '0.98rem', lineHeight: '1.7', margin: 0 }}>
          Rigorous thermal resistance, drop protection, and water submersion testing ensure your devices survive harsh real-world environments effortless.
        </p>
      </div>

      {/* Box 3 */}
      <div style={{
        background: 'linear-gradient(160deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '28px',
        padding: '2.5rem 2rem',
        textAlign: 'left',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1.2rem' }}>🔋</div>
        <h3 style={{ color: '#f8fafc', fontSize: '1.4rem', fontWeight: '800', margin: '0 0 0.8rem 0' }}>AI Battery Optimization</h3>
        <p style={{ color: '#cbd5e1', fontSize: '0.98rem', lineHeight: '1.7', margin: 0 }}>
          Smart power routing algorithms extend overall battery lifespan up to 300% longer while preventing thermal throttling during heavy power usage.
        </p>
      </div>

    </div>
  </div>


  {/* 2. MODERN COMPARISON MATRIX */}
  <div style={{
  position: 'relative',
  width: '100%',
  maxWidth: '1100px',
  margin: '5rem auto',
  padding: '1.5px',
  borderRadius: '36px',
  background: 'rgba(15, 23, 42, 0.8)',
  boxShadow: '0 30px 90px rgba(0, 0, 0, 0.85), 0 0 50px rgba(168, 85, 247, 0.25)',
  overflow: 'hidden'
}}>

  <style>{`
    @keyframes tableBorderGlow {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes tablePulseOrb {
      0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.35; }
      50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.75; }
    }

    /* Conic Animated Border */
    .em-table-card::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: conic-gradient(from 0deg, transparent 0 300deg, #a855f7 320deg, #38bdf8 340deg, #ec4899 360deg);
      animation: tableBorderGlow 8s linear infinite;
      z-index: 1;
    }

    .em-table-inner {
      position: relative;
      z-index: 2;
      background: #090d16;
      backdrop-filter: blur(30px) saturate(200%);
      -webkit-backdrop-filter: blur(30px) saturate(200%);
      border-radius: 35px;
      padding: 3.5rem 2.5rem;
      overflow: hidden;
    }

    .em-table-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.45rem 1.2rem;
      border-radius: 100px;
      background: rgba(168, 85, 247, 0.08);
      border: 1px solid rgba(168, 85, 247, 0.35);
      backdrop-filter: blur(12px);
      color: #e9d5ff;
      font-size: 0.85rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 1.2rem;
      box-shadow: 0 0 20px rgba(168, 85, 247, 0.2);
    }

    .em-badge-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #38bdf8;
      box-shadow: 0 0 10px #38bdf8, 0 0 20px #38bdf8;
    }

    .em-table-title {
      font-size: clamp(2.2rem, 4vw, 3.2rem);
      font-weight: 900;
      margin: 0 0 0.8rem 0;
      background: linear-gradient(135deg, #ffffff 30%, #e9d5ff 70%, #a855f7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.02em;
    }

    .em-table-subtitle {
      color: #94a3b8;
      font-size: 1.1rem;
      margin: 0;
      font-weight: 400;
    }

    /* Table Styling */
    .em-custom-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      text-align: left;
      color: #fff;
      min-width: 650px;
      margin-top: 1rem;
    }

    .em-custom-table th {
      padding: 1.5rem 1.2rem;
      font-size: 1.05rem;
      font-weight: 800;
      letter-spacing: 0.03em;
      border-bottom: 2px solid rgba(255, 255, 255, 0.08);
      text-transform: uppercase;
    }

    .em-custom-table td {
      padding: 1.4rem 1.2rem;
      font-size: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      transition: all 0.3s ease;
    }

    .em-custom-table tbody tr {
      transition: all 0.3s ease;
      border-radius: 16px;
    }

    .em-custom-table tbody tr:hover td {
      background: rgba(168, 85, 247, 0.06);
    }

    /* Highlight Column (Electro Mark Elite) */
    .em-highlight-col {
      background: rgba(56, 189, 248, 0.04);
      border-left: 1px solid rgba(56, 189, 248, 0.15);
      border-right: 1px solid rgba(56, 189, 248, 0.15);
    }

    .em-highlight-header {
      background: linear-gradient(180deg, rgba(56, 189, 248, 0.15) 0%, rgba(56, 189, 248, 0.02) 100%);
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      border-left: 1px solid rgba(56, 189, 248, 0.25) !important;
      border-right: 1px solid rgba(56, 189, 248, 0.25) !important;
      border-top: 1px solid rgba(56, 189, 248, 0.25);
    }

    .em-badge-check {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #4ade80;
      font-weight: 700;
    }

    .em-badge-cross {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #f87171;
    }

    /* Ambient Glow Behind Table */
    .em-table-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.22) 0%, rgba(56, 189, 248, 0.1) 50%, transparent 70%);
      filter: blur(90px);
      z-index: 0;
      pointer-events: none;
      animation: tablePulseOrb 6s infinite alternate;
    }
  `}</style>

  <div className="em-table-card">
    <div className="em-table-glow"></div>

    <div className="em-table-inner">
      
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div className="em-table-badge">
          <span className="em-badge-dot"></span>
          Verified Comparison
        </div>
        <h2 className="em-table-title">
          Standard Market vs. Electro Mark Guarantee ⚡
        </h2>
        <p className="em-table-subtitle">
          See why thousands of buyers choose our official tech inventory over market alternatives.
        </p>
      </div>

      {/* Table Container */}
      <div style={{ overflowX: 'auto' }}>
        <table className="em-custom-table">
          <thead>
            <tr>
              <th style={{ color: '#94a3b8', width: '28%' }}>Key Feature</th>
              <th style={{ color: '#94a3b8', width: '32%' }}>Ordinary Sellers</th>
              <th className="em-highlight-header" style={{ color: '#38bdf8', fontSize: '1.2rem' }}>
                Electro Mark Elite ⚡
              </th>
            </tr>
          </thead>
          <tbody>

            <tr>
              <td style={{ fontWeight: '700', color: '#f1f5f9' }}>Product Authenticity</td>
              <td>
                <span className="em-badge-cross">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  Refurbished or Replica
                </span>
              </td>
              <td className="em-highlight-col">
                <span className="em-badge-check">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  100% Factory Sealed Genuine
                </span>
              </td>
            </tr>

            <tr>
              <td style={{ fontWeight: '700', color: '#f1f5f9' }}>Warranty Coverage</td>
              <td>
                <span className="em-badge-cross">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  Short 7-Day Checking
                </span>
              </td>
              <td className="em-highlight-col">
                <span className="em-badge-check">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  1 to 2 Years Official Warranty
                </span>
              </td>
            </tr>

            <tr>
              <td style={{ fontWeight: '700', color: '#f1f5f9' }}>Delivery & Inspection</td>
              <td>
                <span className="em-badge-cross">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  Delayed Express & Advance Only
                </span>
              </td>
              <td className="em-highlight-col">
                <span className="em-badge-check">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Express Cash On Delivery
                </span>
              </td>
            </tr>

            <tr>
              <td style={{ fontWeight: '700', color: '#f1f5f9' }}>Customer Support</td>
              <td>
                <span className="em-badge-cross">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  Unresponsive After Delivery
                </span>
              </td>
              <td className="em-highlight-col" style={{ borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
                <span className="em-badge-check">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  24/7 Priority Tech Desk
                </span>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

    </div>
  </div>

</div>


  {/* 3. BUYER'S FAQ / ACCORDION STYLE TRUST SECTION */}
  <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
      <span style={{ background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', padding: '6px 18px', borderRadius: '30px', border: '1px solid rgba(74, 222, 128, 0.3)', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>
        Got Questions?
      </span>
      <h2 style={{ fontSize: '2.8rem', fontWeight: '900', color: '#fff', margin: '0.8rem 0 0.5rem 0' }}>
        Frequently Asked Questions 💬
      </h2>
      <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Everything you need to know before ordering your next gadget.</p>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* FAQ Item 1 */}
      <div style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '1.8rem 2rem' }}>
        <h4 style={{ color: '#38bdf8', fontSize: '1.2rem', margin: '0 0 0.6rem 0', fontWeight: '800' }}>
          ❓ How does Cash on Delivery (COD) work?
        </h4>
        <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.7', margin: 0 }}>
          Simply place your order online, fill out your shipping address at checkout, and select COD. You only pay in cash once the courier hands over your sealed parcel at your doorstep.
        </p>
      </div>

      {/* FAQ Item 2 */}
      <div style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '1.8rem 2rem' }}>
        <h4 style={{ color: '#38bdf8', fontSize: '1.2rem', margin: '0 0 0.6rem 0', fontWeight: '800' }}>
          ❓ How do I claim the brand warranty if needed?
        </h4>
        <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.7', margin: 0 }}>
          All products come with an official warranty card inside the box. You can claim it at any official service center nationwide or contact our 24/7 support team to guide you through the process.
        </p>
      </div>

      {/* FAQ Item 3 */}
      <div style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '1.8rem 2rem' }}>
        <h4 style={{ color: '#38bdf8', fontSize: '1.2rem', margin: '0 0 0.6rem 0', fontWeight: '800' }}>
          ❓ What is the estimated delivery timeframe?
        </h4>
        <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.7', margin: 0 }}>
          Orders are dispatched within 24 hours. Major metropolitan cities receive orders within 2 business days, while other areas take 3 to 4 business days.
        </p>
      </div>

    </div>
  </div>

</div>
{/* --- FINAL ECOSYSTEM HIGHLIGHT & NEWSLETTER SECTION (1-INCH MARGIN BEFORE FOOTER) --- */}
<div style={{ 
  marginTop: '6rem', 
  marginBottom: '2.5rem', /* 1 Inch Gap Before Footer */
  display: 'flex', 
  flexDirection: 'column', 
  gap: '4rem' 
}}>

  {/* 1. Interactive 3-Column Innovation Grid */}
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem'
  }}>
    
    {/* Card 1 */}
    <div style={{
      background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.85) 100%)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(56, 189, 248, 0.25)',
      borderRadius: '28px',
      padding: '2.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ 
        width: '50px', 
        height: '50px', 
        borderRadius: '16px', 
        background: 'rgba(56, 189, 248, 0.15)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        fontSize: '1.8rem', 
        marginBottom: '1.5rem',
        border: '1px solid rgba(56, 189, 248, 0.3)'
      }}>
        ⚙️
      </div>
      <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: '800', margin: '0 0 0.8rem 0' }}>
        Precision Quality Control
      </h3>
      <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.7', margin: 0 }}>
        Every single item shipped from our warehouse undergoes a strict 15-point diagnostic check to ensure zero defective hardware or aesthetic blemishes reach your hands.
      </p>
    </div>

    {/* Card 2 */}
    <div style={{
      background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.85) 100%)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(129, 140, 248, 0.25)',
      borderRadius: '28px',
      padding: '2.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ 
        width: '50px', 
        height: '50px', 
        borderRadius: '16px', 
        background: 'rgba(129, 140, 248, 0.15)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        fontSize: '1.8rem', 
        marginBottom: '1.5rem',
        border: '1px solid rgba(129, 140, 248, 0.3)'
      }}>
        🔄
      </div>
      <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: '800', margin: '0 0 0.8rem 0' }}>
        Hassle-Free Replacement
      </h3>
      <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.7', margin: 0 }}>
        Encountered an unexpected glitch? Our streamlined 7-day instant replacement window ensures your order is swapped for a brand-new unit without lengthy waiting periods.
      </p>
    </div>

    {/* Card 3 */}
    <div style={{
      background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.85) 100%)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(74, 222, 128, 0.25)',
      borderRadius: '28px',
      padding: '2.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ 
        width: '50px', 
        height: '50px', 
        borderRadius: '16px', 
        background: 'rgba(74, 222, 128, 0.15)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        fontSize: '1.8rem', 
        marginBottom: '1.5rem',
        border: '1px solid rgba(74, 222, 128, 0.3)'
      }}>
        🌍
      </div>
      <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: '800', margin: '0 0 0.8rem 0' }}>
        Global Tech Sourcing
      </h3>
      <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.7', margin: 0 }}>
        We partner directly with authorized international distributors in North America, Japan, and Europe to bring rare, high-demand flagship electronics straight to Pakistan.
      </p>
    </div>

  </div>

  {/* 2. VIP Tech Club / Newsletter Subscription Banner */}
  <div>
  {/* CSS Styles for Animated Border Beam */}
  <style>{`
    @keyframes moveBeam {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `}</style>

  {/* Outer Container with Rotating Border Line */}
  <div style={{
    position: 'relative',
    borderRadius: '32px',
    padding: '2px', // Border Thickness
    overflow: 'hidden',
    maxWidth: '700px',
    margin: '0 auto',
    boxShadow: '0 0 40px rgba(56, 189, 248, 0.25)'
  }}>
    {/* Moving Beam Layer */}
    <div style={{
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: 'conic-gradient(from 0deg, transparent 0 270deg, #38bdf8 310deg, #818cf8 340deg, #c084fc 360deg)',
      animation: 'moveBeam 3.5s linear infinite'
    }} />

    {/* Inner Dark Glass Card */}
    <div style={{
      position: 'relative',
      zIndex: 1,
      background: 'radial-gradient(circle at top right, rgba(15, 23, 42, 0.9) 0%, rgba(3, 7, 18, 0.98) 80%)',
      backdropFilter: 'blur(24px)',
      borderRadius: '30px',
      padding: '3.5rem 2.5rem',
      textAlign: 'center'
    }}>
      <span style={{ 
        background: 'rgba(56, 189, 248, 0.1)', 
        color: '#38bdf8', 
        padding: '6px 20px', 
        borderRadius: '30px', 
        border: '1px solid rgba(56, 189, 248, 0.25)', 
        fontSize: '0.85rem', 
        fontWeight: 'bold', 
        letterSpacing: '2px', 
        textTransform: 'uppercase' 
      }}>
        ⚡ Get In Touch
      </span>

      <h2 style={{ 
        fontSize: '3rem', 
        fontWeight: '900', 
        color: '#fff', 
        margin: '1.2rem 0 0.8rem 0',
        background: 'linear-gradient(to right, #ffffff, #38bdf8, #818cf8)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Contact Us
      </h2>

      <p style={{ color: '#94a3b8', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto 2.5rem auto', lineHeight: '1.7' }}>
        Have questions or need assistance? Reach out directly to the Electro Mark team via WhatsApp or Email for instant support.
      </p>

      {/* Circle Icons Section */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '2rem', 
        alignItems: 'center' 
      }}>
        {/* WhatsApp Icon Circle */}
        <a 
          href="https://wa.me/923421287734?text=Hello%20Electro%20Mark%20team,%20I%20have%20a%20query%20and%20need%20some%20assistance" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: 'rgba(37, 211, 102, 0.1)',
            border: '1px solid rgba(37, 211, 102, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(37, 211, 102, 0.2)',
            transition: 'all 0.3s ease',
            textDecoration: 'none'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.background = '#25D366';
            e.currentTarget.querySelector('svg').style.fill = '#ffffff';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = 'rgba(37, 211, 102, 0.1)';
            e.currentTarget.querySelector('svg').style.fill = '#25D366';
          }}
        >
          <svg style={{ width: '35px', height: '35px', fill: '#25D366', transition: 'fill 0.3s ease' }} viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
        </a>

        {/* Gmail Icon Circle */}
        <a 
          href="mailto:book.apexcode@gmail.com?subject=Inquiry%20for%20Electro%20Mark" 
          style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: 'rgba(234, 67, 53, 0.1)',
            border: '1px solid rgba(234, 67, 53, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(234, 67, 53, 0.2)',
            transition: 'all 0.3s ease',
            textDecoration: 'none'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.background = '#EA4335';
            e.currentTarget.querySelector('svg').style.fill = '#ffffff';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = 'rgba(234, 67, 53, 0.1)';
            e.currentTarget.querySelector('svg').style.fill = '#EA4335';
          }}
        >
          <svg style={{ width: '32px', height: '32px', fill: '#EA4335', transition: 'fill 0.3s ease' }} viewBox="0 0 24 24">
            <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.545l8.073-6.052C21.69 2.28 24 3.434 24 5.457z"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</div>

</div>
  </div>
)}

        {/* Login Page */}
        {currentPage === 'login' && (
          <div className="login-wrapper">
            <div className="login-card">
              <div className="login-header">
                <div className="login-icon-badge">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                  </svg>
                </div>
                <h2>Admin Portal</h2>
                <p>Enter your credentials to access the store dashboard</p>
              </div>

              <form onSubmit={handleLogin} className="login-form">
                <div className="input-group">
                  <label>Email Address</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    <input 
                      type="email" 
                      placeholder="admin@electromark.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Password</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6-5c1.66 0 3 1.34 3 3v2H9V6c0-1.66 1.34-3 3-3zm6 15H6V10h12v10z"/>
                    </svg>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                {error && (
                  <div className="error-message">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <button type="submit" className="btn-login-submit">
                  Sign In
                </button>

                <button 
                  type="button" 
                  className="btn-back-home"
                  onClick={() => setCurrentPage('home')}
                >
                  ← Back to Store
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Dashboard Page */}
        {currentPage === 'dashboard' && (
          <div className="admin-wrapper">
            {/* Sidebar Navigation */}
            <aside className="admin-sidebar">
              <div className="sidebar-header">
                <div className="admin-avatar">A</div>
                <div>
                  <h4>Admin</h4>
                  <span className="admin-badge">Store Manager</span>
                </div>
              </div>

              <nav className="sidebar-menu">
                <button 
                  className={`sidebar-btn ${adminTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setAdminTab('dashboard')}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
                  Dashboard
                </button>

                <button 
                  className={`sidebar-btn ${adminTab === 'upload-product' ? 'active' : ''}`}
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ name: '', description: '', regularPrice: '', discountPrice: '', images: [] });
                    setAdminTab('upload-product');
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                  Upload Product
                </button>

                <button 
                  className={`sidebar-btn ${adminTab === 'update-password' ? 'active' : ''}`}
                  onClick={() => setAdminTab('update-password')}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6-5c1.66 0 3 1.34 3 3v2H9V6c0-1.66 1.34-3 3-3zm6 15H6V10h12v10z"/></svg>
                  Update Password
                </button>
              </nav>

              <button className="sidebar-btn btn-logout" onClick={() => { setCurrentPage('home'); setIsAdmin(false); }}>
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
                Logout
              </button>
            </aside>

            {/* Content Area */}
            <section className="admin-content">
{adminTab === 'dashboard' && (
  <div>
    {/* 1. KHOOBSURAT HEADING (Box se bahar/alag) */}
    <div style={{ marginBottom: '2rem' }}>
      <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '4px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
        Store Control Center
      </span>
      <h1 style={{ fontSize: '2.8rem', fontWeight: '900', margin: '0.8rem 0 0.5rem 0', background: 'linear-gradient(to right, #fff, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Admin Management Dashboard ⚡
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: 0, maxWidth: '650px', lineHeight: '1.6' }}>
        Welcome back, Admin! Here you can manage your inventory, update prices, list new flagship products, and control store security settings seamlessly.
      </p>
    </div>
                  {/* Ye rahi aapki Admin wali Product List */}
                  <div style={{ marginTop: '2rem' }}>
                    <h3 style={{ borderBottom: '1px solid #334155', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Uploaded Products</h3>
                    <div className="products-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                      {(products || [])
                        .map(product => (
                          <div className="product-card" key={product._id} style={{ background: '#1e293b', border: '1px solid #334155' }}>
                            <div className="product-image-box" style={{ height: '150px' }}>
                              <img src={(product.images && product.images[0]) || 'https://via.placeholder.com/150'} alt={product.name} />
                            </div>
                            <div className="product-details" style={{ padding: '1rem' }}>
                              <h4 className="product-name" style={{ fontSize: '1rem', margin: '0 0 0.5rem 0' }}>{product.name}</h4>
                              <div className="product-pricing" style={{ marginBottom: '0.5rem' }}>
                                <span className="current-price" style={{ color: '#38bdf8' }}>PKR {product.discountPrice || product.regularPrice}</span>
                              </div>
                              
                              {/* Edit & Delete Buttons sirf admin list me */}
                              <div className="admin-product-controls" style={{ display: 'flex', gap: '0.5rem' }}>
                                <button 
                                  onClick={() => handleEditClick(product)}
                                  style={{ flex: 1, background: '#eab308', color: '#000', border: 'none', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDeleteProduct(product._id)}
                                  style={{ flex: 1, background: '#ef4444', color: '#fff', border: 'none', padding: '0.4rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}
                                >
                                  Delete
                                </button>
                              {/* Admin Product Controls yahan khatam hote hain */}
</div>

{/* NAYA CODE: Admin Review Management */}
<div className="admin-product-reviews" style={{ marginTop: '1rem', borderTop: '1px solid #334155', paddingTop: '0.5rem' }}>
  <h5 style={{ color: '#94a3b8', margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>
    Reviews ({product.reviews ? product.reviews.length : 0})
  </h5>
  
  <div style={{ maxHeight: '100px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
    {(product.reviews || []).map(review => (
      <div key={review.id} style={{ background: '#0f172a', padding: '0.5rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <div style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
          <strong style={{color: '#fff'}}>{review.name}</strong> <span style={{color: '#fbbf24'}}>⭐{review.rating}</span><br/>
          <span style={{color: '#cbd5e1'}}>{review.comment}</span>
        </div>
        
        <button 
          onClick={async () => {
            if(window.confirm("Are you sure you want to delete this comment?")) {
              const res = await fetch(`http://127.0.0.1:5000/api/products/${product._id}/reviews/${review.id}`, { method: 'DELETE' });
              if (res.ok) {
                // Fetch fresh products list after deleting review
                const updated = await fetch('http://127.0.0.1:5000/api/products').then(r => r.json());
                setProducts(updated);
              }
            }
          }}
          style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold' }}
        >
          Del
        </button>
        
      </div>
    ))}
  </div>
</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* The Working Product Form */}
              {adminTab === 'upload-product' && (
  <div className="admin-card" style={{
    background: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(56, 189, 248, 0.25)',
    borderRadius: '24px',
    padding: '2.5rem',
    boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7)',
    maxWidth: '800px',
    margin: '0 auto'
  }}>
    <div className="card-header" style={{ marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
      <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '4px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
        Inventory Management
      </span>
      <h3 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#fff', margin: '0.5rem 0 0.2rem 0' }}>
        {editingId ? "✏️ Edit Product Details" : "🚀 Add New Product"}
      </h3>
      <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.95rem' }}>Fill in the details below to publish your item live to the store.</p>
    </div>

    <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Product Title */}
      <div className="form-group">
        <label style={{ display: 'block', color: '#cbd5e1', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Product Title *</label>
        <input 
          type="text" 
          value={formData.name} 
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
          placeholder="e.g. iPhone 15 Pro Max 256GB" 
          required 
          style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem', outline: 'none' }}
        />
      </div>

      {/* Category & Stock Status Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
        
        {/* Category Dropdown */}
        <div className="form-group">
          <label style={{ display: 'block', color: '#cbd5e1', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Category *</label>
          <select 
            value={formData.category} 
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem', outline: 'none', cursor: 'pointer' }}
          >
            <option value="Mobiles">📱 Mobiles & Tablets</option>
            <option value="Laptops">💻 Laptops & Computers</option>
            <option value="Audio">🎧 Headphones & Audio</option>
            <option value="Smartwatches">⌚ Smartwatches</option>
            <option value="Accessories">🔌 Accessories & Cables</option>
          </select>
        </div>

        {/* Stock Status Dropdown */}
        <div className="form-group">
          <label style={{ display: 'block', color: '#cbd5e1', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Stock Status *</label>
          <select 
            value={formData.stockStatus} 
            onChange={(e) => setFormData({...formData, stockStatus: e.target.value})}
            style={{ 
              width: '100%', 
              padding: '1rem', 
              borderRadius: '12px', 
              background: '#1e293b', 
              border: formData.stockStatus === 'in_stock' ? '1px solid #4ade80' : '1px solid #ef4444', 
              color: formData.stockStatus === 'in_stock' ? '#4ade80' : '#ef4444', 
              fontWeight: 'bold',
              fontSize: '1rem', 
              outline: 'none', 
              cursor: 'pointer' 
            }}
          >
            <option value="in_stock" style={{ color: '#4ade80', background: '#0f172a' }}>🟢 In Stock</option>
            <option value="out_of_stock" style={{ color: '#ef4444', background: '#0f172a' }}>🔴 Out of Stock</option>
          </select>
        </div>

      </div>

      {/* Description */}
      <div className="form-group">
        <label style={{ display: 'block', color: '#cbd5e1', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Description *</label>
        <textarea 
          value={formData.description} 
          onChange={(e) => setFormData({...formData, description: e.target.value})} 
          placeholder="Detailed specs, features, and warranty details..." 
          rows="4" 
          required 
          style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem', resize: 'vertical', outline: 'none' }}
        ></textarea>
      </div>

      {/* Regular & Discount Price */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
        <div className="form-group">
          <label style={{ display: 'block', color: '#cbd5e1', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Regular Price (PKR) *</label>
          <input 
            type="number" 
            step="1" 
            value={formData.regularPrice} 
            onChange={(e) => setFormData({...formData, regularPrice: e.target.value})} 
            placeholder="50000" 
            required 
            style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem', outline: 'none' }}
          />
        </div>
        <div className="form-group">
          <label style={{ display: 'block', color: '#cbd5e1', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Discount Price (PKR)</label>
          <input 
            type="number" 
            step="1" 
            value={formData.discountPrice} 
            onChange={(e) => setFormData({...formData, discountPrice: e.target.value})} 
            placeholder="45000" 
            style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem', outline: 'none' }}
          />
        </div>
      </div>

      {/* Image Upload */}
      <div className="form-group">
        <label style={{ display: 'block', color: '#cbd5e1', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Upload Product Images *</label>
        <input 
          type="file" 
          multiple 
          accept="image/*"
          onChange={handleImageUpload} 
          required={!editingId}
          style={{ width: '100%', background: 'rgba(30, 41, 59, 0.6)', padding: '1rem', borderRadius: '12px', color: '#cbd5e1', border: '1px dashed rgba(56, 189, 248, 0.4)', cursor: 'pointer' }}
        />
        {formData.images.length > 0 && (
          <span style={{ color: '#38bdf8', fontSize: '0.85rem', marginTop: '0.5rem', display: 'inline-block', fontWeight: 'bold' }}>
            ✓ {formData.images.length} Image(s) Attached
          </span>
        )}
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        style={{ 
          marginTop: '1rem', 
          padding: '1.2rem', 
          background: 'linear-gradient(135deg, #38bdf8, #2563eb)', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '14px', 
          fontSize: '1.1rem', 
          fontWeight: 'bold', 
          cursor: 'pointer',
          boxShadow: '0 10px 25px rgba(56, 189, 248, 0.3)',
          transition: 'transform 0.2s' 
        }}
      >
        {editingId ? "Update Product Listing" : "Publish Product Now 🚀"}
      </button>
    </form>
  </div>
)}

              {adminTab === 'update-password' && (
  <div className="admin-card max-w-md">
    <div className="card-header">
      <h3>Update Security Password</h3>
      <p>Ensure your account stays safe with a strong password</p>
    </div>

    {/* Old form ko iss naye form se replace karein */}
    <form onSubmit={handlePasswordUpdate} className="admin-form">
      <div className="form-group">
        <label>Current Password</label>
        <input 
          type="password" 
          placeholder="••••••••" 
          value={passForm.currentPass} 
          onChange={(e) => setPassForm({...passForm, currentPass: e.target.value})} 
          required 
        />
      </div>
      <div className="form-group">
        <label>New Password</label>
        <input 
          type="password" 
          placeholder="••••••••" 
          value={passForm.newPass} 
          onChange={(e) => setPassForm({...passForm, newPass: e.target.value})} 
          required 
        />
      </div>
      <div className="form-group">
        <label>Confirm New Password</label>
        <input 
          type="password" 
          placeholder="••••••••" 
          value={passForm.confirmPass} 
          onChange={(e) => setPassForm({...passForm, confirmPass: e.target.value})} 
          required 
        />
      </div>
      <button type="submit" className="btn-primary">Save New Password</button>
    </form>
  </div>
)}
            </section>
          </div>
        )}

        {/* Products Page */}
        {/* Products Page - Ultra Glowing Premium 2-Column Grid */}
  {currentPage === 'products' && (
  <div className="products-page-container" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
    
    {/* Inline CSS for Hyper-Glowing Animations & Hover Effects */}
    <style>{`
      @keyframes neonGlow {
        0% { border-color: rgba(56, 189, 248, 0.3); box-shadow: 0 0 20px rgba(56, 189, 248, 0.1); }
        50% { border-color: rgba(56, 189, 248, 0.7); box-shadow: 0 0 35px rgba(56, 189, 248, 0.3); }
        100% { border-color: rgba(56, 189, 248, 0.3); box-shadow: 0 0 20px rgba(56, 189, 248, 0.1); }
      }
      .glowing-card {
        background: linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(56, 189, 248, 0.25);
        border-radius: 24px;
        overflow: hidden;
        transition: all 0.4s ease;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      }
      .glowing-card:hover {
        transform: translateY(-8px);
        border-color: #38bdf8;
        box-shadow: 0 0 30px rgba(56, 189, 248, 0.3), 0 20px 40px rgba(0, 0, 0, 0.8);
      }
      .glowing-card-img {
        transition: transform 0.6s ease;
      }
      .glowing-card:hover .glowing-card-img {
        transform: scale(1.1);
      }
      .glow-btn-primary {
        background: linear-gradient(135deg, #38bdf8, #2563eb);
        transition: all 0.3s ease;
      }
      .glow-btn-primary:hover {
        box-shadow: 0 0 20px rgba(56, 189, 248, 0.6);
      }
    `}</style>

    {/* HEADER SECTION (Title & Subtitle) */}
    <div className="products-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '6px 18px', borderRadius: '30px', border: '1px solid rgba(56, 189, 248, 0.3)', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>
        Exclusive Tech Store
      </span>
      <h2 className="products-title" style={{ fontSize: '3.8rem', fontWeight: '900', background: 'linear-gradient(to right, #fff, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '1rem 0 0.5rem 0' }}>
        Featured Collection
      </h2>
      <p className="products-subtitle" style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
        Explore next-generation electronics built for performance and modern living.
      </p>

      {/* SEARCH BAR */}
      <div className="search-box-wrapper" style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '550px', display: 'flex', alignItems: 'center' }}>
          <svg 
            style={{ position: 'absolute', left: '18px', width: '22px', height: '22px', fill: '#38bdf8', pointerEvents: 'none', zIndex: 10, display: 'block' }} 
            viewBox="0 0 24 24"
          >
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>

          <input 
            type="text" 
            placeholder="Search by brand, type (e.g. iPhone, Samsung, Laptop)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            style={{ width: '100%', padding: '1.2rem 1.8rem 1.2rem 3.5rem', borderRadius: '35px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#fff', fontSize: '1.05rem', outline: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', boxSizing: 'border-box' }}
          />
        </div>
      </div>
    </div>

    {/* FILTER & SORT DROPDOWNS */}
    <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      
      {/* 1. Category Filter Dropdown */}
      <select 
  value={selectedCategory} 
  onChange={(e) => setSelectedCategory(e.target.value)}
  style={{
    padding: '0.9rem 1.6rem',
    borderRadius: '24px',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%), rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(30px) saturate(210%)',
    WebkitBackdropFilter: 'blur(30px) saturate(210%)',
    border: '1px solid rgba(56, 189, 248, 0.4)',
    borderTop: '1px solid rgba(255, 255, 255, 0.4)',
    borderLeft: '1px solid rgba(255, 255, 255, 0.4)',
    color: '#fff',
    fontSize: '0.95rem',
    fontWeight: '600',
    outline: 'none',
    cursor: 'pointer',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), inset 0 0 15px rgba(56, 189, 248, 0.15)',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    appearance: 'none',
    WebkitAppearance: 'none',
    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%2338bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>')`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 1.2rem center'
  }}
>
  <option value="All" style={{ background: '#0f172a', color: '#fff' }}>📂 All Categories</option>
  <option value="Mobiles" style={{ background: '#0f172a', color: '#fff' }}>📱 Mobiles & Tablets</option>
  <option value="Laptops" style={{ background: '#0f172a', color: '#fff' }}>💻 Laptops & Computers</option>
  <option value="Audio" style={{ background: '#0f172a', color: '#fff' }}>🎧 Headphones & Audio</option>
  <option value="Smartwatches" style={{ background: '#0f172a', color: '#fff' }}>⌚ Smartwatches</option>
  <option value="Accessories" style={{ background: '#0f172a', color: '#fff' }}>🔌 Accessories & Cables</option>
</select>

      {/* 2. Price Sort Dropdown */}
      <select 
  value={sortOrder} 
  onChange={(e) => setSortOrder(e.target.value)}
  style={{
    padding: '0.9rem 2.8rem 0.9rem 1.6rem',
    borderRadius: '24px',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%), rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(30px) saturate(210%)',
    WebkitBackdropFilter: 'blur(30px) saturate(210%)',
    border: '1px solid rgba(56, 189, 248, 0.4)',
    borderTop: '1px solid rgba(255, 255, 255, 0.4)',
    borderLeft: '1px solid rgba(255, 255, 255, 0.4)',
    color: '#fff',
    fontSize: '0.95rem',
    fontWeight: '600',
    outline: 'none',
    cursor: 'pointer',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), inset 0 0 15px rgba(56, 189, 248, 0.15)',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    appearance: 'none',
    WebkitAppearance: 'none',
    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%2338bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>')`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 1.2rem center'
  }}
>
  <option value="default" style={{ background: '#0f172a', color: '#fff' }}>⚡ Sort By Price</option>
  <option value="high-to-low" style={{ background: '#0f172a', color: '#fff' }}>📈 Price: High to Low</option>
  <option value="low-to-high" style={{ background: '#0f172a', color: '#fff' }}>📉 Price: Low to High</option>
</select>
    </div>

    {/* DYNAMIC PRODUCT GRID - 3 Columns (1 line mein 3 products) */}
    <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem' }}>
      {(products || [])
        // 1. Search Query Filter
        .filter(product => {
          if (!searchQuery.trim()) return true;
          const content = `${product.name || ''} ${product.description || ''}`.toLowerCase();
          const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/);
          return searchTerms.every(term => content.includes(term));
        })
        // 2. Category Filter
        .filter(product => {
          if (selectedCategory === 'All') return true;
          return product.category === selectedCategory;
        })
        // 3. Price Sorting
        .sort((a, b) => {
          const priceA = Number(a.discountPrice || a.regularPrice || 0);
          const priceB = Number(b.discountPrice || b.regularPrice || 0);
          if (sortOrder === 'high-to-low') return priceB - priceA;
          if (sortOrder === 'low-to-high') return priceA - priceB;
          return 0; 
        })
        .map(product => (
          <div className="glowing-card" key={product._id}>
            
            {/* Image Section */}
            <div 
              onClick={() => { setSelectedProduct(product); setCurrentPage('product-detail'); }}
              style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.02)', height: '280px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', overflow: 'hidden' }}
            >
              <img 
                className="glowing-card-img"
                src={(product.images && product.images[0]) || 'https://via.placeholder.com/300'} 
                alt={product.name} 
                style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))' }}
              />
            </div>

            {/* Clean Content Details */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <h3 
                onClick={() => { setSelectedProduct(product); setCurrentPage('product-detail'); }}
                style={{ cursor: 'pointer', fontSize: '1.4rem', color: '#f8fafc', fontWeight: '800', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {product.name}
              </h3>

              {/* Review Stars */}
{(() => {
  const productReviews = product.reviews || [];
  const totalReviews = productReviews.length;
  const avgStars = totalReviews > 0 
    ? (productReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / totalReviews).toFixed(1) 
    : (product.rating || 0).toFixed(1);
  const numericRating = Number(avgStars);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span style={{ color: '#fbbf24', fontSize: '1.1rem' }}>
        {'★'.repeat(Math.floor(numericRating))}
        {numericRating % 1 >= 0.5 ? '½' : ''}
        <span style={{color: '#64748b'}}>
          {'☆'.repeat(Math.max(0, 5 - Math.ceil(numericRating)))}
        </span>
      </span>
      <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
        ({numericRating > 0 ? numericRating : '0.0'})
      </span>
    </div>
  );
})()}

              {/* Pricing */}
              <div style={{ 
  display: 'center', 
  alignItems: 'baseline', 
  gap: '6px', 
  fontFamily: 'system-ui, sans-serif' 
}}>
  {/* PKR - Sleek & Muted White */}
  <span style={{ 
    fontSize: '0.9rem', 
    color: '#e2e8f0', // Thoda sa soft white/silver premium look ke liye
    fontWeight: '600', 
    letterSpacing: '1.5px', // Khula khula text premium lagta hai
    textTransform: 'uppercase',
    opacity: '0.9'
  }}>
    PKR
  </span>

  {/* Price - Vibrant Gradient & Glow */}
  <span style={{ 
    fontSize: '1.8rem', 
    fontWeight: '900', 
    // Ek khoobsurat light-blue se purple-blue ka gradient
    background: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    // Halka sa neon glow effect
    textShadow: '0px 4px 10px rgba(56, 189, 248, 0.3)' 
  }}>
    {product.discountPrice || product.regularPrice}
  </span>
</div>
              
              {/* Buttons */}
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                <button 
                  onClick={() => handleAddToCart(product)}
                  style={{ flex: 1, padding: '0.8rem', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }} 
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} 
                  onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                >
                  🛒 Add
                </button>
                <button 
                  onClick={() => { setSelectedProduct(product); setCurrentPage('product-detail'); }}
                  className="glow-btn-primary" 
                  style={{ flex: 1, padding: '0.8rem', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Explore →
                </button>
              </div>

              {/* Admin Controls */}
              {isAdmin && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                  <button 
                    onClick={() => handleEditClick(product)}
                    style={{ flex: 1, background: '#eab308', color: '#000', border: 'none', padding: '0.6rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product._id)}
                    style={{ flex: 1, background: '#ef4444', color: '#fff', border: 'none', padding: '0.6rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
    {/* --- ULTRA-PREMIUM ANIMATED GLASSMORPHISM 5-FEATURE SECTION --- */}
<div style={{ marginTop: '5rem', display: 'flex', flexDirection: 'column', gap: '4rem' }}>

  {/* Custom CSS for Animations & Glass Effect */}
  <style>{`
    @keyframes pulseGlowBorder {
      0%, 100% { border-color: rgba(56, 189, 248, 0.3); box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6); }
      50% { border-color: rgba(56, 189, 248, 0.6); box-shadow: 0 25px 60px rgba(56, 189, 248, 0.25); }
    }

    @keyframes beamSweep {
      0% { left: -100%; }
      100% { left: 200%; }
    }

    .glass-feature-card {
      position: relative;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%), rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(30px) saturate(210%);
      -webkit-backdrop-filter: blur(30px) saturate(210%);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-top: 1px solid rgba(255, 255, 255, 0.3);
      border-left: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 32px;
      padding: 3rem;
      overflow: hidden;
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), inset 0 0 20px rgba(255, 255, 255, 0.04);
    }

    /* Moving Light Beam Effect */
    .glass-feature-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 50%;
      height: 2px;
      background: linear-gradient(90deg, transparent, #38bdf8, #818cf8, transparent);
      transition: left 0.8s ease;
      z-index: 3;
    }

    /* Floating Background Aura Light */
    .glass-feature-card::after {
      content: '';
      position: absolute;
      width: 250px;
      height: 250px;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%);
      top: -50px;
      right: -50px;
      pointer-events: none;
      transition: all 0.5s ease;
      z-index: 0;
    }

    .glass-feature-card:hover {
      transform: translateY(-12px) scale(1.01);
      border-color: rgba(56, 189, 248, 0.5);
      box-shadow: 0 30px 70px -10px rgba(0, 0, 0, 0.8),
                  0 0 40px rgba(56, 189, 248, 0.3);
    }

    .glass-feature-card:hover::before {
      left: 200%;
    }

    .glass-feature-card:hover::after {
      transform: scale(1.5);
      opacity: 0.8;
    }

    /* Image Container Zoom Effect */
    .glass-img-container {
      position: relative;
      overflow: hidden;
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
    }

    .glass-img-container img {
      transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .glass-feature-card:hover .glass-img-container img {
      transform: scale(1.1) rotate(1deg);
    }
  `}</style>

  {/* Header Section */}
  <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '8px 20px', borderRadius: '40px', border: '1px solid rgba(56, 189, 248, 0.3)', fontSize: '0.82rem', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', boxShadow: '0 0 20px rgba(56, 189, 248, 0.15)' }}>
      ⚡ DEEP TECHNICAL DEEP-DIVE
    </span>
    <h2 style={{ fontSize: '3.2rem', color: '#fff', margin: '0 0 1.2rem 0', fontWeight: '900', lineHeight: '1.15', background: 'linear-gradient(to right, #ffffff, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
      Comprehensive Product Breakdown & Specifications
    </h2>
    <p style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '1.15rem', margin: 0, fontWeight: '400', maxWidth: '700px' }}>
      Explore the inner engineering, premium architecture, and hardware components powering our entire flagship electronic store inventory.
    </p>
  </div>

  {/* Row 1: Image Left | Text Right */}
  <div className="glass-feature-card" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '3.5rem' }}>
    <div className="glass-img-container" style={{ flex: '1 1 400px', height: '340px' }}>
      <img src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1200&auto=format&fit=crop" alt="Mobile Tech" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <div style={{ flex: '1 1 400px', zIndex: 1 }}>
      <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '6px 18px', borderRadius: '30px', border: '1px solid rgba(56, 189, 248, 0.35)', fontSize: '0.82rem', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '0.8rem', boxShadow: '0 0 15px rgba(56, 189, 248, 0.25)' }}>
        01. Mobile Technology
      </span>
      <h3 style={{ fontSize: '2.5rem', color: '#fff', margin: '0.5rem 0 1rem 0', fontWeight: '900', lineHeight: '1.2', background: 'linear-gradient(to right, #fff, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Flagship Smartphones Engineered for Speed
      </h3>
      <p style={{ color: '#cbd5e1', lineHeight: '1.85', fontSize: '1.08rem', margin: 0, fontWeight: '400' }}>
        Discover ultra-high definition OLED screens, aerospace-grade titanium framing, and multi-lens camera setups designed to capture life's purest moments. Built with industry-leading processors for seamless multitasking.
      </p>
    </div>
  </div>

  {/* Row 2: Text Left | Image Right */}
  <div className="glass-feature-card" style={{ display: 'flex', flexWrap: 'wrap-reverse', alignItems: 'center', gap: '3.5rem' }}>
    <div style={{ flex: '1 1 400px', zIndex: 1 }}>
      <span style={{ background: 'rgba(129, 140, 248, 0.15)', color: '#818cf8', padding: '6px 18px', borderRadius: '30px', border: '1px solid rgba(129, 140, 248, 0.35)', fontSize: '0.82rem', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '0.8rem', boxShadow: '0 0 15px rgba(129, 140, 248, 0.25)' }}>
        02. High Performance
      </span>
      <h3 style={{ fontSize: '2.5rem', color: '#fff', margin: '0.5rem 0 1rem 0', fontWeight: '900', lineHeight: '1.2', background: 'linear-gradient(to right, #fff, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Next-Gen Laptops for Heavy Workloads
      </h3>
      <p style={{ color: '#cbd5e1', lineHeight: '1.85', fontSize: '1.08rem', margin: 0, fontWeight: '400' }}>
        Unleash creative freedom with workstation-grade graphics processing, liquid cooling thermals, and all-day battery efficiency. Perfect for high-end gaming, 3D rendering, and software development.
      </p>
    </div>
    <div className="glass-img-container" style={{ flex: '1 1 400px', height: '340px' }}>
      <img src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1200&auto=format&fit=crop" alt="Laptops" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  </div>

  {/* Row 3: Image Left | Text Right */}
  <div className="glass-feature-card" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '3.5rem' }}>
    <div className="glass-img-container" style={{ flex: '1 1 400px', height: '340px' }}>
      <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop" alt="Headphones" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <div style={{ flex: '1 1 400px', zIndex: 1 }}>
      <span style={{ background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', padding: '6px 18px', borderRadius: '30px', border: '1px solid rgba(74, 222, 128, 0.35)', fontSize: '0.82rem', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '0.8rem', boxShadow: '0 0 15px rgba(74, 222, 128, 0.25)' }}>
        03. Studio Audio
      </span>
      <h3 style={{ fontSize: '2.5rem', color: '#fff', margin: '0.5rem 0 1rem 0', fontWeight: '900', lineHeight: '1.2', background: 'linear-gradient(to right, #fff, #4ade80)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Immersive Active Noise Cancelling Acoustic Systems
      </h3>
      <p style={{ color: '#cbd5e1', lineHeight: '1.85', fontSize: '1.08rem', margin: 0, fontWeight: '400' }}>
        Step into acoustic perfection with custom dynamic drivers, spatial 3D audio isolation, and active noise cancellation that silences background ambient noise for a pure studio listening experience.
      </p>
    </div>
  </div>

  {/* Row 4: Text Left | Image Right */}
  <div className="glass-feature-card" style={{ display: 'flex', flexWrap: 'wrap-reverse', alignItems: 'center', gap: '3.5rem' }}>
    <div style={{ flex: '1 1 400px', zIndex: 1 }}>
      <span style={{ background: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', padding: '6px 18px', borderRadius: '30px', border: '1px solid rgba(251, 146, 60, 0.35)', fontSize: '0.82rem', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '0.8rem', boxShadow: '0 0 15px rgba(251, 146, 60, 0.25)' }}>
        04. Smart Wearables
      </span>
      <h3 style={{ fontSize: '2.5rem', color: '#fff', margin: '0.5rem 0 1rem 0', fontWeight: '900', lineHeight: '1.2', background: 'linear-gradient(to right, #fff, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Advanced Fitness & Health Analytics Wearables
      </h3>
      <p style={{ color: '#cbd5e1', lineHeight: '1.85', fontSize: '1.08rem', margin: 0, fontWeight: '400' }}>
        Monitor real-time heart metrics, oxygen saturation, sleep cycles, and physical activity with surgical precision. Encased in durable sapphire glass with water resistance for all-day wear.
      </p>
    </div>
    <div className="glass-img-container" style={{ flex: '1 1 400px', height: '340px' }}>
      <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop" alt="Smartwatch" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  </div>

  {/* Row 5: Image Left | Text Right */}
  <div className="glass-feature-card" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '3.5rem' }}>
    <div className="glass-img-container" style={{ flex: '1 1 400px', height: '340px' }}>
      <img src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1200&auto=format&fit=crop" alt="Tablets" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <div style={{ flex: '1 1 400px', zIndex: 1 }}>
      <span style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', padding: '6px 18px', borderRadius: '30px', border: '1px solid rgba(236, 72, 153, 0.35)', fontSize: '0.82rem', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '0.8rem', boxShadow: '0 0 15px rgba(236, 72, 153, 0.25)' }}>
        05. Pro Digital Canvas
      </span>
      <h3 style={{ fontSize: '2.5rem', color: '#fff', margin: '0.5rem 0 1rem 0', fontWeight: '900', lineHeight: '1.2', background: 'linear-gradient(to right, #fff, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Versatile Ultra-Slim Digital Tablets
      </h3>
      <p style={{ color: '#cbd5e1', lineHeight: '1.85', fontSize: '1.08rem', margin: 0, fontWeight: '400' }}>
        Transform your workflow into a mobile digital studio with stylus-enabled pressure sensitivity, magnetic keyboard dock support, and ultra-wide camera lenses for maximum creative output.
      </p>
    </div>
  </div>

</div>
{/* --- ULTRA-PREMIUM ANIMATED GLASSMORPHISM CATEGORY SHOWCASE --- */}
<div style={{ marginTop: '6rem', display: 'flex', flexDirection: 'column', gap: '4.5rem' }}>

  {/* CSS Styles for Animated Glassmorphism & Micro-Interactions */}
  <style>{`
    @keyframes pulseAura {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.15); }
    }

    @keyframes shineRay {
      0% { left: -100%; }
      100% { left: 200%; }
    }

    /* 💎 Ultra Glassmorphic Category Card */
    .glass-category-card {
      position: relative;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%), rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(35px) saturate(220%);
      -webkit-backdrop-filter: blur(35px) saturate(220%);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-top: 1px solid rgba(255, 255, 255, 0.28);
      border-left: 1px solid rgba(255, 255, 255, 0.28);
      border-radius: 36px;
      padding: 3.5rem 3rem;
      overflow: hidden;
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.75), inset 0 0 20px rgba(255, 255, 255, 0.03);
    }

    /* Top Moving Light Ray */
    .glass-category-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 50%;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--card-glow-color, #38bdf8), transparent);
      transition: left 0.8s ease;
      z-index: 3;
    }

    .glass-category-card:hover {
      transform: translateY(-10px) scale(1.01);
      border-color: var(--card-glow-color, rgba(56, 189, 248, 0.5));
      box-shadow: 0 35px 80px -15px rgba(0, 0, 0, 0.85),
                  0 0 40px -5px var(--card-glow-shadow, rgba(56, 189, 248, 0.3));
    }

    .glass-category-card:hover::before {
      left: 200%;
    }

    /* 🌟 Inner Glass Feature Box */
    .glass-feature-pill {
      background: rgba(15, 23, 42, 0.55);
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      padding: 1.8rem;
      transition: all 0.4s ease;
      position: relative;
      z-index: 1;
    }

    .glass-feature-pill:hover {
      background: rgba(30, 41, 59, 0.75);
      border-color: var(--card-glow-color, rgba(56, 189, 248, 0.4));
      transform: translateY(-5px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
    }

    /* Floating Icon Glow */
    .icon-glass-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 70px;
      height: 70px;
      border-radius: 24px;
      font-size: 2.4rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.3);
      transition: all 0.5s ease;
    }

    .glass-category-card:hover .icon-glass-avatar {
      transform: scale(1.12) rotate(-5deg);
      box-shadow: 0 0 30px var(--card-glow-color, rgba(56, 189, 248, 0.6));
    }
  `}</style>

  {/* 👑 ULTRA-GLOW CENTER HERO HEADER */}
  <div style={{ textAlign: 'center', position: 'relative', maxWidth: '850px', margin: '0 auto' }}>
    
    {/* Background Glow Aura */}
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '350px',
      height: '150px',
      background: 'radial-gradient(ellipse, rgba(56, 189, 248, 0.3) 0%, transparent 70%)',
      filter: 'blur(50px)',
      pointerEvents: 'none',
      zIndex: 0
    }} />

    <div style={{ position: 'relative', zIndex: 1 }}>
      <span style={{ 
        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(129, 140, 248, 0.1) 100%)', 
        color: '#38bdf8', 
        padding: '8px 24px', 
        borderRadius: '99px', 
        border: '1px solid rgba(56, 189, 248, 0.4)', 
        fontSize: '0.85rem', 
        fontWeight: '800', 
        letterSpacing: '3px', 
        textTransform: 'uppercase',
        boxShadow: '0 0 25px rgba(56, 189, 248, 0.3)',
        display: 'inline-block',
        marginBottom: '1.2rem'
      }}>
        ⚡ Deep Technical Deep-Dive
      </span>

      <h2 style={{ 
        fontSize: '3.6rem', 
        fontWeight: '900', 
        color: '#fff', 
        margin: '0 0 1rem 0', 
        lineHeight: '1.15',
        letterSpacing: '-1px',
        background: 'linear-gradient(135deg, #ffffff 20%, #38bdf8 70%, #818cf8 100%)', 
        WebkitBackgroundClip: 'text', 
        WebkitTextFillColor: 'transparent',
        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))'
      }}>
        Comprehensive Product Breakdown & Specifications
      </h2>

      <p style={{ color: '#94a3b8', fontSize: '1.2rem', margin: '0 auto', lineHeight: '1.8', fontWeight: '400' }}>
        Explore the inner engineering, premium architecture, and hardware components powering our entire flagship electronic store inventory.
      </p>
    </div>
  </div>

  {/* 📱 Category 1: Mobiles & Smartphones */}
  <div className="glass-category-card" style={{ '--card-glow-color': '#38bdf8', '--card-glow-shadow': 'rgba(56, 189, 248, 0.35)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
      <div className="icon-glass-avatar" style={{ borderColor: 'rgba(56, 189, 248, 0.4)', background: 'rgba(56, 189, 248, 0.12)' }}>
        📱
      </div>
      <div>
        <h3 style={{ fontSize: '2.4rem', color: '#fff', margin: 0, fontWeight: '900', letterSpacing: '-0.5px' }}>
          Flagship Mobile & Smartphone Ecosystem
        </h3>
        <span style={{ color: '#38bdf8', fontSize: '0.98rem', fontWeight: '800', letterSpacing: '0.5px' }}>
          Ultra OLED Displays • Bionic & Snapdragon Chips • Periscope Telephoto Cameras
        </span>
      </div>
    </div>
    
    <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '2.5rem', fontWeight: '400' }}>
      Our flagship smartphone collection represents the pinnacle of modern mobile engineering. Crafted with aerospace-grade titanium chassis and ceramic-shield glass, these devices are designed to withstand drop impacts while maintaining an ultra-sleek, ergonomic profile. Powered by 3nm processor architectures, they execute billions of neural calculations per second, ensuring zero frame drops during heavy 4K video editing, real-time ray tracing gaming, and heavy background multitasking.
    </p>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.8rem' }}>
      <div className="glass-feature-pill" style={{ '--card-glow-color': '#38bdf8' }}>
        <h4 style={{ color: '#38bdf8', margin: '0 0 0.6rem 0', fontSize: '1.25rem', fontWeight: '800' }}>⚡ Pro Display Super Retina</h4>
        <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.98rem', lineHeight: '1.65' }}>
          Dynamic 120Hz ProMotion refresh rates with up to 2600 nits peak outdoor brightness. Featuring Always-On technology and ambient color sensing.
        </p>
      </div>

      <div className="glass-feature-pill" style={{ '--card-glow-color': '#38bdf8' }}>
        <h4 style={{ color: '#38bdf8', margin: '0 0 0.6rem 0', fontSize: '1.25rem', fontWeight: '800' }}>📸 Cinema-Grade Optical Optics</h4>
        <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.98rem', lineHeight: '1.65' }}>
          200MP main sensors paired with periscope telephoto lenses offering up to 100x digital zoom, 8K video recording, and nightography computational AI.
        </p>
      </div>

      <div className="glass-feature-pill" style={{ '--card-glow-color': '#38bdf8' }}>
        <h4 style={{ color: '#38bdf8', margin: '0 0 0.6rem 0', fontSize: '1.25rem', fontWeight: '800' }}>🔋 All-Day Power & Fast Charging</h4>
        <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.98rem', lineHeight: '1.65' }}>
          High-density 5000mAh silicon-carbon batteries supporting 100W GaN fast wired charging, achieving 0 to 80% charge in under 18 minutes.
        </p>
      </div>
    </div>
  </div>

  {/* 💻 Category 2: Laptops & Workstations */}
  <div className="glass-category-card" style={{ '--card-glow-color': '#818cf8', '--card-glow-shadow': 'rgba(129, 140, 248, 0.35)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
      <div className="icon-glass-avatar" style={{ borderColor: 'rgba(129, 140, 248, 0.4)', background: 'rgba(129, 140, 248, 0.12)' }}>
        💻
      </div>
      <div>
        <h3 style={{ fontSize: '2.4rem', color: '#fff', margin: 0, fontWeight: '900', letterSpacing: '-0.5px' }}>
          High-Performance Laptops & Workstations
        </h3>
        <span style={{ color: '#818cf8', fontSize: '0.98rem', fontWeight: '800', letterSpacing: '0.5px' }}>
          DDR5 RAM • PCIe Gen4 NVMe SSDs • Vapor Chamber Thermal Cooling
        </span>
      </div>
    </div>
    
    <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '2.5rem', fontWeight: '400' }}>
      Designed for software engineers, video producers, 3D animators, and hardcore gamers, our workstation laptops redefine portable computing power. Built with CNC-machined aluminum unibodies, these machines integrate vapor chamber cooling chambers with dual liquid-crystal polymer fans to keep thermal throttling at zero even under 100% CPU and GPU loads.
    </p>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.8rem' }}>
      <div className="glass-feature-pill" style={{ '--card-glow-color': '#818cf8' }}>
        <h4 style={{ color: '#818cf8', margin: '0 0 0.6rem 0', fontSize: '1.25rem', fontWeight: '800' }}>🖥️ Studio Color-Calibrated Displays</h4>
        <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.98rem', lineHeight: '1.65' }}>
          4K Mini-LED panels covering 100% DCI-P3 color gamut with Delta E &lt; 1 color accuracy, ideal for high-precision video color grading.
        </p>
      </div>

      <div className="glass-feature-pill" style={{ '--card-glow-color': '#818cf8' }}>
        <h4 style={{ color: '#818cf8', margin: '0 0 0.6rem 0', fontSize: '1.25rem', fontWeight: '800' }}>⚡ Extreme PCIe Gen4 Storage</h4>
        <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.98rem', lineHeight: '1.65' }}>
          Ultra-fast read speeds up to 7000MB/s allow instant project file loading, seamless game booting, and rapid multi-gigabyte file transfers.
        </p>
      </div>

      <div className="glass-feature-pill" style={{ '--card-glow-color': '#818cf8' }}>
        <h4 style={{ color: '#818cf8', margin: '0 0 0.6rem 0', fontSize: '1.25rem', fontWeight: '800' }}>⌨️ Tactile Mechanical Keyboards</h4>
        <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.98rem', lineHeight: '1.65' }}>
          Per-key RGB backlighting with 1.5mm key travel distance and anti-ghosting switches engineered for comfortable, high-speed typing sessions.
        </p>
      </div>
    </div>
  </div>

  {/* 🎧 Category 3: Audio & Studio Headphones */}
  <div className="glass-category-card" style={{ '--card-glow-color': '#4ade80', '--card-glow-shadow': 'rgba(74, 222, 128, 0.35)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
      <div className="icon-glass-avatar" style={{ borderColor: 'rgba(74, 222, 128, 0.4)', background: 'rgba(74, 222, 128, 0.12)' }}>
        🎧
      </div>
      <div>
        <h3 style={{ fontSize: '2.4rem', color: '#fff', margin: 0, fontWeight: '900', letterSpacing: '-0.5px' }}>
          Studio Fidelity Audio & ANC Headsets
        </h3>
        <span style={{ color: '#4ade80', fontSize: '0.98rem', fontWeight: '800', letterSpacing: '0.5px' }}>
          Active Noise Cancellation • 40mm Custom Drivers • Spatial 3D Audio
        </span>
      </div>
    </div>
    
    <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '2.5rem', fontWeight: '400' }}>
      Engineered for audiophiles and music lovers who demand pure sound transparency. Our high-resolution certified audio gear features custom beryllium-coated drivers that produce deep, tight bass, rich midranges, and crystal-clear high frequencies. Integrated dual-chip ANC processors constantly sample surrounding environmental sound 40,000 times per second to generate inverted soundwaves, effectively silencing plane engines and city noise.
    </p>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.8rem' }}>
      <div className="glass-feature-pill" style={{ '--card-glow-color': '#4ade80' }}>
        <h4 style={{ color: '#4ade80', margin: '0 0 0.6rem 0', fontSize: '1.25rem', fontWeight: '800' }}>🔊 Lossless Audio Codecs</h4>
        <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.98rem', lineHeight: '1.65' }}>
          Supports LDAC, aptX Adaptive, and AAC codecs delivering bitrates up to 990kbps for studio-master quality wireless audio playback.
        </p>
      </div>

      <div className="glass-feature-pill" style={{ '--card-glow-color': '#4ade80' }}>
        <h4 style={{ color: '#4ade80', margin: '0 0 0.6rem 0', fontSize: '1.25rem', fontWeight: '800' }}>🎙️ Beamforming Microphones</h4>
        <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.98rem', lineHeight: '1.65' }}>
          Multi-mic array isolates your voice while filtering wind and ambient noise, ensuring crystal clear voice calls in noisy outdoor environments.
        </p>
      </div>

      <div className="glass-feature-pill" style={{ '--card-glow-color': '#4ade80' }}>
        <h4 style={{ color: '#4ade80', margin: '0 0 0.6rem 0', fontSize: '1.25rem', fontWeight: '800' }}>🔋 50-Hour Playback Stamina</h4>
        <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.98rem', lineHeight: '1.65' }}>
          Ultra-efficient Bluetooth 5.3 chips provide continuous music playback for up to 50 hours on a single charge with ANC enabled.
        </p>
      </div>
    </div>
  </div>

</div>
  </div>
)}
        {/* === ULTRA PRO MAX PREMIUM PRODUCT DETAILS PAGE === */}
        {currentPage === 'product-detail' && selectedProduct && (() => {
  // Dynamic Rating Calculation
  // Database se aane wale reviews ko directly use karo
const productReviews = selectedProduct.reviews || [];
  const totalReviews = productReviews.length;
  const avgStars = totalReviews > 0 ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) : 5.0;
  const fullStars = '★'.repeat(Math.round(avgStars));
  const emptyStars = '☆'.repeat(5 - Math.round(avgStars));

  // ⚡ GET ALL RELATED PRODUCTS BY CATEGORY 
  const relatedProducts = (products || []).filter(
    p => p.category === selectedProduct.category && p._id !== selectedProduct._id
  );

  return (
    <div className="product-detail-container" style={{ padding: '2rem', maxWidth: '1350px', margin: '0 auto', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* CSS for Premium Smooth Animations, Shimmer & Soft Glows */}
      <style>{`
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatPremium {
          0% { transform: translateY(0px); filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.4)); }
          50% { transform: translateY(-12px); filter: drop-shadow(0 35px 40px rgba(56, 189, 248, 0.3)); }
          100% { transform: translateY(0px); filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.4)); }
        }
        @keyframes shimmerEffect {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        .animate-item { opacity: 0; animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }

        /* Ultra Premium Glass Card */
        .glass-card-premium {
          background: linear-gradient(145deg, rgba(15, 23, 42, 0.7) 0%, rgba(30, 41, 59, 0.4) 100%);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 32px;
          box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.8);
        }

        /* Inner Glass Panels for subtle separation */
        .glass-panel {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          transition: all 0.3s ease;
        }
        .glass-panel:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(56, 189, 248, 0.3);
        }

        .hover-lift { transition: transform 0.3s ease, background 0.3s ease; }
        .hover-lift:hover { transform: translateY(-4px); background: rgba(56, 189, 248, 0.1); }

        /* Premium Input Fields */
        .premium-input {
          width: 100%; padding: 1.2rem; border-radius: 16px;
          background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.08);
          color: #fff; font-size: 1rem; transition: all 0.3s ease; outline: none;
        }
        .premium-input:focus {
          border-color: #38bdf8; background: rgba(0,0,0,0.4);
          box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.15);
        }
      `}</style>

      {/* Top Navigation */}
      <div className="animate-item back-button-wrapper">
  <button 
    onClick={() => setCurrentPage('products')} 
    className="premium-back-btn"
  >
    <span className="back-btn-icon">←</span>
    <span className="back-btn-text">Back to Collection</span>
  </button>
</div>

      {/* MAIN HERO SECTION */}
      <div className="glass-card-premium animate-item delay-1" style={{ padding: '4rem 3rem' }}>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6rem', alignItems: 'center' }}>
          
          {/* Left Side: Product Image Showcase */}
          <div style={{ flex: '1 1 450px', position: 'relative' }}>
            
            {/* Floating Badges */}
            <div style={{ position: 'absolute', top: '0', left: '0', zIndex: 10, display: 'flex', gap: '12px' }}>
              <span style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)', padding: '6px 18px', borderRadius: '30px', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', boxShadow: '0 8px 20px rgba(239, 68, 68, 0.4)' }}>🔥 Bestseller</span>
              <span style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', padding: '6px 18px', borderRadius: '30px', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.1)' }}>✨ Limited</span>
            </div>

            {/* Glowing Orb Background for Image */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '500px', width: '100%' }}>
              <div style={{ position: 'absolute', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', filter: 'blur(40px)', zIndex: 0 }}></div>
              
              <img src={(selectedProduct.images && selectedProduct.images[0]) || 'https://via.placeholder.com/600'} alt={selectedProduct.name} style={{ width: '100%', maxWidth: '500px', maxHeight: '550px', objectFit: 'contain', animation: 'floatPremium 6s ease-in-out infinite', zIndex: 1, position: 'relative' }} />
            </div>
          </div>

          {/* Right Side: Core Details */}
          <div style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column' }}>
            
            <h1 style={{ fontSize: '3.5rem', margin: '0 0 1.2rem 0', color: '#ffffff', fontWeight: '900', lineHeight: '1.1', letterSpacing: '-1px' }}>
              {selectedProduct.name}
            </h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '8px 16px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: '#fbbf24', fontSize: '1.2rem', letterSpacing: '1px' }}>{fullStars}<span style={{color: '#475569'}}>{emptyStars}</span></span>
                <span style={{ color: '#fff', fontSize: '1rem', fontWeight: '700', marginLeft: '4px' }}>{avgStars}</span>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>({totalReviews} reviews)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ade80', fontSize: '0.9rem', fontWeight: '600' }}>
                <div style={{ width: '10px', height: '10px', background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 12px #4ade80' }}></div> Ready to Ship
              </div>
            </div>
              
            {/* Description */}
            <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem',whiteSpace: 'pre-wrap', marginBottom: '2.5rem', fontWeight: '300' }}>
              {selectedProduct.description}
            </p>

            {/* Pricing Section (Clean & Minimal) */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '3.8rem', fontWeight: '900', color: '#fff', lineHeight: '1', letterSpacing: '-1px' }}>
                <span style={{ fontSize: '2rem', color: '#38bdf8', verticalAlign: 'top', marginRight: '8px' }}>PKR</span> 
                {selectedProduct.discountPrice || selectedProduct.regularPrice}
              </span>
              {selectedProduct.discountPrice && (
                <div style={{ paddingBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.3rem', textDecoration: 'line-through', color: '#64748b', display: 'block', marginBottom: '4px' }}>PKR {selectedProduct.regularPrice}</span>
                  <span style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: '700', background: 'rgba(239, 68, 68, 0.1)', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>You Save PKR {(selectedProduct.regularPrice - selectedProduct.discountPrice).toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Stock Progress Bar */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <span>🔥 High Demand</span>
                <span style={{ color: '#ef4444' }}>Grab It Fast</span>
              </div>
              <div style={{ width: '100%', background: 'rgba(0,0,0,0.3)', height: '6px', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: '85%', background: 'linear-gradient(90deg, #ef4444, #f97316)', height: '100%', borderRadius: '10px' }}></div>
              </div>
            </div>

            {/* Quick Features Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }}>
              <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px' }}>
                <span style={{ fontSize: '1.5rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>🔋</span> <span style={{ color: '#e2e8f0', fontSize: '0.95rem', fontWeight: '600' }}>Long Lasting Battery</span>
              </div>
              <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px' }}>
                <span style={{ fontSize: '1.5rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>💦</span> <span style={{ color: '#e2e8f0', fontSize: '0.95rem', fontWeight: '600' }}>IP68 Water Resistant</span>
              </div>
              <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px' }}>
                <span style={{ fontSize: '1.5rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>⚡</span> <span style={{ color: '#e2e8f0', fontSize: '0.95rem', fontWeight: '600' }}>Ultra-Fast Charging</span>
              </div>
              <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px' }}>
                <span style={{ fontSize: '1.5rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>🛡️</span> <span style={{ color: '#e2e8f0', fontSize: '0.95rem', fontWeight: '600' }}>2 Years Care+</span>
              </div>
            </div>

            {/* Action Buttons & Trust Badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <button 
                onClick={() => {
                  handleAddToCart(selectedProduct);
                  if (!selectedCartIds.includes(selectedProduct._id)) {
                    setSelectedCartIds([...selectedCartIds, selectedProduct._id]);
                  }
                  setCurrentPage('checkout');
                }}
                style={{ width: '100%', padding: '1.4rem', background: 'linear-gradient(110deg, #2563eb, #38bdf8, #2563eb)', backgroundSize: '200% auto', color: '#fff', border: 'none', borderRadius: '16px', fontSize: '1.2rem', fontWeight: '800', cursor: 'pointer', animation: 'shimmerEffect 3s linear infinite', boxShadow: '0 15px 30px rgba(56, 189, 248, 0.3)', transition: 'transform 0.2s, box-shadow 0.2s' }} 
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(56, 189, 248, 0.5)'; }} 
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(56, 189, 248, 0.3)'; }}
              >
                🚀 Proceed to Buy Now
              </button>
              
              <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <span style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '600' }}>Guaranteed Safe & Secure Checkout</span>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '18px', marginTop: '12px', fontSize: '1.5rem', filter: 'grayscale(100%) opacity(0.5)' }}>
                  💳 🏦 💵 🛡️
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* --- DETAILED TECHNICAL SPECIFICATIONS --- */}
        <div className="animate-item delay-2" style={{ marginTop: '6rem', paddingTop: '4rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.8rem', color: '#fff', margin: '0 0 1rem 0', fontWeight: '800', letterSpacing: '-0.5px' }}>Technical Specifications</h2>
            <p style={{ color: '#94a3b8', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>Explore the cutting-edge technology and premium materials that make this product truly exceptional.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
            
            {/* Spec Table 1 */}
            <div className="glass-panel" style={{ padding: '2.5rem' }}>
              <h3 style={{ color: '#38bdf8', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.4rem' }}><span style={{ fontSize: '1.8rem' }}>⚙️</span> Core Features</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {[
                  { label: 'Brand', value: 'Electro Mark Elite' },
                  { label: 'Connectivity', value: 'Bluetooth 5.3 / Type-C' },
                  { label: 'Compatibility', value: 'iOS, Android, Windows, Mac' },
                  { label: 'Voice Assistant', value: 'Siri & Google Assistant' }
                ].map((spec, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: idx !== 3 ? '1px solid rgba(255,255,255,0.05)' : 'none', paddingBottom: idx !== 3 ? '1rem' : '0' }}>
                    <span style={{ color: '#94a3b8', fontSize: '1.05rem' }}>{spec.label}</span>
                    <strong style={{ color: '#f8fafc', fontSize: '1.05rem', fontWeight: '600' }}>{spec.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Spec Table 2 */}
            <div className="glass-panel" style={{ padding: '2.5rem' }}>
              <h3 style={{ color: '#4ade80', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.4rem' }}><span style={{ fontSize: '1.8rem' }}>📐</span> Build & Dimensions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {[
                  { label: 'Material', value: 'Aerospace-grade Aluminum' },
                  { label: 'Weight', value: 'Ultralight (215 grams)' },
                  { label: 'Dimensions', value: '150 x 85 x 45 mm' },
                  { label: 'Colors Available', value: 'Midnight Black, Frost White' }
                ].map((spec, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: idx !== 3 ? '1px solid rgba(255,255,255,0.05)' : 'none', paddingBottom: idx !== 3 ? '1rem' : '0' }}>
                    <span style={{ color: '#94a3b8', fontSize: '1.05rem' }}>{spec.label}</span>
                    <strong style={{ color: '#f8fafc', fontSize: '1.05rem', fontWeight: '600' }}>{spec.value}</strong>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* --- CUSTOMER REVIEWS & RATING BREAKDOWN --- */}
        <div className="animate-item delay-3" style={{ marginTop: '6rem', paddingTop: '4rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5rem' }}>
            
            {/* Left: Overall Rating & Progress Bars */}
            <div style={{ flex: '1 1 350px' }}>
              <h2 style={{ fontSize: '2.8rem', color: '#fff', margin: '0 0 2rem 0', fontWeight: '800', letterSpacing: '-0.5px' }}>Customer Reviews</h2>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem', background: 'rgba(0,0,0,0.15)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ fontSize: '5rem', fontWeight: '900', color: '#fff', lineHeight: '1', textShadow: '0 10px 20px rgba(0,0,0,0.5)' }}>{avgStars}</div>
                <div>
                  <div style={{ color: '#fbbf24', fontSize: '1.6rem', letterSpacing: '3px', filter: 'drop-shadow(0 2px 5px rgba(251, 191, 36, 0.3))' }}>{fullStars}<span style={{color: '#475569'}}>{emptyStars}</span></div>
                  <div style={{ color: '#94a3b8', marginTop: '8px', fontSize: '1.05rem' }}>Based on {totalReviews} global reviews</div>
                </div>
              </div>

              {/* Fake Rating Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {[5, 4, 3, 2, 1].map(star => {
                  const percentage = star === 5 ? '75%' : star === 4 ? '15%' : star === 3 ? '5%' : star === 2 ? '3%' : '2%';
                  return (
                    <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span style={{ color: '#cbd5e1', width: '50px', fontSize: '0.95rem', fontWeight: '600' }}>{star} Star</span>
                      <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', height: '10px', borderRadius: '10px', overflow: 'hidden', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)' }}>
                        <div style={{ width: percentage, background: star > 3 ? '#fbbf24' : star === 3 ? '#fb923c' : '#f87171', height: '100%', borderRadius: '10px' }}></div>
                      </div>
                      <span style={{ color: '#64748b', width: '35px', textAlign: 'right', fontSize: '0.9rem', fontWeight: '600' }}>{percentage}</span>
                    </div>
                  );
                })}
              </div>
              
              <p style={{ color: '#4ade80', fontWeight: '600', marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem', background: 'rgba(74, 222, 128, 0.05)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(74, 222, 128, 0.1)' }}>
                <span style={{ background: '#4ade80', color: '#000', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.9rem' }}>✓</span> 
                94% of buyers highly recommend this product.
              </p>
            </div>
            
            {/* Right: Add Review Form (Glassmorphism Inputs) */}
            <div style={{ flex: '1 1 400px' }}>
              <div className="glass-panel" style={{ padding: '3rem' }}>
                <h3 style={{ margin: '0 0 2rem 0', color: '#fff', fontSize: '1.6rem', fontWeight: '700' }}>Share your experience</h3>
                <form onSubmit={async (e) => {
  e.preventDefault();
  if (!reviewForm.name || !reviewForm.comment) return;
  
  const newReviewObj = {
    name: reviewForm.name,
    rating: Number(reviewForm.rating),
    comment: reviewForm.comment,
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  };

  try {
    // 1. Backend par review bhejo
    const res = await fetch(`http://127.0.0.1:5000/api/products/${selectedProduct._id}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReviewObj)
    });

    if (res.ok) {
      // 2. Database update hone ke baad fresh products fetch karo
      const updatedProducts = await fetch('http://127.0.0.1:5000/api/products').then(r => r.json());
      setProducts(updatedProducts);
      
      // 3. Current khule hue product ko bhi update karo
      const updatedSelected = updatedProducts.find(p => p._id === selectedProduct._id);
      if(updatedSelected) setSelectedProduct(updatedSelected);

      setReviewForm({ name: '', comment: '', rating: 5 });
    } else {
      alert("Failed to submit review.");
    }
  } catch (error) {
    console.error(error);
    alert("Server error, check backend!");
  }
}} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

  {/* Yahan se missing Inputs shuru hote hain */}
  <input 
    type="text" 
    placeholder="Your Name" 
    value={reviewForm.name} 
    onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})} 
    className="premium-input" 
    required 
  />
  
  <select 
    value={reviewForm.rating} 
    onChange={(e) => setReviewForm({...reviewForm, rating: e.target.value})} 
    className="premium-input"
    style={{ cursor: 'pointer' }}
  >
    <option value="5" style={{ color: '#000' }}>⭐⭐⭐⭐⭐ (5/5)</option>
    <option value="4" style={{ color: '#000' }}>⭐⭐⭐⭐ (4/5)</option>
    <option value="3" style={{ color: '#000' }}>⭐⭐⭐ (3/5)</option>
    <option value="2" style={{ color: '#000' }}>⭐⭐ (2/5)</option>
    <option value="1" style={{ color: '#000' }}>⭐ (1/5)</option>
  </select>
  
  <textarea 
    placeholder="Write your review here..." 
    rows="4" 
    value={reviewForm.comment} 
    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})} 
    className="premium-input" 
    style={{ resize: 'none' }} 
    required
  ></textarea>
  
  <button 
    type="submit" 
    className="hover-lift" 
    style={{ padding: '1.2rem', background: 'linear-gradient(135deg, #38bdf8, #2563eb)', color: '#fff', border: 'none', borderRadius: '16px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 20px rgba(56, 189, 248, 0.3)' }}
  >
    Submit Review
  </button>
</form>
              </div>
            </div>

          </div>

          {/* Comments List */}
          <div style={{ marginTop: '5rem' }}>
            <h3 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '2.5rem', fontWeight: '700' }}>Recent Comments ({totalReviews})</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2rem' }}>
              {productReviews.length === 0 ? (
                <p style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '1.2rem' }}>Be the first to share your thoughts!</p>
              ) : (
                productReviews.map((review, index) => (
                  <div key={review.id} className="animate-item glass-panel" style={{ padding: '2rem', animationDelay: `${index * 0.1}s` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.2rem' }}>
                      <div style={{ width: '55px', height: '55px', borderRadius: '50%', background: 'linear-gradient(135deg, #38bdf8, #2563eb)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '800', fontSize: '1.4rem', color: '#fff', boxShadow: '0 5px 15px rgba(56,189,248,0.3)' }}>
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong style={{ color: '#fff', fontSize: '1.15rem', display: 'block', marginBottom: '2px' }}>{review.name}</strong>
                        <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '500' }}>Verified Buyer • {review.date}</span>
                      </div>
                    </div>
                    <div style={{ color: '#fbbf24', marginBottom: '1rem', fontSize: '1.2rem', letterSpacing: '3px' }}>
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                    <p style={{ margin: 0, color: '#cbd5e1', lineHeight: '1.7', fontSize: '1.05rem' }}>"{review.comment}"</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 🔥🔥🔥 RELATED PRODUCTS SECTION (Clean 3-Column Style) 🔥🔥🔥 */}
      {relatedProducts.length > 0 && (
  <div className="animate-item delay-4 related-products-section">
    
    {/* Heading */}
    <div className="related-heading">
      <span className="related-badge">
        Similar Items
      </span>
      <h2 className="related-title">
        You Might Also Like
      </h2>
      <p className="related-subtitle">
        Explore other premium items in the {selectedProduct.category} category.
      </p>
    </div>

    {/* Related Products Grid */}
    <div className="related-grid">
      {relatedProducts.slice(0, 3).map(relProduct => (
        <div key={relProduct._id} className="related-card">
          
          {/* Image Box */}
          <div 
            className="related-image-box"
            onClick={() => { 
              setSelectedProduct(relProduct); 
              window.scrollTo({ top: 0, behavior: 'smooth' }); 
            }}
          >
            <img 
              src={(relProduct.images && relProduct.images[0]) || 'https://via.placeholder.com/300'} 
              alt={relProduct.name} 
            />
          </div>

          {/* Details Box */}
          <div className="related-details">
            <h3 
              className="related-product-name"
              onClick={() => { 
                setSelectedProduct(relProduct); 
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
              }}
            >
              {relProduct.name}
            </h3>

            <div className="related-price">
              PKR {relProduct.discountPrice || relProduct.regularPrice}
            </div>

            <div className="related-actions">
              <button 
                className="related-btn-cart"
                onClick={() => handleAddToCart(relProduct)}
              >
                🛒 Add
              </button>
              <button 
                className="related-btn-explore"
                onClick={() => { 
                  setSelectedProduct(relProduct); 
                  window.scrollTo({ top: 0, behavior: 'smooth' }); 
                }}
              >
                Explore →
              </button>
            </div>
          </div>

        </div>
      ))}
    </div>

  </div>
)}
      
    </div>
  );
})()}
        {/* === SHOPPING CART PAGE WITH SELECTABLE CHECKOUT === */}
        {currentPage === 'cart' && (() => {
          const selectedItems = cartItems.filter(item => selectedCartIds.includes(item._id));
          const totalAmount = selectedItems.reduce((sum, item) => {
            const price = item.discountPrice || item.regularPrice;
            return sum + (price * item.quantity);
          }, 0);

          return (
            <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto', color: '#fff' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1.5rem', color: '#f8fafc' }}>Your Shopping Cart</h2>
              
              {cartItems.length === 0 ? (
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '3rem', borderRadius: '20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>Your cart is empty!</p>
                  <button onClick={() => setCurrentPage('products')} style={{ marginTop: '1rem', padding: '0.8rem 1.5rem', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Explore Products
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                  
                  {/* Left: Cart Items List */}
                  <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {cartItems.map(item => {
                      const isSelected = selectedCartIds.includes(item._id);
                      return (
                        <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', background: 'rgba(30, 41, 59, 0.5)', backdropFilter: 'blur(10px)', padding: '1.2rem', borderRadius: '16px', border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)' }}>
                          
                          {/* Checkbox for Select */}
                          <input 
                            type="checkbox" 
                            checked={isSelected} 
                            onChange={() => toggleCartSelect(item._id)} 
                            style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#38bdf8' }} 
                          />

                          <img src={(item.images && item.images[0]) || 'https://via.placeholder.com/100'} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }} />

                          <div style={{ flex: 1 }}>
                            <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '1.1rem', color: '#f8fafc' }}>{item.name}</h4>
                            <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>PKR{item.discountPrice || item.regularPrice}</span>
                          </div>

                          {/* Quantity Controls */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.4rem 0.8rem', borderRadius: '10px' }}>
                            <button onClick={() => updateQuantity(item._id, -1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>-</button>
                            <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item._id, 1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>+</button>
                          </div>

                          {/* Remove Button */}
                          <button onClick={() => setCartItems(cartItems.filter(i => i._id !== item._id))} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '1.2rem', cursor: 'pointer' }}>
                            🗑️
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right: Order Summary & Checkout */}
                  <div style={{ flex: '1 1 300px', background: 'rgba(15, 23, 42, 0.7)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(56, 189, 248, 0.2)', height: 'fit-content' }}>
                    <h3 style={{ margin: '0 0 1.2rem 0', color: '#f8fafc' }}>Order Summary</h3>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', marginBottom: '0.8rem' }}>
                      <span>Selected Items:</span>
                      <strong style={{ color: '#fff' }}>{selectedItems.length}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                      <span>Total Amount:</span>
                      <strong style={{ color: '#38bdf8', fontSize: '1.5rem' }}>PKR{totalAmount.toFixed(2)}</strong>
                    </div>
<button 
  disabled={selectedItems.length === 0} 
  onClick={() => setCurrentPage('checkout')} 
  style={{ width: '100%', padding: '1.1rem', background: selectedItems.length > 0 ? 'linear-gradient(135deg, #38bdf8, #2563eb)' : '#334155', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem', cursor: selectedItems.length > 0 ? 'pointer' : 'not-allowed' }}
>
  Buy Now ({selectedItems.length})
</button>
                  </div>

                </div>
              )}
            </div>
          );
        })()}
        {/* === ULTRA PREMIUM TERMS & CONDITIONS PAGE === */}
{currentPage === 'terms' && (
  <div style={{ padding: '3rem 1.5rem', maxWidth: '1000px', margin: '0 auto', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
    
    {/* Page Title & Header */}
    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
      <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '6px 18px', borderRadius: '30px', border: '1px solid rgba(56, 189, 248, 0.3)', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>
        Legal Documentation
      </span>
      <h1 style={{ fontSize: '3.5rem', fontWeight: '900', margin: '1rem 0 0.5rem 0', background: 'linear-gradient(to right, #fff, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Terms & Conditions
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Last Updated: September 2026</p>
    </div>

    {/* Glassmorphism Main Content Container */}
    <div style={{
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(24px)',
      border: '1px solid rgba(56, 189, 248, 0.25)',
      borderRadius: '28px',
      padding: '3rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
      display: 'flex',
      flexDirection: 'column',
      gap: '2.5rem'
    }}>
      
      {/* 1. Introduction */}
      <div>
        <h2 style={{ fontSize: '1.6rem', color: '#38bdf8', marginBottom: '0.8rem', fontWeight: '800' }}>1. Introduction & Agreement</h2>
        <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.05rem', margin: 0 }}>
          Welcome to Electro Mark. By accessing or using our website and purchasing products from our catalog, you agree to be bound by these Terms and Conditions. Please read them carefully before placing any order. If you do not agree with any part of these terms, you should refrain from using our services.
        </p>
      </div>

      {/* 2. Product Authenticity & Pricing */}
      <div>
        <h2 style={{ fontSize: '1.6rem', color: '#38bdf8', marginBottom: '0.8rem', fontWeight: '800' }}>2. Product Authenticity & Pricing</h2>
        <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.05rem', margin: 0 }}>
          All electronics, devices, and accessories offered on Electro Mark are guaranteed to be 100% genuine and sourced directly from official brand suppliers. Prices listed on the platform are final in PKR (Pakistani Rupee). We reserve the right to modify prices, launch temporary promotions, or correct typographical errors at any time without prior notice.
        </p>
      </div>

      {/* 3. Orders & Cash on Delivery (COD) */}
      <div>
        <h2 style={{ fontSize: '1.6rem', color: '#38bdf8', marginBottom: '0.8rem', fontWeight: '800' }}>3. Order Processing & Payments</h2>
        <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.05rem', margin: 0 }}>
          Orders placed using Cash on Delivery (COD) are subject to verification via phone call or SMS. Customers are required to provide complete, accurate delivery addresses and contact information. Payment must be handed over in full to the authorized courier agent upon delivery.
        </p>
      </div>

      {/* 4. Shipping & Delivery Terms */}
      <div>
        <h2 style={{ fontSize: '1.6rem', color: '#38bdf8', marginBottom: '0.8rem', fontWeight: '800' }}>4. Shipping & Delivery Policy</h2>
        <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.05rem', margin: 0 }}>
          Standard nationwide delivery takes approximately 2 to 4 business days. While we make every effort to deliver within estimated timeframes, Electro Mark is not liable for minor delays caused by extreme weather, courier disruptions, or unforeseen logistics delays.
        </p>
      </div>

      {/* 5. Returns, Replacements & Warranty */}
      <div>
        <h2 style={{ fontSize: '1.6rem', color: '#38bdf8', marginBottom: '0.8rem', fontWeight: '800' }}>5. Return, Replacement & Warranty Claims</h2>
        <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.05rem', margin: 0 }}>
          We provide a 7-day initial checking window for manufacturing defects. Returned products must be in their original factory-sealed condition with all included box accessories intact. Official brand warranties must be claimed directly through authorized brand service centers using the provided warranty card.
        </p>
      </div>

      {/* 6. Contact Information */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '2rem' }}>
        <h2 style={{ fontSize: '1.6rem', color: '#4ade80', marginBottom: '0.8rem', fontWeight: '800' }}>6. Questions & Legal Inquiries</h2>
        <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.05rem', margin: '0 0 1.5rem 0' }}>
          If you have any questions regarding these terms, please get in touch with our legal support desk:
        </p>
        <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '1.2rem 1.8rem', borderRadius: '16px', display: 'inline-block', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ margin: '0 0 0.4rem 0', color: '#38bdf8', fontWeight: 'bold' }}>📧 Email: support@electromark.com</p>
          <p style={{ margin: 0, color: '#94a3b8' }}>📍 Head Office: Electro Mark Tech Tower, Pakistan</p>
        </div>
      </div>

      {/* Back to Home Button */}
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button 
          onClick={() => {
            setCurrentPage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{
            padding: '1.1rem 2.5rem',
            background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
            color: '#fff',
            border: 'none',
            borderRadius: '16px',
            fontSize: '1.05rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 0 25px rgba(56, 189, 248, 0.4)'
          }}
        >
          ← Back to Main Store
        </button>
      </div>

    </div>
  </div>
)}
{/* === ULTRA PREMIUM PRIVACY POLICY PAGE === */}
{currentPage === 'privacy' && (
  <div style={{ padding: '3rem 1.5rem', maxWidth: '1000px', margin: '0 auto', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
    
    {/* Page Title & Header */}
    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
      <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '6px 18px', borderRadius: '30px', border: '1px solid rgba(56, 189, 248, 0.3)', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>
        Data Protection & Safety
      </span>
      <h1 style={{ fontSize: '3.5rem', fontWeight: '900', margin: '1rem 0 0.5rem 0', background: 'linear-gradient(to right, #fff, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Privacy Policy
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Last Updated: September 2026</p>
    </div>

    {/* Glassmorphic Main Container */}
    <div style={{
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(24px)',
      border: '1px solid rgba(56, 189, 248, 0.25)',
      borderRadius: '28px',
      padding: '3rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
      display: 'flex',
      flexDirection: 'column',
      gap: '2.5rem'
    }}>
      
      {/* 1. Overview */}
      <div>
        <h2 style={{ fontSize: '1.6rem', color: '#38bdf8', marginBottom: '0.8rem', fontWeight: '800' }}>1. Overview & Commitment</h2>
        <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.05rem', margin: 0 }}>
          At Electro Mark, we respect your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information when you browse our platform, place orders, or subscribe to our updates.
        </p>
      </div>

      {/* 2. Information We Collect */}
      <div>
        <h2 style={{ fontSize: '1.6rem', color: '#38bdf8', marginBottom: '0.8rem', fontWeight: '800' }}>2. Information We Collect</h2>
        <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.05rem', margin: '0 0 1rem 0' }}>
          When you place an order or interact with our store, we may collect the following personal information:
        </p>
        <ul style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.05rem', paddingLeft: '1.5rem', margin: 0 }}>
          <li><strong style={{ color: '#fff' }}>Contact Information:</strong> Full Name, Email Address, and Phone Number.</li>
          <li><strong style={{ color: '#fff' }}>Delivery Details:</strong> Shipping address, House number, City, and Postal details.</li>
          <li><strong style={{ color: '#fff' }}>Technical Data:</strong> IP address, browser type, and device details for site performance optimization.</li>
        </ul>
      </div>

      {/* 3. How We Use Your Data */}
      <div>
        <h2 style={{ fontSize: '1.6rem', color: '#38bdf8', marginBottom: '0.8rem', fontWeight: '800' }}>3. How We Use Your Information</h2>
        <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.05rem', margin: '0 0 1rem 0' }}>
          Your data is strictly utilized for the following operational purposes:
        </p>
        <ul style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.05rem', paddingLeft: '1.5rem', margin: 0 }}>
          <li>Processing, dispatching, and fulfilling your orders via courier partners.</li>
          <li>Sending order confirmation calls, delivery updates, and customer support assistance.</li>
          <li>Improving store navigation, user experience, and technical security.</li>
        </ul>
      </div>

      {/* 4. Data Sharing & Security */}
      <div>
        <h2 style={{ fontSize: '1.6rem', color: '#38bdf8', marginBottom: '0.8rem', fontWeight: '800' }}>4. Data Protection & Third Parties</h2>
        <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.05rem', margin: 0 }}>
          We <strong style={{ color: '#4ade80' }}>never sell or rent</strong> your personal information to third-party advertisers. Your information is shared only with verified logistics partners (courier companies) solely for order delivery. All submissions are protected using 256-bit SSL encryption.
        </p>
      </div>

      {/* 5. Cookies & Tracking */}
      <div>
        <h2 style={{ fontSize: '1.6rem', color: '#38bdf8', marginBottom: '0.8rem', fontWeight: '800' }}>5. Cookies Policy</h2>
        <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.05rem', margin: 0 }}>
          Electro Mark uses essential session cookies to keep track of items in your shopping cart and remember your session preferences. You can disable cookies in your browser settings at any time, though some features of the site may function with reduced performance.
        </p>
      </div>

      {/* 6. Contact & Data Control */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '2rem' }}>
        <h2 style={{ fontSize: '1.6rem', color: '#4ade80', marginBottom: '0.8rem', fontWeight: '800' }}>6. Contact Our Privacy Officer</h2>
        <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.05rem', margin: '0 0 1.5rem 0' }}>
          If you wish to update, modify, or request deletion of your personal data from our systems, please reach out to us:
        </p>
        <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '1.2rem 1.8rem', borderRadius: '16px', display: 'inline-block', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ margin: '0 0 0.4rem 0', color: '#38bdf8', fontWeight: 'bold' }}>📧 Privacy Support: privacy@electromark.com</p>
          <p style={{ margin: 0, color: '#94a3b8' }}>🔒 Data Protection Officer, Electro Mark Tower</p>
        </div>
      </div>

      {/* Back to Main Store Button */}
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button 
          onClick={() => {
            setCurrentPage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{
            padding: '1.1rem 2.5rem',
            background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
            color: '#fff',
            border: 'none',
            borderRadius: '16px',
            fontSize: '1.05rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 0 25px rgba(56, 189, 248, 0.4)'
          }}
        >
          ← Back to Main Store
        </button>
      </div>

    </div>
  </div>
)}
{/* === ULTRA PREMIUM ABOUT US PAGE === */}
{currentPage === 'about' && (
  <div style={{ padding: '3rem 1.5rem', maxWidth: '1000px', margin: '0 auto', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
    
    {/* Page Header */}
    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
      <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '6px 18px', borderRadius: '30px', border: '1px solid rgba(56, 189, 248, 0.3)', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>
        Who We Are
      </span>
      <h1 style={{ fontSize: '3.5rem', fontWeight: '900', margin: '1rem 0 0.5rem 0', background: 'linear-gradient(to right, #fff, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        About Electro Mark
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '650px', margin: '0 auto' }}>
        Empowering tech enthusiasts with authentic devices, flagship performance, and uncompromised quality.
      </p>
    </div>

    {/* Glassmorphic Container */}
    <div style={{
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(24px)',
      border: '1px solid rgba(56, 189, 248, 0.25)',
      borderRadius: '28px',
      padding: '3rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
      display: 'flex',
      flexDirection: 'column',
      gap: '3rem'
    }}>
      
      {/* 1. Our Story */}
      <div>
        <h2 style={{ fontSize: '1.8rem', color: '#38bdf8', marginBottom: '1rem', fontWeight: '800' }}>🚀 Our Story</h2>
        <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.05rem', margin: 0 }}>
          Electro Mark was founded with a clear vision: to revolutionize the online electronics shopping experience by delivering 100% original, factory-sealed devices directly to your doorstep. We bridge the gap between cutting-edge technology and everyday users, providing seamless access to top-tier smartphones, powerful workstations, studio-quality audio equipment, and smart wearables.
        </p>
      </div>

      {/* 2. Core Mission & Vision */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>🎯</div>
          <h3 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>Our Mission</h3>
          <p style={{ color: '#cbd5e1', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}>
            To build the most trusted tech marketplace by guaranteeing absolute product authenticity, transparent pricing, and nationwide Cash on Delivery service.
          </p>
        </div>

        <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>🌟</div>
          <h3 style={{ color: '#38bdf8', fontSize: '1.3rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>Our Vision</h3>
          <p style={{ color: '#cbd5e1', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}>
            To empower millions of users across Pakistan with next-generation electronics, backed by official brand warranties and round-the-clock priority customer support.
          </p>
        </div>
      </div>

      {/* 3. Why Choose Us (Stats Grid) */}
      <div>
        <h2 style={{ fontSize: '1.8rem', color: '#38bdf8', marginBottom: '1.5rem', fontWeight: '800' }}>⚡ Why Electro Mark Stands Out</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <h4 style={{ color: '#4ade80', fontSize: '2rem', margin: '0 0 0.3rem 0', fontWeight: '900' }}>100%</h4>
            <p style={{ color: '#cbd5e1', margin: 0, fontSize: '0.9rem' }}>Genuine Sealed Products</p>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <h4 style={{ color: '#38bdf8', fontSize: '2rem', margin: '0 0 0.3rem 0', fontWeight: '900' }}>50k+</h4>
            <p style={{ color: '#cbd5e1', margin: 0, fontSize: '0.9rem' }}>Satisfied Tech Buyers</p>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <h4 style={{ color: '#818cf8', fontSize: '2rem', margin: '0 0 0.3rem 0', fontWeight: '900' }}>24/7</h4>
            <p style={{ color: '#cbd5e1', margin: 0, fontSize: '0.9rem' }}>Dedicated Support Desk</p>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <h4 style={{ color: '#fb923c', fontSize: '2rem', margin: '0 0 0.3rem 0', fontWeight: '900' }}>2-4 Days</h4>
            <p style={{ color: '#cbd5e1', margin: 0, fontSize: '0.9rem' }}>Express Nationwide Shipping</p>
          </div>

        </div>
      </div>

      {/* 4. Get In Touch */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
        <div>
          <h3 style={{ color: '#fff', fontSize: '1.3rem', margin: '0 0 0.4rem 0', fontWeight: '800' }}>Have Any Questions?</h3>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.95rem' }}>Our team is always here to assist you with technical queries or order guidance.</p>
        </div>
        <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '0.8rem 1.5rem', borderRadius: '14px', color: '#38bdf8', fontWeight: 'bold' }}>
          📧 support@electromark.com
        </div>
      </div>

      {/* Back to Home Button */}
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button 
          onClick={() => {
            setCurrentPage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{
            padding: '1.1rem 2.5rem',
            background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
            color: '#fff',
            border: 'none',
            borderRadius: '16px',
            fontSize: '1.05rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 0 25px rgba(56, 189, 248, 0.4)'
          }}
        >
          ← Back to Main Store
        </button>
      </div>

    </div>
  </div>
)}
        {/* === ULTRA PRO MAX LUXURY 2-COLUMN CHECKOUT PAGE === */}
        {currentPage === 'checkout' && (() => {
          const selectedItems = cartItems.filter(item => selectedCartIds.includes(item._id));
          const itemsToBuy = selectedItems.length > 0 ? selectedItems : cartItems;
          const totalAmount = itemsToBuy.reduce((sum, item) => {
            const price = item.discountPrice || item.regularPrice;
            return sum + (price * item.quantity);
          }, 0);

          const orderDetailsText = itemsToBuy.map(i => `${i.name} (Qty: ${i.quantity}) - PKR ${((i.discountPrice || i.regularPrice) * i.quantity).toFixed(2)}`).join('\n');

          return (
            <div className="checkout-page-container" style={{ padding: '2rem 1rem', maxWidth: '1280px', margin: '0 auto', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              
              {/* Custom CSS For Animations & Hyper Glows */}
              <style>{`
                @keyframes glowPulse {
                  0% { box-shadow: 0 0 15px rgba(56, 189, 248, 0.2); }
                  50% { box-shadow: 0 0 30px rgba(56, 189, 248, 0.5); }
                  100% { box-shadow: 0 0 15px rgba(56, 189, 248, 0.2); }
                }
                .form-input-field {
                  width: 100%;
                  padding: 1.1rem 1.2rem;
                  border-radius: 14px;
                  background: rgba(15, 23, 42, 0.6);
                  border: 1px solid rgba(255, 255, 255, 0.1);
                  color: #fff;
                  font-size: 1rem;
                  outline: none;
                  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .form-input-field:focus {
                  border-color: #38bdf8;
                  background: rgba(30, 41, 59, 0.8);
                  box-shadow: 0 0 20px rgba(56, 189, 248, 0.25);
                }
                .order-item-thumb {
                  transition: transform 0.3s ease;
                }
                .order-item-row:hover .order-item-thumb {
                  transform: scale(1.08);
                }
              `}</style>

              {/* Top Breadcrumb & Header */}
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '6px 18px', borderRadius: '30px', border: '1px solid rgba(56, 189, 248, 0.3)', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>
                  🔒 Fast & Secure Checkout
                </span>
                <h2 style={{ fontSize: '3.2rem', fontWeight: '900', margin: '1rem 0 0.5rem 0', background: 'linear-gradient(to right, #fff, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Finalize Your Order
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Complete your details to receive your package at your doorstep.</p>
              </div>

              {/* Main 2-Column Responsive Layout */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'flex-start' }}>
                
                {/* LEFT COLUMN: Shipping & Customer Info Form */}
                <div style={{ flex: '1 1 580px', background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '28px', padding: '2.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}>
                  
                  <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '1.8rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ background: '#38bdf8', color: '#0f172a', width: '32px', height: '32px', borderRadius: '50%', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontSize: '1rem', fontWeight: 'bold' }}>1</span>
                    Shipping Information
                  </h3>

                  {/* Formspree Form Integration */}
                  {/* Formspree Background AJAX Submission */}
                  <form 
                  onSubmit={async (e) => {
  e.preventDefault();
  if (!reviewForm.name || !reviewForm.comment) return;
  
  const newReviewObj = {
    name: reviewForm.name,
    rating: Number(reviewForm.rating),
    comment: reviewForm.comment,
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  };

  try {
    // 1. Backend par review bhejo
    const res = await fetch(`http://127.0.0.1:5000/api/products/${selectedProduct._id}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReviewObj)
    });

    if (res.ok) {
      // 2. Database update hone ke baad fresh products fetch karo
      const updatedProducts = await fetch('http://127.0.0.1:5000/api/products').then(r => r.json());
      setProducts(updatedProducts);
      
      // 3. Current khule hue product ko bhi update karo taake naya review fauran screen par nazar aaye
      const updatedSelected = updatedProducts.find(p => p._id === selectedProduct._id);
      if(updatedSelected) setSelectedProduct(updatedSelected);

      setReviewForm({ name: '', comment: '', rating: 5 });
    } else {
      alert("Failed to submit review.");
    }
  } catch (error) {
    console.error(error);
    alert("Server error, check backend!");
  }
}}
                  >
                    <input type="hidden" name="_next" value="https://yourwebsite.com/#thank-you" />

                    {/* Hidden Formspree Payload Fields */}
                    <input type="hidden" name="Order_Summary" value={orderDetailsText || "No items specified"} />
                    <input type="hidden" name="Total_Amount" value={`PKR ${totalAmount.toFixed(2)}`} />
                    <input type="hidden" name="Payment_Method" value="Cash on Delivery (COD)" />

                    {/* First Name & Last Name */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.6rem', color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 'bold' }}>First Name *</label>
                        <input type="text" name="First_Name" required placeholder="Paras" className="form-input-field" />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.6rem', color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 'bold' }}>Last Name *</label>
                        <input type="text" name="Last_Name" required placeholder="Bruce" className="form-input-field" />
                      </div>
                    </div>

                    {/* Phone Number & Email */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.6rem', color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 'bold' }}>Phone Number *</label>
                        <input type="tel" name="Phone_Number" required placeholder="+92 300 1234567" className="form-input-field" />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.6rem', color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 'bold' }}>Email Address *</label>
                        <input type="email" name="Email_Address" required placeholder="book.apexcode@gmail.com" className="form-input-field" />
                      </div>
                    </div>

                    {/* Complete Address */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.6rem', color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 'bold' }}>House Address / Delivery Destination *</label>
                      <textarea name="House_Address" rows="3" required placeholder="House No, Street, Landmark, City..." className="form-input-field" style={{ resize: 'none' }}></textarea>
                    </div>

                    {/* Payment Method Badge */}
                    <div style={{ marginTop: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.2rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ background: '#38bdf8', color: '#0f172a', width: '32px', height: '32px', borderRadius: '50%', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontSize: '1rem', fontWeight: 'bold' }}>2</span>
                        Payment Method
                      </h3>

                      <div style={{ background: 'linear-gradient(145deg, rgba(56, 189, 248, 0.1) 0%, rgba(15, 23, 42, 0.4) 100%)', border: '1.5px solid #38bdf8', borderRadius: '18px', padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1.2rem', boxShadow: '0 10px 25px -5px rgba(56, 189, 248, 0.15)' }}>
                        <input type="radio" checked readOnly style={{ accentColor: '#38bdf8', width: '22px', height: '22px', cursor: 'pointer' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ fontSize: '1.1rem', color: '#fff' }}>💵 Cash on Delivery (COD)</strong>
                            <span style={{ background: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>Verified Method</span>
                          </div>
                          <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>Pay with cash when your parcel is delivered to your door.</p>
                        </div>
                      </div>
                    </div>

                    {/* Big Action Submit Button */}
                    <button 
                      type="submit" 
                      style={{ marginTop: '1.5rem', padding: '1.3rem', background: 'linear-gradient(135deg, #38bdf8, #2563eb)', color: '#fff', border: 'none', borderRadius: '18px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s', animation: 'glowPulse 3s infinite' }}
                    >
                      Complete Order (PKR {totalAmount.toFixed(2)}) 🚀
                    </button>

                  </form>
                </div>

                {/* RIGHT COLUMN: Order Summary Card (Selected Items & Showcase) */}
                <div style={{ flex: '1 1 380px', position: 'sticky', top: '2rem', background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '28px', padding: '2.5rem', boxShadow: '0 25px 50px -10px rgba(0, 0, 0, 0.8)' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: '#f8fafc' }}>Order Items</h3>
                    <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                      {itemsToBuy.length} Item(s)
                    </span>
                  </div>

                  {/* Items Showcase List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxHeight: '380px', overflowY: 'auto', paddingRight: '5px', marginBottom: '1.8rem' }}>
                    {itemsToBuy.length === 0 ? (
                      <p style={{ color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' }}>No products selected.</p>
                    ) : (
                      itemsToBuy.map(item => (
                        <div key={item._id} className="order-item-row" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          
                          {/* Item Thumbnail */}
                          <div style={{ width: '75px', height: '75px', borderRadius: '14px', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(15, 23, 42, 0.4) 70%)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '8px', overflow: 'hidden', flexShrink: 0 }}>
                            <img className="order-item-thumb" src={(item.images && item.images[0]) || 'https://via.placeholder.com/80'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          </div>

                          {/* Item Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4 style={{ margin: '0 0 0.3rem 0', fontSize: '1.05rem', color: '#f8fafc', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.name}
                            </h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Qty: <strong style={{ color: '#fff' }}>{item.quantity}</strong></span>
                              <strong style={{ color: '#38bdf8', fontSize: '1.05rem' }}>PKR {((item.discountPrice || item.regularPrice) * item.quantity).toFixed(2)}</strong>
                            </div>
                          </div>

                        </div>
                      ))
                    )}
                  </div>

                  {/* Calculations breakdown */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.95rem' }}>
                      <span>Subtotal</span>
                      <strong style={{ color: '#fff' }}>PKR {totalAmount.toFixed(2)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.95rem' }}>
                      <span>Express Shipping</span>
                      <strong style={{ color: '#4ade80' }}>FREE</strong>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px dashed rgba(255,255,255,0.15)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>Total Amount</span>
                      <span style={{ fontSize: '2.2rem', fontWeight: '900', color: '#38bdf8', textShadow: '0 0 15px rgba(56, 189, 248, 0.4)' }}>
                        PKR {totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Trust Badges Footer */}
                  <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px' }}>🛡️ 256-Bit SSL Encrypted & Formspree Secured</div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', fontSize: '1.3rem', opacity: 0.7 }}>
                      📦 ⚡ 🛡️ 🤝
                    </div>
                  </div>

                </div>

              </div>

            </div>
          );
        })()}
        {/* === ULTRA PREMIUM THANK YOU PAGE === */}
        {currentPage === 'thank-you' && (
          <div className="thank-you-container" style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center', color: '#fff' }}>
            
            {/* Smooth Animations */}
            <style>{`
              @keyframes popIn {
                0% { transform: scale(0.6); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
              }
              @keyframes pulseRing {
                0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4); }
                70% { box-shadow: 0 0 0 25px rgba(74, 222, 128, 0); }
                100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
              }
            `}</style>

            <div style={{ background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(24px)', border: '1px solid rgba(74, 222, 128, 0.3)', borderRadius: '32px', padding: '4rem 2.5rem', boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.8)', animation: 'popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
              
              {/* Success Animated Circle Icon */}
              <div style={{ width: '90px', height: '90px', background: 'rgba(74, 222, 128, 0.15)', border: '2px solid #4ade80', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 2rem auto', animation: 'pulseRing 2s infinite' }}>
                <span style={{ fontSize: '3rem', color: '#4ade80' }}>✓</span>
              </div>

              {/* Title & Subtitle */}
              <span style={{ background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', padding: '6px 20px', borderRadius: '30px', border: '1px solid rgba(74, 222, 128, 0.3)', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Order Confirmed
              </span>

              <h2 style={{ fontSize: '3.5rem', fontWeight: '900', margin: '1.5rem 0 1rem 0', background: 'linear-gradient(to right, #fff, #4ade80, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: '1.2' }}>
                Thank You For Your Order!
              </h2>

              <p style={{ color: '#cbd5e1', fontSize: '1.2rem', lineHeight: '1.8', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
                We have received your request. Our delivery team will prepare your items and contact you shortly before shipping.
              </p>

              {/* Order Delivery Status Bar */}
              <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: '1.5rem', marginBottom: '3rem', textAlign: 'left' }}>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block' }}>Payment Method</span>
                  <strong style={{ color: '#fff', fontSize: '1.05rem' }}>💵 Cash on Delivery</strong>
                </div>
                <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '1.5rem' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block' }}>Estimated Delivery</span>
                  <strong style={{ color: '#38bdf8', fontSize: '1.05rem' }}>🚚 2 - 4 Business Days</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => {
                    setCartItems([]);
                    setSelectedCartIds([]);
                    setCurrentPage('products');
                  }}
                  style={{ padding: '1.2rem 2.5rem', background: 'linear-gradient(135deg, #38bdf8, #2563eb)', color: '#fff', border: 'none', borderRadius: '18px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 25px rgba(56, 189, 248, 0.4)' }}
                >
                  Continue Shopping 🛍️
                </button>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      {/* Ultra Premium Split Footer (Extreme Left & Extreme Right) */}
<footer className="footer" style={{ background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)', borderTop: '1px solid rgba(56, 189, 248, 0.2)', padding: '4rem 2rem 2rem 2rem', color: '#fff' }}>
  <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
    
    {/* ============ TOP SECTION: Brand + Links ============ */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '3rem', marginBottom: '3.5rem' }}>
      
      {/* 1. LEFT: Brand & Detail */}
      <div style={{ textAlign: 'left', maxWidth: '420px' }}>
        <h2 style={{ fontSize: '2.4rem', fontWeight: '900', margin: '0 0 1rem 0', color: '#fff', textAlign: 'left' }}>
          Electro Mark<span style={{ color: '#38bdf8' }}>.</span>
        </h2>
        <p style={{ color: '#94a3b8', lineHeight: '1.8', fontSize: '1rem', margin: 0, textAlign: 'left' }}>
          Your ultimate destination for top-quality electronics, modern gadgets, and seamless tech shopping experiences. We bring next-gen technology straight to your doorstep.
        </p>
      </div>

      {/* 2. RIGHT: Navigation & Legal Links */}
      <div style={{ display: 'flex', gap: '4rem', textWrap: 'nowrap' }}>
        
        {/* Nav Links Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#38bdf8', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 0.5rem 0' }}>
            Navigation
          </h3>
          <a href="#home" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }} style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e)=>e.target.style.color='#38bdf8'} onMouseOut={(e)=>e.target.style.color='#cbd5e1'}>Home</a>
          <a href="#products" onClick={(e) => { e.preventDefault(); setCurrentPage('products'); }} style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e)=>e.target.style.color='#38bdf8'} onMouseOut={(e)=>e.target.style.color='#cbd5e1'}>Products</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); alert('Contact: support@electromark.com'); }} style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e)=>e.target.style.color='#38bdf8'} onMouseOut={(e)=>e.target.style.color='#cbd5e1'}>Contact Us</a>
        </div>

        {/* Legal Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#38bdf8', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 0.5rem 0' }}>
            Legal
          </h3>
          <a href="#terms" onClick={(e) => { e.preventDefault(); setCurrentPage('terms'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e)=>e.target.style.color='#38bdf8'} onMouseOut={(e)=>e.target.style.color='#cbd5e1'}>
            Terms & Conditions
          </a>
          <a href="#privacy" onClick={(e) => { e.preventDefault(); setCurrentPage('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e)=>e.target.style.color='#38bdf8'} onMouseOut={(e)=>e.target.style.color='#cbd5e1'}>
            Privacy Policy
          </a>
          <a href="#about" onClick={(e) => { e.preventDefault(); setCurrentPage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e)=>e.target.style.color='#38bdf8'} onMouseOut={(e)=>e.target.style.color='#cbd5e1'}>
            About Us
          </a>
        </div>

      </div>

    </div>

    {/* ============ MIDDLE SECTION: Social Icons + Admin Button ============ */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', marginBottom: '2.5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
      
      {/* LEFT: Social Media Icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: '600' }}>Follow Us:</span>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a href="#" className="btn-social-icon" aria-label="Facebook">
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}>
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7.5v-3H10V9.69c0-2.47 1.47-3.84 3.73-3.84 1.08 0 2.22.19 2.22.19v2.44h-1.25c-1.23 0-1.61.76-1.61 1.54V12h2.74l-.44 3h-2.3v6.8c4.56-.93 8-4.96 8-9.8z"/>
            </svg>
          </a>
          <a href="#" className="btn-social-icon" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}>
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a href="#" className="btn-social-icon" aria-label="Twitter">
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* RIGHT: Admin Button */}
      <div>
        <button 
          onClick={() => setCurrentPage('login')} 
          style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.4)', padding: '0.7rem 1.8rem', borderRadius: '30px', color: '#38bdf8', fontSize: '0.95rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', backdropFilter: 'blur(10px)', transition: 'all 0.3s' }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.25)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(56, 189, 248, 0.4)'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <svg style={{ width: '18px', height: '18px', fill: 'currentColor' }} viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
          Admin Portal Access
        </button>
      </div>

    </div>

    {/* ============ BOTTOM SECTION: Copyright LEFT + Apex Code RIGHT ============ */}
    <div className="footer-bottom-wrapper">
      
      {/* LEFT SIDE: Copyright Line */}
      <div className="footer-copyright-line">
        <p className="footer-copyright-text">
          © {new Date().getFullYear()}{' '}
          <span className="footer-brand-highlight">Electro Mark</span>
          . All rights reserved. Designed for Excellence.
        </p>
      </div>

      {/* RIGHT SIDE: Ultra Premium Apex Code Section */}
      <div className="apex-right-container">
        
        {/* Purple Glowing Animated Avatar Logo */}
        <div className="apex-purple-glow-avatar">
          <div className="apex-purple-border-ring"></div>
          <div className="apex-purple-border-ring-2"></div>
          <div className="apex-purple-avatar-inner">
            <img 
              src="apex.jpeg"
              alt="Apex Code Logo" 
              className="apex-purple-avatar-img"
            />
          </div>
          <div className="apex-avatar-glow"></div>
        </div>

        {/* Brand Details & Links */}
        <div className="apex-clean-info">
          <div className="apex-clean-header">
            <span className="apex-sub-text">
              <span className="apex-sub-line"></span>
              DEVELOPED BY
              <span className="apex-sub-line"></span>
            </span>
            <h3 className="apex-main-brand">
              <span className="apex-brand-letter">A</span>
              <span className="apex-brand-letter">P</span>
              <span className="apex-brand-letter">E</span>
              <span className="apex-brand-letter">X</span>
              <span className="apex-brand-space"></span>
              <span className="apex-brand-letter">C</span>
              <span className="apex-brand-letter">O</span>
              <span className="apex-brand-letter">D</span>
              <span className="apex-brand-letter">E</span>
              <span className="apex-purple-dot">.</span>
            </h3>
          </div>

          <div className="apex-clean-links">
            {/* Website Link */}
            <a 
              href="https://www.bookapexcode.store" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="apex-glow-link"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="apex-link-icon">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              <span>www.bookapexcode.store</span>
            </a>

            <span className="apex-dot-divider">•</span>

            {/* Email Link */}
            <a href="mailto:book.apexcode@gmail.com" className="apex-glow-link">
              <svg viewBox="0 0 24 24" fill="currentColor" className="apex-link-icon">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <span>book.apexcode@gmail.com</span>
            </a>

            <span className="apex-dot-divider">•</span>

            {/* Phone Link */}
            <a href="tel:03421287734" className="apex-glow-link">
              <svg viewBox="0 0 24 24" fill="currentColor" className="apex-link-icon">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              <span>0342-1287734</span>
            </a>
          </div>
        </div>

      </div>

    </div>

  </div>
</footer>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);