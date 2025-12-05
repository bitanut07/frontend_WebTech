//import { get } from 'mongoose';
import axiosInstance from './api';
import Swal from 'sweetalert2';
//import { getProductByCategory } from '../../../backend/controllers/productController';

const handleApiError = (error, customMessage) => {
    const errorMessage = error.response?.data?.message || customMessage;
    console.error(customMessage, error);
    throw new Error(errorMessage);
};

const productApi = {
    // Categories APIs
    categories: {
        getAll: async () => {
            try {
                const response = await axiosInstance.get('/category');
                return response.data;
            } catch (error) {
                handleApiError(error, 'Error fetching categories');
            }
        },

        create: async (categoryData) => {
            try {
                const response = await axiosInstance.post('/category', categoryData);
                if (response.data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công',
                        text: 'Tạo danh mục thành công',
                    });
                }
                return response.data;
            } catch (error) {
                handleApiError(error, 'Error creating category');
            }
        },

        update: async (id, categoryData) => {
            try {
                const response = await axiosInstance.put(`/category/${id}`, categoryData);
                if (response.data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công',
                        text: 'Cập nhật danh mục thành công',
                    });
                }
                return response.data;
            } catch (error) {
                handleApiError(error, 'Error updating category');
            }
        },

        delete: async (id) => {
            try {
                const response = await axiosInstance.delete(`/category/${id}`);
                if (response.data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công',
                        text: 'Xóa danh mục thành công',
                    });
                }
                return response.data;
            } catch (error) {
                handleApiError(error, 'Error deleting category');
            }
        },
    },

    // Products APIs
    products: {
        getAll: async (params = {}) => {
            try {
                const {
                    page = 1,
                    per_page = 10,
                    productType,
                    sortBy = 'avgStar',
                    order = 'asc',
                    search,
                    ...filters
                } = params;

                const queryParams = new URLSearchParams({
                    page,
                    per_page,
                    ...(productType && { productType }),
                    ...(search && { search }),
                    sortBy,
                    order,
                    ...filters,
                }).toString();

                const response = await axiosInstance.get(`/product?${queryParams}`);
                
                // Handle response format
                if (response.data && response.data.success !== undefined) {
                    return response.data;
                }
                
                // Fallback for old format
                return {
                    success: true,
                    products: response.data?.products || [],
                    page: response.data?.page || page,
                    per_page: response.data?.per_page || per_page,
                    totalProducts: response.data?.totalProducts || 0,
                    totalPages: response.data?.totalPages || 0,
                };
            } catch (error) {
                console.error('Error in getAll products:', error);
                return {
                    success: false,
                    products: [],
                    page: 1,
                    per_page: 10,
                    totalProducts: 0,
                    totalPages: 0,
                };
            }
        },

        getById: async (id) => {
            try {
                if (!id) {
                    throw new Error('Product ID is required');
                }
                
                const response = await axiosInstance.get(`/product/${id}`);
                
                // Handle both response formats
                if (response.data && response.data.success !== undefined) {
                    return response.data.product || response.data;
                }
                
                return response.data;
            } catch (error) {
                console.error('Error in getById:', error);
                return {
                    success: false,
                    product: null,
                    message: error.response?.data?.message || 'Product not found'
                };
            }
        },

        getByCategory: async (category) => {
            try {
                if (!category) {
                    throw new Error('Category is required');
                }
                
                const response = await axiosInstance.get(`/product/product-category/${category}`);
                
                // Handle response format
                if (response.data && response.data.success !== undefined) {
                    return response.data.products || [];
                }
                
                // Fallback for array response
                return Array.isArray(response.data) ? response.data : [];
            } catch (error) {
                console.error('Error in getByCategory:', error);
                return [];
            }
        },

        getFeatured: async (limit = 5) => {
            try {
                const response = await axiosInstance.get(`/product/feature-product`, {
                    params: { limit }
                });
                
                // Đảm bảo response có đúng format
                if (response.data && response.data.success) {
                    return response.data;
                }
                
                // Fallback nếu response không đúng format
                return {
                    success: true,
                    featuredProducts: response.data?.featuredProducts || response.data || []
                };
            } catch (error) {
                console.error('Error fetching featured products:', error);
                
                // Trả về empty array thay vì throw error để không crash app
                return {
                    success: false,
                    featuredProducts: [],
                    message: error.response?.data?.message || 'Không thể tải sản phẩm nổi bật'
                };
            }
        },
        create: async (formData) => {
            try {
                const response = await axiosInstance.post('/product', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    transformRequest: [(data) => data],
                    maxBodyLength: Infinity,
                    maxContentLength: Infinity,
                    timeout: 60000,
                });
                return response.data;
            } catch (error) {
                console.error('API Error:', {
                    message: error.response?.data?.message,
                    formDataContent: Array.from(formData.entries()).reduce((acc, [key, value]) => {
                        acc[key] = value instanceof File ? `File: ${value.name} (${value.type})` : value;
                        return acc;
                    }, {}),
                });
                throw error;
            }
        },
        update: async (id, productData) => {
            try {
                const formData = new FormData();

                Object.keys(productData).forEach((key) => {
                    if (key !== 'thumbnail' && key !== 'listImage') {
                        if (typeof productData[key] === 'object') {
                            formData.append(key, JSON.stringify(productData[key]));
                        } else {
                            formData.append(key, productData[key]);
                        }
                    }
                });

                if (productData.thumbnail) {
                    formData.append('thumbnail', productData.thumbnail);
                }
                if (productData.listImage) {
                    productData.listImage.forEach((image) => {
                        formData.append('listImage', image);
                    });
                }
                console.log(formData);
                const response = await axiosInstance.put(`/product/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    timeout: 60000, // 60 giây cho upload file
                });

                if (response.data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công',
                        text: 'Cập nhật sản phẩm thành công',
                    });
                }
                return response.data;
            } catch (error) {
                handleApiError(error, 'Error updating product');
            }
        },

        delete: async (id) => {
            try {
                const response = await axiosInstance.delete(`/product/${id}`);
                if (response.data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công',
                        text: 'Xóa sản phẩm thành công',
                    });
                }
                return response.data;
            } catch (error) {
                handleApiError(error, 'Error deleting product');
            }
        },

        bulkDelete: async (ids) => {
            try {
                const response = await axiosInstance.post('/product/bulk-delete', { ids });
                if (response.data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công',
                        text: 'Xóa sản phẩm thành công',
                    });
                }
                return response.data;
            } catch (error) {
                handleApiError(error, 'Error bulk deleting products');
            }
        },

        updateStatus: async (id, status) => {
            try {
                const response = await axiosInstance.patch(`/product/${id}/status`, { status });
                if (response.data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công',
                        text: 'Cập nhật trạng thái thành công',
                    });
                }
                return response.data;
            } catch (error) {
                handleApiError(error, 'Error updating product status');
            }
        },

        updateQuantity: async (id, quantity) => {
            try {
                const response = await axiosInstance.patch(`/product/${id}/quantity`, { quantity });
                if (response.data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công',
                        text: 'Cập nhật số lượng thành công',
                    });
                }
                return response.data;
            } catch (error) {
                handleApiError(error, 'Error updating product quantity');
            }
        },

        rate: async (productId, ratingData) => {
            try {
                console.log("here");
                const response = await axiosInstance.put('/product/ratings', {
                    productId,
                    ...ratingData,
                });
                console.log(response);
                console.log(productId, ratingData);
                if (response.data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công',
                        text: 'Đánh giá sản phẩm thành công',
                    });
                }
                return response.data;
            } catch (error) {
                const errorMessage = error.response?.data?.mes || 'Không thể đánh giá sản phẩm';
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: errorMessage,
                });
                throw error;
            }
        },
        getProductsSimilar: async (productName, productType) => {
            try {
                // Remove size/version info for base name match
                const baseNamePattern = productName
                    .replace(/\d+(\.\d+)?\s*(inch|"|GB|TB|MHz|W)/gi, '') // Remove sizes/units
                    .replace(/\s+(Standard|Pro|Lite|Plus|Max)\b/gi, '') // Remove version names
                    .trim();

                const response = await axiosInstance.get(
                    `/product?name=${encodeURIComponent(baseNamePattern)}&productType=${productType}`,
                );

                // Filter products with same base name pattern
                const similarProducts = (response.data.products || []).filter(
                    (p) =>
                        p.productType === productType && p.name.toLowerCase().includes(baseNamePattern.toLowerCase()),
                );

                return {
                    success: true,
                    products: similarProducts || [],
                };
            } catch (error) {
                console.error('Error fetching similar products:', error);
                return {
                    success: false,
                    products: [],
                };
            }
        },
        getProductByCategory: async (category) => {
            try {
                if (!category) {
                    throw new Error('Category is required');
                }
                
                console.log(category);
                const response = await axiosInstance.get(`/product/product-category/${category}`);
                
                // Handle response format
                if (response.data && response.data.success !== undefined) {
                    return response.data.products || [];
                }
                
                // Fallback for array response
                return Array.isArray(response.data) ? response.data : [];
            } catch (error) {
                console.error('Error in getProductByCategory:', error);
                return [];
            }
        },
    },

    helpers: {
        buildFilterQuery: (productType, filters) => {
            const query = {};

            if (productType) {
                query.productType = productType;

                const filterMappings = {
                    laptop: {
                        brand: 'brand',
                        ram: 'ram',
                        CPU: 'CPU',
                        screen_size: 'screen_size',
                        hard_drive: 'hard_drive',
                        graphics_card: 'graphics_card',
                    },
                    phone: {
                        brand: 'brand',
                        internal_storage: 'internal_storage',
                        ram: 'RAM_capacity',
                        operating_system: 'operating_system',
                    },
                    tv: {
                        screen_size: 'screen_size',
                        resolution_type: 'resolution_type',
                        screen_type: 'screen_type',
                        processor: 'processor',
                    },
                    watch: {
                        brand: 'brand',
                        screen: 'screen',
                        compatibility: 'compatibility',
                    },
                    camera: {
                        brand: 'brand',
                        camera_type: 'camera_type',
                    },
                    pc: {
                        CPU_type: 'CPU_type',
                        RAM_capacity: 'RAM_capacity',
                    },
                    monitor: {
                        Monitor_size: 'Monitor_size',
                        resolution: 'resolution',
                    },
                };

                const mappings = filterMappings[productType.toLowerCase()];
                if (mappings) {
                    Object.entries(filters).forEach(([key, value]) => {
                        if (mappings[key]) {
                            query[mappings[key]] = { $regex: value, $options: 'i' };
                        }
                    });
                }
            }

            return query;
        },
    },
};

export default productApi;
