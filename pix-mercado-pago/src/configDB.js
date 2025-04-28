const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

// you would have to import / invoke this in another file
exports.openDB = async function(){
    return open({
        filename: './src/database.db',
        driver: sqlite3.Database
    });
}