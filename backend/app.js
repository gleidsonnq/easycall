const express = require("express");
var cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { eAdmin } = require('./middlewares/auth')
const Usuario = require('./models/Usuario');
const { SequelizeScopeError } = require("sequelize");
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type, Authorization");
    app.use(cors());
    next();

});

app.get("/users", eAdmin, async (req, res) => {

    await Usuario.findAll({
        attributes: ['id', 'name', 'email', 'password']
    })
    .then((users) => {
        return res.json({
            erro: false,
            users
        });
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário ou senha incorreta!"
        });
    });    
});

app.get("/user/:id", eAdmin, async (req, res) => {
    const { id } = req.params;

    //await Usuario.findAll({ where: { id: id }})
    await Usuario.findByPk(id)
    .then((user) => {
        return res.json({
            erro: false,
            user: user
        });
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Erro: Usuário ou senha incorreta!"
        });
    });
});

app.post("/user", eAdmin, async (req, res) => {
    var dados = req.body;
    dados.password = await bcrypt.hash(dados.password, 8);

    await Usuario.create(dados)
    .then(() => {
        return res.json({
            erro: false,
            mensagem: "Usuário cadastrado com sucesso!"
        });
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário não cadastrado com sucesso!"
        });
    })
});

app.put("/user", eAdmin, async (req, res) => {
    const { id } = req.body;

    await Usuario.update(req.body, {where: {id}})
    .then(() => {
        return res.json({
            erro: false,
            mensagem: "Usuário editado com sucesso!"
        });
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário não editado com sucesso!"
        });
    })
});

app.put("/user-senha", eAdmin, async (req, res) => {
    const { id, password } = req.body;
    var senhaCrypt = await bcrypt.hash(password, 8);
    await Usuario.update({password: senhaCrypt}, {where: {id}})
    .then(() => {
        return res.json({
            erro: false,
            mensagem: "Senha editada com sucesso!"
        });
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Senha não editada com sucesso!"
        });
    })
});

app.delete("/user/:id", eAdmin, async (req, res) => {
    const { id } = req.params;

    await Usuario.destroy({where:{id}})
    .then(() => {
        return res.json({
            erro: false,
            mensagem: "Usuário apagado com sucesso!"
        });
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário não apagado com sucesso!"
        });
    });
    
});

app.post('/login', async (req, res) => {

    await sleep(3000);
    function sleep(ms){
        return new Promise((resolve) => {
            setTimeout(resolve,ms);
        });
    };
    const user = await Usuario.findOne({
        attributes: ['id', 'name', 'email', 'password'],
        where: {email: req.body.email}});
    if(user === null){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário ou senha incorreta!"
        });    
    };
    if(!(await bcrypt.compare(req.body.password, user.password))){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário ou senha incorreta!"
        });    
    };

    var token = jwt.sign({id: user.id}, process.env.SECRET, {
        //expiresIn 600 // 10min
        expiresIn: '7d' // 7 dias
    })

    return res.json({
        erro: false,
        mensagem: "Login realizado com sucesso!",
        token
    });
})

app.get("/val-token", eAdmin, async (req, res) => {
    await Usuario.findByPk(req.userId, {attributes: ['id', 'name', 'email']})
    .then((user) => {
        return res.json({
            erro: false,
            user
        });
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Necessário realizar login!"
        });
    }); 
});
app.listen(8080, () => {
    console.log("Servidor iniciado na porta 8080: http://localhost:8080")
});