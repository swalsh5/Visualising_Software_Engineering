

// Handle Input ----------------------------------------------------------------------------

function handleInput() {
    var user = document.getElementById("textBox").value;
    main(user);
}

// Get Request ------------------------------------------------------------------------------

async function GetRequest(url) {
    const response = await fetch(url);
    let data = await response.json();
    return data;
}

// Main -----------------------------------------------------------------------------------

async function main(user) {
    let url = 'https://api.github.com/users/' + user + '/repos';
    let repoData = await GetRequest(url).catch(error => console.error(error))

    //User Stats
    AvgCommits(repoData);
    FavouriteLanguage(repoData);
    MostCommits(repoData, user);

    //Social Graph
    parseSocialGraph(repoData);
    //PieChart
    languageChart(repoData, user)
    //Line Graph
    parseLineGraph(repoData);

}

