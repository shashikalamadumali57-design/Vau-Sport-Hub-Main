import { createContext, useContext, useState, useEffect } from "react";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem("teamMessages");
        return savedMessages ? JSON.parse(savedMessages) : [];
    });

    useEffect(() => {
        localStorage.setItem("teamMessages", JSON.stringify(messages));
    }, [messages]);

    const sendMessage = (messageData) => {
        const newMessage = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            status: 'unread',
            ...messageData
        };
        setMessages((prev) => [...prev, newMessage]);
        console.log("Message sent:", newMessage); // For debugging
        return true;
    };

    return (
        <MessageContext.Provider value={{ messages, sendMessage }}>
            {children}
        </MessageContext.Provider>
    );
};

export const useMessages = () => useContext(MessageContext);
