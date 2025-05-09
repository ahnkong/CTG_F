import { combineReducers } from "redux";
import userReducer from "./userReducer";

// const rootReducer = combineReducers({
//     user: userReducer,
// });

const rootReducer = combineReducers({
    auth: userReducer, // 'auth'로 통일 (store.js와 이름 일치)
  });

  
export default rootReducer;
