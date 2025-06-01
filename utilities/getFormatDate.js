const formatDate = (date) => {
    const formatDate = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
    return formatDate;
}

module.exports = formatDate;