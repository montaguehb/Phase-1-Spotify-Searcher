const searchTerm = `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`
let authToken = {};

fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },    
    body: searchTerm
})
.then((resp) => resp.json())
.then(obj => {
    authToken = {...obj}
})
.catch(error => console.error(error));


const getPlaylist = (token, playlistID) => {
    fetch("https://api.spotify.com/v1/playlists/37i9dQZF1DXcBWIGoYBM5M", {
        method: "GET",
        headers: {
            authorization: `${authToken.token_type} ${authToken.access_token}`
        } 
    })
    .then(resp => resp.json())
    .then(playlist => console.log(playlist))
}