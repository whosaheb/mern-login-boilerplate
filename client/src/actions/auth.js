import axios from 'axios';
import { useDispatch } from 'react-redux';
const dispatch = useDispatch();

export const register = user => {
    console.log(user)
    dispatch(
        login({...user, loading: true, error:""})
    );
    return axios.post(`${API}/auth/login`, JSON.stringify(user))
                .then( res => {
                    return res.json()
                })
                .catch( err => {
                    console.log(err);
                })
}

export const login = user => {
    return axios.post(`${API}/auth/login`, JSON.stringify(user))
                .then( res => {
                    return res.json()
                })
                .catch( err => {
                    console.log(err);
                })
}