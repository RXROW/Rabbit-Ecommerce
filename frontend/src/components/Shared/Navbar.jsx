import { User } from "lucide-react";
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineShoppingBag, HiBars3BottomRight } from "react-icons/hi2";
import SeachBar from "./SearchBar";
import CartDrawer from "./CartDrawer/CartDrawer";
import { HiOutlineX } from "react-icons/hi";
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';
import { publicInstance } from '../../services/apisUrls';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const [isOpenCart, setIsOpenCart] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await publicInstance.get('/categories');
        setCategories(response.data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleOpenCart = () => {
    setIsOpenCart(!isOpenCart);
  };

  const handleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <>
      <nav className="container  mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <div>
          <Link to="/" className=" text-2xl font-medium text-slate-900  ">
            Rabbit
          </Link>
        </div>
        <div className=" hidden md:flex space-x-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/collections/${category.slug}`}
              className=" text-gray-700 hover:text-black text-sm font-medium uppercase"
            >
              {category.name}
            </Link>
          ))}
        </div>
        {/* Icons */}
        <div className=" flex items-center space-x-4">
          {user?.role === 'admin' && (
            <Link to="/admin/dashbourd" className=" text-gray-200 hover:bg-black p-1 rounded bg-red-800 ">
              Admin
            </Link>
          )}
          {user ? (
            <>
              <Link to="/profile" className=" text-gray-700 hover:text-black ">
                <User className=" w-5 h-5" />
              </Link>
              <button onClick={handleLogout} className="text-gray-700 hover:text-black text-sm font-medium">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-gray-700 hover:text-black text-sm font-medium">
              Login
            </Link>
          )}
          <button onClick={handleOpenCart} className=" relative hover:text-black">
            <HiOutlineShoppingBag className=" w-6 h-6" />
            <span className=" absolute -top-0 -right-3 bg-red-600 text-white text-sm rounded-full px-2 py-0.5">
              2
            </span>
          </button>
          {/* Seach Bar  */}
          <div className=" overflow-hidden">
            <SeachBar />
          </div>
          <button onClick={handleNavDrawer} className=" md:hidden">
            <HiBars3BottomRight className=" w-6 h-6 text-gray-700" />
          </button>
        </div>
      </nav>
      {/* Cart Drawer  */}
      <CartDrawer isOpen={isOpenCart} setIsOpenCart={setIsOpenCart} />
      {/* Nav Mobile  */}
      <div className={` fixed top-0 left-0 w-3/4 sm:w-1/2 h-full md:w-1/3 bg-gray-100/60 backdrop-blur-md 
        transition-all duration-300 z-50 ${navDrawerOpen ? ' translate-x-0' : ' -translate-x-full'}`}>
        <div className=" flex justify-end p-4">
          <button className="p-2  rounded-full bg-gray-100 ">
            <HiOutlineX className=" w-6 h-6  text-red-400"
              onClick={handleNavDrawer} />
          </button>
        </div>
        <div className="p-4">
          <h2 className=" text-xl font-semibold mb-4 ">Menu</h2>
          <nav>
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/collections/${category.slug}`}
                onClick={handleNavDrawer}
                className=" block text-lg py-2 font-medium text-gray-700 hover:text-black"
              >
                {category.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/profile" onClick={handleNavDrawer} className="block text-lg py-2 font-medium text-gray-700 hover:text-black">
                  Profile
                </Link>
                <button onClick={() => { handleLogout(); handleNavDrawer(); }} className="block text-lg py-2 font-medium text-gray-700 hover:text-black w-full text-left">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={handleNavDrawer} className="block text-lg py-2 font-medium text-gray-700 hover:text-black">
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
