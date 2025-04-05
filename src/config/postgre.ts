import dotenv from "dotenv";
import { DatabaseError, Pool } from "pg";
import ErrorHandler from "../errorHandlers/errorHandler";
import { StatusCode } from "../types";
import postgreErrorHandler from "../errorHandlers/postgreErrorHandler";


// load env
dotenv.config();



class Postgre {

  public db: Pool;

  constructor() {

    this.db = new Pool({
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.POSTGRES_SERVER,
      database: process.env.POSTGRES_DB_NAME,
      ssl: { rejectUnauthorized: true },
    });


    // run this to create tables if doesn't exist
    this.createTable();


    this.db.on("error", (err) => {
      console.log("Error on PG client ", err);
      throw new ErrorHandler({ message: "Postgre client connection error : ", status: StatusCode.INTERNAL_SERVER_ERROR });
    });

  }



  // create user table if it dont exist
  private async createTable() {

    try {

      await this.db.query(`
        CREATE TABLE IF NOT EXISTS users(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(50) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        )`
      );

      await this.db.query(`
        DO $$
        BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gadgetstatus') THEN
        CREATE TYPE gadgetStatus AS ENUM ('Available', 'Deployed', 'Destroyed', 'Decommissioned');
        END IF;
        END
        $$;

        CREATE TABLE IF NOT EXISTS gadgets(
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(50) NOT NULL,
          codename VARCHAR(50) NOT NULL,
          status gadgetStatus DEFAULT 'Available',
          created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          decommission_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `
      );

    } catch (err) {
      console.log("Error on create table : ", err);
      if (err instanceof DatabaseError) {
        postgreErrorHandler(err);
      } else {
        throw new ErrorHandler({ status: StatusCode.INTERNAL_SERVER_ERROR, message: "Error on create table" });
      }
    }

  }

}

const postgres = new Postgre();

export default postgres;