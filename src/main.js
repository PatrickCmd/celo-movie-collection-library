
/*
string title;
string genres;
string image;
string movie_imbd_link;
string content_rating;
uint year;
uint imbd_score;
uint user_reviews;
uint views;
uint view_price;
*/
const movies = [
    {
      title: "Spider-Man 3",
      genres: `Action|Adventure|Romance`,
      image: "https://rukminim1.flixcart.com/image/832/832/kbgu1e80/physical-game/v/j/u/spider-man-game-spider-man-3-action-adventure-fighting-shooting-original-imafssfnxtfgtfcn.jpeg?q=70",
      imbd_link: "http://www.imdb.com/title/tt0413300/?ref_=fn_tt_tt_1",
      content_rating: "PG-13",
      owner: "0x32Be343B94f860124dC4fEe278FDCBD38C102D88",
      year: 2007,
      imbd_score: 7,
      view_price: 3,
      views: 27,
      user_reviews: 1903,
      index: 0,
    },
    {
        title: "Avengers: Age of Ultron",
        genres: `Action|Adventure|Sci-Fi`,
        image: "https://pbs.twimg.com/media/B-n_ClcUAAAMdpM?format=jpg&name=large",
        imbd_link: "http://www.imdb.com/title/tt2395427/?ref_=fn_tt_tt_1",
        content_rating: "PG-13",
        owner: "0x3275B7F400cCdeBeDaf0D8A9a7C8C1aBE2d747Ea",
        year: 2015,
        imbd_score: 8,
        view_price: 4,
        views: 27,
        user_reviews: 1117,
        index: 1,
    },
    {
        title: "Harry Potter and the Half-Blood Prince",
        genres: `Adventure|Family|Fantasy|Mystery`,
        image: "https://darkroom.bbfc.co.uk/751/https://m.media-amazon.com/images/M/MV5BNzU3NDg4NTAyNV5BMl5BanBnXkFtZTcwOTg2ODg1Mg@@._V1_.jpg:e078e76491dceb4d951c0fb2bd7c61cd",
        imbd_link: "http://www.imdb.com/title/tt0417741/?ref_=fn_tt_tt_1",
        content_rating: "PG",
        owner: "0x2EF48F32eB0AEB90778A2170a0558A941b72BFFb",
        year: 2009,
        imbd_score: 8,
        view_price: 3,
        views: 30,
        user_reviews: 973,
        index: 2,
    },
    {
        title: "Men in Black 3",
        genres: `Action|Adventure|Comedy|Family|Fantasy|Sci-Fi`,
        image: "https://darkroom.bbfc.co.uk/751/https://m.media-amazon.com/images/M/MV5BMTU2NTYxODcwMF5BMl5BanBnXkFtZTcwNDk1NDY0Nw@@._V1_.jpg:3f0ebb6cef594b60d28f64a06ab5f5fb",
        imbd_link: "http://www.imdb.com/title/tt1409024/?ref_=fn_tt_tt_1",
        content_rating: "PG-13",
        owner: "0x2EF48F32eB0AEB90778A2170a0558A941b72BFFb",
        year: 2012,
        imbd_score: 7,
        view_price: 4,
        views: 17,
        user_reviews: 341,
        index: 3,
    },
  ]
  
  const getBalance = function () {
    document.querySelector("#balance").textContent = 21
  }
  
  function renderMovies() {
    document.getElementById("movielibrary").innerHTML = ""
    movies.forEach((_movie) => {
      const newDiv = document.createElement("div")
      newDiv.className = "col-md-4"
      newDiv.innerHTML = movieTemplate(_movie)
      document.getElementById("movielibrary").appendChild(newDiv)
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
            <strong>Move IMBD Score</strong>: ${_movie.imbd_score}
            <br>
            <strong>Year released</strong>: ${_movie.year}
            <br>
            <strong>Content rating</strong>: ${_movie.content_rating}
            <br>
            <strong>User Reviews</strong>: ${_movie.user_reviews}
            <br>
            Follow movie IMBD link to see movie trailor: 
            <a target="_blank" href="${_movie.imbd_link}">IMBD Link</a> 
            <br>
          </p>
          <p class="card-text mt-4">
            <strong>Genres</strong>:
            <span>${_movie.genres}</span>
          </p>
          <div class="d-grid gap-2">
            <a class="btn btn-lg btn-outline-dark viewBtn fs-6 p-3" id=${
              _movie.index
            }>
              View for ${_movie.view_price} cUSD
            </a>
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
  
  window.addEventListener("load", () => {
    notification("⌛ Loading...")
    getBalance()
    renderMovies()
    notificationOff()
  })
  
  document
    .querySelector("#newMovieBtn")
    .addEventListener("click", () => {
      const _movie = {
        owner: "0x2EF48F32eB0AEB90778A2170a0558A941b72BFFb",
        title: document.getElementById("newMovieTitle").value,
        genres: document.getElementById("newMovieGenres").value,
        image: document.getElementById("newImgUrl").value,
        imbd_link: document.getElementById("newImbdLink").value,
        content_rating: document.getElementById("newContentRating").value,
        imbd_score: document.getElementById("newMovieImbdScore").value,
        year: document.getElementById("newMovieYear").value,
        user_reviews: document.getElementById("newMovieUserReviews").value,
        view_price: document.getElementById("newMovieViewPrice").value,
        views: 0,
        index: movies.length,
      }
      movies.push(_movie)
      notification(`🎉 You successfully added "${_movie.title}".`)
      renderMovies()
    })
  
  document.querySelector("#movielibrary").addEventListener("click", (e) => {
    if(e.target.className.includes("viewBtn")) {
      const index = e.target.id
      movies[index].sold++
      notification(`🎉 You successfully viewed "${movies[index].title}".`)
      renderMovies()
    }
  })