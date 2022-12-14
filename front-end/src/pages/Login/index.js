import React, { useState, useContext} from "react";

import { useNavigate } from 'react-router-dom';

import api from '../../config/configApi';
import {Context} from '../../Context/AuthContext';

export const Login = () =>{
    
    const navigate = useNavigate();
    const {authenticated, signIn} = useContext(Context);
    console.log("Situação usuario login: " + authenticated);

    const [user, setUser] = useState({
        email: '',
        password: ''
    });

    const [status,setStatus] = useState({
        type: '',
        mensagem: '',
        loading: false
    });
    const valorInput = e => setUser({...user, [e.target.name]: e.target.value});

    const loginSubmit = async e => {
        e.preventDefault();
        //console.log(user.email);
        //console.log(user.password);
        setStatus({
            loading: true
        })
        const headers = {
            'Content-Type': 'application/json'
        }
        await api.post("/login", user, {headers})
        .then((response) => {
            //console.log(response);
            setStatus({
                type: 'sucess',
                mensagem: response.data.mensagem,
                loading: false
            });
            localStorage.setItem('token', response.data.token);
            signIn(true);
            return navigate('/home');
        }).catch((err) => {
            if(err.response){
                //console.log(err.response);
                setStatus({
                    type: 'error',
                    mensagem: err.response.data.mensagem,
                    loading: false
                })
            }else{
                //console.log("Erro: tente mais tarde");
                setStatus({
                    type: 'error',
                    mensagem: "Erro: tente mais tarde",
                    loading: false
                })
            }
            
        });
    }
    
    return(
        <div>
            <h1>Login</h1>
            {status.type === 'error'? <p>{status.mensagem}</p>: ""}
            {status.type === 'sucess'? <p>{status.mensagem}</p>: ""}
            {status.loading ? <p>Validando...</p>: ""}
            <form onSubmit={loginSubmit}>
                <label>Usuário: </label>
                <input type="text" name="email" placeholder="Digite o email" onChange={valorInput} /><br /><br />
                
                <label>Senha: </label>
                <input type="password" name="password" placeholder="Digite a senha" autoComplete="on" onChange={valorInput} /><br /><br />

                {status.loading ? <button type="submit" disabled>Acessando...</button> : <button type="submit">Acessar</button>}

            </form>
        </div>
    );
};