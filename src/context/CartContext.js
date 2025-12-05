import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        // Parse price to number if it's a string
        const numericPrice = typeof product.price === 'string' 
            ? Number(product.price.replace(/[^\d]/g, ''))
            : product.price;

        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id 
                        ? {...item, quantity: item.quantity + 1}
                        : item
                );
            }
            return [...prevItems, {
                ...product,
                price: numericPrice, // Store as number
                quantity: 1
            }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => 
            prevItems.filter(item => item.id !== productId)
        );
    };

    const updateCartItemQuantity = (productId, quantity) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId 
                    ? {...item, quantity: parseInt(quantity)}
                    : item
            )
        );
    };
    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
    };
    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addToCart, 
            removeFromCart,
            updateCartItemQuantity, // Add this function to the context
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};