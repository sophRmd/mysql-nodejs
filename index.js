var conexao = require("./conexaobanco");
var express = require("express");
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var app = express();


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

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
            res.render('estudantes', {estudante:result});
        });
    });

// rota de delete
app.delete('/delete-estudante', function(req, res){
    // var sql = "DELETE FROM estudante WHERE id=?";
    // var id = req.query.id;
    // conexao.query(sql, [id], function(error, result){
    //     if(error) console.log(error);

    //     res.redirect('/estudantes');  -- usando esse, tem q usar app.get

    // });

    const id = req.body.id;
    conexao.query('DELETE FROM estudante WHERE id = ?', [id], (err) =>{
        if(err){
            console.error(err);
            return res.status(500).send('Erro ao deletar estudante');
        }
        res.redirect('/estudantes');
    });
});


// Rota update
app.get('/update-estudante', function(req, res){
    // var sql = "SELECT * FROM estudante WHERE id=?";
    // var id = req.query.id;
    // conexao.query(sql, [id], function(error, result){
    //     if(error) console.log(error);
    //     res.render('alterarestudantes', {estudante:result});
    // });
    const id = req.query.id;

    conexao.query("SELECT * FROM estudante WHERE id = ?", [id], (err, results) =>{
        if(err) return res.status(500).send('Erro ao buscar estudante');
        res.render('alterarestudantes', {estudante: results[0]})
    });

});

app.put('/update-estudante', function(req, res){
    // var nomecompleto = req.body.nomecompleto;
    // var email = req.body.email;
    // var senha = req.body.senha;
    // var id = req.body.id;

    // var sql = "UPDATE estudante SET nomecompleto = ?, email = ?, senha = ? WHERE id = ?";
    // var id = req.query.id;
    // conexao.query(sql, [nomecompleto, email, senha, id], function(error, result){
    //     if(error) console.log(error);
    //     res.render(__dirname + '/alterarestudantes', {estudante:result});
    //     res.redirect('/estudantes'); -- para funcionar, tem q usar app.post
    // });

    const{id, nomecompleto, email, senha} = req.body;

    conexao.query('UPDATE estudante SET nomecompleto=?, email=?, senha=? WHERE id=?', [nomecompleto, email, senha, id], (err) => {
        if(err) return res.status(500).send('Erro ao atualizar estudante');
        res.redirect('/estudantes');
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