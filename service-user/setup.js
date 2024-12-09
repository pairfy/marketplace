import mysql from "mysql2";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const sqlDirectoryPath = path.join(__dirname, "src/db");

const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT) || 3306,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
});

connection.connect((err) => {
  if (err) {
    console.error("SETUP: database connection error", err);
  }

  console.log("SETUP: database success connection");

  connection.query(
    `CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE_NAME}`,
    (err, results) => {
      if (err) {
        console.error("SETUP: error creating database:", err);
      }

      console.log(`SETUP: database ${process.env.DATABASE_NAME} is ready.`);

      connection.query(`USE ${process.env.DATABASE_NAME}`, (err, results) => {
        if (err) {
          console.error("SETUP: Error selecting database:", err);
        }

        executeScripts();

       
      });
    }
  );
});

function executeScripts() {
  fs.readdir(sqlDirectoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
    }

    const SQLS = files.filter((file) => file.endsWith(".sql"));

    SQLS.forEach((file) =>
      fs.readFile(
        path.join(sqlDirectoryPath, file),
        "utf8",
        (err, sqlScript) => {
          if (err) {
            console.error(`SETUP: Error reading ${file}:`, err);
          }

          connection.query(sqlScript, (err, results) => {
            if (err) {
              console.error(`SETUP: Error executing ${file}:`, err);
            } else {
              console.log(`SETUP: ${file} executed successfully.`);
              return;
            }
          });
        }
      )
    );
  });

 
}
