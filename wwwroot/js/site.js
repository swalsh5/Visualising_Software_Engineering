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
    BasicStats(repoData, user)
    //Social Graph
    parseNetworkGraph(repoData);
    //PieChart
    GetLanguageData(repoData, user)

}

// Function to call the functions that populate user stats
function BasicStats(data,user) {
    GetAvatar(data);
    GetUserName(data);
    GetAmtOfRepos(data);
    GetFollowers(user);
    GetFavouriteLanguage(data);
    GetMostFollowedRepo(data);
}

function GetAvatar(data) {
    const img = document.getElementById("avatar");
    img.src = data[0].owner.avatar_url;
    img.style.width = "300px";
    img.style.height = "300px";
}

function GetUserName(data) {
    const userName = document.getElementById("userName");
    userName.innerHTML = data[0].owner.login;
}

function GetAmtOfRepos(data) {
    const amt = GetCount(data);
    const amtRepos = document.getElementById("amtRepos");
    if (amtRepos === 30) {
        amtRepos.innerHTML = "Public Repos = >= 30";
    }
    else {
    amtRepos.innerHTML = "Public Repos = " + amt;
    }
}

async function GetFollowers(user) {
    let url = 'https://api.github.com/users/' + user;
    let followerData = await GetRequest(url).catch(error => console.error(error));
    const followers = document.getElementById("followers");
    followers.innerHTML = "Followers = " + followerData.followers;
}
function GetFavouriteLanguage(data) {
    let favouredLanguage = "";
    let favouredCount = 0;
    for (var i = 0; i < data.length; i++) {
        let currentLanguage = data[i].language;
        if (currentLanguage == null) { continue; }
        let currentCount = 0;
        for (var j = 0; j < data.length; j++) {
            if (currentLanguage == data[j].language) {
                currentCount++;
            }
        }
        if (currentCount > favouredCount) {
            favouredCount = currentCount;
            favouredLanguage = currentLanguage;
        }
    }
    const language = document.getElementById("favouredLanguage");
    language.innerHTML = "Favoured Language: " + favouredLanguage;
}
function GetMostFollowedRepo(data) {
    let mostFollowedReposArr = []; //in case of more than 1
    let mostFollowedRepoNo = data[0].stargazers_count;
    for (var i = 0; i < data.length; i++) {
        if (data[i].stargazers_count === 0) { continue; }
        if (data[i].stargazers_count > mostFollowedRepoNo) {
            mostFollowedReposArr = []; //reset array
            mostFollowedRepoNo = data[i].stargazers_count;
            mostFollowedReposArr.push(data[i].name);
        }
        else if (data[i].stargazers_count === mostFollowedRepoNo) {
            mostFollowedReposArr.push(data[i].name)
        }
    }
    const starredRepos = document.getElementById("followedRepo");
    starredRepos.innerHTML = "Most Followed Repo(s): " + mostFollowedReposArr.toString();
}

function GetCount(data) {
    var count = 0;
    for (let i = 0; i < data.length; i++) {
    count++;
    }
    return count;
}


// Network Graph ---------------------------
async function parseNetworkGraph(repoData) {
    let arrRepos = [];
    let theNodes = []
    let theLinks = []

    for (let i = 0; i < repoData.length; i++) {
        const element = repoData[i];
        let contributors = await GetRequest(`${element.contributors_url}`).catch((error) => console.error(error));
        let contributorsName = [];
        if (contributors !== undefined) {
            for (let j = 0; j < contributors.length; j++) {
                let name = contributors[j].login;
                contributorsName.push(name);
            }
            let repo = { index: i, repo: element.name, contributors: contributorsName };
            arrRepos.push(repo);
        }
    }

    for (let i = 0; i < arrRepos.length; i++) {
        const repo = arrRepos[i];
        let node = { id: repo.repo, group: 1 }; 
        theNodes.push(node);
        for (let j = 0; j < repo.contributors.length; j++) {
            const contrib = repo.contributors[j];
            let nodeC = { id: contrib, group: 2 }; 
            if (!theNodes.filter((e) => e.id == contrib).length > 0) {
                theNodes.push(nodeC);
            }
            let linkC = { source: contrib, target: repo.repo }; 
            theLinks.push(linkC);
        }
    }
    NetworkGraphDraw(theNodes, theLinks);
}
function NetworkGraphDraw(nodeData, linkData) {
    var svg = d3.select(".socialGraph");
    svg.selectAll("*").remove()
    var width = svg.attr("width");
    var height = svg.attr("height");
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var graph = {
        nodes: nodeData,
        links: linkData,
    };

    var simulation = d3
        .forceSimulation(graph.nodes) 
        .force(
            "link",
            d3.forceLink(graph.links).id(function (d) {
                return d.id;
            }) 
        )
        .force("charge", d3.forceManyBody().strength(-4)) 
        .force("center", d3.forceCenter(width / 2, height / 2)) 
        .on("tick", ticked);

    var link = svg
        .append("g")
        .selectAll("line")
        .data(graph.links)
        .enter()
        .append("line")
        .style("stroke", "#aaa");

    var node = svg
        .append("g")
        .selectAll("circle")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr('fill', function (d, i) {
            return color(d.group);
        })
        .style("border", "#000");

    function ticked() {
        link
            .attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node
            .attr("cx", function (d) {
                return d.x + 3;
            })
            .attr("cy", function (d) {
                return d.y - 3;
            });
    }
}

//Pie Chart
async function GetLanguageData(data, user) {
    let languages = new Set();
    let langsInRepo = []
    for (let i = 0; i < data.length; i++) {
        const repo = data[i].name;
        let a = await GetRequest('https://api.github.com/repos/' + user + '/' + repo + '/languages').catch((error) => console.error(error));
        langsInRepo.push(a)
    }
    for (let i = 0; i < langsInRepo.length; i++) {
        let keyArr = Object.keys(langsInRepo[i]);
        for (let j = 0; j < keyArr.length; j++) {
            languages.add(keyArr[j])
        }
    }
    let langSize = new Map()
    for (let value of languages) langSize.set(value, 0);
    for (let i = 0; i < langsInRepo.length; i++) {
        let obj = langsInRepo[i];
        for (const [key, value] of Object.entries(obj)) {

            let oldVal = langSize.get(key);
            let newVal = value + oldVal;
            const newMap = langSize.set(key, newVal)
            langSize = newMap;
        }

    }
    let languageList = [];
    let valueList = [];
    for (const [key, value] of langSize.entries()) {
        languageList.push(key);
        valueList.push(value);
    }
    DrawPieChart(languageList, valueList);
}
function DrawPieChart(languages, values) {
    let chart = document.getElementById("pieChart");
    let pieChart = new Chart(chart, {
        type: 'doughnut',
        data: {
            labels: languages,
            datasets: [{
                label: 'Languages',
                data: values,
                backgroundColor: GenerateColours(languages.length)
            }],
        },
        options: {}
    });
}

// Random rgb colour generator to generate colours for pie chart
function GenerateColours(amtNeeded) {
    let colours = [];
    for (var i = 0; i < amtNeeded; i++) {
        let r = Math.floor(Math.random() * 200);
        let g = Math.floor(Math.random() * 200);
        let b = Math.floor(Math.random() * 200);
        let colour = 'rgba(' + r + ',' + g + ',' + b + ', 0.6)';
        colours.push(colour);
    }
    return colours;
}