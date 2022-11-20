import '../App.css';
import { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { motion } from "framer-motion";
import SignIn from './SignIn';

export default function RutasAnimadas() {

    const location = useLocation();

    return(
        <Routes location={location} key={location.pathname}>
            <Route path='/SignIn' element={
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.8 }} 
                    className='lobby'>
                    <SignIn/>
                </motion.div>}>
            </Route>
        </Routes>
    )
}