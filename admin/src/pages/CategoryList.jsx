import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import "./Category.css";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [name, setName] = useState("");
  
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("adminToken");

  // Fetch categories
  const fetchCategories = async () => {
    const { data } = await axios.get(
      "http://localhost:5000/api/categories"
    );
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Open Add Modal
  const openAddModal = () => {
    setIsEditing(false);
    setName("");
    setShowModal(true);
  };

  // Open Edit Modal
  const openEditModal = (cat) => {
    setIsEditing(true);
    setCurrentId(cat._id);
    setName(cat.name);
    setShowModal(true);
  };

  // Save (Add or Update)
  const saveHandler = async () => {
    if (!name.trim()) return;

    if (isEditing) {
      await axios.put(
        `http://localhost:5000/api/categories/${currentId}`,
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } else {
      await axios.post(
        "http://localhost:5000/api/categories",
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }

    setShowModal(false);
    setName("");
    fetchCategories();
  };

  // Delete category
  const deleteHandler = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmDelete) return;

    await axios.delete(
      `http://localhost:5000/api/categories/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    fetchCategories();
  };

  return (
    <AdminLayout>
    <div className="category-header">

<h2>Categories</h2>

<div className="category-controls">

<input
type="text"
placeholder="Search category..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="category-search"
/>

<button className="add-btn" onClick={openAddModal}>
+ Add Category
</button>

</div>

</div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>
              {isEditing ? "Edit Category" : "Add New Category"}
            </h3>

            <input
              type="text"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="modal-buttons">
              <button className="save-btn" onClick={saveHandler}>
                {isEditing ? "Update" : "Add"}
              </button>

              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="category-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
           {categories
.filter(cat =>
cat.name.toLowerCase().includes(search.toLowerCase())
)
.map((cat) => (
              <tr key={cat._id}>
                <td>{cat.name}</td>

                <td>
                  {new Date(cat.createdAt).toLocaleDateString()}
                </td>

                <td>
                  <div className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => openEditModal(cat)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteHandler(cat._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}