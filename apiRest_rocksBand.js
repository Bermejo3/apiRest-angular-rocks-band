const express = require('express')
const app = express();
const cors = require('cors')

app.use(express.urlencoded({extended: false}));
app.use(express.json())
app.use(cors())

let mysql = require('mysql');
const { response } = require('express');
let connection = mysql.createConnection({
    database: "bands",
    host: "rock-band.cczyivccckpk.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: "admin1234"
})
connection.connect();

let port = process.env.PORT || 300
app.listen(port)

app.get("/bands", function(request, response){
    let sql = "SELECT * FROM rockBands"
    connection.query(sql, function(err, res){
        if (err) response.send(err)
        else response.send(res)
    })
})

app.post("/bands", function(request, response){
    let papictures = [request.body.name, request.body.website, request.body.description, request.body.video, request.body.isActive, request.body.year, request.body.picture, request.body.logo]
    let sql = "INSERT INTO rockBands (name, website, description, video, isActive, year, picture, logo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    connection.query(sql, papictures, function(err, res){
        if (err) response.send(err)
        else {
            if (res.affectedRows == 1){
                response.send({mensaje: "Band added", codigo: 1})
            }
            else response.send(res)
        }
    })
})

app.put("/bands", function(request, response){
    let papictures = [request.body.name, request.body.website, request.body.description, request.body.video, request.body.isActive, request.body.year, request.body.picture, request.body.logo, request.body.id]
    let sql = `UPDATE rockBands
                    SET name = COALESCE(?, name),
                        website = COALESCE(?, website),
                        description = COALESCE(?, description),
                        video = COALESCE(?, video),
                        isActive = COALESCE(?, isActive),
                        year = COALESCE(?, year),
                        picture = COALESCE(?, picture),
                        logo = COALESCE(?, logo)
                    WHERE id = ?`
    connection.query(sql, papictures, function(err, res){
        if (err) response.send(err)
        else {
            if (res.changedRows == 0){
                response.send({'mensaje': 'Nothing to update', codigo: 0})
            }
            else{
                response.send({'mensaje': 'Band updated', codigo: 1})
            }
        }
    })
})

app.delete("/bands", function(request, response){
    let papictures = [request.body.id]
    let sql = "DELETE FROM rockBands WHERE id = ?"
    connection.query(sql, papictures, function(err, res){
        if (err) response.send(err)
        else response.send({'mensaje': 'Band deleted', codigo: 1})
    })
})