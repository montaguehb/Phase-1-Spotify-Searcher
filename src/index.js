//global variables
const musicCollection = document.querySelector(".music-collection")
let emptyObj ={}
function appendPlaylistItems(playlistObj){
  // debugger
  playlistObj.items.forEach((item) => {

  const newIframe = document.createElement('iframe')
  newIframe.src = `https://open.spotify.com/embed/track/${item.track.id}`
  newIframe.setAttribute("allow", "clipboard-write; encrypted-media; fullscreen; picture-in-picture" )
  newIframe.setAttribute("loading", "lazy")
  let musicCollection = document.querySelector('.music-collection')
  musicCollection.append(newIframe)
  })
}




const playlists = [{genre: "pop", id: "37i9dQZF1DXcBWIGoYBM5M"}, {genre: "Hip-Hop", id: "37i9dQZF1DX8uG7blV3kzV"}, {genre: "Rock", id: "37i9dQZF1DXcF6B6QPhFDv"}, {genre: "House", id: "37i9dQZF1DX5xiztvBdlUf"}, {genre: "Alt", id: "37i9dQZF1DXdfR43X3iEzK"}]
let timer = 3600;

const getToken = () => {
    if(localStorage.getItem("expiration") < Math.floor(Date.now() / 1000)) {
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

//Function that makes a call to the Spotify API and retrieves a playlist based on the ID it recieves
const getPlaylist = (playlistID, numSongs, offset) => {
    const urlParams = new URLSearchParams({
        "offset": `${offset}`,
        "limit": `${numSongs}`
    })
    fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks?${urlParams.toString()}`, {
        method: "GET",
        headers: {
            authorization: `${localStorage.getItem("token_type")} ${localStorage.getItem("access_token")}`,
        }
    })
    .then(resp => resp.json())
    .then(playlistObj => appendPlaylistItems(playlistObj))
}

//Puts a copy of the token object it recieves into local storage
const tokenStorage = (tokenObj) => {
    for (let key in tokenObj) {
        key === "expires_in"?localStorage.setItem("expiration", `${Math.floor(Date.now() / 1000) + 3600}`):localStorage.setItem(`${key}`, `${tokenObj[key]}`);
    }
}

setInterval(getToken(), (timer * 1000))

//event listeners
// document.querySelector("a").addEventListener("click", e => {
//     const songs = document.querySelectorAll(`.${e.target.id}`)
//     songs.forEach(song => {
//         song.hidden?
//     })
// })


//function and event listener to search for a song by track
//name and display it in music container
const simpleSearch = document.querySelector("#simple-search")
function displaySong(song){
    const div = document.createElement("div")
    div.className = "card"
    const h4 = document.createElement("h4")
    h4.className = "track-title"
    h4.textContent = song.name
    const img = document.createElement("img")
    // debugger
    img.src = song.album.images[1].url
    img.className = "track-image"
    img.alt = `${song.name} by ${song.artists.map(artist => artist.name)}`
    const span = document.createElement("span")
    span.className = "artists"
    span.textContent = `artists: ${song.artists.map(artist => artist.name)}`
    const br = document.createElement("br")
    const audio = document.createElement("audio")
    audio.controls = 'controls'
    const source = document.createElement("source")
    source.src = song.preview_url
    source.type = 'audio/mp3' 

    audio.append(source)

    div.append(h4, img, audio, br, span)
    musicCollection.append(div)
}
simpleSearch.addEventListener("submit", (e) =>{
    e.preventDefault()
    const song = e.target["song-title-input"].value
    fetch(`https://api.spotify.com/v1/search?q=${song}&type=track`, {
        method: "GET",
        headers: {
            authorization: `${localStorage.getItem("token_type")} ${localStorage.getItem("access_token")}`,
        }
    })
    .then(resp => resp.json())
    .then(songs => songs.tracks.items.forEach(song => displaySong(song)))
})
