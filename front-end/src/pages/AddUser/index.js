import React, { useState } from "react";
import {Link} from 'react-router-dom';
import api from '../../config/configApi'

export const AddUser = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: ''
    });

    const valueInput = e => setUser({...user,[e.target.name]: e.target.value});
    const [status, setStatus] = useState({
        type: '',
        mensagem: ''
    })
    const addUser = async e => {
        e.preventDefault();
        console.log(user);
        const headers = {
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
        await api.post('/user', user, headers)
        .then((response) => {
            setStatus({
                type: 'success',
                mensagem: response.data.mensagem
            });
            
        }).catch((err) => {
            if(err.response){
                setStatus({
                    type: 'error',
                    mensagem: err.response.data.mensagem
                });
            }else{
                setStatus({
                    type: 'error',
                    mensagem: "Erro: Tente mais tarde!"
                });
            }
        });
    }

    return(
        <div>
            <Link to="/home">Home</Link><br />
            <Link to="/users">Usuários</Link><br />
            <Link to="/add-user">Cadastrar Usuário</Link><br />
            <h1>Cadastrar Usuário</h1>
            {status.type === 'error'? <p>{status.mensagem}</p> : ""}
            {status.type === 'success'? <p>{status.mensagem}</p> : ""}
            <form onSubmit={addUser}>
                <label>Nome: </label>
                <input type="text" name="name" placeholder="Nome completo" onChange={valueInput}/> <br /><br />

                <label>email: </label>
                <input type="email" name="email" placeholder="email do usuário" onChange={valueInput}/> <br /><br />

                <label>Senha: </label>
            <input type="password" name="password" placeholder="senha para acesso" autoComplete="on" onChange={valueInput}/> <br /><br />

                <button type="submit">Cadastrar</button>
            </form>
        </div>
    );
};