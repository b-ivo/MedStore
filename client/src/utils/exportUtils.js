export const exportToCSV = (data, filename) => {
    if (!data || !data.length) return;

    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','), // header row
        ...data.map(row => 
            headers.map(header => {
                const val = row[header];
                const stringVal = val === null || val === undefined ? '' : String(val);
                return `"${stringVal.replace(/"/g, '""')}"`; // handle commas and quotes
            }).join(',')
        )
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
