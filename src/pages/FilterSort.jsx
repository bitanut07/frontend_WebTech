import React, { useState, useEffect } from 'react';
import '../pages/Users/css/FilterSort.css';
import { useSearchParams } from 'react-router-dom';

function FilterSort({
    selectedCategory,
    selectFilterChild,
    setSelectFilterChild,
    filterParams,
    setFilterParams,
    activeSort,
    setActiveSort,
    onFilterChange,
}) {
    const [filterBrand, setFilterBrand] = useState('all');
    // State để quản lý trạng thái hiển thị của từng filter
    const [activeFilter, setActiveFilter] = useState(null);

    const categories = {
        Phone: {
            brand: [
                { name: 'Iphone', src: 'https://cellphones.com.vn/media/tmp/catalog/product/f/r/frame_59.png' },
                { name: 'Samsung', src: 'https://cellphones.com.vn/media/tmp/catalog/product/f/r/frame_60.png' },
                { name: 'Xiaomi', src: 'https://cellphones.com.vn/media/tmp/catalog/product/f/r/frame_61.png' },
                { name: 'OPPO', src: 'https://cellphones.com.vn/media/tmp/catalog/product/f/r/frame_62.png' },
                { name: 'realme', src: 'https://cellphones.com.vn/media/tmp/catalog/product/f/r/frame_63.png' },
                { name: 'Nokia', src: 'https://cellphones.com.vn/media/tmp/catalog/product/f/r/frame_37_1.png' },
                { name: 'OnePlus', src: 'https://cellphones.com.vn/media/tmp/catalog/product/f/r/frame_65.png' },
                { name: 'ASUS', src: 'https://cellphones.com.vn/media/tmp/catalog/product/f/r/frame_67.png' },
                { name: 'vivo', src: 'https://cellphones.com.vn/media/tmp/catalog/product/t/_/t_i_xu_ng_67_.png' },
                { name: 'Tecno', src: 'https://cellphones.com.vn/media/tmp/catalog/product/f/r/frame_69_1_.png' },
                {
                    name: 'Huawei',
                    src: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/wysiwyg/Icon/brand_logo/Huawei.png',
                },
            ],
            filter: [
                { name: 'RAM_capacity', child: ['4GB', '6GB', '8GB'] },
                { name: 'internal_storage', child: ['64GB', '128GB', '256GB', '512GB'] },
                { name: 'operating_system', child: ['Android', 'iOS'] },
                { name: 'screen_size', child: ['5.5 inch', '6.1 inch', '6.7 inch'] },
                { name: 'usage_demand', child: ['Chơi game', 'Livestream', 'Chụp hình đẹp'] },
            ],
        },
        Laptop: {
            brand: [
                {
                    name: 'Dell',
                    src: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/wysiwyg/Icon/brand_logo/Dell.png',
                },
                {
                    name: 'HP',
                    src: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/wysiwyg/Icon/brand_logo/HP.png',
                },
                {
                    name: 'ASUS',
                    src: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/wysiwyg/Icon/brand_logo/Asus.png',
                },
                {
                    name: 'Lenovo',
                    src: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/wysiwyg/Icon/brand_logo/Lenovo.png',
                },
                {
                    name: 'Apple',
                    src: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/wysiwyg/Icon/brand_logo/macbook.png',
                },
                {
                    name: 'MSI',
                    src: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/wysiwyg/Icon/brand_logo/MSI.png',
                },
                {
                    name: 'Acer',
                    src: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/wysiwyg/Icon/brand_logo/acer.png',
                },
            ],
            filter: [
                { name: 'ram', child: ['8GB', '16GB', '32GB'] },
                {
                    name: 'CPU',
                    child: ['Intel core i5', 'Intel core i7', 'Intel core i9', 'AMD Ryzen 5', 'AMD Ryzen 7'],
                },
                { name: 'hard_drive', child: ['256GB SSD', '512GB SSD', '1TB HDD'] },
                { name: 'graphics_card', child: ['Intel', 'GPU', 'RTX'] },
                { name: 'screen_size', child: ['13.6 inch', '15.6 inch', '17 inch', '16 inch'] },
            ],
        },
        Watch: {
            brand: [
                {
                    name: 'Garmin',
                    src: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/wysiwyg/Icon/brand_logo/garmin.png',
                },
                {
                    name: 'Apple',
                    src: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/wysiwyg/Icon/brand_logo/Apple_watch.png',
                },
                { name: 'Samsung', src: 'https://cellphones.com.vn/media/tmp/catalog/product/f/r/frame_60.png' },
                {
                    name: 'Kieslect',
                    src: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/wysiwyg/Icon/brand_logo/Kieslect.png',
                },
            ],
            filter: [
                { name: 'screen', child: ['AMOLED', 'LCD', 'E-ink'] },
                { name: 'compatibility', child: ['iOS', 'Android'] },
                { name: 'health_features', child: ['Đo nhịp tim', 'Đo SpO2', 'Theo dõi giấc ngủ'] },
                { name: 'strap_material', child: ['Silicone', 'Kim loại', 'Da'] },
                { name: 'battery_life', child: ['1 ngày', '7 ngày', '14 ngày'] },
            ],
        },
        Camera: {
            brand: [
                { name: 'Canon', src: 'https://rubee.com.vn/wp-content/uploads/2021/06/logo-canon.png' },
                { name: 'Nikon', src: 'https://logovina.com/wp-content/uploads/2015/07/logo-nikon.jpg' },
                { name: 'Sony', src: 'https://banner2.cleanpng.com/20180430/peq/avdioxxb0.webp' },
            ],
            filter: [
                { name: 'camera_type', child: ['DSLR', 'Mirrorless', 'Compact'] },
                { name: 'camera_resolution', child: ['6048 x 4024', '6000 x 4000', '8368 x 5584', '4608 x 3456'] },
                { name: 'camera_sensor', child: ['Full-frame', 'APS-C', 'Micro Four Thirds'] },
            ],
        },
        PC: {
            brand: [
                {
                    name: 'CPS',
                    src: 'https://www.pngfind.com/pngs/m/527-5274018_cps-logo-consumer-portfolio-services-logo-hd-png.png',
                },
                {
                    name: 'ASUS',
                    src: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/wysiwyg/Icon/brand_logo/Asus.png',
                },
            ],
            filter: [
                { name: 'number_of_RAM_slots', child: ['2 slots', '4 slots'] },
                { name: 'CPU_type', child: ['Intel', 'AMD'] },
                { name: 'RAM_capacity', child: ['8GB', '16GB', '32GB'] },
                { name: 'graphics_card', child: ['Integrated', 'Dedicated'] },
                { name: 'hard_drive', child: ['SSD', 'HDD'] },
            ],
        },
        Monitor: {
            brand: [
                { name: 'Samsung', src: 'https://cellphones.com.vn/media/tmp/catalog/product/f/r/frame_60.png' },
                {
                    name: 'LG',
                    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/LG_logo_%282014%29.svg/2560px-LG_logo_%282014%29.svg.png',
                },
                {
                    name: 'Xiaomi',
                    src: 'https://cellphones.com.vn/media/tmp/catalog/product/f/r/frame_61.png',
                },
                {
                    name: 'Dell',
                    src: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/wysiwyg/Icon/brand_logo/Dell.png',
                },
                {
                    name: 'Asus',
                    src: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:50/q:30/plain/https://cellphones.com.vn/media/wysiwyg/Icon/brand_logo/Asus.png',
                },
                {
                    name: 'ViewSonic',
                    src: 'https://www.cdnlogo.com/logos/v/57/viewsonic.svg',
                },
            ],
            filter: [
                { name: 'Monitor_size', child: ['24 inches', '27 inches', '32 inches'] },
                { name: 'refresh_rate', child: ['60Hz', '144Hz', '240Hz'] },
                { name: 'screen_type', child: ['IPS', 'VA', 'TN'] },
            ],
        },
        TV: {
            brand: [
                { name: 'Samsung', src: 'https://cellphones.com.vn/media/tmp/catalog/product/f/r/frame_60.png' },
                {
                    name: 'LG',
                    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/LG_logo_%282014%29.svg/2560px-LG_logo_%282014%29.svg.png',
                },
                {
                    name: 'Sony',
                    src: 'https://banner2.cleanpng.com/20180430/peq/avdioxxb0.webp',
                },
                {
                    name: 'TCL',
                    src: 'https://w7.pngwing.com/pngs/584/682/png-transparent-tcl-hd-logo.png',
                },
            ],
            filter: [
                { name: 'screen_size', child: ['43 inch', '58 inch', '75 inch', '65 inch'] },
                { name: 'resolution', child: ['HD', '8K', '4K'] },
                { name: 'screen_type', child: ['QLED', 'OLED', 'LED'] },
            ],
        },
    };

    // Biến ảo để hiển thị tất cả filter
    const allFilters = {
        name: 'filterAll',
        filters: [],
    };

    const handleBrandClick = (brand) => {
        setFilterBrand(brand); // Cập nhật thương hiệu đã chọn
        onFilterChange({ category: selectedCategory, brand }); // Gửi callback với danh mục và thương hiệu đã chọn
    };

    const brands = categories[selectedCategory]?.brand || [];

    const handleFilterClick = (filter) => {
        // Nếu filter đã được chọn thì hủy chọn, ngược lại chọn filter đó
        setActiveFilter(activeFilter === filter.name ? null : filter.name);
    };

    const handleActiveSort = (sort) => {
        // Nếu click vào sort đang active thì set về null
        const newSort = activeSort === sort ? null : sort;
        setActiveSort(newSort);

        if (newSort === null) {
            // Nếu hủy sort thì xóa params sortBy và order
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('sortBy');
            newParams.delete('order');
            setSearchParams(newParams);
        }
    };

    const [searchParams, setSearchParams] = useSearchParams();

    // Hàm cập nhật query string
    const handleFilterChange = (filterName, filterValue) => {
        console.log(filterParams);
        const newParams = new URLSearchParams(searchParams);
        if (filterValue === 'all') {
            while (newParams.size > 0) {
                newParams.delete(newParams.keys().next().value);
            }
        } else {
            filterName.forEach((name, index) => {
                if (name === 'brand') {
                    newParams.set(name, filterValue[index]);
                } else if (name === 'sortBy') {
                    newParams.set(name, filterValue[index]);
                    newParams.set('order', filterValue[index + 1]);
                }
            });
            filterParams.forEach((param) => {
                newParams.set(param.filter, param.value.join(','));
            });
        }

        setSearchParams(newParams);
    };

    useEffect(() => {
        const newParams = new URLSearchParams(searchParams);

        // Xóa tất cả các param hiện có liên quan đến filter
        Array.from(newParams.keys()).forEach((key) => {
            if (key !== 'sortBy' && key !== 'order') {
                // Giữ lại các param không liên quan đến filter nếu cần
                newParams.delete(key);
            }
        });

        // Thêm lại các param từ filterParams
        filterParams.forEach((param) => {
            if (param.value.length > 0) {
                newParams.set(param.filter, param.value.join(','));
            }
        });

        // Cập nhật URL chỉ khi có thay đổi
        const newUrl = newParams.toString();
        const currentUrl = searchParams.toString();
        if (newUrl !== currentUrl) {
            setSearchParams(newParams);
        }
    }, [filterParams]);

    //Hàm cập nhật trạng thái của child filter
    const handleFilterChildClick = (child) => {
        if (selectFilterChild.includes(child)) {
            setSelectFilterChild(selectFilterChild.filter((item) => item !== child));
        } else {
            setSelectFilterChild([...selectFilterChild, child]);
        }
    };

    const handleFilterParams = (params) => {
        if (filterParams.length === 0) {
            setFilterParams([params]);
        } else {
            let updatedParams = [...filterParams];
            let check = false;
            updatedParams = updatedParams
                .map((param) => {
                    if (param.filter === params.filter) {
                        if (param.value.includes(params.value[0])) {
                            const newValue = param.value.filter((item) => item !== params.value[0]);
                            check = true;
                            if (newValue.length === 0) {
                                return null; // Mark for removal
                            }
                            return { ...param, value: newValue };
                        } else {
                            check = true;
                            return { ...param, value: [...param.value, params.value[0]] };
                        }
                    }
                    return param;
                })
                .filter(Boolean); // Remove null items

            if (!check) {
                updatedParams.push(params);
            }

            setFilterParams(updatedParams);
        }
    };

    useEffect(() => {
        // Hàm kiểm tra nếu click ra ngoài filter
        const handleClickOutside = (event) => {
            if (activeFilter && !event.target.closest('.filter-wrapper')) {
                setActiveFilter(null); // Đóng filter khi click ra ngoài
            }
        };

        // Thêm sự kiện khi component mount
        document.addEventListener('click', handleClickOutside);

        // Dọn dẹp khi component unmount
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [activeFilter]);

    const filterNames = {
        RAM: 'RAM',
        ram: 'RAM',
        RAM_capacity: 'Dung lượng RAM',
        internal_storage: 'Bộ nhớ trong',
        operating_system: 'Hệ điều hành',
        screen_size: 'Kích thước màn hình',
        Screen_size: 'Kích thước màn hình',
        Monitor_size: 'Kích thước màn hình',
        screen: 'Kích thước màn hình',
        usage_demand: 'Nhu cầu sử dụng',
        CPU: 'CPU',
        CPU_type: 'CPU',
        hard_drive: 'Ổ cứng',
        graphics_card: 'Card đồ họa',
        compatibility: 'Tương thích',
        health_features: 'Tính năng sức khỏe',
        strap_material: 'Chất liệu dây',
        battery_life: 'Thời lượng pin',
        camera_type: 'Loại camera',
        camera_resolution: 'Độ phân giải',
        resolution: 'Độ phân giải',
        camera_sensor: 'Cảm biến',
        refresh_rate: 'Tần số làm mới',
        screen_type: 'Loại màn hình',
        Screen_type: 'Loại màn hình',
        processor: 'Bộ xử lý',
        number_of_RAM_slots: 'Số khe RAM',
    };
    const getFilterName = (name) => filterNames[name] || name;

    return (
        <>
            {' '}
            {selectedCategory !== 'all' && (
                <div className="block-filter-sort">
                    {/* Thương hiệu */}
                    <div className="block-filter-brand">
                        <div className="brands-content">
                            <div className="brands-title">
                                <h2 className="title-brand">Thương hiệu</h2>
                            </div>
                            <div className="brands-list">
                                {brands.map((brand) => (
                                    <a
                                        key={brand.name}
                                        className={`list-brand__item type-overflow button__link ${
                                            filterBrand === brand.name ? 'active' : ''
                                        }`}
                                        onClick={() =>
                                            handleBrandClick(brand.name) || handleFilterChange(['brand'], [brand.name])
                                        }
                                    >
                                        <img
                                            src={brand.src}
                                            alt={brand.name}
                                            loading="lazy"
                                            className="filter-brand__img"
                                        />
                                        <span></span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="block-filter-sort">
                        <div className="filter-sort__title">Chọn theo tiêu chí</div>
                        <div className="filter-module-container bannerTopHead">
                            <div id="filterModule" class>
                                <div class="filter-sort__list-filter">
                                    <div class="filter-wrapper">
                                        <button
                                            class="btn-filter button__filter-parent"
                                            onClick={() => handleFilterClick('all') || handleFilterChange('all', 'all')}
                                        >
                                            ALL
                                        </button>
                                    </div>{' '}
                                    {categories[selectedCategory]?.filter.map((filter) => (
                                        <div className="filter-wrapper outside" key={filter.name}>
                                            <button
                                                className={`btn-filter button__filter-parent ${
                                                    activeFilter === filter.name ? 'active' : ''
                                                }`}
                                                onClick={() => handleFilterClick(filter)}
                                            >
                                                {getFilterName(filter.name)}
                                                <div className="icon">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 448 512"
                                                        width="10"
                                                        height="10"
                                                    >
                                                        <path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"></path>
                                                    </svg>
                                                </div>
                                            </button>
                                            {activeFilter === filter.name && (
                                                // Hiển thị child nếu filter đang được chọn
                                                <div className="list-filter-child active">
                                                    <ul>
                                                        {filter.child.map((child, index) => (
                                                            <li key={index}>
                                                                <button
                                                                    className={`btn-filter btn-filter-item button__filter-children ${
                                                                        selectFilterChild.includes(child)
                                                                            ? 'active'
                                                                            : ''
                                                                    }`}
                                                                    onClick={() => {
                                                                        handleFilterChildClick(child);
                                                                        handleFilterParams({
                                                                            filter: filter.name,
                                                                            value: [child],
                                                                        });
                                                                    }}
                                                                >
                                                                    {child}
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="block-filter-sort">
                        <div className="filter-sort__title">Sắp xếp theo</div>

                        <div class="sort-wrapper">
                            <div class="filter-sort__list-filter">
                                <a
                                    className={`btn-filter button__sort ${activeSort === 'price desc' ? 'active' : ''}`}
                                    onClick={() => {
                                        handleActiveSort('price desc');
                                        // Chỉ gọi handleFilterChange nếu đang kích hoạt sort mới
                                        if (activeSort !== 'price desc') {
                                            handleFilterChange(['sortBy', 'order'], ['price', 'desc']);
                                        }
                                    }}
                                >
                                    <div class="icon">
                                        <svg height="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                            <path d="M416 288h-95.1c-17.67 0-32 14.33-32 32s14.33 32 32 32H416c17.67 0 32-14.33 32-32S433.7 288 416 288zM544 32h-223.1c-17.67 0-32 14.33-32 32s14.33 32 32 32H544c17.67 0 32-14.33 32-32S561.7 32 544 32zM352 416h-32c-17.67 0-32 14.33-32 32s14.33 32 32 32h32c17.67 0 31.1-14.33 31.1-32S369.7 416 352 416zM480 160h-159.1c-17.67 0-32 14.33-32 32s14.33 32 32 32H480c17.67 0 32-14.33 32-32S497.7 160 480 160zM192.4 330.7L160 366.1V64.03C160 46.33 145.7 32 128 32S96 46.33 96 64.03v302L63.6 330.7c-6.312-6.883-14.94-10.38-23.61-10.38c-7.719 0-15.47 2.781-21.61 8.414c-13.03 11.95-13.9 32.22-1.969 45.27l87.1 96.09c12.12 13.26 35.06 13.26 47.19 0l87.1-96.09c11.94-13.05 11.06-33.31-1.969-45.27C224.6 316.8 204.4 317.7 192.4 330.7z"></path>
                                        </svg>
                                    </div>
                                    Giá Cao - Thấp
                                </a>
                                <a
                                    className={`btn-filter button__sort ${activeSort === 'price asc' ? 'active' : ''}`}
                                    onClick={() => {
                                        handleActiveSort('price asc');
                                        if (activeSort !== 'price asc') {
                                            handleFilterChange(['sortBy', 'order'], ['price', 'asc']);
                                        }
                                    }}
                                >
                                    <div class="icon">
                                        <svg height="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                            <path d="M320 224H416c17.67 0 32-14.33 32-32s-14.33-32-32-32h-95.1c-17.67 0-32 14.33-32 32S302.3 224 320 224zM320 352H480c17.67 0 32-14.33 32-32s-14.33-32-32-32h-159.1c-17.67 0-32 14.33-32 32S302.3 352 320 352zM320 96h32c17.67 0 31.1-14.33 31.1-32s-14.33-32-31.1-32h-32c-17.67 0-32 14.33-32 32S302.3 96 320 96zM544 416h-223.1c-17.67 0-32 14.33-32 32s14.33 32 32 32H544c17.67 0 32-14.33 32-32S561.7 416 544 416zM192.4 330.7L160 366.1V64.03C160 46.33 145.7 32 128 32S96 46.33 96 64.03v302L63.6 330.7c-6.312-6.883-14.94-10.38-23.61-10.38c-7.719 0-15.47 2.781-21.61 8.414c-13.03 11.95-13.9 32.22-1.969 45.27l87.1 96.09c12.12 13.26 35.06 13.26 47.19 0l87.1-96.09c11.94-13.05 11.06-33.31-1.969-45.27C224.6 316.8 204.4 317.7 192.4 330.7z"></path>
                                        </svg>
                                    </div>
                                    Giá Thấp - Cao
                                </a>
                                <a
                                    className={`btn-filter button__sort ${activeSort === 'avgStar' ? 'active' : ''}`}
                                    onClick={() => {
                                        handleActiveSort('avgStar');
                                        if (activeSort !== 'avgStar') {
                                            handleFilterChange(['sortBy', 'order'], ['avgStar', 'desc']);
                                        }
                                    }}
                                >
                                    <div class="icon">
                                        <svg height="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                            <path d="M112 224c61.9 0 112-50.1 112-112S173.9 0 112 0 0 50.1 0 112s50.1 112 112 112zm0-160c26.5 0 48 21.5 48 48s-21.5 48-48 48-48-21.5-48-48 21.5-48 48-48zm224 224c-61.9 0-112 50.1-112 112s50.1 112 112 112 112-50.1 112-112-50.1-112-112-112zm0 160c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zM392.3.2l31.6-.1c19.4-.1 30.9 21.8 19.7 37.8L77.4 501.6a23.95 23.95 0 0 1-19.6 10.2l-33.4.1c-19.5 0-30.9-21.9-19.7-37.8l368-463.7C377.2 4 384.5.2 392.3.2z"></path>
                                        </svg>
                                    </div>
                                    Đánh giá cao nhất
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default FilterSort;
