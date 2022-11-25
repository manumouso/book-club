import '../App.css';
import { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { motion } from "framer-motion";
import SignIn from './SignIn';
import MisPrestamos from './MisPrestamos';
import MisLibros from './MisLibros';
import Catalogo from './Catalogo';
import NewBookForm from './NewBookForm';
import AddCover from './AddCover';
import Detail from './Detail';
import EditBook from './EditBook';
import EditCover from './EditCover';


export default function RutasAnimadas() {

        const location = useLocation();

        return (
                <Routes location={location} key={location.pathname}>
                        <Route path='/SignIn' element={
                                <motion.div
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -10, opacity: 0 }}
                                        transition={{ duration: 0.8 }}
                                        className='lobby'>
                                        <SignIn />
                                </motion.div>}>
                        </Route>
                        <Route path='/' element={
                                <motion.div
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -10, opacity: 0 }}
                                        transition={{ duration: 0.8 }}
                                        className='lobby'>
                                        <SignIn />
                                </motion.div>}>
                        </Route>
                        <Route path='/MisPrestamos' element={
                                <motion.div
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -10, opacity: 0 }}
                                        transition={{ duration: 0.8 }}
                                        className='lobby'>
                                        <MisPrestamos />
                                </motion.div>}>
                        </Route>
                        <Route path='/MisLibros' element={
                                <motion.div
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -10, opacity: 0 }}
                                        transition={{ duration: 0.8 }}
                                        className='lobby'>
                                        <MisLibros />
                                </motion.div>}>
                        </Route>
                        <Route path='/Catalogo' element={
                                <motion.div
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -10, opacity: 0 }}
                                        transition={{ duration: 0.8 }}
                                        className='lobby'>
                                        <Catalogo />
                                </motion.div>}>
                        </Route>
                        <Route path='/createBook' element={
                                <motion.div
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -10, opacity: 0 }}
                                        transition={{ duration: 0.8 }}
                                        className='lobby'>
                                        <NewBookForm />
                                </motion.div>}>
                        </Route>
                        <Route path='/coverUpload' element={
                                <motion.div
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -10, opacity: 0 }}
                                        transition={{ duration: 0.8 }}
                                        className='lobby'>
                                        <AddCover />
                                </motion.div>}>
                        </Route>
                        <Route path='/Details' element={
                                <motion.div
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -10, opacity: 0 }}
                                        transition={{ duration: 0.8 }}
                                        className='lobby'>
                                        <Detail />
                                </motion.div>}>
                        </Route>
                        <Route path='/EditBook' element={
                                <motion.div
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -10, opacity: 0 }}
                                        transition={{ duration: 0.8 }}
                                        className='lobby'>
                                        <EditBook />
                                </motion.div>}>
                        </Route>
                        <Route path='/EditCover' element={
                                <motion.div
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -10, opacity: 0 }}
                                        transition={{ duration: 0.8 }}
                                        className='lobby'>
                                        <EditCover />
                                </motion.div>}>
                        </Route>
                </Routes>
        )
}