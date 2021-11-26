import React from 'react';
import ReactDOM from 'react-dom';
import { createGlobalState } from 'react-hooks-global-state';
import App from './App';
import { Order, User } from './api/BasilApi';
import './index.css';
import reportWebVitals from './reportWebVitals';

const globalProfile: User | false = null;
const globalBasket: Partial<Order> | void = null;
const globalPendingState: boolean = false;

const { useGlobalState, setGlobalState, getGlobalState } = createGlobalState({
  profile: globalProfile,
  basket: globalBasket,
  pendingState: globalPendingState,
});

ReactDOM.render(<App />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export { useGlobalState, setGlobalState, getGlobalState };
