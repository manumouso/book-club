import { Button, Toolbar } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import nasheTest from "../utils/imagenes/iconoBookClub.png"

function removeToken() {
        localStorage.clear('atoken')
}

const PrivateToolBar = () => {

        const token = localStorage.getItem('atoken');

        return (
                <AppBar position="relative">
                        <Toolbar style={{ "display": "flex", "justifyContent": "space-around" }}>
                                <img type="image/png" src={nasheTest} width='40vw' alt="bookClubIcon" />
                                <Button style={{ "color": "white" }} href="/Catalog">Catalog 📜</Button>
                                {!token && <Button style={{ "color": "white" }} href="/">Sign in ✏️</Button>}
                                {token && <Button style={{ "color": "white" }} href="/MyBooks">My Books 📚</Button>}
                                {token && <Button style={{ "color": "white" }} href="/MyLoans">My loans ♻️</Button>}
                                {token && <Button style={{ "color": "white" }} onClick={() => { removeToken() }} href="/">Logout 👋🏻</Button>}
                        </Toolbar>
                </AppBar>
        )
}

export default PrivateToolBar