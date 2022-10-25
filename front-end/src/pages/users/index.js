import React, { useEffect, useState } from "react";
import {Link, useLocation} from 'react-router-dom';
import api from '../../config/configApi';

export const Users = () => {

    const { state } = useLocation();

    const [data, setData] = useState([]);

    const [status, setStatus] = useState({
        type: state ? state.type : "",
        mensagem: state ? state.mensagem : ""
    })
    const getUsers = async () => {
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
        await api.get("/users", headers)
        .then((response) => {
            console.log(response);
            setData(response.data.users);
        }).catch((err) => {
            if(err.response){
                setStatus({
                    type: 'error',
                    mensagem: err.response.data.mensagem
                })
            }else{
                setStatus({
                    type: 'error',
                    mensagem: "Erro: Tente mais tarde!"
                })
            }
        })
    }

    useEffect(() => {
        getUsers();
    },[]);


    const deleteUser = async (idUser) => {
        const headers = {
            'headers': {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
        await api.delete("/user/" + idUser,headers)
        .then((response) => {
            setStatus({
                type: 'success',
                mensagem: response.data.mensagem
            })
            getUsers();
        }).catch((err) => {
            if(err.response){
                setStatus({
                    type: 'error',
                    mensagem: err.response.data.mensagem
                })
            }else{
                setStatus({
                    type: 'error',
                    mensagem: "Erro: Tente mais tarde!"
                })
            }
        })
    }
    return(
        <>
            <Link to="/home">Home</Link><br />
            <Link to="/users">Usuários</Link><br />
            <Link to="/add-user">Cadastrar Usuário</Link><br />
            <h1>Listar Usuários</h1>
            {status.type === 'error'? <p>{status.mensagem}</p>: ""}
            {status.type === 'success'? <p>{status.mensagem}</p>: ""}
            {data.map(user => (
                <div key={user.id}>
                    <span>{user.id}</span><br />
                    <span>{user.name}</span><br />
                    <span>{user.email}</span><br /><br/>
                    <Link to={"/view-user/" + user.id}><button type="button">Visualizar</button></Link><br/><br />
                    <Link to={"/edit-user/" + user.id}><button type="button">Editar</button></Link><br/><br/>
                    <Link to={"#"}><button type="button" onClick={() => deleteUser(user.id)}>Apagar</button></Link><br/><br/><hr />
                </div>
            ))}
        </>
    )
}