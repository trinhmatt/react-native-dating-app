import { userConst } from '../constants/user-constants';

//let user = JSON.parse(localStorage.getItem('user'));
const initState = {};

export default(state = initState, action) => {
    switch (action.type) {
        case userConst.LOGIN_SUCCESS:
            //console.log("action", action)
            return {
                ...state,
                user: {...action.userData.data},
                conversations: action.userData.data.conversations
            };
        case userConst.UPDATE_CONVERSATION:
            return {
                ...state,
                conversations: action.conversationData
            }
        case userConst.LOGIN_FAILURE:
            return initState;
        case userConst.LOGOUT:
            return initState;
        default:
            return state;
    }
}