const playlists = [{genre: pop, id: "37i9dQZF1DXcBWIGoYBM5M"}]
let timer = 3600;

const getToken = () => {
    if(localStorage.getItem("expiration") <  Math.floor(Date.now() / 1000)) {
        localStorage.clear()
        fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
            },    
            body: new URLSearchParams({
                "grant_type": "client_credentials",
                "client_id": `${clientId}`,
                "client_secret": `${clientSecret}`
            }).toString()
        })
        .then((resp) => resp.json())
        .then(obj => {tokenStorage(obj)})
        .catch(error => console.error(error));
    }
    else {
        timer = localStorage.getItem("expiration") - Math.floor(Date.now() / 1000)
    }
}


const getPlaylist = (token, playlistID) => {
    fetch(`https://api.spotify.com/v1/playlists/${playlistID}`, {
        method: "GET",
        headers: {
            authorization: `${token.token_type} ${token.access_token}`
        } 
    })
    .then(resp => resp.json())
    .then(playlist => console.log(playlist))
}

const tokenStorage = (tokenObj) => {
    for (let key in tokenObj) {
        key === "expires_in"?localStorage.setItem("expiration", `${Math.floor(Date.now() / 1000) + 3600}`):localStorage.setItem(`${key}`, `${tokenObj[key]}`);
    }
}

setInterval(getToken(), (timer * 1000))