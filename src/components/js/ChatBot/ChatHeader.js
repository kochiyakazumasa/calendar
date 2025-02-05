import React from 'react';

function ChatHeader({ isMinimized, toggleMinimize }) {
    return (
        <div className="chat-header">
            <h3>チャットボット</h3>
            <div className="chat-header-actions">
                <span className="bot-status online">オンライン</span>
                <button 
                    className="minimize-button"
                    onClick={toggleMinimize}
                >
                    {isMinimized ? '⬆️' : '⬇️'}
                </button>
            </div>
        </div>
    );
}

export default ChatHeader; 