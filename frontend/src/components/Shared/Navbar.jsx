import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  User,
  ShoppingBag,
  Menu,
  X,
  ChevronRight,
  Home,
  Phone,
  HelpCircle
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';
import { CATEGORIES, publicInstance, SUB_CATEGORIES } from '../../services/apisUrls';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [isOpenCart, setIsOpenCart] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(2); // Replace with actual cart count from state
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Premium T-Shirt",
      price: 32.00,
      color: "Black",
      quantity: 1,
      image: "/api/placeholder/80/80"
    },
    {
      id: 2,
      name: "Designer Jeans",
      price: 45.00,
      size: "Medium",
      quantity: 1,
      image: "/api/placeholder/80/80"
    }
  ]);

  const dropdownRef = useRef(null);
  const navbarRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await publicInstance.get(CATEGORIES.GET_ALL_CATEGORIES);
        setCategories(response.data.data);

        // Fetch subcategories for each category
        response.data.data.forEach(category => {
          fetchSubcategoriesForCategory(category._id);
        });
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();

    // Handle scroll events
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const fetchSubcategoriesForCategory = async (categoryId) => {
    try {
      const response = await publicInstance.get(SUB_CATEGORIES.GET_ALL_SUB_CATEGORIES_BY_CATEGORYID(categoryId));
      setSubcategories(prev => ({
        ...prev,
        [categoryId]: response.data.data
      }));
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleOpenCart = () => {
    setIsOpenCart(!isOpenCart);
    // Prevent scrolling when cart is open
    if (!isOpenCart) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    setCartCount(prevCount => prevCount - 1);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
    // Prevent scrolling when mobile menu is open
    if (!navDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const toggleDropdown = (categoryId) => {
    setActiveDropdown(activeDropdown === categoryId ? null : categoryId);
  };

  return (
    <>
      {/* Spacer to prevent content jump when navbar becomes fixed */}
      {scrolled && <div className="h-16" />}

      <header
        ref={navbarRef}
        className={`${scrolled
            ? "fixed top-0 left-0 right-0 bg-white shadow-md animate-slideDown z-50"
            : "bg-white relative"
          } transition-all duration-300`}
      >
        <nav className="container mx-auto flex items-center justify-between py-1 px-4 md:px-6 h-16 md:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-slate-900 hover:text-slate-700 transition-colors">
              Rabbit
            </Link>
          </div>

          {/* Main Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8" ref={dropdownRef}>
            <div className="relative group">
              <button
                className="flex items-center text-gray-700 hover:text-black text-sm font-medium uppercase tracking-wide"
                onClick={() => toggleDropdown('categories')}
              >
                Categories <ChevronDown className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>

              {activeDropdown === 'categories' && (
                <div className="absolute z-10 mt-2 w-56 bg-white shadow-xl rounded-md py-2 text-sm animate-fadeIn">
                  {categories.map((category) => (
                    <div key={category._id} className="relative group/subcategory">
                      <div className="flex justify-between items-center px-4 py-2 hover:bg-gray-50 transition-colors">
                        <Link
                          to={`/collections/${category.slug}`}
                          className="block text-gray-700 hover:text-black transition-colors w-full"
                        >
                          {category.name}
                        </Link>
                        {subcategories[category._id]?.length > 0 && (
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        )}
                      </div>

                      {subcategories[category._id]?.length > 0 && (
                        <div className="absolute left-full top-0 w-56 bg-white shadow-xl rounded-md py-2 hidden group-hover/subcategory:block animate-fadeIn">
                          {subcategories[category._id].map(subcategory => (
                            <Link
                              key={subcategory._id}
                              to={`/collections/${category.slug}/${subcategory.slug}`}
                              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                            >
                              {subcategory.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link to="/about" className="text-gray-700 hover:text-black text-sm font-medium uppercase tracking-wide transition-colors">
              About Us
            </Link>

            <Link to="/contact" className="text-gray-700 hover:text-black text-sm font-medium uppercase tracking-wide transition-colors">
              Contact Us
            </Link>

            <div className="relative group">
              <button
                className="flex items-center text-gray-700 hover:text-black text-sm font-medium uppercase tracking-wide"
                onClick={() => toggleDropdown('pages')}
              >
                Pages <ChevronDown className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>

              {activeDropdown === 'pages' && (
                <div className="absolute z-10 mt-2 w-56 bg-white shadow-xl rounded-md py-2 text-sm animate-fadeIn">
                  <Link to="/faq" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-black transition-colors">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    FAQ
                  </Link>
                  <Link to="/shipping" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-black transition-colors">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Shipping
                  </Link>
                  <Link to="/returns" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-black transition-colors">
                    <ChevronRight className="w-4 h-4 mr-2" />
                    Returns
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-5">
            {user?.role === 'admin' && (
              <Link to="/admin/dashbourd" className="text-white hover:bg-red-900 p-1.5 px-3 rounded bg-red-800 text-sm font-medium transition-colors">
                Admin
              </Link>
            )}
            {user ? (
              <>
                <Link to="/profile" className="text-gray-700 hover:text-black transition-colors relative group">
                  <User className="w-5 h-5" />
                  <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 hidden group-hover:block whitespace-nowrap">Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-black text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-black text-sm font-medium transition-colors">
                Login
              </Link>
            )}
            <button
              onClick={handleOpenCart}
              className="relative text-gray-700 hover:text-black transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={handleNavDrawer}
              className="lg:hidden text-gray-700 hover:text-black transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed inset-0 bg-black/30 z-50 backdrop-blur-sm transition-opacity duration-300 ${navDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={handleNavDrawer}
      >
        <div
          className={`fixed top-0 left-0 w-4/5 max-w-sm h-full bg-white shadow-xl transition-transform duration-300 ease-in-out ${navDrawerOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">Menu</h2>
            <button
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              onClick={handleNavDrawer}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
            {/* Mobile Categories with Dropdown */}
            <div className="mb-3">
              <button
                className="flex items-center justify-between w-full text-lg py-2 font-medium text-gray-700 hover:text-black transition-colors"
                onClick={() => toggleDropdown('mobile-categories')}
              >
                Categories
                <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${activeDropdown === 'mobile-categories' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'mobile-categories' && (
                <div className="pl-4 mt-1 border-l-2 border-gray-200 animate-fadeIn">
                  {categories.map((category) => (
                    <div key={category._id} className="mb-3">
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/collections/${category.slug}`}
                          onClick={handleNavDrawer}
                          className="block text-base py-1.5 font-medium text-gray-700 hover:text-black transition-colors"
                        >
                          {category.name}
                        </Link>

                        {subcategories[category._id]?.length > 0 && (
                          <button
                            onClick={() => toggleDropdown(`mobile-sub-${category._id}`)}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === `mobile-sub-${category._id}` ? 'rotate-180' : ''
                                }`}
                            />
                          </button>
                        )}
                      </div>

                      {activeDropdown === `mobile-sub-${category._id}` && subcategories[category._id]?.length > 0 && (
                        <div className="pl-4 mt-1 border-l border-gray-200 animate-fadeIn">
                          {subcategories[category._id].map(subcategory => (
                            <Link
                              key={subcategory._id}
                              to={`/collections/${category.slug}/${subcategory.slug}`}
                              onClick={handleNavDrawer}
                              className="block text-sm py-1.5 text-gray-600 hover:text-black transition-colors"
                            >
                              {subcategory.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/about"
              onClick={handleNavDrawer}
              className="flex items-center text-lg py-2 font-medium text-gray-700 hover:text-black transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              About Us
            </Link>

            <Link
              to="/contact"
              onClick={handleNavDrawer}
              className="flex items-center text-lg py-2 font-medium text-gray-700 hover:text-black transition-colors"
            >
              <Phone className="w-5 h-5 mr-2" />
              Contact Us
            </Link>

            {/* Mobile Pages Dropdown */}
            <div className="mb-3">
              <button
                className="flex items-center justify-between w-full text-lg py-2 font-medium text-gray-700 hover:text-black transition-colors"
                onClick={() => toggleDropdown('mobile-pages')}
              >
                Pages
                <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${activeDropdown === 'mobile-pages' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'mobile-pages' && (
                <div className="pl-4 mt-1 border-l-2 border-gray-200 animate-fadeIn">
                  <Link
                    to="/faq"
                    onClick={handleNavDrawer}
                    className="flex items-center text-base py-1.5 text-gray-700 hover:text-black transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    FAQ
                  </Link>
                  <Link
                    to="/shipping"
                    onClick={handleNavDrawer}
                    className="flex items-center text-base py-1.5 text-gray-700 hover:text-black transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Shipping
                  </Link>
                  <Link
                    to="/returns"
                    onClick={handleNavDrawer}
                    className="flex items-center text-base py-1.5 text-gray-700 hover:text-black transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 mr-2" />
                    Returns
                  </Link>
                </div>
              )}
            </div>

            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={handleNavDrawer}
                  className="flex items-center text-lg py-2 font-medium text-gray-700 hover:text-black transition-colors"
                >
                  <User className="w-5 h-5 mr-2" />
                  Profile
                </Link>
                <button
                  onClick={() => { handleLogout(); handleNavDrawer(); }}
                  className="flex items-center text-lg py-2 font-medium text-gray-700 hover:text-black w-full text-left transition-colors"
                >
                  <X className="w-5 h-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={handleNavDrawer}
                className="flex items-center text-lg py-2 font-medium text-gray-700 hover:text-black transition-colors"
              >
                <User className="w-5 h-5 mr-2" />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <div
        className={`fixed inset-0 bg-black/30 z-50 backdrop-blur-sm transition-opacity duration-300 ${isOpenCart ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={handleOpenCart}
      >
        <div
          className={`fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-xl transition-transform duration-300 ease-in-out ${isOpenCart ? 'translate-x-0' : 'translate-x-full'
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">Your Cart ({cartCount})</h2>
            <button
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              onClick={handleOpenCart}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4 flex flex-col h-[calc(100%-64px)]">
            <div className="flex-grow overflow-y-auto">
              {cartCount > 0 ? (
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center border-b pb-4">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                      </div>
                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>{item.name}</h3>
                            <p className="ml-4">${item.price.toFixed(2)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.color ? `Color: ${item.color}` : item.size ? `Size: ${item.size}` : ''}
                          </p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="flex items-center border rounded">
                            <button
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                              onClick={() => {
                                setCartItems(prevItems =>
                                  prevItems.map(cartItem =>
                                    cartItem.id === item.id && cartItem.quantity > 1
                                      ? { ...cartItem, quantity: cartItem.quantity - 1 }
                                      : cartItem
                                  )
                                );
                              }}
                            >
                              -
                            </button>
                            <span className="px-2 py-1">{item.quantity}</span>
                            <button
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                              onClick={() => {
                                setCartItems(prevItems =>
                                  prevItems.map(cartItem =>
                                    cartItem.id === item.id
                                      ? { ...cartItem, quantity: cartItem.quantity + 1 }
                                      : cartItem
                                  )
                                );
                              }}
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            className="font-medium text-red-600 hover:text-red-500"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="w-16 h-16 mx-auto text-gray-300" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
                  <p className="mt-1 text-gray-500">Start shopping to add items to your cart</p>
                  <button
                    className="mt-6 bg-black hover:bg-gray-800 transition-colors text-white py-3 px-6 rounded-md font-medium"
                    onClick={handleOpenCart}
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>

            {cartCount > 0 && (
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                  <p>Subtotal</p>
                  <p>${calculateSubtotal()}</p>
                </div>
                <p className="text-sm text-gray-500 mb-4">Shipping and taxes calculated at checkout.</p>
                <Link
                  to="/checkout"
                  onClick={handleOpenCart}
                  className="w-full bg-black hover:bg-gray-800 transition-colors text-white py-3 px-4 rounded-md font-medium text-center block"
                >
                  Checkout
                </Link>
                <div className="mt-3 flex justify-center text-center text-sm text-gray-500">
                  <p>
                    or{" "}
                    <button
                      type="button"
                      className="font-medium text-black hover:text-gray-700"
                      onClick={handleOpenCart}
                    >
                      Continue Shopping
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Add these animations to your tailwind.config.js
// extend: {
//   keyframes: {
//     slideDown: {
//       '0%': { transform: 'translateY(-100%)' },
//       '100%': { transform: 'translateY(0)' },
//     },
//     fadeIn: {
//       '0%': { opacity: 0 },
//       '100%': { opacity: 1 },
//     },
//   },
//   animation: {
//     slideDown: 'slideDown 0.3s ease-in-out',
//     fadeIn: 'fadeIn 0.2s ease-in-out',
//   },
// },

export default Navbar;