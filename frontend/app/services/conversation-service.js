import axios from "axios";
import qs from "qs";

export const conversationService = {
    createConv
    //getConv,
};

function createConv(users) {
    return new Promise( (resolve, reject) => {
        console.log(users);
        axios.post("https://radiant-woodland-06944.herokuapp.com/api/create-conversation", qs.stringify(users), { headers: { 'content-type': 'application/x-www-form-urlencoded' } })
    .then( (response) => {
        //console.log(response);
        resolve(response);
    })
    .catch( err => console.log(err));
    })
    
}

// function getConv() {
//     return new Promise( (resolve, reject) => {

//     })
// }