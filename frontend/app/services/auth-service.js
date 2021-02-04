
import axios from 'axios';
import qs from 'qs';


import * as RootNavigation from '../../routes';

export const userService = {
    login,
    logout,
};

function login(userObj) {
    return new Promise( (resolve, reject) => {
        axios.post("https://radiant-woodland-06944.herokuapp.com/login", qs.stringify(userObj), { headers: { 'content-type': 'application/x-www-form-urlencoded' } })
        .then( (user) => {
            resolve(user);
        })
        .catch( (err) => {
            console.log("err:",err)
            reject(err);
        })
        })
    
};

function logout() {
    return axios.get("https://radiant-woodland-06944.herokuapp.com/logout")
    .then(() => {
        RootNavigation.navigate('Welcome');
    })
}