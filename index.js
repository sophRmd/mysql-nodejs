var conexao = require("./conexaobanco");
var express = require("express");
var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

// conexão no banco de dados
conexao.connect(function(error){
    if(error){
        console.error("Erro ao conectar ao banco de dados: ", error);
        process.exit(); // encerrar o servidor caso a conexão falhe
    }
});  

app.get('/', function(req,res){
    res.sendFile(__dirname + '/cadastro.html');
});

app.post('/', function(req, res){
    var nomecompleto = req.body.nomecompleto;
    var email = req.body.email;
    var senha = req.body.senha;



    // prevenindo SQL injectiom
    var sql = "INSERT INTO estudante(nomecompleto, email, senha) VALUES (?, ?, ?)";
    conexao.query(sql, [nomecompleto, email, senha], function(error, result){
        if(error) throw error;
        // res.send("Estudante cadastrado com sucesso! " + result.insertId);
        res.redirect('/estudantes');
    });
    });

// Leitura do banco de dados
app.get('/estudantes', function(req, res){

        var sql = "SELECT * FROM estudante";
        conexao.query(sql, function(error, result){
            if(error) console.log(error);
            // console.log(result);
            res.render(__dirname + "/estudantes", {estudante:result});
        });
    });

app.listen(7000);



//     //console.log("O banco de dados foi conectado!");
// conexao.query("SELECT * FROM estudante", function(error, result){
// if(error) throw error;
// // console.log(result);
// console.log(result[0]);
// console.log(result[0].nomecompleto)
// });
// });