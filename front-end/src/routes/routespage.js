import React, { useContext } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import { Login } from '../pages/Login'
import { Dashboard } from '../pages/Dashboard'
import { Users } from '../pages/users'
import { AddUser  } from '../pages/AddUser'
import { Context } from '../Context/AuthContext';
import { ViewUser } from '../pages/ViewUser';
import { EditUser } from '../pages/EditUser';

function CustomRoute({ children, redirectTo }) {

const { authenticated } = useContext(Context)

return authenticated ? children : <Navigate to={redirectTo} />

}

export default function routespage() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<CustomRoute redirectTo="/"><Dashboard /> </CustomRoute>} />
            <Route path="/users" element={<CustomRoute redirectTo="/"><Users /> </CustomRoute>} />
            <Route path="/add-user" element={<CustomRoute redirectTo="/"><AddUser /> </CustomRoute>} />
            <Route path="/view-user/:id" element={<CustomRoute redirectTo="/"><ViewUser /> </CustomRoute>} />
            <Route path="/edit-user/:id" element={<CustomRoute redirectTo="/"><EditUser /> </CustomRoute>} />
        </Routes>
    );
}