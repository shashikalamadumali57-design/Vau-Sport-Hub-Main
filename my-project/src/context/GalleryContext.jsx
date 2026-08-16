import { createContext, useContext, useState, useEffect } from "react";
import { galleryImages as initialGallery } from "../data/mockData";

const GalleryContext = createContext();

export const GalleryProvider = ({ children }) => {
    const [galleryItems, setGalleryItems] = useState(() => {
        const savedGallery = localStorage.getItem("galleryItems");
        return savedGallery ? JSON.parse(savedGallery) : initialGallery.map(item => ({ ...item, type: 'image' }));
    });

    useEffect(() => {
        localStorage.setItem("galleryItems", JSON.stringify(galleryItems));
    }, [galleryItems]);

    const addGalleryItem = (newItem) => {
        setGalleryItems((prev) => [...prev, { ...newItem, id: Date.now() }]);
    };

    const deleteGalleryItem = (id) => {
        setGalleryItems((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <GalleryContext.Provider value={{ galleryItems, addGalleryItem, deleteGalleryItem }}>
            {children}
        </GalleryContext.Provider>
    );
};

export const useGallery = () => useContext(GalleryContext);
