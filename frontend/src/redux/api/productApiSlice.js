import { apiSlice } from "../api/apiSlice";
import { PRODUCT_URL, UPLOAD_URL } from "../constants";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword, page }) => ({
        url: `${PRODUCT_URL}`,
        params: { keyword, page },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Product"],
    }),

    getProductById: builder.query({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),

    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),

    allProducts: builder.query({
      query: () => ({
        url: `${PRODUCT_URL}/allproducts`,
      }),
      providesTags: ["Product"],
    }),

    createProduct: builder.mutation({
      query: (productData) => ({
        url: `${PRODUCT_URL}`,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation({
      query: ({ productId, formData }) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Product"],
    }),

    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    getTopProducts: builder.query({
      query: () => ({
        url: `${PRODUCT_URL}/top`,
      }),
      invalidatesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),

    getNewProducts: builder.query({
      query: () => ({
        url: `${PRODUCT_URL}/new`,
      }),
      invalidatesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),

    getFilteredProducts: builder.query({
      query: ({ checked, radio, checkedBrands }) => ({
        url: `${PRODUCT_URL}/filtered-products`,
        method: "POST",
        body: { checked, radio, checkedBrands },
      }),
    }),
  }),
});

export const {
  useGetProductByIdQuery,
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
  useGetNewProductsQuery,
  useUploadProductImageMutation,
  useGetFilteredProductsQuery,
} = productApiSlice;
