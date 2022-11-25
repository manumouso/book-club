import * as React from 'react';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';

export default function Unauthorized() {
    return (
        <main>
            <h1 className='unAuthorized'><DoNotDisturbIcon fontSize='large' /><div > UNAUTHORIZED, Please <a href="/">Sign In</a>!</div> <DoNotDisturbIcon fontSize='large' /></h1>
        </main>
    );
}