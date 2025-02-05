import React from 'react';

function ChatMessage({ message }) {
    return (
        <div className={`message ${message.type}`}>
            <div className="message-content">
                {message.type === 'bot' && (
                    <div className="bot-avatar">🤖</div>
                )}
                <div className="message-bubble">
                    {message.text}
                    <span className="message-time">{message.time}</span>
                </div>
            </div>
        </div>
    );
}

export default ChatMessage; 