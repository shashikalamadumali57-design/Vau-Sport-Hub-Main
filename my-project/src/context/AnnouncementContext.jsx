import { createContext, useContext, useState, useEffect } from "react";
import announcementService from "../services/announcementService";
import { announcements as mockAnnouncements } from "../data/mockData";

const AnnouncementContext = createContext();

export const AnnouncementProvider = ({ children }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usingMockData, setUsingMockData] = useState(false);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            setError(null);
            const data = await announcementService.getAllAnnouncements();
            setAnnouncements(Array.isArray(data) ? data : []);
            setUsingMockData(false);
        } catch (err) {
            console.warn("Backend unavailable, using mock data for announcements.", err.message);
            // Fall back to mock data so the page still works
            setAnnouncements(mockAnnouncements);
            setUsingMockData(true);
            setError(null); // clear error so page shows content instead of error message
        } finally {
            setLoading(false);
        }
    };

    const addAnnouncement = async (newAnnouncement) => {
        if (usingMockData) {
            const fake = { ...newAnnouncement, id: Date.now() };
            setAnnouncements((prev) => [...prev, fake]);
            return fake;
        }
        try {
            const response = await announcementService.createAnnouncement(newAnnouncement);
            const created = response.data || response;
            setAnnouncements((prev) => [...prev, created]);
            return created;
        } catch (err) {
            console.error("Error adding announcement", err);
            throw err;
        }
    };

    const deleteAnnouncement = async (id) => {
        if (usingMockData) {
            setAnnouncements((prev) => prev.filter((a) => a.id !== id));
            return;
        }
        try {
            await announcementService.deleteAnnouncement(id);
            setAnnouncements((prev) => prev.filter((a) => a.id !== id));
        } catch (err) {
            console.error("Error deleting announcement", err);
            throw err;
        }
    };

    const updateAnnouncement = async (id, updatedAnnouncement) => {
        if (usingMockData) {
            setAnnouncements((prev) =>
                prev.map((a) => (a.id === id ? { ...a, ...updatedAnnouncement } : a))
            );
            return updatedAnnouncement;
        }
        try {
            const response = await announcementService.updateAnnouncement(id, updatedAnnouncement);
            const updated = response.data || response;
            setAnnouncements((prev) =>
                prev.map((a) => (a.id === id ? updated : a))
            );
            return updated;
        } catch (err) {
            console.error("Error updating announcement", err);
            throw err;
        }
    };

    return (
        <AnnouncementContext.Provider value={{
            announcements,
            loading,
            error,
            usingMockData,
            addAnnouncement,
            deleteAnnouncement,
            updateAnnouncement,
            refreshAnnouncements: fetchAnnouncements
        }}>
            {children}
        </AnnouncementContext.Provider>
    );
};

export const useAnnouncements = () => useContext(AnnouncementContext);
