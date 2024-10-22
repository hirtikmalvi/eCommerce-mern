import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  useGetProductByIdQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/Loader";
import AlertPopUp from "../../components/AlertPopUp";

const ProductUpdate = () => {
  const params = useParams();
  const {
    data: productData,
    isLoading,
    isError,
    error,
  } = useGetProductByIdQuery(params.id);

  const [image, setImage] = useState("Hirtik");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);

  const navigate = useNavigate();
  const { data: categories } = useFetchCategoriesQuery();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData?.name);
      setDescription(productData.description || "");
      setPrice(productData.price || "");
      setCategory(productData.category || "");
      setQuantity(productData.quantity || "");
      setBrand(productData.brand || "");
      setImage(productData.image || "");
      setStock(productData.countInStock || 0);
    }
  }, [productData]);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      // console.log("Product Data:", productData);

      const { data } = await updateProduct({
        productId: params.id,
        formData,
      });
      // console.log("DATA: ", data);
      if (data.error) {
        // toast.error("Product update failed. Try Again.");
        toast.error(data.error);
      } else {
        toast.success(`${data.name} is updated`);
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product update failed. Try Again.");
    }
  };

  const handleDeleteProduct = async () => {
    try {
      let valid = window.confirm("Are you sure?");
      if (valid) {
        const { data } = await deleteProduct(params.id);
        toast.success(`${data.name} has been deleted.`, {
          autoClose: 1500,
        });
        navigate("/admin/allproductslist");
      } else {
        return;
      }
    } catch (error) {
      toast.error("Delete Failed. Try Again...", {
        autoClose: 1500,
      });
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-2xl px-4 py-6 mx-auto lg:py-10">
        <AdminMenu />
        <h2 className="mb-7 text-xl font-semibold text-gray-900">
          Update Product
        </h2>

        <form onSubmit={handleUpdateSubmit}>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6">
                <div className="w-full sm:col-span-1">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Type product name"
                  />
                </div>

                <div className="w-full sm:col-span-1">
                  <label
                    htmlFor="brand"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Brand
                  </label>
                  <input
                    type="text"
                    id="brand"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Product brand"
                  />
                </div>

                <div className="w-full">
                  <label
                    htmlFor="price"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="₹299"
                  />
                </div>

                <div className="w-full">
                  <label
                    htmlFor="quantity"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Quantity
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter quantity"
                  />
                </div>

                <div className="w-full">
                  <label
                    htmlFor="stock"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Count in Stock
                  </label>
                  <input
                    type="number"
                    id="stock"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="Enter stock count"
                  />
                </div>

                <div className="w-full">
                  <label
                    htmlFor="category"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows="2"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write product description"
                  ></textarea>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Upload Image
                  </label>
                  <label className="block text-center border border-gray-300 rounded-lg p-8 cursor-pointer">
                    {image ? image.name : "Click to upload"}
                    <input
                      type="file"
                      name="image"
                      className={`${!image ? "hidden" : ""}`}
                      onChange={uploadFileHandler}
                      accept="image/*"
                    />
                  </label>
                </div>
                {image && (
                  <div className="flex text-center mb-4">
                    <img
                      src={image}
                      alt="product"
                      className="block mx-auto mb-2 max-h-[200px] rounded-lg border border-gray-300"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  className="text-white bg-pink-600 hover:bg-pink-700 rounded-lg text-sm px-5 py-2.5"
                >
                  Update Product
                </button>
                <button
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-700 rounded-lg text-sm px-5 py-2.5"
                  onClick={handleDeleteProduct}
                >
                  Delete Product
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProductUpdate;
