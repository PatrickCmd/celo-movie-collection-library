import Web3 from 'web3';
import { newKitFromWeb3 } from '@celo/contractkit';
import BigNumber from 'bignumber.js';
import movieLibraryAbi from '../contract/movie_library.abi.json';
import erc20Abi from "../contract/erc20.abi.json"

const ERC20_DECIMALS = 18;
const MVContractAddress = "0xE675Fc97AbE1FC0728d1eb2f3D1535275fC50149";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

let kit;
let contract;
/*
{
    title: "Spider-Man 3",
    genres: `Action|Adventure|Romance`,
    image: "https://rukminim1.flixcart.com/image/832/832/kbgu1e80/physical-game/v/j/u/spider-man-game-spider-man-3-action-adventure-fighting-shooting-original-imafssfnxtfgtfcn.jpeg?q=70",
    movieImbdLink: "http://www.imdb.com/title/tt0413300/?ref_=fn_tt_tt_1",
    contentRating: "PG-13",
    owner: "0x32Be343B94f860124dC4fEe278FDCBD38C102D88",
    year: 2007,
    imbdScore: 7,
    viewPrice: 3,
    views: 27,
    userReviews: 1903,
    index: 0,
}
*/
let movies = [];

const connectCeloWallet = async function () {
    if (window.celo) {
        try {
            notification("⚠️ Please approve this DApp to use it.")
            await window.celo.enable()
            notificationOff()

            const web3 = new Web3(window.celo)
            kit = newKitFromWeb3(web3)

            const accounts = await kit.web3.eth.getAccounts()
            kit.defaultAccount = accounts[0]

            contract = new kit.web3.eth.Contract(movieLibraryAbi, MVContractAddress)
        } catch (error) {
            notification(`⚠️ ${error}.`)
        }
    } else {
        notification("⚠️ Please install the CeloExtensionWallet.")
    }
}

async function approve(_price) {
    const cUSDContract = new kit.web3.eth.Contract(erc20Abi, cUSDContractAddress)

    const result = await cUSDContract.methods
        .approve(MVContractAddress, _price)
        .send({ from: kit.defaultAccount })
    return result
}

const getBalance = async function () {
    const totalBalance = await kit.getTotalBalance(kit.defaultAccount)
    const cUSDBalance = totalBalance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2)
    document.querySelector("#balance").textContent = cUSDBalance
}

const getMovieContentRating = async function (index) {
    const movieData = await contract.methods.readMovie(index).call()
    const rating = await movieData.contentRating
    return rating
}

const getMovieUserReviews = async function (index) {
    const movieData = await contract.methods.readMovie(index).call()
    const userReviews = await movieData.userReviews
    return userReviews
}

const getMovieImbdScore = async function (index) {
    const movieData = await contract.methods.readMovie(index).call()
    const imbdScore = await movieData.imbdScore;
    return imbdScore
}

const getMovieImbdLink = async function (index) {
    const movieData = await contract.methods.readMovie(index).call()
    const imbdLink = await movieData.movieImbdLink;
    return imbdLink
}

const getMovies = async function () {
    const _moviesLength = await contract.methods.moviesLength().call()
    const _movies = []

    for (let i = 0; i < _moviesLength; i++) {
        let _movie = new Promise(async (resolve, reject) => {
            let m = await contract.methods.readMovie(i).call()
            resolve({
                index: i,
                owner: m[0],
                title: m[1],
                genres: m[2],
                image: m[3],
                year: m[6],
                views: m[9],
                viewPrice: new BigNumber(m[10]),
                contentRating: await getMovieContentRating(i),
                userReviews: await getMovieUserReviews(i),
                imbdScore: await getMovieImbdScore(i),
                movieImbdLink: await getMovieImbdLink(i)
            })
        })
        _movies.push(_movie)
    }
    movies = await Promise.all(_movies)
    renderMovies()
}

function renderMovies() {
    document.getElementById("movielibrary").innerHTML = ""
    movies.forEach((_movie) => {
        if (_movie.owner !== "0x0000000000000000000000000000000000000000") {
            const newDiv = document.createElement("div")
            newDiv.className = "col-md-4"
            newDiv.innerHTML = movieTemplate(_movie)
            document.getElementById("movielibrary").appendChild(newDiv)
        }
    })
}

function movieTemplate(_movie) {
    return `
        <div class="card mb-4">
        <img class="card-img-top" src="${_movie.image}" alt="...">
        <div class="position-absolute top-0 end-0 bg-warning mt-4 px-2 py-1 rounded-start">
            ${_movie.views} Viewed
        </div>
        <div class="card-body text-left p-4 position-relative">
            <div class="translate-middle-y position-absolute top-0">
            ${identiconTemplate(_movie.owner)}
            </div>
            <h2 class="card-title fs-4 fw-bold mt-2">${_movie.title}</h2>
            <p class="card-text mb-4" style="min-height: 82px">
            <strong>Move IMBD Score</strong>: ${_movie.imbdScore}
            <br>
            <strong>Year released</strong>: ${_movie.year}
            <br>
            <strong>Content rating</strong>: ${_movie.contentRating}
            <br>
            <strong>User Reviews</strong>: ${_movie.userReviews}
            <br>
            Follow movie IMBD link to see movie trailer: 
            <a target="_blank" href="${_movie.movieImbdLink}">IMBD Link</a> 
            <br>
            </p>
            <p class="card-text mt-4">
            <strong>Genres</strong>:
            <span>${_movie.genres}</span>
            </p>
            <div class="d-grid gap-2">
            <a class="btn btn-lg btn-outline-dark viewBtn fs-6 p-3" id=${_movie.index
        }>
                View for ${_movie.viewPrice.shiftedBy(-ERC20_DECIMALS).toFixed(2)} cUSD
            </a>
            
            <a class="btn btn-lg btn-outline-danger deleteBtn fs-6 p-3" id=${_movie.index
        }>Delete Movie</a>
            </div>
        </div>
        </div>
    `
}

function identiconTemplate(_address) {
    const icon = blockies
        .create({
            seed: _address,
            size: 8,
            scale: 16,
        })
        .toDataURL()

    return `
        <div class="rounded-circle overflow-hidden d-inline-block border border-white border-2 shadow-sm m-0">
            <a href="https://alfajores-blockscout.celo-testnet.org/address/${_address}/transactions"
                target="_blank">
                <img src="${icon}" width="48" alt="${_address}">
            </a>
        </div>
    `
}

function notification(_text) {
    document.querySelector(".alert").style.display = "block"
    document.querySelector("#notification").textContent = _text
}

function notificationOff() {
    document.querySelector(".alert").style.display = "none"
}

function clear() {
    document.getElementById("newMovieTitle").value = ""
    document.getElementById("newMovieGenres").value = "";
    document.getElementById("newImgUrl").value = "";
    document.getElementById("newImbdLink").value = "";
    document.getElementById("newContentRating").value = "";
    document.getElementById("newMovieYear").value = "";
    document.getElementById("newMovieImbdScore").value = "";
    document.getElementById("newMovieUserReviews").value = "";
    document.getElementById("newMovieViewPrice").value = "";
}

window.addEventListener("load", async () => {
    notification("⌛ Loading...")
    await connectCeloWallet()
    await getBalance()
    await getMovies()
    notificationOff()
})

document
    .querySelector("#newMovieBtn")
    .addEventListener("click", async (e) => {
        const params = [
            document.getElementById("newMovieTitle").value,
            document.getElementById("newMovieGenres").value,
            document.getElementById("newImgUrl").value,
            document.getElementById("newImbdLink").value,
            document.getElementById("newContentRating").value,
            document.getElementById("newMovieYear").value,
            document.getElementById("newMovieImbdScore").value,
            document.getElementById("newMovieUserReviews").value,
            new BigNumber(document.getElementById("newMovieViewPrice").value)
                .shiftedBy(ERC20_DECIMALS)
                .toString()
        ]
        notification(`⌛ Adding "${params[0]}"...`)
        try {
            const result = await contract.methods
                .writeMovie(...params)
                .send({ from: kit.defaultAccount })
        } catch (error) {
            notification(`⚠️ ${error}.`)
        }
        notification(`🎉 You successfully added "${params[0]}".`)
        getMovies()
    })


document.querySelector("#movielibrary").addEventListener("click", async (e) => {
    if (e.target.className.includes("viewBtn")) {
        const index = e.target.id
        if (movies[index].owner !== kit.defaultAccount) {
            notification("⌛ Waiting for payment approval...")
            try {
                await approve(movies[index].viewPrice)
            } catch (error) {
                notification(`⚠️ ${error}.`)
            }
            notification(`⌛ Awaiting payment for "${movies[index].title}"...`)
            try {
                const result = await contract.methods
                    .viewMovie(index)
                    .send({ from: kit.defaultAccount })
                notification(`🎉 You successfully viewed "${movies[index].title}".`)
                getMovies()
                getBalance()
            } catch (error) {
                notification(`⚠️ ${error}.`)
            }
        }
        else {
            notification("Owner can't view their own movie");
        }
    }

})

document.querySelector("#movielibrary").addEventListener("click", async (e) => {
    if (e.target.className.includes("deleteBtn")) {
        const index = e.target.id
        if (movies[index].owner === kit.defaultAccount) {
            notification(`⚠️ You are deleting movie: "${movies[index].title}"...`)
            try {
                const result = await contract.methods
                    .deleteMovie(index)
                    .send({ from: kit.defaultAccount })
                notification(`🎉 You successfully deleted "${movies[index].title}".`)
                getMovies()
            } catch (error) {
                notification(`⚠️ ${error}.`)
            }
        }
        else {
            notification("Not authorized. You don't have permission to perform this action.");
        }
    }
})

document.querySelector("#addModal").addEventListener("hidden.bs.modal", function(e) {
    clear()
})
 