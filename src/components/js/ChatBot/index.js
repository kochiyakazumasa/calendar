import React, { useState, useRef, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { getBotResponse } from './utils/botResponses';
import '../../css/ChatBot.css';

function ChatBot() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: 'こんにちは！授業に関する質問がありましたら、お気軽にどうぞ。',
            time: new Date().toLocaleTimeString()
        }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            type: 'user',
            text: newMessage,
            time: new Date().toLocaleTimeString()
        };

        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');

        setTimeout(() => {
            const botResponse = {
                id: messages.length + 2,
                type: 'bot',
                text: getBotResponse(newMessage),
                time: new Date().toLocaleTimeString()
            };
            setMessages(prev => [...prev, botResponse]);
        }, 1000);
    };

    return (
        <div className="chat-container">
            <ChatHeader />
            <ChatMessages messages={messages} messagesEndRef={messagesEndRef} />
            <ChatInput
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                handleSendMessage={handleSendMessage}
            />
        </div>
    );
}

export default ChatBot; 