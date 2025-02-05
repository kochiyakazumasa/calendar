import React, { useState, useRef, useEffect } from 'react';
import '../css/ChatBot.css';

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

        // ユーザーメッセージを追加
        const userMessage = {
            id: messages.length + 1,
            type: 'user',
            text: newMessage,
            time: new Date().toLocaleTimeString()
        };

        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');

        // ボットの応答を生成（実際のAPIと連携する場合はここを修正）
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

    const getBotResponse = (message) => {
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('授業')) {
            return '授業に関する情報は、カレンダーで確認できます。';
        } else if (lowerMessage.includes('課題')) {
            return '課題の提出期限は課題一覧ページで確認できます。';
        } else if (lowerMessage.includes('テスト')) {
            return 'テストの日程は担当の先生に確認してください。';
        } else {
            return 'すみません、よく分かりませんでした。もう少し具体的に質問していただけますか？';
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h3>チャットボット</h3>
                <span className="bot-status online">オンライン</span>
            </div>
            <div className="messages-container">
                {messages.map(message => (
                    <div 
                        key={message.id} 
                        className={`message ${message.type}`}
                    >
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
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="メッセージを入力..."
                />
                <button type="submit">送信</button>
            </form>
        </div>
    );
}

export default ChatBot; 