const express = require('express');
const app = express();
const morgan = require('morgan');
const pg = require('pg');
const client = new pg.Client("postgres://localhost/abnormalities_backend_db");

app.use(morgan('dev'));
app.use(express.json());

app.get('/api/abnormalities', async(req, res, next) => {
    try {
        const SQL = `
        SELECT *
        FROM abnormalities
        `;

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

app.delete('/api/abnormalities/:id', async(req, res, next) => {
    try {
        const SQL = `
        DELETE 
        FROM abnormalities
        WHERE id = $1
        `;

        const response = await client.query(SQL,[req.params.id]);
        console.log(response.rows);

        res.send(response.rows);
    }catch (error) {
        next(error);
    }
});

app.post('/api/abnormalities', async(req, res, next) => {
    const body = req.body;
    try {
        const SQL = `
        INSERT INTO abnormalities(name, risk, ego)
        VALUES($1, $2, $3)
        RETURNING *
        `;

        const response = await client.query(SQL, [body.name, body.risk, body.ego]);

    }catch (error) {
        next(error);
    }
});

app.put('/api/abnormalities/:id', async(req, res, next) => {
    try {
        const SQL = `
        UPDATE abnormalities
        SET name = $1, risk = $2, ego = $3
        WHERE id = $4
        RETURNING *
        `;

        const response = await client.query(SQL, [body.name, body.risk, body.ego]);
        res.send(response.rows);
    }catch (error) {
        next(error);
    }
});

app.use('*', (req, res, next) => {
    res.status(404).send("The Abnormality you're looking for doesn't exist")
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