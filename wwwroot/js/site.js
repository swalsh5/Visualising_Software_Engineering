// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.

const btnRepos = document.getElementById("btnRepos")
const btnIssues = document.getElementById("btnIssues")
const btnCommits = document.getElementById("btnCommits")
const btnIssuesPrivate = document.getElementById("btnIssuesPrivate")

const divResult = document.getElementById("divResult")

btnRepos.addEventListener("click", getRepos)
btnIssues.addEventListener("click", getIssues)
btnCommits.addEventListener("click", e => getCommits())
btnIssuesPrivate.addEventListener("click", e =>  getIssuesPrivate())

async function getRepos() {
    clear()
    const url = "https://api.github.com/search/repositories?q=stars:>100000"
    const response = await fetch(url)
    const result = await response.json()

    result.items.forEach(i => {
        const anchor = document.createElement("a")
        anchor.href = i.html_url;
        anchor.textContent = i.full_name;
        divResult.appendChild(anchor)
        divResult.appendChild(document.createElement("br"))
    })
}

async function getIssues() {
    clear()
    const url = "https://api.github.com/search/issues?q=author:najmieh repo:freecodecamp/freecodecamp type:issue"
    const response = await fetch(url)
    const result = await response.json()

    result.items.forEach(i => {
        const anchor = document.createElement("a")
        anchor.href = i.html_url;
        anchor.textContent = i.title;
        divResult.appendChild(anchor)
        divResult.appendChild(document.createElement("br"))
    })
}

async function getCommits(url = "https://api.github.com/search/commits?q=repo:freecodecamp/freecodecamp author-date:2020-09-01..2020-09-30") {
    clear(); 
    const headers = {
        "Accept": "application/vnd.github.cloak-preview"
    }
    const response = await fetch(url, {
        "method" : "GET",
        "headers": headers
    })

    const link = response.headers.get("link")
    const links = link.split(",")
    const urls = links.map(a => {
        return {
            url: a.split(";")[0].replace(">","").replace("<",""),
            title: a.split(";")[1]
        }
    })

    const result = await response.json()

    result.items.forEach(i => {
        const img = document.createElement("img")
        img.src = i.author.avatar_url;
        img.style.width = "32px"
        img.style.height = "32px"

        const anchor = document.createElement("a")
        anchor.href = i.html_url;
        anchor.textContent = i.commit.message.substr(0,120) + "...";

        divResult.appendChild(img)
        divResult.appendChild(anchor)
        divResult.appendChild(document.createElement("br"))
    })

    urls.forEach(u => {
        const btn = document.createElement("button")
        btn.textContent = u.title;
        btn.addEventListener("click", e => getCommits(u.url))
        divResult.appendChild(btn);
    })
}

 // ff37ca4d426b67f55d7b7f8809dfd59d1b614731
async function getIssuesPrivate() {
    clear()
    const headers = {
        "Authorization": 'Token ff37ca4d426b67f55d7b7f8809dfd59d1b614731'
    }
    const url = "https://api.github.com/search/issues?q=repo:swalsh5/lca_java type:issue"
    const response = await fetch(url, {
        "method": "GET",
        "headers": headers
    })
    const result = await response.json()

    result.items.forEach(i => {
        const anchor = document.createElement("a")
        anchor.href = i.html_url;
        anchor.textContent = i.title;
        divResult.appendChild(anchor)
        divResult.appendChild(document.createElement("br"))
    })
}

function clear() {
    while (divResult.firstChild)
        divResult.removeChild(divResult.firstChild)
}