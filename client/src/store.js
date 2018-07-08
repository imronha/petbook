import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const initialState = {};
const middleware = [thunk];

// createStore(root reducer, , )
const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    // Implement windows redux dev tool
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
