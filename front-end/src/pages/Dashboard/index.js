import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import {Context} from '../../Context/AuthContext';


export const Dashboard = () => {
    //const token = localStorage.getItem('token');

    const {authenticated, handleLogout} = useContext(Context);
    console.log("Situação usuario login: " + authenticated);

    return(
        <div>
            <h1>Página Inicial</h1>
            <Link to="/home">Home</Link><br />
            <Link to="/users">Usuários</Link><br />
            <Link to="/add-user">Cadastrar Usuário</Link><br />
            <button type="button" onClick={handleLogout}>Sair</button>
        </div>
    )
}