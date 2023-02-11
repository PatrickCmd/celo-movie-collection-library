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


//Contract store movie details uploaded by users
contract MovieLibrary {
    //track the movie count
    uint internal moviesLength = 0;

    //cUSd token contract address
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    //Organize movie details in a struct
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

    //track all movies
    mapping (uint => Movie) public movies;


    //track movies bought by a specific address
    mapping(address => Movie[]) public myPaidMovies;


    //store movie details in the  smart contract
    function writeMovie(
        string calldata _title,
        string calldata _genres,
        string calldata _image,
        string calldata _imbdLink,
        string calldata _contentRating,
        uint _year,
        uint _imbd_score,
        uint _user_reviews,
        uint _view_price

    ) public {

        require(bytes(_title).length > 0, "Input is invalid");
        require(bytes(_genres).length > 0, "Input is invalid");
        require(bytes(_image).length > 0, "Input is invalid");
        require(bytes(_imbdLink).length > 0, "Input is invalid");
        require(bytes(_contentRating).length > 0, "Input is invalid");
        require(_view_price > 0, "Input is invalid");

        uint _views = 0;
        movies[moviesLength] = Movie(
            payable(msg.sender),
            _title,
            _genres,
            _image,
            _imbdLink,
            _contentRating,
            _year,
            _imbd_score,
            _user_reviews,
            _views,
            _view_price
        );
        moviesLength++;
    }

    //return movie with a specific index
    function readMovie(uint _index) public view returns (Movie memory) {
        return  movies[_index];
    
    }


    //pay for a movie to watch it
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
        myPaidMovies[msg.sender].push(movies[_index]);
    }


    //get all movies paid by the user
    function getMyPaidMovies() public view returns(Movie[] memory){
        return myPaidMovies[msg.sender];
    }


//Delete a movie
function deleteMovie(uint _index) public{
    require(movies[_index].owner == msg.sender,"You are not authorized");
    delete movies[_index];
}


}

