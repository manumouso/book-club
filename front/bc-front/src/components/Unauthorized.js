import * as React from 'react';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import { color } from '@mui/system';

export default function Unauthorized() {
    return (
        <main>
            <h1 style={{backgroundColor: "#9c27b0", color: "white"}}className='unAuthorized'><DoNotDisturbIcon fontSize='large' /><div > UNAUTHORIZED, Please <a href="/">Sign In</a>!</div> <DoNotDisturbIcon fontSize='large' /></h1>
        </main>
    );
}