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

// Added NatSpec comments

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
/// @author (your name here)
contract MovieLibrary {

    uint public moviesLength = 0; // Changed the visibility to public to be able to access its value from the frontend
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    // Chnaged the variable naming convention to mixedCase(camel case)
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

    mapping (uint => Movie) internal movies; // Changed the visibility of the movies mapping to be able to access Movie structs stored in the mapping

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
        return movies[_index]; // Chnaged the return statement to be able to access all the stored properties
    }

    /// @notice View a movie, sends the view price of the movie to the movie owner, 
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
    }

// Removed the getMoviesLength function as it can be accessed from the moviesLength variable
// Removed the getMovieUserReviews, getMovieImbdScore, getMovieContentRating, getMovieImbdLink functions
// as the values they return can be accessed from the readMovies function
}