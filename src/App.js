import React, { useState, useEffect } from 'react';
import './App.css';
import Calendar from './components/js/Calendar';
import AddClass from './components/js/AddClass';
import Notification from './components/js/Notification';
import Assignment from './components/js/Assignment';
import Settings from './components/js/Settings';
import UserProfile from './components/js/UserProfile';
import Login from './components/js/Login';
import ClassManagement from './components/js/ClassManagement';
import ChatBot from './components/js/ChatBot';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
    const [user, setUser] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [showAddClass, setShowAddClass] = useState(false);
    const [currentPage, setCurrentPage] = useState('calendar');
    const [theme, setTheme] = useState('light');
    const [showChat, setShowChat] = useState(false);

    // テーマの変更を監視して適用
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // テーマ変更のハンドラー
    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
    };

    const handleAddClass = (classData) => {
        setSchedule(prev => {
            const newSchedule = { ...prev };
            const dateKey = classData.date;
            if (!newSchedule[dateKey]) {
                newSchedule[dateKey] = [];
            }
            newSchedule[dateKey].push({
                subject: classData.subject,
                time: classData.time,
                duration: classData.duration
            });
            return newSchedule;
        });
        setShowAddClass(false);
    };

    const handleLogin = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        setUser(null);
        setCurrentPage('calendar');
    };

    const handleAddSchedule = (scheduleData) => {
        if (scheduleData instanceof Object && !Array.isArray(scheduleData)) {
            // 単一のスケジュール追加
            setSchedule(prev => {
                const newSchedule = { ...prev };
                const dateKey = scheduleData.date;
                if (!newSchedule[dateKey]) {
                    newSchedule[dateKey] = [];
                }
                newSchedule[dateKey].push({
                    subject: scheduleData.subject,
                    time: scheduleData.time,
                    duration: scheduleData.duration,
                    type: scheduleData.type || 'special'
                });
                return newSchedule;
            });
        } else {
            // スケジュール全体の更新
            setSchedule(scheduleData);
        }
    };

    if (!user) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <Router>
            <div className="app">
                <header className="app-header">
                    <div className="header-left">
                        <h1>授業管理システム</h1>
                    </div>
                    <div className="header-right">
                        <select className="view-select">
                            <option>週間</option>
                            <option>全て</option>
                        </select>
                        <button 
                            className="add-class-button"
                            onClick={() => setShowAddClass(true)}
                        >
                            ＋ 授業を追加
                        </button>
                    </div>
                </header>
                <div className="app-content">
                    <aside className="sidebar">
                        <UserProfile 
                            userType={user.type}
                            userData={user}
                        />
                        <nav className="nav-menu">
                            <button 
                                className={`nav-item ${currentPage === 'calendar' ? 'active' : ''}`}
                                onClick={() => setCurrentPage('calendar')}
                            >
                                📅 カレンダー
                            </button>
                            <button 
                                className={`nav-item ${currentPage === 'notification' ? 'active' : ''}`}
                                onClick={() => setCurrentPage('notification')}
                            >
                                🔔 通知
                            </button>
                            <button 
                                className={`nav-item ${currentPage === 'assignment' ? 'active' : ''}`}
                                onClick={() => setCurrentPage('assignment')}
                            >
                                📝 課題
                            </button>
                            <button 
                                className={`nav-item ${currentPage === 'class-management' ? 'active' : ''}`}
                                onClick={() => setCurrentPage('class-management')}
                            >
                                👥 クラス管理
                            </button>
                            <button 
                                className={`nav-item ${currentPage === 'settings' ? 'active' : ''}`}
                                onClick={() => setCurrentPage('settings')}
                            >
                                ⚙️ 設定
                            </button>
                            <button 
                                className="nav-item"
                                onClick={handleLogout}
                            >
                                ➡️ ログアウト
                            </button>
                        </nav>
                    </aside>
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={
                                showAddClass ? (
                                    <AddClass 
                                        onSave={handleAddClass}
                                        onCancel={() => setShowAddClass(false)}
                                    />
                                ) : currentPage === 'calendar' ? (
                                    <Calendar 
                                        selectedDay={selectedDay}
                                        setSelectedDay={setSelectedDay}
                                        schedule={schedule}
                                        onAddSchedule={handleAddSchedule}
                                    />
                                ) : currentPage === 'notification' ? (
                                    <Notification />
                                ) : currentPage === 'assignment' ? (
                                    <Assignment />
                                ) : currentPage === 'settings' ? (
                                    <Settings onThemeChange={handleThemeChange} currentTheme={theme} />
                                ) : currentPage === 'class-management' ? (
                                    <ClassManagement userType={user.type} />
                                ) : currentPage === 'chatbot' ? (
                                    <ChatBot schedule={schedule} />
                                ) : null
                            } />
                        </Routes>
                    </main>
                </div>
                <button 
                    className="chat-toggle-button"
                    onClick={() => setShowChat(!showChat)}
                >
                    {showChat ? '✕' : '💬'}
                </button>
                
                {showChat && <ChatBot schedule={schedule} />}
            </div>
        </Router>
    );
}

export default App; 