//global variables
const musicCollection = document.querySelector("#music-collection");
const advancedSearch = document.querySelector("#advanced-search");
const advSearchButton = document.querySelector("#advanced-search-button");
const playlists = [
  { genre: "Pop", id: "37i9dQZF1DXcBWIGoYBM5M" },
  { genre: "Hip-Hop", id: "37i9dQZF1DX8uG7blV3kzV" },
  { genre: "Rock", id: "37i9dQZF1DXcF6B6QPhFDv" },
  { genre: "House", id: "37i9dQZF1DX5xiztvBdlUf" },
  { genre: "Alt", id: "37i9dQZF1DXdfR43X3iEzK" },
]
let timer = 3600;


//Function to get the OAuth token
const getToken = () => {
//checks if a token exists and is not expired. If it is expired, fetches a new one. Updates the timer when called, mainly for page refreshes
  if (
    !localStorage.getItem("expiration") ||
    localStorage.getItem("expiration") < Math.floor(Date.now() / 1000)
  ) {
    localStorage.clear()
    fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: `${clientId}`,
        client_secret: `${clientSecret}`,
      }).toString(),
    })
      .then((resp) => resp.json())
      .then((obj) => {
        tokenStorage(obj)
      })
      .catch((error) => console.error(error))
  } else {
    timer = localStorage.getItem("expiration") - Math.floor(Date.now() / 1000)
  }
}

//Puts a copy of the token object it recieves from getToken into local storage
const tokenStorage = (tokenObj) => {
    for (let key in tokenObj) {
      key === "expires_in"
        ? localStorage.setItem(
            "expiration",
            `${Math.floor(Date.now() / 1000) + 3600}`
          )
        : localStorage.setItem(`${key}`, `${tokenObj[key]}`)
    }
}

//Function that makes a call to the Spotify API and retrieves a playlist based on the ID it recieves
const getPlaylist = (playlistID, numSongs, offset) => {
  const urlParams = new URLSearchParams({
    offset: `${offset}`,
    limit: `${numSongs}`,
  });
  fetch(
    `https://api.spotify.com/v1/playlists/${playlistID}/tracks?${urlParams.toString()}`,
    {
      method: "GET",
      headers: {
        authorization: `${localStorage.getItem(
          "token_type"
        )} ${localStorage.getItem("access_token")}`,
      },
    }
  )
    .then((resp) => resp.json())
    .then((playlistObj) => appendPlaylistItems(playlistObj));
}

//takes in an object containing track/song information and adds an iframe to the page containing the song information for every song in the object
function appendPlaylistItems(playlistObj) {
    playlistObj.items.forEach((item) => {
      const id = item.hasOwnProperty("track") ? item.track.id : item.id
      const newIframe = document.createElement("iframe")
      newIframe.src = `https://open.spotify.com/embed/track/${id}`
      newIframe.setAttribute(
        "allow",
        "clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      );
      newIframe.setAttribute("loading", "lazy")
      musicCollection.append(newIframe)
    });
}

//event listeners
//updates songs when clicking on the nav bar elements
document.querySelectorAll("a").forEach((element) => {
  element.addEventListener("click", (e) => {
    const genre = e.target.id;
    playlists.forEach((element) => {
      musicCollection.innerHTML = ""
      element.genre === genre ? getPlaylist(element.id, 10, 0) : () => {};
    })
  })
})

//Toggle for the advanced and simple search forms
advSearchButton.addEventListener("click", () => {
  document
    .querySelectorAll("form")
    .forEach((form) => (form.hidden = form.hidden ? false : true))
  advSearchButton.textContent =
    advSearchButton.textContent === "Search by Song"
      ? "Advanced Search"
      : "Search by Song"
})

//function that sends a search query to spotify's API with the information gotten from the form input
document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    musicCollection.innerHTML = "";
    const infoObj =
      e.target.id === "simple-search"
        ? { song: e.target["track-name"].value }
        : {
            song: e.target["track-name"].value,
            artist: e.target["artist-name"].value,
            album: e.target["album-name"].value,
            playlist: e.target["playlist"].value,
          };
    for (let key in infoObj) {
      if (!!infoObj[key]) {
        infoObj[key].padStart(1, "&");
      }
    }
    fetch(
      `https://api.spotify.com/v1/search?q=${infoObj.song}${infoObj.artist}${infoObj.album}${infoObj.playlist}&type=track&type=artist&type=album&type=playlist&type=show&type=episode&type=audiobook&limit=10`,
      {
        method: "GET",
        headers: {
          authorization: `${localStorage.getItem(
            "token_type"
          )} ${localStorage.getItem("access_token")}`,
        },
      }
    )
      .then((resp) => resp.json())
      .then((songs) => appendPlaylistItems(songs.tracks))
    e.target.reset()
  });
})

setInterval(getToken(), timer * 1000)
// getPlaylist(playlists[0].id, 10, 0)
