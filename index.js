const cheerio = require('cheerio');
const fetch = require('node-fetch');
const cheerioTableParser = require('cheerio-tableparser');
const _ = require('lodash');

//

exports.get = async () => {
    getCellValue = (cell, attrib) => {
        const cellName = cheerio.load(cell);
        let dt = '';
        if (cellName('a')[0] === undefined) {
            dt = cell;
        } else if (cell[0] === '<') {
            dt = cellName('a')[0]['attribs'][attrib];
        } else {
            dt = cell.split('<')[0];
        }
        return dt;
    };

    parseHeader = (data) => {
        const headArr = [];
        for (const col of data) {
            const dt = getCellValue(col[0], 'title');
            headArr.push(dt);
        }
        return headArr;
    };

    const url = 'http://en.wikipedia.org/wiki/List_of_S%26P_500_companies';
    const response = await fetch(url);
    const htmlText = await response.text();
    const cRoot = cheerio.load(htmlText);
    const tbl = (cRoot('table'))[0];
    const r1 = cheerio.load(tbl);

    cheerioTableParser(r1);
    const data = r1('table').parsetable();
    const headArr = parseHeader(data);
    const col = data[0];
    const rowQuant = col.length - 1;
    let rows = [];
    for (let i = 0; i < rowQuant; i++) {
        rows.push({});
    }
    const attribs = ['title', 'href', 'href', 'title', 'title', 'title', 'title', 'title', 'title'];
    for (let colInd = 0; colInd < data.length; colInd++) {
        const colArr = data[colInd];
        for (let rowInd = 1; rowInd < colArr.length; rowInd++) {
            const cell = colArr[rowInd];
            const dt = getCellValue(cell, attribs[colInd]);
            const row = rows[rowInd - 1];
            const colName = headArr[colInd];
            if (colName === 'Security') {
                row['description'] = dt;
            } else if (colName === 'Symbol') {
                let symbol = dt.split(':')[2];
                if (symbol === undefined) {
                    symbol = (dt.split('/')[4]).toUpperCase();
                }
                symbol = symbol.replace(/\./g, '_').replace(/-/g, '_');
                row['symbol'] = symbol;
            } else if (colName === 'Date first added') {
                if (dt === '') {
                    row['DateFirstAdded'] = '2000-01-01';
                } else {
                    row['DateFirstAdded'] = dt;
                }
            } else if (colName === 'Headquarters Location') {
                row['HeadquartersLocation'] = dt.replace('\n', '');
            } else if (colName === 'SEC filing') {
                row['SECfiling'] = dt.replace('\n', '');
            } else if (colName.trim() === 'Founded') {
                row['Founded'] = dt.replace('\n', '');
            } else if (colName === 'Global Industry Classification Standard') {
                row['GlobalIndustry'] = dt.replace('\n', '');
            } else if (colName === 'GICS Sub Industry') {
                row['GICSSubIndustry'] = dt.replace('\n', '');
            } else if (colName === 'Central Index Key') {
                row['CIK'] = dt.replace('\n', '');
            } else {
                console.log(colName);
            }
        }
    }
    rows = rows.filter(x => x.symbol !== 'EQUITIES');
    rows = _.sortBy(rows, 'symbol', 'asc');
    return rows;
}

//this.get().then((data) => console.log(data));
