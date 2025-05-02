import React, { useState, useEffect } from 'react';
import { privateInstance } from '../../services/apisUrls';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { BRANDS } from '../../services/apisUrls';

const BrandsList = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [currentBrand, setCurrentBrand] = useState({
        _id: null,
        name: '',
        description: '',
        logo: ''
    });

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            setLoading(true);
            const response = await privateInstance.get(BRANDS.GET_ALL_BRANDS);
            setBrands(response.data.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch brands');
            toast.error('Failed to fetch brands');
            console.error('Error fetching brands:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this brand?')) {
            try {
                await privateInstance.delete(BRANDS.DELETE_BRAND(id));
                setBrands(brands.filter(brand => brand._id !== id));
                toast.success('Brand deleted successfully');
            } catch (err) {
                setError('Failed to delete brand');
                toast.error('Failed to delete brand');
                console.error('Error deleting brand:', err);
            }
        }
    };

    const handleEdit = (brand) => {
        setEditMode(true);
        setCurrentBrand({
            _id: brand._id,
            name: brand.name,
            description: brand.description || '',
            logo: brand.logo || ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentBrand({
            ...currentBrand,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentBrand._id) {
                // Update existing brand
                await privateInstance.put(
                    BRANDS.UPDATE_BRAND(currentBrand._id),
                    currentBrand
                );
                setBrands(brands.map(brand =>
                    brand._id === currentBrand._id ? currentBrand : brand
                ));
                toast.success('Brand updated successfully');
            } else {
                // Create new brand
                const response = await privateInstance.post(
                    BRANDS.CREATE_BRAND,
                    currentBrand
                );
                setBrands([...brands, response.data.data]);
                toast.success('Brand created successfully');
            }
            resetForm();
        } catch (err) {
            setError('Failed to save brand');
            toast.error('Failed to save brand');
            console.error('Error saving brand:', err);
        }
    };

    const resetForm = () => {
        setEditMode(false);
        setCurrentBrand({
            _id: null,
            name: '',
            description: '',
            logo: ''
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto mt-5">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Brand Management</h1>
                <button
                    onClick={() => setEditMode(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Brand
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Brand Form */}
            {editMode && (
                <div className="bg-white p-6 rounded shadow-sm mb-8">
                    <h2 className="text-lg font-medium mb-4">
                        {currentBrand._id ? 'Edit Brand' : 'Add New Brand'}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm mb-2">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={currentBrand.name}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm mb-2">Description</label>
                            <textarea
                                name="description"
                                value={currentBrand.description}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                rows="3"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm mb-2">Logo URL</label>
                            <input
                                type="text"
                                name="logo"
                                value={currentBrand.logo}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="https://example.com/logo.png"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
                            >
                                {currentBrand._id ? 'Update' : 'Create'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Brands List Table */}
            <div className="bg-white rounded shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left py-3 px-4 font-medium">NAME</th>
                            <th className="text-left py-3 px-4 font-medium">DESCRIPTION</th>
                            <th className="text-left py-3 px-4 font-medium">LOGO</th>
                            <th className="text-left py-3 px-4 font-medium">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {brands.map((brand) => (
                            <tr key={brand._id} className="border-t">
                                <td className="py-3 px-4">{brand.name}</td>
                                <td className="py-3 px-4">{brand.description || '-'}</td>
                                <td className="py-3 px-4">
                                    {brand.logo ? (
                                        <img
                                            src={brand.logo}
                                            alt={brand.name}
                                            className="w-8 h-8 object-contain"
                                        />
                                    ) : (
                                        '-'
                                    )}
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(brand)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(brand._id)}
                                            className="text-red-500 hover:text-red-700"
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
        </div>
    );
};

export default BrandsList;
