import React from 'react';

function ChatInput({ newMessage, setNewMessage, handleSendMessage }) {
    return (
        <form onSubmit={handleSendMessage} className="message-input">
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="メッセージを入力..."
            />
            <button type="submit">送信</button>
        </form>
    );
}

export default ChatInput; 