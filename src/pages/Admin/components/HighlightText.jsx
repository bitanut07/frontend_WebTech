import React from 'react';

const HighlightText = ({ text, highlight }) => {
    if (!highlight.trim()) {
        return <span>{text}</span>;
    }

    // Chuẩn hóa chuỗi để tìm kiếm không phân biệt dấu
    const normalizeStr = (str) => {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    };

    const normalizedText = normalizeStr(text);
    const normalizedHighlight = normalizeStr(highlight);

    // Nếu không tìm thấy từ khóa
    if (!normalizedText.includes(normalizedHighlight)) {
        return <span>{text}</span>;
    }

    const parts = [];
    let lastIndex = 0;
    let index = normalizedText.indexOf(normalizedHighlight);

    while (index !== -1) {
        // Thêm phần text trước từ khóa
        if (index > lastIndex) {
            parts.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex, index)}</span>);
        }

        // Thêm phần text được highlight
        parts.push(
            <span key={`highlight-${index}`} className="highlight">
                {text.slice(index, index + highlight.length)}
            </span>,
        );

        lastIndex = index + highlight.length;
        index = normalizedText.indexOf(normalizedHighlight, lastIndex);
    }

    // Thêm phần text còn lại
    if (lastIndex < text.length) {
        parts.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>);
    }

    return <>{parts}</>;
};

export default HighlightText;
