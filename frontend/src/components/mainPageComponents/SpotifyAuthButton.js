import React from 'react';
//import { SpotifyApiContext } from 'react-spotify-api';
import { SpotifyAuth, Scopes } from 'react-spotify-auth';

const SpotifyAuthButton = (props) => {


    return(
        <SpotifyAuth
                        title={props.header}
                        redirectUri='http://localhost:3001/home'
                        clientID='4fc7bf448443478b8181ef1cc8d069ad'
                        scopes={[
                            'streaming', 
                            'user-read-email',
                            'user-read-private',
                            'user-read-playback-state',
                            'user-modify-playback-state',
                            'user-library-read',
                            'user-library-modify'

                        ]} 
                        localStorage = {true}
                        noCookie = {true}
        />
    )
}

export default SpotifyAuthButton