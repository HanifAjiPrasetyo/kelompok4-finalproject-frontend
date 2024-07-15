import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function CategoryTable() {
  const { token } = useSelector((state) => state.auth);

  // Get Categories
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    axios
      .get(`${backendURL}/getCategories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err.response.data.message));
  }, [token]);

  // Add Category
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [validation, setValidation] = useState([]);

  const [loading, setIsLoading] = useState(false);

  const handleAddCategory = async (e) => {
    e.preventDefault();

    const data = new FormData();

    name && data.append("name", name);
    description && data.append("description", description);

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    setIsLoading(true);

    await axios
      .post(`${backendURL}/storeCategory`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        alert(res.data.message);
        document.getElementById("addCategory").close();
        window.location.reload();
      })
      .catch((err) => {
        setValidation(err.response.data);
        setIsLoading(false);
      });
  };

  return (
    <>
      {loading && (
        <div className="fixed top-1/3 left-1/2 z-[9999]">
          <span className="loading loading-spinner loading-lg text-first"></span>
        </div>
      )}
      <div className={"relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white"}>
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap gap-5 items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className={"font-semibold text-lg"}>Categories</h3>
            </div>
            {/* <div className="form-control">
              <input
                type="text"
                placeholder="Search"
                className="input input-sm input-bordered w-full md:w-auto"
                onChange={(e) => {
                  e.preventDefault();
                  setSearchKey(e.target.value);
                }}
              />
            </div> */}
            {/* Add Product */}
            <button className="btn btn-success btn-sm text-xs text-white" onClick={() => document.getElementById("addCategory").showModal()}>
              Add Category
            </button>
            <dialog id="addCategory" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Add Category</h3>
                {loading && (
                  <div className="fixed top-1/2 left-1/2 z-[9999]">
                    <span className="loading loading-spinner loading-lg text-first"></span>
                  </div>
                )}
                <div className="modal-action flex flex-col gap-y-4">
                  <div className="mb-2">
                    <div className="label">
                      <span className="label-text">Name</span>
                    </div>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" className="input input-bordered w-full" />
                    <p className="my-2 text-red-500 text-xs">{validation.name && validation.name}</p>
                  </div>
                  <div className="mb-2">
                    <div className="label">
                      <span className="label-text">Description</span>
                    </div>
                    <textarea type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Category description" className="input input-bordered w-full"></textarea>
                  </div>
                  <div className="flex items-center gap-x-3 mt-3">
                    <button className="btn btn-success text-white w-1/2" type="button" onClick={handleAddCategory}>
                      Save
                    </button>
                    <button type="button" className="btn bg-slate-300 w-1/2" onClick={() => document.getElementById("addCategory").close()}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </dialog>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"}>Name</th>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"}>Description</th>
                {/* <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"}>Action</th> */}
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id}>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-lg whitespace-nowrap p-4">{category.name}</td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4">{category.description}</td>
                    {/* <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-4">
                      <div className="flex items-center gap-2 justify-center">
                        <button
                          className="btn btn-error btn-xs text-white"
                          onClick={() => {
                            if (confirm("Delete category?")) {
                              handleDeleteCategory(item.id);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="text-center py-10">
                    Empty
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
