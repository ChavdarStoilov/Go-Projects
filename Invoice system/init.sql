USE InvoiceSystem;

CREATE TABLE IF NOT EXISTS BrandConfig (
    ID bigint NOT NULL AUTO_INCREMENT,
    Name varchar(255),
    Address varchar(255),
    Owner varchar(255),
    mail varchar(255),
    PRIMARY KEY (ID)
);


CREATE TABLE IF NOT EXISTS Clients (
    ID bigint NOT NULL AUTO_INCREMENT,
    First_name varchar(255),
    Last_name varchar(255),
    Phone varchar(255),
    PRIMARY KEY (ID)
);

CREATE TABLE IF NOT EXISTS Invoices (
    ID bigint NOT NULL AUTO_INCREMENT,
    invoice_id bigint,
    Items varchar(255),
    Quantity int,
    Price float,
    Amount float,
    owner int,
    status int,
    PRIMARY KEY (ID)
);


CREATE TABLE IF NOT EXISTS status_type (
    id bigint NOT NULL AUTO_INCREMENT,
    status varchar(50),
    PRIMARY KEY (id)
); 


CREATE TABLE IF NOT EXISTS error_handler (
    id bigint NOT NULL AUTO_INCREMENT,
    description varchar(255),
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)

);

INSERT INTO status_type (status) VALUES ('Active'), ('Completed'), ('Rejected');