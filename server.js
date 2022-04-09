const { Client } = require('pg');
const path = require('path');
const bodyParser = require('body-parser');
const knex = require('knex');
const express = require('express');
const { request } = require('http');
const app = express();

app.use(express.json());

const PORT = 8080;

const db = knex({
    client: "pg",
    connection: {
        host: "localhost",
        user: "postgres",
        password: "postgres",
        database: "shift_appens"
    }
})

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});

app.post("/register-client", async(req, res) => {
    const { username, password, name } = req.body;

    db("client").insert({
            username_cliente: username,
            password_cliente: password,
            name: name,
        })
        .returning(["id_client"])
        .then(data => {
            res.json(data[0])
        })
        .catch(err => {
            console.log(err);
        })
});

app.post("/register-shop", async(req, res) => {
    const { username, password, image } = req.body;

    db("shop").insert({
            username_loja: username,
            password_loja: password,
            image_shop: image
        })
        .returning(["id_shop"])
        .then(data => {
            res.json(data[0])
        })
        .catch(err => {
            console.log(err);
        })
});

app.post("/login-client", async(req, res) => {
    const { username, password } = req.body;

    db("client").select(["id_client"])
        .where({
            username_cliente: username,
            password_cliente: password,
        })
        .then(data => {
            res.json(data[0])
        })
        .catch(err => {
            console.log(err);
        })
});

app.post("/login-shop", async(req, res) => {
    const { username, password } = req.body;

    db("shop").select(["id_shop"])
        .where({
            username_loja: username,
            password_loja: password,
        })
        .then(data => {
            res.json(data[0])
        })
        .catch(err => {
            console.log(err);
        })
});

app.get("/see-events", async(req, res) => {

    db("event").select(["id_event", "name", "date_beg", "date_end", "duration"])
        .then(data => {
            res.json(data[0])
        })
        .catch(err => {
            console.log(err);
        })
});

app.post("/see-event-shops", async(req, res) => {
    const { id_event } = req.body;

    db.raw("SELECT username_loja, image_shop FROM shop, event_shop WHERE event_shop.event_id_event = " + id_event + " AND shop.id_shop = event_shop.shop_id_shop")
        .then(data => {
            res.json(data.rows)
        })
        .catch(err => {
            console.log(err);
        })
});

app.post("/see-shop-products", async(req, res) => {
    const { id_shop } = req.body;

    db.raw("SELECT name, image_link, price, discount, available, description FROM product WHERE shop_id_shop = " + id_shop)
        .then(data => {
            res.json(data.rows)
        })
        .catch(err => {
            console.log(err);
        })
});

app.post("/see-product", async(req, res) => {
    const { id_product } = req.body;

    db('product').select(['name', 'image_link', 'price', 'discount', 'available', 'description'])
        .where({
            id_prod: id_product
        })
        .then(data => {
            res.json(data[0])
        })
        .catch(err => {
            console.log(err);
        })
});

app.post("/add-product", async(req, res) => {
    const { name, image_link, price, discount, available, description, shop_id } = req.body;
    console.log(description);

    db('product').insert({
            name: name,
            image_link: image_link,
            price: price,
            discount: discount,
            available: available,
            description: description,
            shop_id_shop: shop_id
        })
        .returning(["id_prod"])
        .then(data => {
            res.json(data[0])
        })
        .catch(err => {
            console.log(err);
        })
});

app.post("/remove-product", async(req, res) => {
    const { id_product } = req.body;

    db('product').del()
        .where({
            id_prod: id_product
        })
        .returning(["id_prod"])
        .then(data => {
            res.json(data[0])
        })
        .catch(err => {
            console.log(err);
        })
});

app.post("/update-product", async(req, res) => {
    const { id_product, name, image_link, price, discount, available, description } = req.body;

    db('product').where({
            id_prod: id_product
        })
        .update({
            name: name,
            image_link: image_link,
            price: price,
            discount: discount,
            available: available,
            description: description
        })
        .returning(["id_prod"])
        .then(data => {
            res.json(data[0])
        })
        .catch(err => {
            console.log(err);
        })
});