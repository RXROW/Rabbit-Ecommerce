import React, { useState, useEffect } from 'react';
import { CATEGORIES, SUB_CATEGORIES, privateInstance } from '../../services/apisUrls';
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../../context/ThemeContext';

const CategoriesList = () => {

    const { darkMode } = useTheme();
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [subcategoryEditMode, setSubcategoryEditMode] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState(new Set());
    const [currentCategory, setCurrentCategory] = useState({
        _id: null,
        name: '',
        description: '',
        icon: ''
    });
    const [currentSubcategory, setCurrentSubcategory] = useState({
        _id: null,
        name: '',
        description: '',
        categoryId: null
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await privateInstance.get(CATEGORIES.GET_ALL_CATEGORIES);
            setCategories(response.data.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch categories');
            toast.error('Failed to fetch categories');
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchSubcategories = async (categoryId) => {
        try {
            const response = await privateInstance.get(CATEGORIES.GET_ALL_SUB_CATEGORIES_BY_CATEGORYID(categoryId));
            setSubcategories(prev => ({
                ...prev,
                [categoryId]: response.data.data
            }));
        } catch (err) {
            toast.error('Failed to fetch subcategories');
            console.error('Error fetching subcategories:', err);
        }
    };

    const toggleCategory = (categoryId) => {
        setExpandedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(categoryId)) {
                newSet.delete(categoryId);
            } else {
                newSet.add(categoryId);
                if (!subcategories[categoryId]) {
                    fetchSubcategories(categoryId);
                }
            }
            return newSet;
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await privateInstance.delete(CATEGORIES.DELETE_CATEGORY(id));
                setCategories(categories.filter(category => category._id !== id));
                toast.success('Category deleted successfully');
            } catch (err) {
                setError('Failed to delete category');
                toast.error('Failed to delete category');
                console.error('Error deleting category:', err);
            }
        }
    };

    const handleSubcategoryDelete = async (categoryId, subcategoryId) => {
        if (window.confirm('Are you sure you want to delete this subcategory?')) {
            try {
                await privateInstance.delete(SUB_CATEGORIES.DELETE_SUB_CATEGORY(subcategoryId));
                setSubcategories(prev => ({
                    ...prev,
                    [categoryId]: prev[categoryId].filter(sub => sub._id !== subcategoryId)
                }));
                toast.success('Subcategory deleted successfully');
            } catch (err) {
                toast.error('Failed to delete subcategory');
                console.error('Error deleting subcategory:', err);
            }
        }
    };

    const handleEdit = (category) => {
        setEditMode(true);
        setCurrentCategory({
            _id: category._id,
            name: category.name,
            description: category.description || '',
            icon: category.icon || ''
        });
    };

    const handleSubcategoryEdit = (subcategory, categoryId) => {
        setSubcategoryEditMode(true);
        setCurrentSubcategory({
            _id: subcategory._id,
            name: subcategory.name,
            description: subcategory.description || '',
            categoryId: categoryId
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentCategory({
            ...currentCategory,
            [name]: value
        });
    };

    const handleSubcategoryInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentSubcategory({
            ...currentSubcategory,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedName = currentCategory.name.trim();
        if (!trimmedName) {
            toast.error('Category name cannot be empty');
            return;
        }
        if (trimmedName.length < 3 || trimmedName.length > 30) {
            toast.error('Category name must be between 3 and 30 characters');
            return;
        }
        try {
            const categoryData = {
                name: trimmedName,
                description: currentCategory.description?.trim() || '',
                icon: currentCategory.icon?.trim() || ''
            };

            if (currentCategory._id) {
                await privateInstance.put(
                    CATEGORIES.UPDATE_CATEGORY(currentCategory._id),
                    categoryData
                );
                setCategories(categories.map(category =>
                    category._id === currentCategory._id ? { ...currentCategory, ...categoryData } : category
                ));
                toast.success('Category updated successfully');
            } else {
                const response = await privateInstance.post(
                    CATEGORIES.CREATE_CATEGORY,
                    categoryData
                );
                setCategories([...categories, response.data.data]);
                toast.success('Category created successfully');
            }
            resetForm();
        } catch (err) {
            setError('Failed to save category');
            toast.error('Failed to save category');
            console.error('Error saving category:', err);
        }
    };

    const handleSubcategorySubmit = async (e) => {
        e.preventDefault();
        const trimmedName = currentSubcategory.name.trim();
        if (!trimmedName) {
            toast.error('Subcategory name cannot be empty');
            return;
        }
        if (trimmedName.length < 3 || trimmedName.length > 30) {
            toast.error('Subcategory name must be between 3 and 30 characters');
            return;
        }
        try {
            const subcategoryData = {
                name: trimmedName,
                description: currentSubcategory.description?.trim() || '',
                category: currentSubcategory.categoryId
            };

            if (currentSubcategory._id) {
                await privateInstance.put(
                    SUB_CATEGORIES.UPDATE_SUB_CATEGORY(currentSubcategory._id),
                    subcategoryData
                );
                setSubcategories(prev => ({
                    ...prev,
                    [currentSubcategory.categoryId]: prev[currentSubcategory.categoryId].map(sub =>
                        sub._id === currentSubcategory._id ? { ...currentSubcategory, ...subcategoryData } : sub
                    )
                }));
                toast.success('Subcategory updated successfully');
            } else {
                const response = await privateInstance.post(
                    SUB_CATEGORIES.CREATE_SUB_CATEGORY,
                    subcategoryData
                );
                setSubcategories(prev => ({
                    ...prev,
                    [currentSubcategory.categoryId]: [...(prev[currentSubcategory.categoryId] || []), response.data.data]
                }));
                toast.success('Subcategory created successfully');
            }
            resetSubcategoryForm();
        } catch (err) {
            toast.error('Failed to save subcategory');
            console.error('Error saving subcategory:', err);
        }
    };

    const resetForm = () => {
        setEditMode(false);
        setCurrentCategory({
            _id: null,
            name: '',
            description: '',
            icon: ''
        });
    };

    const resetSubcategoryForm = () => {
        setSubcategoryEditMode(false);
        setCurrentSubcategory({
            _id: null,
            name: '',
            description: '',
            categoryId: null
        });
    };

    if (loading) {
        return (
            <div className={`flex justify-center items-center h-64 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${darkMode ? 'border-white' : 'border-gray-900'}`}></div>
            </div>
        );
    }

    return (
        <div className={`p-6 max-w-6xl mx-auto mt-5 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Category Management</h1>
                <button
                    onClick={() => setEditMode(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${darkMode
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                >
                    <Plus size={18} />
                    Add Category
                </button>
            </div>

            {error && (
                <div className={`mb-4 p-4 rounded-lg ${darkMode
                    ? 'bg-red-900/50 border border-red-700 text-red-200'
                    : 'bg-red-100 border border-red-400 text-red-700'
                    }`}>
                    {error}
                </div>
            )}

            {/* Category Form */}
            {editMode && (
                <div className={`p-6 rounded-lg shadow-lg mb-8 ${darkMode
                    ? 'bg-gray-800 border border-gray-700'
                    : 'bg-white border border-gray-200'
                    }`}>
                    <h2 className="text-lg font-medium mb-4">
                        {currentCategory._id ? 'Edit Category' : 'Add New Category'}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={currentCategory.name}
                                onChange={handleInputChange}
                                className={`w-full p-2 rounded-lg ${darkMode
                                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                    : 'border-gray-300 focus:border-blue-500'
                                    } border focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>Description</label>
                            <textarea
                                name="description"
                                value={currentCategory.description}
                                onChange={handleInputChange}
                                className={`w-full p-2 rounded-lg ${darkMode
                                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                    : 'border-gray-300 focus:border-blue-500'
                                    } border focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                rows="3"
                            />
                        </div>

                        <div className="mb-4">
                            <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>Icon URL</label>
                            <input
                                type="text"
                                name="icon"
                                value={currentCategory.icon}
                                onChange={handleInputChange}
                                className={`w-full p-2 rounded-lg ${darkMode
                                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                    : 'border-gray-300 focus:border-blue-500'
                                    } border focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                placeholder="https://example.com/icon.png"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${darkMode
                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                    : 'bg-green-500 hover:bg-green-600 text-white'
                                    }`}
                            >
                                {currentCategory._id ? 'Update' : 'Create'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${darkMode
                                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                    : 'bg-gray-500 hover:bg-gray-600 text-white'
                                    }`}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Subcategory Form */}
            {subcategoryEditMode && (
                <div className={`p-6 rounded-lg shadow-lg mb-8 ${darkMode
                    ? 'bg-gray-800 border border-gray-700'
                    : 'bg-white border border-gray-200'
                    }`}>
                    <h2 className="text-lg font-medium mb-4">
                        {currentSubcategory._id ? 'Edit Subcategory' : 'Add New Subcategory'}
                    </h2>

                    <form onSubmit={handleSubcategorySubmit}>
                        <div className="mb-4">
                            <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={currentSubcategory.name}
                                onChange={handleSubcategoryInputChange}
                                className={`w-full p-2 rounded-lg ${darkMode
                                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                    : 'border-gray-300 focus:border-blue-500'
                                    } border focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>Description</label>
                            <textarea
                                name="description"
                                value={currentSubcategory.description}
                                onChange={handleSubcategoryInputChange}
                                className={`w-full p-2 rounded-lg ${darkMode
                                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                    : 'border-gray-300 focus:border-blue-500'
                                    } border focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                rows="3"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${darkMode
                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                    : 'bg-green-500 hover:bg-green-600 text-white'
                                    }`}
                            >
                                {currentSubcategory._id ? 'Update' : 'Create'}
                            </button>
                            <button
                                type="button"
                                onClick={resetSubcategoryForm}
                                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${darkMode
                                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                    : 'bg-gray-500 hover:bg-gray-600 text-white'
                                    }`}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Categories List Table */}
            <div className={`rounded-lg shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                <table className="w-full">
                    <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}>
                        <tr>
                            <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>NAME</th>
                            <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>DESCRIPTION</th>
                            <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>ICON</th>
                            <th className={`text-left py-3 px-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <React.Fragment key={category._id}>
                                <tr className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'
                                    }`}>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => toggleCategory(category._id)}
                                                className={`p-1 rounded-full hover:bg-opacity-20 ${darkMode
                                                    ? 'text-gray-400 hover:bg-gray-600'
                                                    : 'text-gray-500 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {expandedCategories.has(category._id) ? (
                                                    <ChevronUp size={18} />
                                                ) : (
                                                    <ChevronDown size={18} />
                                                )}
                                            </button>
                                            <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                                                {category.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {category.description || '-'}
                                    </td>
                                    <td className="py-3 px-4">
                                        {category.icon ? (
                                            <img
                                                src={category.icon}
                                                alt={category.name}
                                                className="w-8 h-8 object-contain"
                                            />
                                        ) : (
                                            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>-</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className={`p-1 rounded-full hover:bg-opacity-20 ${darkMode
                                                    ? 'text-blue-400 hover:bg-blue-900'
                                                    : 'text-blue-500 hover:bg-blue-100'
                                                    }`}
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category._id)}
                                                className={`p-1 rounded-full hover:bg-opacity-20 ${darkMode
                                                    ? 'text-red-400 hover:bg-red-900'
                                                    : 'text-red-500 hover:bg-red-100'
                                                    }`}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setCurrentSubcategory(prev => ({
                                                        ...prev,
                                                        categoryId: category._id
                                                    }));
                                                    setSubcategoryEditMode(true);
                                                }}
                                                className={`p-1 rounded-full hover:bg-opacity-20 ${darkMode
                                                    ? 'text-green-400 hover:bg-green-900'
                                                    : 'text-green-500 hover:bg-green-100'
                                                    }`}
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {expandedCategories.has(category._id) && subcategories[category._id] && (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-2">
                                            <div className={`ml-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'
                                                }`}>
                                                <h3 className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                    }`}>Subcategories</h3>
                                                <table className="w-full">
                                                    <thead className={darkMode ? 'bg-gray-600' : 'bg-gray-100'}>
                                                        <tr>
                                                            <th className={`text-left py-2 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                                }`}>Name</th>
                                                            <th className={`text-left py-2 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                                }`}>Description</th>
                                                            <th className={`text-left py-2 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                                }`}>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {subcategories[category._id].map((subcategory) => (
                                                            <tr key={subcategory._id} className={`border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'
                                                                }`}>
                                                                <td className={`py-2 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                                    }`}>{subcategory.name}</td>
                                                                <td className={`py-2 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                                    }`}>{subcategory.description || '-'}</td>
                                                                <td className="py-2 px-4">
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            onClick={() => handleSubcategoryEdit(subcategory, category._id)}
                                                                            className={`p-1 rounded-full hover:bg-opacity-20 ${darkMode
                                                                                ? 'text-blue-400 hover:bg-blue-900'
                                                                                : 'text-blue-500 hover:bg-blue-100'
                                                                                }`}
                                                                        >
                                                                            <Edit2 size={18} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleSubcategoryDelete(category._id, subcategory._id)}
                                                                            className={`p-1 rounded-full hover:bg-opacity-20 ${darkMode
                                                                                ? 'text-red-400 hover:bg-red-900'
                                                                                : 'text-red-500 hover:bg-red-100'
                                                                                }`}
                                                                        >
                                                                            <Trash2 size={18} />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CategoriesList;
