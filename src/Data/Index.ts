import * as SQLite from 'expo-sqlite';
import { Dispatch, SetStateAction } from 'react';

const tableName: String = 'memories'

interface IModel {
    id: Number,
    title: String,
    description: String,
    date: String,
    image: String,
    audio: String
}

interface Imodel {
    title: String,
    description: String,
    date: String,
    image: String,
    audio: String
}


const createTable = async (db: any) => {
    // create table if not exists
    try{
        const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            date TEXT NOT NULL,
            image TEXT NOT NULL,
            audio TEXT NOT NULL
        );`;
  
        await db.transaction((tx: SQLite.SQLTransaction) => {
            tx.executeSql(query);
        },
        (error: any) => {
            console.log('ERROR AT CREATING TABLE', error)
        },
        () => {
            console.log('TABLE CREATED')
        }
        )
    }catch(error) {
        console.log(error , "error");
        throw Error('[ERROR] AT CREATING TABLE');
    }
    
};


const getAll = async (db: SQLite.Database, setData: Function) => {
    try{
        await db.transaction(tx =>{
            tx.executeSql(
                `SELECT * FROM ${tableName}`,
                [],
                (_, result) => setData(result.rows._array),
                (_, error) => {
                    console.log(error)
                    return false
                }
            )
        })
    } catch(error) {
        console.log(error, "error");
        return [];
    }
}


const saveItem = async (db: SQLite.Database, todoItem: Imodel) => {

    const insertQuery =
      `INSERT INTO ${tableName} (title, description, date, image, audio) values 
        (
            "${todoItem.title}", 
            "${todoItem.description}", 
            "${todoItem.date}", 
            "${todoItem.image}", 
            "${todoItem.audio}"
        )`
    return db.transaction(tx => {
        tx.executeSql(insertQuery,
            [],
            (_, result) => console.log(result),
            (_, error) => {
                console.log(error)
                return false
            });
    })
};

const deleteItem = async (db: SQLite.Database, id: String) => {
    const query = `DELETE FROM ${tableName} WHERE ID="${id}"`;

    return db.transaction(tx => {
        tx.executeSql(query,
            [],
            (_, result) => console.log(result),
            (_, error) => {
                console.log(error)
                return false
            });
    })
}

const deleteAll = async (db: SQLite.Database) => {
    const query = `DELETE FROM ${tableName}`;

    return db.transaction(tx => {
        tx.executeSql(query,
            [],
            (_, result) => console.log(result),
            (_, error) => {
                console.log(error)
                return false
            });
    })
}

export {
    createTable,
    getAll,
    saveItem,
    deleteItem,
    deleteAll,
    IModel,
    Imodel
}