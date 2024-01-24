import './App.css';
import axios from 'axios';
import {UserContextProvider } from './UserContex';
import Routes from './Routes';


function App() {
  axios.defaults.baseURL = "https://mcchatapi.azurewebsites.net";
  //axios.defaults.baseURL = "http://localhost:8000"
  axios.defaults.withCredentials = true;

  return (
    <UserContextProvider>
      <Routes/>
    </UserContextProvider>
  );
}

export default App;
