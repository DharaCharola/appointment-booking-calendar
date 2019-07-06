import { combineReducers } from "redux";
import eventsReducer  from "./eventsReducer";

const rootReducers = combineReducers({
    eventsReducer: eventsReducer,
});

export default rootReducers;