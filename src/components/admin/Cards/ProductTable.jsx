import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProduct } from "../../../slices/productSlice";

export default function ProductTable() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Get Products State
  const { products } = useSelector((state) => state.product);
  const [productImage, setProductImage] = useState(null);

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
  }, []);

  // Search Product
  const [searchKey, setSearchKey] = useState("");
  const [searchProducts, setSearchProducts] = useState([]);

  useEffect(() => {
    if (searchKey && products.length > 0) {
      const items = products.filter((item) => item.title.toLowerCase().includes(searchKey.toLowerCase()) || item.category.toLowerCase().includes(searchKey.toLowerCase()));
      setSearchProducts(items);
    }
  }, [products, searchKey]);

  // Add Product
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [size, setSize] = useState(null);
  const [weight, setWeight] = useState(null);
  const [price, setPrice] = useState(null);
  const [year, setYear] = useState(null);
  const [description, setDescription] = useState(null);
  const [validation, setValidation] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImage(reader.result);
      };
      reader.readAsDataURL(file);
    }

    setImage(file);
  };

  const [loading, setIsLoading] = useState(false);

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("category_id", categoryId);
    data.append("title", title);
    data.append("image", image);
    data.append("price", price);
    data.append("size", size);
    data.append("weight", weight);
    data.append("year", year);
    data.append("description", description);

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    setIsLoading(true);

    await axios
      .post(`${backendURL}/product`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        dispatch(fetchProduct());
        setIsLoading(false);
        alert(res.data.message);
        document.getElementById("addProduct").close();
      })
      .catch((err) => {
        setValidation(err.response.data.errors);
        setIsLoading(false);
      });
  };

  // Set Active Product
  const handleActive = (e) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const formData = new FormData();
    formData.append("productId", e.target.value);
    formData.append("isChecked", e.target.checked);

    setIsLoading(true);

    axios
      .post(`${backendURL}/updateActiveProduct`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        dispatch(fetchProduct()).then(() => {
          alert(res.data.message);
          setIsLoading(false);
        });
      })
      .catch((err) => console.log(err));
  };

  // Delete Product
  const handleDeleteProduct = (id) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    setIsLoading(true);

    axios
      .delete(`${backendURL}/product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        dispatch(fetchProduct());
        alert(res.data.message);
        setIsLoading(false);
      })
      .catch((err) => {
        alert(err.response.data.message);
        setIsLoading(false);
      });
  };

  // Edit Product
  const handleEditProduct = async (e, id) => {
    e.preventDefault();

    const data = new FormData();

    data.append("category_id", categoryId);
    data.append("title", title);
    image && data.append("image", image);
    data.append("price", price);
    data.append("size", size);
    data.append("weight", weight);
    data.append("year", year);
    data.append("description", description);

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    setIsLoading(true);

    await axios
      .post(`${backendURL}/product/updateProduct/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        dispatch(fetchProduct()).then(() => {
          setIsLoading(false);
          alert(res.data.message);
          document.getElementById(`editProduct${id}`).close();
        });
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
              <h3 className={"font-semibold text-lg"}>Products</h3>
            </div>
            <div className="form-control">
              <input
                type="text"
                placeholder="Search"
                className="input input-sm input-bordered w-full md:w-auto"
                onChange={(e) => {
                  e.preventDefault();
                  setSearchKey(e.target.value);
                }}
              />
            </div>
            {/* Add Product */}
            <button className="btn btn-success btn-sm text-xs text-white" onClick={() => document.getElementById("addProduct").showModal()}>
              Add Product
            </button>
            <dialog id="addProduct" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Add Product</h3>
                {loading && (
                  <div className="fixed top-1/2 left-1/2 z-[9999]">
                    <span className="loading loading-spinner loading-lg text-first"></span>
                  </div>
                )}
                <div className="modal-action flex flex-col gap-y-4">
                  <div className="mb-2">
                    <div className="relative w-full mb-3 text-center">
                      <label className="block text-sm mb-2" htmlFor="product-image">
                        Product Image
                      </label>
                      <input type="file" accept="image/*" className="hidden" id="product-image" onChange={handleImageChange} />
                      <div className="flex justify-center mt-2">
                        <label htmlFor="product-image" className="cursor-pointer">
                          {productImage ? (
                            <img src={productImage} className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover" />
                          ) : (
                            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg flex items-center justify-center bg-gray-200 text-blueGray-300">Upload Image</div>
                          )}
                        </label>
                      </div>
                      <p className="my-2 text-red-500 text-xs">{validation.image && validation.image}</p>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="label">
                      <span className="label-text">Title</span>
                    </div>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Product title" className="input input-bordered w-full" />
                    <p className="my-2 text-red-500 text-xs">{validation.title && validation.title}</p>
                  </div>
                  <div className="mb-2">
                    <div className="label">
                      <span className="label-text">Category</span>
                    </div>
                    <select
                      className="border-0 px-3 py-3 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      onChange={(e) => {
                        setCategoryId(e.target.value);
                      }}
                      value={categoryId}
                    >
                      <option selected disabled>
                        Choose Category
                      </option>
                      {categories?.map((category, idx) => {
                        return (
                          <option key={idx} className="text-sm" value={category.id}>
                            {category.name}
                          </option>
                        );
                      })}
                    </select>
                    <p className="my-2 text-red-500 text-xs">{validation.category_id && validation.category_id}</p>
                  </div>
                  <div className="flex gap-x-2">
                    <div className="mb-2">
                      <div className="label">
                        <span className="label-text">Price</span>
                      </div>
                      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="999999" className="input input-bordered w-full" />
                      <p className="my-2 text-red-500 text-xs">{validation.price && validation.price}</p>
                    </div>
                    <div className="mb-2">
                      <div className="label">
                        <span className="label-text">Size</span>
                      </div>
                      <input type="text" value={size} onChange={(e) => setSize(e.target.value)} placeholder="S, M, XL | 28, 29, 30" className="input input-bordered w-full" />
                      <p className="my-2 text-red-500 text-xs">{validation.size && validation.size}</p>
                    </div>
                  </div>
                  <div className="flex gap-x-2">
                    <div className="mb-2">
                      <div className="label">
                        <span className="label-text">Weight (gram)</span>
                      </div>
                      <input type="number" min={0} value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="1000" className="input input-bordered w-full" />
                      <p className="my-2 text-red-500 text-xs">{validation.weight && validation.weight}</p>
                    </div>
                    <div className="mb-2">
                      <div className="label">
                        <span className="label-text">Year</span>
                      </div>
                      <input type="number" value={year} min={0} onChange={(e) => setYear(e.target.value)} placeholder="2020" className="input input-bordered w-full" />
                      <p className="my-2 text-red-500 text-xs">{validation.year && validation.year}</p>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="label">
                      <span className="label-text">Description</span>
                    </div>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product descripion...." className="input input-bordered w-full" />
                    <p className="my-2 text-red-500 text-xs">{validation.description && validation.description}</p>
                  </div>
                  <div className="flex items-center gap-x-3 mt-3">
                    <button className="btn btn-success text-white w-1/2" type="button" onClick={handleAddProduct}>
                      Save
                    </button>
                    <button type="button" className="btn bg-slate-300 w-1/2" onClick={() => document.getElementById("addProduct").close()}>
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
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"}>Product</th>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"}>Year</th>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"}>Price</th>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"}>Weight (gr)</th>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"}>Is Active</th>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"}>Action</th>
              </tr>
            </thead>
            <tbody>
              {searchProducts?.length > 0 && searchKey ? (
                searchProducts.map((item) => (
                  <tr key={item.id}>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                      <img src={item.image || productImage} className="h-12 w-12 bg-white rounded-full border" alt={item.title} />
                      <div className="flex flex-col gap-y-1">
                        <span className={"ml-3 font-bold"}>{item.title}</span>
                        <span className={"ml-3 font-normal"}>
                          {item.category} | Size: {item.size}
                        </span>
                      </div>
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{item.year}</td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {Intl.NumberFormat("id", {
                        style: "currency",
                        currency: "IDR",
                      }).format(item.price)}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{item.weight}</td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <input value={item.id} type="checkbox" checked={item.isActive ? true : false} className="checkbox" onChange={handleActive} />
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <div className="flex items-center gap-x-1">
                        <button className="btn btn-primary btn-xs text-white" onClick={() => document.getElementById(`editProduct${item.id}`).showModal()}>
                          Edit
                        </button>
                        <dialog id={`editProduct${item.id}`} className="modal">
                          <div className="modal-box">
                            <h3 className="font-bold text-lg">Edit Product</h3>
                            {loading && (
                              <div className="fixed top-1/2 left-1/2 z-[9999]">
                                <span className="loading loading-spinner loading-lg text-first"></span>
                              </div>
                            )}
                            <div className="modal-action flex flex-col gap-y-4">
                              <div className="mb-2">
                                <div className="relative w-full mb-3 text-center">
                                  <label className="block text-sm mb-2" htmlFor="item-image">
                                    Product Image
                                  </label>
                                  <input type="file" accept="image/*" className="hidden" id="item-image" onChange={handleImageChange} />
                                  <div className="flex justify-center mt-2">
                                    <label htmlFor="item-image" className="cursor-pointer">
                                      {item.image ? (
                                        <img src={productImage || item.image} className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover" />
                                      ) : (
                                        <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg flex items-center justify-center bg-gray-200">Upload Image</div>
                                      )}
                                    </label>
                                  </div>
                                  <p className="my-2 text-red-500 text-xs">{validation.image && validation.image}</p>
                                </div>
                              </div>
                              <div className="mb-2">
                                <div className="label">
                                  <span className="label-text">Title</span>
                                </div>
                                <input type="text" defaultValue={item.title} onChange={(e) => setTitle(e.target.value)} placeholder="Product title" className="input input-bordered w-full" />
                                <p className="my-2 text-red-500 text-xs">{validation.title && validation.title}</p>
                              </div>
                              <div className="mb-2">
                                <div className="label">
                                  <span className="label-text">Category</span>
                                </div>
                                <select
                                  className="border-0 px-3 py-3 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                  onChange={(e) => {
                                    setCategoryId(e.target.value);
                                  }}
                                  defaultValue={categoryId}
                                >
                                  <option selected disabled>
                                    Choose Category
                                  </option>
                                  {categories?.map((category, idx) => {
                                    return (
                                      <option key={idx} className="text-sm" value={category.id}>
                                        {category.name}
                                      </option>
                                    );
                                  })}
                                </select>
                                <p className="my-2 text-red-500 text-xs">{validation.category_id && validation.category_id}</p>
                              </div>
                              <div className="flex gap-x-2">
                                <div className="mb-2">
                                  <div className="label">
                                    <span className="label-text">Price</span>
                                  </div>
                                  <input type="number" defaultValue={item.price} onChange={(e) => setPrice(e.target.value)} placeholder="999999" className="input input-bordered w-full" />
                                  <p className="my-2 text-red-500 text-xs">{validation.price && validation.price}</p>
                                </div>
                                <div className="mb-2">
                                  <div className="label">
                                    <span className="label-text">Size</span>
                                  </div>
                                  <input type="text" defaultValue={item.size} onChange={(e) => setSize(e.target.value)} placeholder="S, M, XL | 28, 29, 30" className="input input-bordered w-full" />
                                  <p className="my-2 text-red-500 text-xs">{validation.size && validation.size}</p>
                                </div>
                              </div>
                              <div className="flex gap-x-2">
                                <div className="mb-2">
                                  <div className="label">
                                    <span className="label-text">Weight (gram)</span>
                                  </div>
                                  <input type="number" min={0} defaultValue={item.weight} onChange={(e) => setWeight(e.target.value)} placeholder="1000" className="input input-bordered w-full" />
                                  <p className="my-2 text-red-500 text-xs">{validation.weight && validation.weight}</p>
                                </div>
                                <div className="mb-2">
                                  <div className="label">
                                    <span className="label-text">Year</span>
                                  </div>
                                  <input type="number" defaultValue={item.year} min={0} onChange={(e) => setYear(e.target.value)} placeholder="2020" className="input input-bordered w-full" />
                                  <p className="my-2 text-red-500 text-xs">{validation.year && validation.year}</p>
                                </div>
                              </div>
                              <div className="mb-2">
                                <div className="label">
                                  <span className="label-text">Description</span>
                                </div>
                                <textarea defaultValue={item.description} onChange={(e) => setDescription(e.target.value)} placeholder="Product descripion...." className="input input-bordered w-full" />
                                <p className="my-2 text-red-500 text-xs">{validation.description && validation.description}</p>
                              </div>
                              <div className="flex items-center gap-x-3 mt-3">
                                <button className="btn btn-success text-white w-1/2" type="button" onClick={(e) => handleEditProduct(e, item.id)}>
                                  Save
                                </button>
                                <button type="button" className="btn bg-slate-300 w-1/2" onClick={() => document.getElementById(`editProduct${item.id}`).close()}>
                                  Close
                                </button>
                              </div>
                            </div>
                          </div>
                        </dialog>
                        <button
                          className="btn btn-xs btn-error text-white"
                          onClick={(e) => {
                            e.preventDefault();
                            if (confirm("Delete product?")) {
                              handleDeleteProduct(item.id);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : products?.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                      <img src={product.image || productImage} className="h-12 w-12 bg-white rounded-full border" alt={product.title} />
                      <div className="flex flex-col gap-y-1">
                        <span className={"ml-3 font-bold"}>{product.title}</span>
                        <span className={"ml-3 font-normal"}>
                          {product.category} | Size: {product.size}
                        </span>
                      </div>
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{product.year}</td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {Intl.NumberFormat("id", {
                        style: "currency",
                        currency: "IDR",
                      }).format(product.price)}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{product.weight}</td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <input value={product.id} type="checkbox" checked={product.isActive ? true : false} className="checkbox" onChange={handleActive} />
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <div className="flex items-center gap-x-1">
                        <button className="btn btn-primary btn-xs text-white" onClick={() => document.getElementById(`editProduct${product.id}`).showModal()}>
                          Edit
                        </button>
                        <dialog id={`editProduct${product.id}`} className="modal">
                          <div className="modal-box">
                            <h3 className="font-bold text-lg">Edit Product</h3>
                            {loading && (
                              <div className="fixed top-1/2 left-1/2 z-[9999]">
                                <span className="loading loading-spinner loading-lg text-first"></span>
                              </div>
                            )}
                            <div className="modal-action flex flex-col gap-y-4">
                              <div className="mb-2">
                                <div className="relative w-full mb-3 text-center">
                                  <label className="block text-sm mb-2" htmlFor="product-image">
                                    Product Image
                                  </label>
                                  <input type="file" accept="image/*" className="hidden" id="product-image" onChange={handleImageChange} />
                                  <div className="flex justify-center mt-2">
                                    <label htmlFor="product-image" className="cursor-pointer">
                                      {product.image ? (
                                        <img src={productImage || product.image} className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover" />
                                      ) : (
                                        <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg flex items-center justify-center bg-gray-200">Upload Image</div>
                                      )}
                                    </label>
                                  </div>
                                  <p className="my-2 text-red-500 text-xs">{validation.image && validation.image}</p>
                                </div>
                              </div>
                              <div className="mb-2">
                                <div className="label">
                                  <span className="label-text">Title</span>
                                </div>
                                <input type="text" defaultValue={product.title} onChange={(e) => setTitle(e.target.value)} placeholder="Product title" className="input input-bordered w-full" />
                                <p className="my-2 text-red-500 text-xs">{validation.title && validation.title}</p>
                              </div>
                              <div className="mb-2">
                                <div className="label">
                                  <span className="label-text">Category</span>
                                </div>
                                <select
                                  className="border-0 px-3 py-3 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                  onChange={(e) => {
                                    setCategoryId(e.target.value);
                                  }}
                                  defaultValue={categoryId}
                                >
                                  <option selected disabled>
                                    Choose Category
                                  </option>
                                  {categories?.map((category, idx) => {
                                    return (
                                      <option key={idx} className="text-sm" value={category.id}>
                                        {category.name}
                                      </option>
                                    );
                                  })}
                                </select>
                                <p className="my-2 text-red-500 text-xs">{validation.category_id && validation.category_id}</p>
                              </div>
                              <div className="flex gap-x-2">
                                <div className="mb-2">
                                  <div className="label">
                                    <span className="label-text">Price</span>
                                  </div>
                                  <input type="number" defaultValue={product.price} onChange={(e) => setPrice(e.target.value)} placeholder="999999" className="input input-bordered w-full" />
                                  <p className="my-2 text-red-500 text-xs">{validation.price && validation.price}</p>
                                </div>
                                <div className="mb-2">
                                  <div className="label">
                                    <span className="label-text">Size</span>
                                  </div>
                                  <input type="text" defaultValue={product.size} onChange={(e) => setSize(e.target.value)} placeholder="S, M, XL | 28, 29, 30" className="input input-bordered w-full" />
                                  <p className="my-2 text-red-500 text-xs">{validation.size && validation.size}</p>
                                </div>
                              </div>
                              <div className="flex gap-x-2">
                                <div className="mb-2">
                                  <div className="label">
                                    <span className="label-text">Weight (gram)</span>
                                  </div>
                                  <input type="number" min={0} defaultValue={product.weight} onChange={(e) => setWeight(e.target.value)} placeholder="1000" className="input input-bordered w-full" />
                                  <p className="my-2 text-red-500 text-xs">{validation.weight && validation.weight}</p>
                                </div>
                                <div className="mb-2">
                                  <div className="label">
                                    <span className="label-text">Year</span>
                                  </div>
                                  <input type="number" defaultValue={product.year} min={0} onChange={(e) => setYear(e.target.value)} placeholder="2020" className="input input-bordered w-full" />
                                  <p className="my-2 text-red-500 text-xs">{validation.year && validation.year}</p>
                                </div>
                              </div>
                              <div className="mb-2">
                                <div className="label">
                                  <span className="label-text">Description</span>
                                </div>
                                <textarea defaultValue={product.description} onChange={(e) => setDescription(e.target.value)} placeholder="Product descripion...." className="input input-bordered w-full" />
                                <p className="my-2 text-red-500 text-xs">{validation.description && validation.description}</p>
                              </div>
                              <div className="flex items-center gap-x-3 mt-3">
                                <button className="btn btn-success text-white w-1/2" type="button" onClick={(e) => handleEditProduct(e, product.id)}>
                                  Save
                                </button>
                                <button type="button" className="btn bg-slate-300 w-1/2" onClick={() => document.getElementById(`editProduct${product.id}`).close()}>
                                  Close
                                </button>
                              </div>
                            </div>
                          </div>
                        </dialog>
                        <button
                          className="btn btn-xs btn-error text-white"
                          onClick={(e) => {
                            e.preventDefault();
                            if (confirm("Delete product?")) {
                              handleDeleteProduct(product.id);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-10">
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
