const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

let mysqlParams = mysql.createConnection({
    user : "root",
    password: "root",
    database: "northwind",
    host: "localhost",
    port: 3306,
    typeCast: function(field,next){
        if(field.type === 'BIT'){
            return (field.buffer()[0] === 1);
        }else{
            return next();
        }
    }
});
// ?id=5
app.get("/listaEmpleadosNw",function (req, res){

    let id = req.query.id;

    let query = "SELECT * FROM employees where employeeid = ?";

    let parametros = [id];

    mysqlParams.query(query,parametros,function (err, data){
        if(err) throw err;
        for(let i = 0 ; i < data.length; i++){
            delete data[i].Photo;
        }
        res.json(data);
    });

});

app.post('/jobs', bodyParser.urlencoded({extended: true}), function (req, res) {

    let jobId = req.body.jobId;
    let jobTitle = req.body.jobTitle;
    let minSalary = req.body.minSalary;
    let maxSalary = req.body.maxSalary;

    let parametros = [jobId, jobTitle, minSalary, maxSalary];
    let query = "INSERT INTO jobs (job_id,job_title,min_salary,max_salary) VALUES (?,?,?,?)";

    conn.query(query, parametros, function (err, result) {
        if (err) throw err;

        conn.query("SELECT * FROM jobs", function (err, results) {
            res.json(results);
        });
    });


});



app.get("/products",function (req, res){

    let query = "SELECT * FROM products;";
    mysqlParams.query(query,function (err, data){
        if(err) throw err;
        res.json(data);
    });

});


app.post("/crearUsuario",bodyParser.urlencoded({extended:true}),function(req,res){
    let nombre = req.body.nombre;
    let apellido = req.body.apellido;
    console.log(nombre);
    console.log(apellido);
    res.send(`nombre recibido: ${nombre} | apellido recibido: ${apellido}`);
});

app.post("/crearUsuarioJson",bodyParser.json(),function(req,res){
    let nombre = req.body.nombre;
    let apellido = req.body.apellido;
    let curso = req.body.curso;

    if(curso == undefined){
        console.log("no envió curso");
    }
    console.log(nombre);
    console.log(apellido);
    //res.send(`nombre recibido: ${nombre} | apellido recibido: ${apellido} | curso: ${curso}`);
    let jsonRespuesta = {
        nombre : nombre,
        apellido : apellido,
        curso: curso
    };
    res.json(jsonRespuesta);
});


app.get("/hola", function (req, res) {
    res.send("Pagina de texto: hola!!!");
});

//localhost:3000/holaNombre?nombre=stuardo&apellido=lucho
app.get("/holaNombre", function (req, res) {
    let nombre = req.query.nombre;
    let apellido = req.query.apellido;
    //res.send(`nombre recibido: ${nombre} | apellido recibido: ${apellido}`);
    let ruta = path.join(__dirname + "/vistas/homePage.html");
    res.sendFile(ruta);
});

//localhost:3000/obtenerTexto/tel137/clase5
app.get("/obtenerTexto/:curso/:clase", function (req, res) {
    let curso = req.params.curso;
    let clase = req.params.clase;

    let texto = "";
    if (curso == "tel137") {
        switch (clase) {
            case "clase4":
                texto = "Los parámetros presentes en la URL se pueden obtener mediante";
                break;
            case "clase 5":
                texto = "Express.js es una librería en NodeJS que utiliza como base la librería http, para brindar las funcionalidades de un servidor web así como gestionar solicitudes REST";
                break;
            default:
                texto = "Esta librería es similar a Spring para la definición y gestión de rutas, así como para la gestión de templates engines.";
        }
    }

    res.send(texto);
});

app.listen(3000, function () {
    console.log("Servidor levantado exitosamente");
})