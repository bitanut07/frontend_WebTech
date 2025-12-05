import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import productApi from '../../../services/product';
export const CATEGORIES = [
    { value: 'all', label: 'Tất cả sản phẩm' },
    { value: 'Laptop', label: 'Laptop' },
    { value: 'TV', label: 'TV' },
    { value: 'Phone', label: 'Điện thoại' },
    { value: 'Watch', label: 'Đồng hồ' },
    { value: 'Camera', label: 'Máy ảnh' },
    { value: 'PC', label: 'PC' },
    { value: 'Monitor', label: 'Màn hình' },
];

export const TABS = [
    { id: 'tất cả', label: 'Tất cả' },
    { id: 'còn hàng', label: 'Còn hàng' },
    { id: 'hết hàng', label: 'Hết hàng' },
    { id: 'đặt hàng', label: 'Đặt hàng' },
];
export const PRODUCTS_PER_PAGE = 10;
export const useProducts = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activeTab, setActiveTab] = useState('tất cả');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const normalizeStr = (str) => {
        if (!str) return '';
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]/g, '');
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = {
                ...(selectedCategory !== 'all' && { productType: selectedCategory }),
                ...(searchQuery && { search: searchQuery }),
            };

            if (searchQuery) {
                // Khi tìm kiếm, set per_page lớn để lấy tất cả sản phẩm
                params.per_page = 1000; // hoặc một số đủ lớn để chứa tất cả sản phẩm
                params.page = 1;
            } else {
                // Khi không tìm kiếm, sử dụng phân trang bình thường
                params.per_page = PRODUCTS_PER_PAGE;
                params.page = currentPage;
            }

            const response = await productApi.products.getAll(params);
            // Ensure products is always an array
            const productsData = Array.isArray(response?.products) ? response.products : [];

            if (searchQuery) {
                // Lọc theo tên sản phẩm (phòng trường hợp API không hỗ trợ tìm kiếm)
                const normalizedSearch = normalizeStr(searchQuery);
                const filtered = productsData.filter((product) =>
                    product && product.name && normalizeStr(product.name).includes(normalizedSearch),
                );
                setProducts(filtered);
                setTotalPages(1); // Không phân trang khi tìm kiếm
            } else {
                setProducts(productsData);
                setTotalPages(response?.totalPages || 0);
            }
        } catch (err) {
            setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    // Theo dõi thay đổi của searchQuery để fetch lại dữ liệu
    useEffect(() => {
        fetchProducts();
    }, [currentPage, selectedCategory, searchQuery]);

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const filteredProducts = useMemo(() => {
        // Ensure products is an array before filtering
        if (!Array.isArray(products)) {
            return [];
        }
        return products.filter((product) => {
            if (!product) return false;
            switch (activeTab) {
                case 'còn hàng':
                    return product.quantity > 0;
                case 'hết hàng':
                    return product.quantity === 0;
                case 'đặt hàng':
                    return product.status === 'Pending';
                default:
                    return true;
            }
        });
    }, [products, activeTab]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setSearchQuery('');
        setCurrentPage(1);
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                await productApi.products.delete(productId);
                fetchProducts();
            } catch (err) {
                setError('Không thể xóa sản phẩm');
            }
        }
    };

    const handleProductClick = (productId) => {
        navigate(`/admin/products/${productId}`);
    };

    const handleAddProduct = () => {
        navigate('/admin/products/add');
    };

    return {
        states: {
            products: filteredProducts,
            loading,
            error,
            currentPage,
            totalPages,
            activeTab,
            selectedCategory,
            searchQuery,
            isSearching: !!searchQuery,
        },
        actions: {
            setActiveTab,
            handlePageChange,
            handleCategoryChange,
            handleDeleteProduct,
            handleProductClick,
            handleAddProduct,
            fetchProducts,
            handleSearchChange,
        },
    };
};
