let apikey = "";
let userName = "";
let completion = "";
let gameId = 0;

function init() {
    fetch("apikey.json")
        .then(res => res.json())
        .then(data => {
            apikey = data.apiKey;
        })

    fetch("config.json")
        .then(res => res.json())
        .then(data => {
            userName = data.userName;
            gameId = data.gameId;
            searchGame();
        })
}

function searchGame() {
    if (!isNaN(gameId) && gameId > 0) {
        fetch(`https://retroachievements.org/API/API_GetGameInfoAndUserProgress.php?g=${gameId}&u=${userName}&y=${apikey}`)
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                completion = data.UserCompletionHardcore;
                document.getElementById("output").innerHTML=`${data.Title} [${data.ConsoleName}]<br/>${completion}`
            })
    } else {
        document.getElementById("output").innerHTML="Oops!";
    }
}

window.onload = function() {
    init();
}