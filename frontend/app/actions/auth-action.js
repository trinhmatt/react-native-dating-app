import { userConst } from '../constants/user-constants';
import { userService } from '../services/auth-service';
import * as RootNavigation from '../../routes';

export const login = (userObj) => dispatch => {
    userService.login(userObj)
    .then((userData) => {
        if (!userData.error) {
            try {
                dispatch(loginSuccess(userData));
                RootNavigation.navigate('Main');
            } catch(err) { console.log(err); }
        } else {
            dispatch(loginFailure(userData.message));
        }
    })
    .catch((err) => {
        console.log(err);
        dispatch(loginFailure(err));
    });
    return { type: 'LOGIN' };
}

export const updateConversation = (conversationData) => ({
    type: userConst.UPDATE_CONVERSATION,
    conversationData
})
    

export const loginSuccess = (userData) => ({
    type: userConst.LOGIN_SUCCESS,
    userData
});

export const loginFailure = (err) => ({
    type: userConst.LOGIN_FAILURE,
    err
});