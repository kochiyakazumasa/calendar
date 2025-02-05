import React from 'react';
import ChatMessage from './ChatMessage';

function ChatMessages({ messages, messagesEndRef }) {
    return (
        <div className="messages-container">
            {messages.map(message => (
                <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}

export default ChatMessages; 