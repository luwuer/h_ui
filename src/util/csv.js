// https://github.com/Terminux/react-csv-downloader/blob/master/src/lib/csv.js

const newLine = '\r\n';
const appendLine = (content, row, { separator, quoted }) => {
    const line = row.map(data => {
        if (!quoted) return data;
        // quote data
        data = typeof data === 'string' ? data.replace(/"/g, '"') : data;
        return `"${data}"`;
    });
    content.push(line.join(separator));
};

const defaults = {
    separator: ',',
    quoted: false
};

export default function csv(columns, datas, options, noHeader = false) {
    options = Object.assign({}, defaults, options);
    let columnOrder;
    const content = [];
    const column = [];
    if (columns) {
        columnOrder = columns.map(v => {
            if (typeof v === 'string') return v;
            if (!noHeader) {
                column.push(typeof v.title !== 'undefined' ? v.title : v.key);
            }
            return v.key;
        });
        if (column.length > 0) appendLine(content, column, options);
    } else {
        columnOrder = [];
        datas.forEach(v => {
            if (!Array.isArray(v)) {
                columnOrder = columnOrder.concat(Object.keys(v));
            }
        });
        if (columnOrder.length > 0) {
            columnOrder = columnOrder.filter((value, index, self) => self.indexOf(value) === index);
            if (!noHeader) appendLine(content, columnOrder, options);
        }
    }

    if (Array.isArray(datas)) {
        datas.forEach(row => {
            if (!Array.isArray(row)) {
                // row = columnOrder.map(k => (typeof row[k] !== 'undefined' ? row[k] : ''));
                row = columnOrder.map((key, index) =>{
                    let exportVal = ''
                    if (columns && columns.length > 0 && columns[index].exportRender) {
                        exportVal =  columns[index].exportRender(row[key])
                    } else {
                        exportVal = typeof row[key] !== 'undefined' ? row[key] : ''
                    }
                    if (typeof exportVal == 'string' && exportVal.indexOf('<br') >= 0) {
                        // 强制换行（
                        exportVal =  "\"" + exportVal.replace(/\<br\>/g, "\n") + "\""
                    }
                    if (typeof exportVal == 'string' && exportVal.substr(0, 1) == '0' || typeof exportVal == 'number') {
                        exportVal =  '="' + exportVal + '"'
                    }
                    return exportVal
                })
            }
            appendLine(content, row, options);
        });
    }
    return content.join(newLine);
}