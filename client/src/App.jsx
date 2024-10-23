import React, { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import AddUserForm from "./components/AddUserForm";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/users");
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      setError("Failed to fetch users");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add new user
  const handleAddUser = async (userData) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (data.success) {
        await fetchUsers();
        setShowForm(false);
      } else {
        setError(data.message || "Failed to add user");
      }
    } catch (err) {
      setError("Failed to add user");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update user
  const handleUpdateUser = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Updating user:", editingUser._id, userData); // Debug log

      const response = await fetch(
        `http://localhost:3000/update/${editingUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();
      console.log("Update response:", data); // Debug log

      if (data.success) {
        await fetchUsers(); // Refresh the list
        setEditingUser(null);
        setShowForm(false);
      } else {
        setError(data.message || "Failed to update user");
      }
    } catch (err) {
      setError("Failed to update user");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/delete/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        await fetchUsers(); // Refresh the list
      } else {
        setError(data.message || "Failed to delete user");
      }
    } catch (err) {
      setError("Failed to delete user");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Start editing user
  const handleEdit = (user) => {
    console.log("Starting edit for user:", user); // Debug log
    setEditingUser(user);
    setShowForm(true);
  };

  // Handle form close
  const handleFormClose = () => {
    setShowForm(false);
    setEditingUser(null);
    setError(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="container">
        <div className="content-wrapper">
          <button className="add-button" onClick={() => setShowForm(true)}>
            <PlusCircle size={20} />
            Add
          </button>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="table-container">
              <table className="user-table">
                <thead className="table-header">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.mobile}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="edit-button"
                            onClick={() => handleEdit(user)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => handleDelete(user._id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <AddUserForm
          onSubmit={editingUser ? handleUpdateUser : handleAddUser}
          onClose={handleFormClose}
          initialData={editingUser}
          isEditing={!!editingUser}
          error={error}
        />
      )}
    </>
  );
}

export default App;
