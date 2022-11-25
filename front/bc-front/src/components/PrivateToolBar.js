import { Button, Toolbar } from '@mui/material';
import AppBar from '@mui/material/AppBar';

function removeToken() {
        localStorage.clear('atoken')
}

const PrivateToolBar = () => {
        return (
                <AppBar position="relative">
                        <Toolbar style={{ "display": "flex", "justifyContent": "space-around" }}>
                                <Button style={{ "color": "white" }} href="/Catalogo">Catalogo 📜</Button>
                                <Button style={{ "color": "white" }} href="/MisLibros">Mis libros 📚</Button>
                                <Button style={{ "color": "white" }} href="/MisPrestamos">Prestamos ♻️</Button>
                                <Button style={{ "color": "white" }} onClick={() => { removeToken() }} href="/">Salir 👋🏻</Button>

                        </Toolbar>
                </AppBar>
        )
}

export default PrivateToolBar