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

/// @title A movie library
/// @author (Patrick Walukagga)
contract MovieLibrary {

    uint public moviesLength = 0; // visibility is public to be able to access its value from the frontend
    //cUSd token contract address
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    struct Movie {
        address payable owner;
        string title;
        string genres;
        string image;
        string movieImbdLink;
        string contentRating;
        uint year;
        uint imbdScore;
        uint userReviews;
        uint views;
        uint viewPrice;
    }

    // track all movies
    mapping (uint => Movie) internal movies;

    //track movies viewed by a specific address
    mapping(address => Movie[]) public myPaidMovies;

    /// @notice Saves a movie, stores it in the movies mapping
    /// @param _title The title of the movie
    /// @param _genres The movie genre
    /// @param _image The movie image
    /// @param _movieImbdLink The movie IMBD link
    /// @param _contentRating The movie content rating
    /// @param _year The movie year
    /// @param _imbdScore The movie IMBD score
    /// @param _userReviews The movie user rating
    /// @param _viewPrice The movie viewing price
    function writeMovie(
        string memory _title,
        string memory _genres,
        string memory _image,
        string memory _movieImbdLink,
        string memory _contentRating,
        uint _year,
        uint _imbdScore,
        uint _userReviews,
        uint _viewPrice
    ) public {
        require(bytes(_title).length > 2, "Input is invalid");
        require(bytes(_genres).length > 2, "Input is invalid");
        require(bytes(_image).length > 5, "Input is invalid");
        require(bytes(_movieImbdLink).length > 5, "Input is invalid");
        require(bytes(_contentRating).length > 1, "Input is invalid");
        require(_year > 0, "Input is invalid");
        require(_viewPrice > 0, "Input is invalid");
        uint _views = 0;
        movies[moviesLength] = Movie(
            payable(msg.sender),
            _title,
            _genres,
            _image,
            _movieImbdLink,
            _contentRating,
            _year,
            _imbdScore,
            _userReviews,
            _views,
            _viewPrice
        );
        moviesLength++;
    }

    /// @notice Get a movie stored in the movies mapping, 
    /// @param _index The index of the movie
    /// @return A movie
    function readMovie(uint _index) public view returns (Movie memory) {
        return movies[_index];
    }

    /// @notice View a movie, sends the view price of the movie to the movie owner, 
    /// @notice And appends the movies to the list of my viewed/paid movies
    /// @param _index The index of the movie to be viewed
    function viewMovie(uint _index) public payable  {
        require(
          IERC20Token(cUsdTokenAddress).transferFrom(
            msg.sender,
            movies[_index].owner,
            movies[_index].viewPrice
          ),
          "Transfer failed."
        );
        movies[_index].views++;
        myPaidMovies[msg.sender].push(movies[_index]);
    }

    ///@notice A list of movies viewed by specific address
    ///@return Movie[]
    function getMyPaidMovies() public view returns(Movie[] memory){
        return myPaidMovies[msg.sender];
    }

    ///@notice Delete a movie from the movies records
    function deleteMovie(uint _index) public {
        require(movies[_index].owner == msg.sender,"You are not authorized to perform this action");
        delete movies[_index];
        moviesLength--;
    }
}