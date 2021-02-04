import { msgConst } from '../constants/message-reducer';

const initState = {};

export default (state = initState, action) => {
    switch (action.type) {
        case msgConst.LOAD_MSG_SUCCESS:
            return {
                ...state,
                [action.id]: action.messages,
            };
        case msgConst.LOAD_MSG_FAILURE:
            return initState;
        case msgConst.SEND_MSG:
            if (state[action.conversationId]) {
                return {
                    ...state,
                    [action.conversationId]: [...state[action.conversationId], action.message],
                };
            }
            return {
                ...state,
                [action.conversationId]: [action.message],
            };
        default:
            return state;
    }
};