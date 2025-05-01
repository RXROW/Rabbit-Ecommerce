import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BRANDS, CATEGORIES, SUB_CATEGORIES, publicInstance } from '../../services/apisUrls';

const CategoriesBrands = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchCategories(), fetchBrands()]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await publicInstance.get(CATEGORIES.GET_ALL_CATEGORIES);
      setCategories(response.data.data);

      // Pre-fetch subcategories for all categories
      response.data.data.forEach(category => {
        fetchSubcategoriesForCategory(category._id);
      });

      return response.data.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await publicInstance.get(BRANDS.GET_ALL_BRANDS);
      setBrands(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching brands:', error);
      return [];
    }
  };

  const fetchSubcategoriesForCategory = async (categoryId) => {
    try {
      const response = await publicInstance.get(
        SUB_CATEGORIES.GET_ALL_SUB_CATEGORIES_BY_CATEGORYID(categoryId)
      );
      setSubcategories(prev => ({
        ...prev,
        [categoryId]: response.data.data
      }));
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const navigateToCategory = (categorySlug) => {
    navigate(`/collections/${categorySlug}`);
  };

  const navigateToBrand = (brandSlug) => {
    navigate(`/collections/${brandSlug}`);
  };

  const navigateToSubcategory = (subcategorySlug, event) => {
    event.stopPropagation();
    navigate(`/collections/${subcategorySlug}`);
  };

  const getSlug = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Categories Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-center">Shop by Categories</h2>

        {categories.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No categories found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {categories.map((category) => (
              <div
                key={category._id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigateToCategory(getSlug(category.name))}
              >
                <div className="flex flex-col items-center p-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    {category.icon ? (
                      <img
                        src={category.icon}
                        alt={category.name}
                        className="w-10 h-10 object-contain"
                      />
                    ) : (
                      <span className="text-xl font-bold text-gray-500">{category.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <h3 className="text-md font-medium text-center">{category.name}</h3>

                  {subcategories[category._id]?.length > 0 && (
                    <div className="w-full mt-3 text-sm text-gray-600">
                      <ul className="space-y-1">
                        {subcategories[category._id].slice(0, 3).map((subcategory) => (
                          <li
                            key={subcategory._id}
                            className="flex items-center hover:text-blue-600"
                            onClick={(e) => navigateToSubcategory(getSlug(subcategory.name), e)}
                          >
                            <span className="text-gray-400 mr-1">›</span> {subcategory.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Brands Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-center">Popular Brands</h2>

        {brands.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No brands found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {brands.map((brand) => (
              <div
                key={brand._id}
                className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col items-center cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all"
                onClick={() => navigateToBrand(getSlug(brand.name))}
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <span className="text-lg font-bold text-gray-500">{brand.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="text-xs font-medium text-center truncate w-full">{brand.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesBrands;