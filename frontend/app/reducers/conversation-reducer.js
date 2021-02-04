import { conversationConst } from '../constants/conversation-constants';

const initState = {
    currentConversationId: '',
    conversations: []
};

export default (state = initState, action) => {
    switch (action.type) {
        case conversationConst.LOAD_SUCCESS: 
            return {
                ...state,
                conversations: action.currentConversationId
            };
        case conversationConst.LOAD_FAILURE:
            return initState;
        case conversationConst.CREATE_SUCCESS:
            return {
                conversations: [...state.conversations, action.conversation],
                currentConversationId: action.conversation.id,
            };
        case conversationConst.CREATE_FAILURE:
            return initState;
        case conversationConst.SET_CONVERSATION:
            return {
                ...state,
                currentConversationId: action.conversationId
            };
        default:
            return state;
    }
};