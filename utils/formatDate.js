const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}, ${getMonthName(date.getMonth())} ${date.getFullYear()} | ${formatTime(date)}`;
};

const getMonthName = (monthIndex) => {
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return months[monthIndex];
};

const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}.${minutes}`;
};

export { formatDate };
