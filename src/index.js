const request = require('request');
const authKey = require("./test")
let token;

request.post(authKey.auth, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      getPlaylist(body)
    }
})


const getPlaylist = (authToken) => {
    fetch("https://api.spotify.com/v1/playlists/37i9dQZF1DXcBWIGoYBM5M", {
        method: "GET",
        headers: {
            authorization: `${authToken.token_type} ${authToken.access_token}`
        } 
    })
    .then(resp => resp.json())
    .then(playlist => console.log(playlist))
}