import * as React from 'react';

export default function Unauthorized() {
    return (
        <main>
            <h1 style={{ textAlign: "center", position: '', backgroundColor: '#ff8c00' }}>¡ Unauthorized, please <a href="/">sign in!</a></h1>
        </main>
    );
}