import { createContext, useContext, useState, useEffect } from "react";
import matchService from "../services/matchService";
import { matches as mockMatches } from "../data/mockData";

const MatchesContext = createContext();

export const MatchesProvider = ({ children }) => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usingMockData, setUsingMockData] = useState(false);

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        try {
            setError(null);
            const data = await matchService.getAllMatches();
            setMatches(Array.isArray(data) ? data : []);
            setUsingMockData(false);
        } catch (err) {
            console.warn("Backend unavailable, using mock data for matches.", err.message);
            // Fall back to mock data so the page still works
            setMatches(mockMatches);
            setUsingMockData(true);
            setError(null); // clear error so page shows content instead of error message
        } finally {
            setLoading(false);
        }
    };

    const addMatch = async (newMatch) => {
        if (usingMockData) {
            const fakeMatch = { ...newMatch, id: Date.now() };
            setMatches((prev) => [...prev, fakeMatch]);
            return fakeMatch;
        }
        try {
            const response = await matchService.createMatch(newMatch);
            const created = response.data || response;
            setMatches((prev) => [...prev, created]);
            return created;
        } catch (err) {
            console.error("Error adding match", err);
            throw err;
        }
    };

    const deleteMatch = async (id) => {
        if (usingMockData) {
            setMatches((prev) => prev.filter((m) => m.id !== id));
            return;
        }
        try {
            await matchService.deleteMatch(id);
            setMatches((prev) => prev.filter((m) => m.id !== id));
        } catch (err) {
            console.error("Error deleting match", err);
            throw err;
        }
    };

    const updateMatch = async (id, updatedMatch) => {
        if (usingMockData) {
            setMatches((prev) =>
                prev.map((m) => (m.id === id ? { ...m, ...updatedMatch } : m))
            );
            return updatedMatch;
        }
        try {
            const response = await matchService.updateMatch(id, updatedMatch);
            const updated = response.data || response;
            setMatches((prev) =>
                prev.map((m) => (m.id === id ? updated : m))
            );
            return updated;
        } catch (err) {
            console.error("Error updating match", err);
            throw err;
        }
    };

    return (
        <MatchesContext.Provider value={{
            matches,
            loading,
            error,
            usingMockData,
            addMatch,
            deleteMatch,
            updateMatch,
            refreshMatches: fetchMatches
        }}>
            {children}
        </MatchesContext.Provider>
    );
};

export const useMatches = () => useContext(MatchesContext);
