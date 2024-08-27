import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Function to open the database
export const openDB = async () => {
  return open({
    filename: 'execution_log.db',
    driver: sqlite3.Database
  });
};

// Function to initialize the database table
export const initDB = async (db) => {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS ExecutionLog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT,
      status TEXT,
      message TEXT,
      proxy TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

// Function to log execution details
export const logExecution = async (db,type, status, message,proxy) => {
  await db.run(`
    INSERT INTO ExecutionLog (type, status, message,proxy)
    VALUES (?, ?, ?, ?)
  `, [type,status, message,proxy]);
};
