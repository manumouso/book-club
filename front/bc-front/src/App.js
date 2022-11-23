import logo from './logo.svg';
import './App.css';
import SignIn from './components/SignIn';
import RutasAnimadas from './components/RutasAnimadas';
import { BrowserRouter } from 'react-router-dom';
import AuthorsComponent from './components/Authors';
import Genres from './components/Genres';
import PublicBooks from './components/PublicBooks';
import MyBooks from './components/MyBooks';
import { useEffect, useState } from 'react';
import NewBookForm from './components/NewBookForm';
import AddCover from './components/AddCover';

function App() {
        return (
                <div>
                        {<BrowserRouter>
                                <RutasAnimadas />
                        </BrowserRouter>}


                </div>
        );
}




export default App;