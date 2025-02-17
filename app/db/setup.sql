-- This file contains the SQL schema, it drops all tables and recreates them

DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS timesheets;

-- To add a field to a table do
-- CREATE TABLE table_name (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     nullable_field TEXT,
--     non_nullable_field TEXT NOT NULL,
--     numeric_field INTEGER,
--     unique_field TEXT UNIQUE,
--     unique_non_nullable_field TEXT NOT NULL UNIQUE,
--     date_field DATE,
--     datetime_field DATETIME
-- );

-- Create employees table
CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT,
    email TEXT NULL,
    phone_number TEXT NULL,
    date_of_birth DATE,
    gender TEXT NULL,
    job_title TEXT NULL,
    department TEXT NULL,
    salary INTEGER NULL,
    start_date DATETIME,
    end_date DATETIME
    -- Rest of the fields
);

-- Create timesheets table
CREATE TABLE timesheets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    -- Rest of the fields
    title TEXT,
    start TEXT,
    end TEXT,
    employee_id INTEGER NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);
