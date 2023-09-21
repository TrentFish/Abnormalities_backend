const express = require('express');
const app = express();
const morgan = require('morgan');
const pg = require('pg');
const client = new pg.Client("postgres://localhost/abnormalities_backend_db");

app.use(morgan('dev'));

app.get('/api/abnormalities', async(req, res, next) => {
    try {
        const SQL = `SELECT * FROM abnormalities`;

        const response = await client.query(SQL);
        console.log(response.rows);

        res.send(response.rows);
    }catch (error) {
        next(error);
    }
});

app.get('/api/abnormalities/:id', async(req, res, next) => {
    try {
        const SQL = `
        SELECT * 
        FROM abnormalities
        WHERE id = $1
        `;

        const response = await client.query(SQL,[req.params.id]);
        console.log(response.rows[0]);

        res.send(response.rows);
    }catch (error) {
        next(error);
    }
});

const start = async() => {
    client.connect();

    const SQL = `
        DROP TABLE IF EXISTS abnormalities;
        CREATE TABLE abnormalities(
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            risk VARCHAR(100),
            ego VARCHAR(100)
        );
        INSERT INTO abnormalities(name, risk, ego) VALUES ('Fairy Festival', 'ZAYIN', 'Wingbeat');
        INSERT INTO abnormalities(name, risk, ego) VALUES ('Spider Bud', 'TETH', 'Red Eyes');
        INSERT INTO abnormalities(name, risk, ego) VALUES ('Funeral of the Dead Butterflies', 'HE', 'Solemn Lament');
        INSERT INTO abnormalities(name, risk, ego) VALUES ('Queen of Hatred', 'WAW', 'In the Name of Love and Hate');
        INSERT INTO abnormalities(name, risk, ego) VALUES ('Nothing There', 'ALEPH', 'Mimicry');
    `;

    await client.query(SQL);

    const port = process.env.POST || 5500;

    app.listen(port, () => {
        console.log(`the server is listening on port ${port}`);
    });
};

start();