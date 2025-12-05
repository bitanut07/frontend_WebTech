import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productApi from '../../../services/product';
import Swal from 'sweetalert2';

export const useProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);
    const [product, setProduct] = useState({
        name: '',
        nameDetail: '',
        description: '',
        productType: '',
        price: '',
        stock: '',
        discount: '',
        status: 'active',
        isFeature: false,
        color: '',
        version: '',
        thumbnail: null,
        listImage: [],
        specifications: {},
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imagePreview, setImagePreview] = useState({
        thumbnail: null,
        listImage: [],
    });
    const [viewerImage, setViewerImage] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!isEditing) return;

            setLoading(true);
            try {
                const response = await productApi.products.getById(id);
                if (response.status === 200) {
                    const productData = response.data;

                    // Extract specifications based on product type
                    const specifications = {};
                    const nonSpecFields = [
                        'name',
                        'nameDetail',
                        'description',
                        'productType',
                        'price',
                        'quantity',
                        'discount',
                        'status',
                        'isFeature',
                        'thumbnail',
                        'listImage',
                        'color',
                        'version',
                        '_id',
                        'createdAt',
                        'updatedAt',
                    ];

                    // Get all fields that aren't in nonSpecFields as specifications
                    Object.keys(productData).forEach((key) => {
                        if (!nonSpecFields.includes(key) && productData[key] !== null) {
                            specifications[key] = productData[key];
                        }
                    });

                    // Format the product data
                    setProduct({
                        name: productData.name || '',
                        nameDetail: productData.nameDetail || '',
                        description: productData.description || '',
                        productType: productData.productType || '',
                        price: productData.price || 0,
                        stock: productData.quantity || 0,
                        discount: productData.discount || 0,
                        status: productData.status || 'active',
                        isFeature: Boolean(productData.isFeature),
                        color: Array.isArray(productData.color)
                            ? productData.color.join(', ')
                            : productData.color || '',
                        version: productData.version || '',
                        thumbnail: productData.thumbnail || null,
                        listImage: productData.listImage || [],
                        specifications: specifications,
                    });

                    // Set image previews
                    setImagePreview({
                        thumbnail: productData.thumbnail || null,
                        listImage: productData.listImage || [],
                    });
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Không thể tải thông tin sản phẩm');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, isEditing]);

    const validateForm = () => {
        if (!product.name?.trim()) {
            setError('Vui lòng nhập tên sản phẩm');
            return false;
        }
        if (!product.nameDetail?.trim()) {
            setError('Vui lòng nhập tên chi tiết sản phẩm');
            return false;
        }
        if (!product.description?.trim()) {
            setError('Vui lòng nhập mô tả sản phẩm');
            return false;
        }
        if (!product.productType) {
            setError('Vui lòng chọn loại sản phẩm');
            return false;
        }
        if (!product.price || isNaN(Number(product.price))) {
            setError('Vui lòng nhập giá sản phẩm hợp lệ');
            return false;
        }
        // Chỉ kiểm tra ảnh khi tạo mới sản phẩm
        if (!isEditing) {
            if (!product.thumbnail) {
                setError('Vui lòng chọn ảnh chính cho sản phẩm');
                return false;
            }
            if (!product.listImage?.length) {
                setError('Vui lòng chọn ít nhất một ảnh phụ cho sản phẩm');
                return false;
            }
        }
        return true;
    };

    const validateSpecificationsByType = (productType, productData) => {
        const requiredFields = {
            Laptop: ['ram', 'screen_size', 'CPU', 'hard_drive'],
            TV: ['tv_size', 'resolution_type', 'CPU', 'screen_type'],
            Phone: ['internal_storage', 'RAM_capacity', 'screen_size', 'operating_system'],
            Watch: ['screen', 'brand'],
            Camera: ['brand', 'camera_type', 'camera_sensor', 'camera_resolution'],
            PC: ['PC_type', 'CPU_type', 'RAM_capacity'],
            Monitor: ['Monitor_size', 'resolution'],
        };
        const required = requiredFields[productType];
        if (!required) return true;

        // Kiểm tra từng field xem có tồn tại và có giá trị không
        const missingFields = [];
        for (const field of required) {
            const value = productData.specifications[field];
            if (!value || value.trim() === '') {
                missingFields.push(field);
            }
        }

        // Log kết quả kiểm tra
        console.log('Missing fields:', missingFields);

        if (missingFields.length > 0) {
            throw new Error(`Vui lòng điền đầy đủ các trường bắt buộc: ${missingFields.join(', ')}`);
        }

        return true;
    };
    const prepareFormData = () => {
        const formData = new FormData();

        // Append all the basic fields
        if (product.thumbnail instanceof File) {
            formData.append('thumbnail', product.thumbnail, product.thumbnail.name);
        }

        if (Array.isArray(product.listImage)) {
            product.listImage.forEach((image) => {
                if (image instanceof File) {
                    formData.append('listImage', image, image.name);
                }
            });
        }

        // Append other fields
        formData.append('name', product.name.trim());
        formData.append('nameDetail', product.nameDetail.trim());
        formData.append('description', product.description.trim());
        formData.append('productType', product.productType);
        formData.append('price', product.price.toString());
        formData.append('quantity', product.stock.toString());
        formData.append('status', product.status);
        formData.append('discount', (product.discount || '0').toString());
        formData.append('isFeature', product.isFeature.toString());
        formData.append('version', product.version || '');

        // Add specifications
        if (product.specifications) {
            Object.entries(product.specifications).forEach(([key, value]) => {
                if (value) {
                    formData.append(key, value.toString());
                }
            });
        }

        // Handle colors
        if (product.color) {
            const colors = Array.isArray(product.color) ? product.color : product.color.split(',').map((c) => c.trim());
            formData.append('color', JSON.stringify(colors));
        }

        // Debug log - proper way to inspect FormData contents
        console.log('FormData contents:');
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
        }

        return formData;
    };
    // Và sửa lại handleSubmit
    const handleSubmit = async (e) => {
        e?.preventDefault();
        setError(null);

        try {
            if (!validateForm()) return;
            // Validate specifications một lần duy nhất
            try {
                validateSpecificationsByType(product.productType, product);
            } catch (specError) {
                setError(specError.message);
                return;
            }

            setLoading(true);
            const formData = prepareFormData();
            console.log('formData: ', formData);
            const response = isEditing
                ? await productApi.products.update(id, formData)
                : await productApi.products.create(formData);

            if (response?.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: isEditing ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!',
                });
                navigate('/admin/products');
            }
        } catch (err) {
            const errorMessage = err.message || err.response?.data?.message || 'Có lỗi xảy ra khi xử lý sản phẩm';
            setError(errorMessage);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };
    const handleImageUpload = (e, type) => {
        const files = Array.from(e.target.files).filter((file) => file.type.startsWith('image/'));
        if (!files.length) {
            setError('Vui lòng chọn file hình ảnh hợp lệ');
            return;
        }
        if (type === 'thumbnail') {
            const file = files[0];
            console.log('Setting thumbnail:', file); // Debug log
            setProduct((prev) => ({
                ...prev,
                thumbnail: file,
            }));
            setImagePreview((prev) => ({
                ...prev,
                thumbnail: URL.createObjectURL(file),
            }));
        } else {
            const newFiles = [...files];
            console.log('Setting listImage:', newFiles); // Debug log
            setProduct((prev) => ({
                ...prev,
                listImage: newFiles,
            }));
            setImagePreview((prev) => ({
                ...prev,
                listImage: newFiles.map((file) => URL.createObjectURL(file)),
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;

        if (name === 'isFeature') {
            processedValue = value === 'true';
        } else if (['price', 'stock', 'discount'].includes(name)) {
            processedValue = value === '' ? '' : Number(value);
        }

        setProduct((prev) => ({
            ...prev,
            [name]: processedValue,
        }));
    };

    const handleRemoveImage = (type, index) => {
        if (type === 'thumbnail') {
            if (imagePreview.thumbnail?.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview.thumbnail);
            }
            setProduct((prev) => ({ ...prev, thumbnail: null }));
            setImagePreview((prev) => ({ ...prev, thumbnail: null }));
        } else {
            // Xử lý xóa ảnh từ listImage
            const newListImage = [...product.listImage];
            const newPreviewList = [...imagePreview.listImage];

            // Revoke URL nếu cần
            if (newPreviewList[index]?.startsWith('blob:')) {
                URL.revokeObjectURL(newPreviewList[index]);
            }

            newListImage.splice(index, 1);
            newPreviewList.splice(index, 1);

            setProduct((prev) => ({
                ...prev,
                listImage: newListImage,
            }));
            setImagePreview((prev) => ({
                ...prev,
                listImage: newPreviewList,
            }));
        }
    };

    const handleSpecChange = (e) => {
        if (e.target.type === 'specification') {
            const { name, value } = e.target;
            console.log('Updating specification:', name, value);
            setProduct((prev) => {
                const newProduct = {
                    ...prev,
                    specifications: {
                        ...prev.specifications,
                        [name]: value,
                    },
                };
                console.log('New product state:', newProduct);
                return newProduct;
            });
        }
    };

    // Cleanup effect
    useEffect(() => {
        return () => {
            if (imagePreview.thumbnail?.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview.thumbnail);
            }
            imagePreview.listImage.forEach((url) => {
                if (url?.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, []);

    return {
        states: {
            product,
            loading,
            error,
            imagePreview,
            viewerImage,
            isEditing,
        },
        handlers: {
            handleChange,
            handleImageUpload,
            handleSpecChange,
            handleRemoveImage,
            handleImageClick: setViewerImage,
            handleCloseViewer: () => setViewerImage(null),
            handleSubmit,
        },
    };
};

export default useProductForm;
