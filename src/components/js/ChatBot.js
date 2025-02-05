import React, { useState, useEffect, useRef } from 'react';
import '../css/ChatBot.css';

function ChatBot({ schedule }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // スケジュール情報から回答を生成する関数
    const generateResponse = (question, scheduleData) => {
        // scheduleDataが未定義またはnullの場合の処理
        if (!scheduleData) {
            return 'スケジュールデータが見つかりません。';
        }

        // 質問を小文字化して検索しやすくする
        const q = question.toLowerCase();
        
        // スケジュールの日付一覧を取得（無効な日付を除外）
        const dates = Object.keys(scheduleData).filter(date => 
            scheduleData[date] && Array.isArray(scheduleData[date])
        );

        // 日付に関する質問の場合
        if (q.includes('いつ') || q.includes('日程') || q.includes('日付')) {
            if (dates.length === 0) {
                return 'スケジュールは登録されていません。';
            }
            // 日付を年月日形式にフォーマット
            const formattedDates = dates.map(date => {
                const d = new Date(date);
                return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
            });
            return `スケジュールは以下の日程で登録されています：\n${formattedDates.join('、')}`;
        }

        // 特定の科目に関する質問の場合
        const subjects = new Set();
        dates.forEach(date => {
            if (scheduleData[date]) {
                scheduleData[date].forEach(item => {
                    if (item && item.subject) {
                        subjects.add(item.subject);
                    }
                });
            }
        });

        for (const subject of subjects) {
            if (q.includes(subject.toLowerCase())) {
                const subjectSchedules = [];
                dates.forEach(date => {
                    if (scheduleData[date]) {
                        scheduleData[date].forEach(item => {
                            if (item && item.subject === subject) {
                                subjectSchedules.push(`${date} ${item.time}（${item.duration}分）`);
                            }
                        });
                    }
                });
                
                if (subjectSchedules.length > 0) {
                    return `${subject}の授業は以下の日時に予定されています：\n${subjectSchedules.join('\n')}`;
                }
            }
        }

        // 特定の日付に関する質問の場合
        for (const date of dates) {
            if (q.includes(date)) {
                const daySchedule = scheduleData[date];
                if (daySchedule && daySchedule.length > 0) {
                    const scheduleList = daySchedule
                        .map(item => `${item.time} - ${item.subject}（${item.duration}分）`)
                        .join('\n');
                    return `${date}のスケジュール：\n${scheduleList}`;
                }
            }
        }

        // 今日のスケジュールに関する質問の場合
        if (q.includes('今日') || q.includes('本日')) {
            const today = new Date().toISOString().split('T')[0];
            const todaySchedule = scheduleData[today];
            if (todaySchedule && todaySchedule.length > 0) {
                const scheduleList = todaySchedule
                    .map(item => `${item.time} - ${item.subject}（${item.duration}分）`)
                    .join('\n');
                return `本日（${today}）のスケジュール：\n${scheduleList}`;
            }
            return '本日の予定はありません。';
        }

        // 特別講義に関する質問の場合
        if (q.includes('特別') || q.includes('特講')) {
            const specialLectures = [];
            dates.forEach(date => {
                if (scheduleData[date]) {
                    scheduleData[date].forEach(item => {
                        if (item && item.type === 'special') {
                            const d = new Date(date);
                            const formattedDate = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
                            specialLectures.push(`${formattedDate} ${item.time} - ${item.subject}（${item.duration}分）`);
                        }
                    });
                }
            });
            
            if (specialLectures.length > 0) {
                return `特別講義は以下の日時に予定されています：\n${specialLectures.join('\n')}`;
            }
            return '特別講義の予定はありません。';
        }

        // デフォルトの応答
        return 'スケジュールについて具体的にお尋ねください。例えば、「今日の予定は？」「数学の授業はいつ？」などとお聞きください。';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
        setIsLoading(true);

        try {
            const response = generateResponse(userMessage, schedule);
            setMessages(prev => [...prev, { text: response, isUser: false }]);
        } catch (error) {
            console.error('チャットボットエラー:', error);
            setMessages(prev => [...prev, {
                text: 'すみません、エラーが発生しました。',
                isUser: false
            }]);
        }

        setIsLoading(false);
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <h3>スケジュールアシスタント</h3>
            </div>
            <div className="chatbot-messages">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`message ${message.isUser ? 'user' : 'bot'}`}
                    >
                        {message.text}
                    </div>
                ))}
                {isLoading && (
                    <div className="message bot loading">
                        <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="chatbot-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="スケジュールについて質問してください..."
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading}>
                    送信
                </button>
            </form>
        </div>
    );
}

export default ChatBot; 