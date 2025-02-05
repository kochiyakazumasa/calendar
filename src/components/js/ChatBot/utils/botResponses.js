export const getBotResponse = (message) => {
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