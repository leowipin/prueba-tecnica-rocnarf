import { DataSource, DataSourceOptions } from "typeorm";
import "reflect-metadata";
import "dotenv/config";

const dataSourceOptions: DataSourceOptions = {
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,

    synchronize: false,

    logging: true,

    entities: [__dirname + '/../models/**/*.js', __dirname + '/../models/**/*.ts'],
    migrations: [__dirname + '/../migrations/**/*.js', __dirname + '/../migrations/**/*.ts'],
    
};

export const AppDataSource = new DataSource(dataSourceOptions);