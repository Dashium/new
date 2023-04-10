const sqlite3 = require('sqlite3').verbose();
const common = require('../common');

// Fonction pour créer la base de données
function createDatabase(dbName) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(`./config/${dbName}.db`, (err) => {
            if (err) {
                reject(err.message);
            }
            common.sucess(`Database ${dbName} created`, 'bdd');
            resolve(db);
        });
    });
}

function loadDatabase(dbName) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(`./config/${dbName}.db`, (err) => {
            if (err) {
                reject(err.message);
            }
            common.sucess(`Database ${dbName} loaded`, 'bdd');
            resolve(db);
        });
    });
}

// Fonction pour créer une table
function createTable(db, tableName, columns) {
    const columnsStr = columns.join(',');
    const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsStr})`;
    return new Promise((resolve, reject) => {
        db.run(sql, [], function (err) {
            if (err) {
                reject(err.message);
            }
            common.sucess(`Table ${tableName} created`, 'bdd');
            resolve();
        });
    });
}

// Fonction pour insérer une ligne dans une table
function insertRow(db, tableName, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(',');
    const sql = `INSERT INTO ${tableName} (${keys.join(',')}) VALUES (${placeholders})`;
    return new Promise((resolve, reject) => {
        db.run(sql, values, function (err) {
            if (err) {
                reject(err.message);
            }
            common.log(`Row inserted into ${tableName} with id ${this.lastID}`, 'bdd');
            resolve(this.lastID);
        });
    });
}

// Fonction pour sélectionner des lignes dans une table
function selectRows(db, tableName, columns = '*', where = '1', params = []) {
    const sql = `SELECT ${columns} FROM ${tableName} WHERE ${where}`;
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err.message);
            }
            if(rows == null){
                common.log(`${rows} rows selected from ${tableName}`, 'bdd');
            }
            else{
                common.log(`${rows.length} rows selected from ${tableName}`, 'bdd');
            }
            resolve(rows);
        });
    });
}

// Fonction pour supprimer des lignes d'une table
function deleteRows(db, tableName, where = '1', params = []) {
    const sql = `DELETE FROM ${tableName} WHERE ${where}`;
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                reject(err.message);
            }
            common.warn(`${this.changes} rows deleted from ${tableName}`, 'bdd');
            resolve(this.changes);
        });
    });
}

// Fonction pour mettre à jour des lignes dans une table
function updateRows(db, tableName, data, where = '1', params = []) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((key) => `${key} = ?`).join(',');
    const sql = `UPDATE ${tableName} SET ${placeholders} WHERE ${where}`;
    return new Promise((resolve, reject) => {
        db.run(sql, [...values, ...params], function (err) {
            if (err) {
                reject(err.message);
            }
            common.log(`${this.changes} rows updated in ${tableName}`, 'bdd');
            resolve(this.changes);
        });
    });
}

module.exports = {
    createDatabase,
    createTable,
    insertRow,
    selectRows,
    deleteRows,
    updateRows,
    loadDatabase,
};
