// SPDX-License-Identifier: MIT  

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
  function transfer(address, uint256) external returns (bool);
  function approve(address, uint256) external returns (bool);
  function transferFrom(address, address, uint256) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address) external view returns (uint256);
  function allowance(address, address) external view returns (uint256);

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

/* Movie Database
owner
title
genres
actors
image
movie_imbd_link
imbd_score
content_rating
year
user_reviews
views
view_price
country
*/

contract MovieLibrary {

    uint internal moviesLength = 0;
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct Movie {
        address payable owner;
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
    }

    mapping (uint => Movie) internal movies;

    function writeMovie(
        string memory _title,
        string memory _genres,
        string memory _image,
        string memory _movie_imbd_link,
        string memory _content_rating,
        uint _year,
        uint _imbd_score,
        uint _user_reviews,
        uint _view_price
    ) public {
        uint _views = 0;
        movies[moviesLength] = Movie(
            payable(msg.sender),
            _title,
            _genres,
            _image,
            _movie_imbd_link,
            _content_rating,
            _year,
            _imbd_score,
            _user_reviews,
            _views,
            _view_price
        );
        moviesLength++;
    }

    function readMovie(uint _index) public view returns (
        address payable,
        string memory,
        string memory,
        string memory,
        uint,
        uint,
        uint
    ) {
        return (
            movies[_index].owner,
            movies[_index].title,
            movies[_index].genres,
            movies[_index].image,
            movies[_index].year,
            movies[_index].views,
            movies[_index].view_price
        );
    }

    function viewMovie(uint _index) public payable  {
        require(
          IERC20Token(cUsdTokenAddress).transferFrom(
            msg.sender,
            movies[_index].owner,
            movies[_index].view_price
          ),
          "Transfer failed."
        );
        movies[_index].views++;
    }

    function getMoviesLength() public view returns (uint) {
        return (moviesLength);
    }

    function getMovieUserReviews(uint _index) public view returns (uint) {
        return (movies[_index].user_reviews);
    }

    function getMovieImbdScore(uint _index) public view returns (uint) {
        return (movies[_index].imbd_score);
    }

    function getMovieContentRating(uint _index) public view returns (string memory) {
        return (movies[_index].content_rating);
    }

    function getMovieImbdLink(uint _index) public view returns (string memory) {
        return (movies[_index].movie_imbd_link);
    }
}