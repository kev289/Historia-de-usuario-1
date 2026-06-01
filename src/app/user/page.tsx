"use client"

import { getUsers } from "@/src/services/users"
import { useState } from "react";

// Interfaz de propiedades del usuario
interface personProps {
    id: number;
    name: string;
    age: string;
}

const User = () => {
    const [person, setPerson] = useState<personProps>();

    const fetchData = async () => {
        const result = await getUsers();
        setPerson(result);
    }

    return (
        <>
        <h1>Vista usuarios</h1>
        <button onClick={fetchData}>Cargar usuario</button>
        <div>La persona es: {person?.name}</div>
        </>
    )
}

export default User
