import React, { Component } from 'react';
const apiKey = 'glrmAqW5aPGaqOaihIAmmWYaxKJj4eG5';
import '../style/home.scss';


function cloneAsObject(obj) {
  if (obj === null || !(obj instanceof Object)) {
      return obj;
  }
  var temp = (obj instanceof Array) ? [] : {};
  // ReSharper disable once MissingHasOwnPropertyInForeach
  for (var key in obj) {
      temp[key] = cloneAsObject(obj[key]);
  }
  return temp;
}


class Home extends Component{
  constructor(){
    super();

    this.state = {
      gifs: [],
      loading: true
    };
  }
  
  componentDidMount(){
    fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=10`)
    .then(results => {
      return results.json();
    }).then(results => {

      this.setState({
        gifs: results.data,
        loading: false
      })
    })
  }
  getLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {

        this.setState({ loc: JSON.stringify(cloneAsObject(position)) });

      })
    }
    else {
      console.info("geolocation is not supported in this environment");
      return false;
    }
  }
  render(){
    const {gifs, loc} = this.state; 

    return (
      <div className="home-container">
        <div className="location-container">
          <button 
            onClick={ () => { 
                this.getLocation();
              }
            }
          >
            Get Location
          </button>
          { 
            loc && 
            <p>
              {loc}
            </p>
          }
          {
            !loc && 
            <p>
              Unable to get the location.
            </p>
          }
        </div>
      <ul className="gif-container">
        { gifs && gifs.length > 0 && gifs.map(gif => <li key={gif.id}> <img src={gif.images.preview_gif.url} alt=""/></li>) }
      </ul>
      </div>

    )
  }
}

export default Home;
