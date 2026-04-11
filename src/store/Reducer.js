export const initialState = {
  user: null,
  starredMessages: [],
};

export const actionTypes = {
  SET_USER: "SET_USER",
  STAR_MESSAGE: "STAR_MESSAGE",
  UNSTAR_MESSAGE: "UNSTAR_MESSAGE",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
      };

    case actionTypes.STAR_MESSAGE:
      return {
        ...state,
        starredMessages: [
          ...state.starredMessages,
          { ...action.message, roomId: action.roomId, roomName: action.roomName },
        ],
      };

    case actionTypes.UNSTAR_MESSAGE:
      return {
        ...state,
        starredMessages: state.starredMessages.filter(
          (m) =>
            !(
              m.message === action.message.message &&
              m.name === action.message.name &&
              m.roomId === action.roomId
            )
        ),
      };

    default:
      return state;
  }
};

export default reducer;
