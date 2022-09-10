
import './App.css';
import {Route,BrowserRouter, Routes} from "react-router-dom";
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { BookingCar } from './pages/BookingCar';
import React from 'react';
import 'antd/dist/antd.css';
import {UserBookings} from './pages/UserBookings';

function App() {

  let user = JSON.parse(localStorage.getItem("user"))

  return (
    <div className="App">
      <BrowserRouter>
      
      <Routes>
        <Route path='/' element ={<Home/>}/>
        <Route path='/login' element ={<Login/>}/>
        <Route path='/register' element ={<Register/>}/>
        <Route path='/booking/:carid/' element ={user ? <BookingCar/> : <Login/>}/>
        <Route path='/userbookings' element ={<UserBookings/>}/>
      </Routes>
      
        
      </BrowserRouter>
    </div>
  );
}

export default App;



