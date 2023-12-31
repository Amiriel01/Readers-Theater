import axios from 'axios';
import { useEffect, useState } from 'react';

export default function ProfilePage() {

    const [user, setUser] = useState('')

    async function getUser() {
        try {
            const response = await axios.get('http://localhost:3000/users/user/6590559d82e961c23fe35d72');
            console.log(response.status, response.data)
            setUser(response.data.username);
        } catch (err) {
            console.log(err)
        }
    };

    useEffect(() => {
        getUser()
    }, []);

    return (
        <>
            <p>Hello, {user}!</p>
        </>
    )
}