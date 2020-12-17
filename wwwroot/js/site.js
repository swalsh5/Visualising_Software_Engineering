// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.

const btnRepos = document.getElementById("btnRepos")
const divResult = document.getElementById("divResult")
btnRepos.addEventListener("click", getRepos)

async function getRepos() {
    const url = "https://api.github.com/search/repositories?q=stars:>100000"
    const response = await fetch(url)
    const result = await response.json()

    result.items.forEach(i => {
        divResult.appendChild(document.createTextNode(i.full_name))
        divResult.appendChild(document.createElement("br"))
    } )
}