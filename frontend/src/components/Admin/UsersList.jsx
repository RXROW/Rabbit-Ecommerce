import React, { useState, useEffect } from 'react';
import { privateInstance } from '../../services/apisUrls';
import { USERS } from '../../services/apisUrls';
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { toast } from 'sonner';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    role: 'user',
    phone: '',
    avatar: ''
  });
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await privateInstance.get(USERS.GET_ALL_USERS);
      setUsers(response.data.data);
    } catch (err) {
      toast.error('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingUser) {
      setEditingUser({
        ...editingUser,
        [name]: value
      });
    } else {
      setNewUser({
        ...newUser,
        [name]: value
      });
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await privateInstance.post(USERS.CREATE_USER, newUser);
      setNewUser({
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        role: 'user',
        phone: '',
        avatar: ''
      });
      toast.success('User added successfully');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add user');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await privateInstance.put(USERS.UPDATE_USER(editingUser._id), editingUser);
      setEditingUser(null);
      toast.success('User updated successfully');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!userId) {
      toast.error('Invalid user ID');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        await privateInstance.delete(USERS.DELETE_USER(userId));
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete user');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const startEditing = (user) => {
    setEditingUser({ ...user });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      {/* Add/Edit User Form */}
      <div className="bg-white p-6 rounded shadow-sm mb-8">
        <h2 className="text-lg font-medium mb-4">{editingUser ? 'Edit User' : 'Add New User'}</h2>

        <form onSubmit={editingUser ? handleEditUser : handleAddUser}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={editingUser ? editingUser.name : newUser.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={editingUser ? editingUser.email : newUser.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            {!editingUser && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm mb-2">Confirm Password</label>
                  <input
                    type="password"
                    name="passwordConfirm"
                    value={newUser.passwordConfirm}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
              </>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                value={editingUser ? editingUser.phone : newUser.phone}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm mb-2">Role</label>
              <select
                name="role"
                value={editingUser ? editingUser.role : newUser.role}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded flex items-center"
              disabled={loading}
            >
              {loading ? 'Loading...' : (editingUser ? 'Update User' : 'Add User')}
            </button>
            {editingUser && (
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded flex items-center"
              >
                <FaTimes className="mr-2" />
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Users List Table */}
      <div className="bg-gray-100 rounded shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left py-3 px-4 font-medium">NAME</th>
              <th className="text-left py-3 px-4 font-medium">EMAIL</th>
              <th className="text-left py-3 px-4 font-medium">PHONE</th>
              <th className="text-left py-3 px-4 font-medium">ROLE</th>
              <th className="text-left py-3 px-4 font-medium">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="border-t border-gray-300">
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.phone}</td>
                  <td className="py-3 px-4 capitalize">{user.role}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEditing(user)}
                        className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50"
                        title="Edit User"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                        title="Delete User"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;