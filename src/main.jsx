import { createRoot } from "react-dom/client"
import { Component } from "react"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      quote: { content: "", author: "" },
      wallpaper: ""
    }
    this.fetchQuote = this.fetchQuote.bind(this)
    this.fetchWallpaper = this.fetchWallpaper.bind(this)
    this.fetchData = this.fetchData.bind(this)
  }
  
  componentDidMount() {
    this.fetchData()
  }

  fetchData() {
    Promise.all([this.fetchQuote(), this.fetchWallpaper()]).then(([[content, author], wallpaper]) => {
      this.setState({
        quote: {
          content: content,
          author: author,
        },
        wallpaper: wallpaper
      })
    }).catch(error => {
      console.error("A promise was rejected: ", error)
    })
  }

  async fetchQuote() {
    const response = await fetch("https://api.quotable.io/random")
    const data = await response.json()
    return [data.content, data.author]
  }

  async fetchWallpaper() {
    const response = await fetch("https://api.unsplash.com/photos/random?client_id=sd6z3HwQyWZC4Vfi0ZaA41v-25ymYq4xwsO2kf5e2jI")
    const data = await response.json()
    return data["urls"]["full"]
  }

  render() {
    const wallpaperStyle = {
      backgroundImage: `url("${this.state.wallpaper}")`, 
      backgroundPosition: "center",
      backgroundSize: "cover"
    }
    return (
      <div className="d-flex justify-content-center align-items-center vh-100" style={wallpaperStyle}>
        <main id="quote-box" className="card w-75">
          <blockquote className="card-body blockquote">
            <p id="text">{this.state.quote.content}</p>
            <p id="author" className="blockquote-footer">{this.state.quote.author}</p>          
          </blockquote>

          <section className="card-footer d-flex justify-content-between">
            <a href={"https://twitter.com/intent/tweet?text=" + this.state.quote.content} id="tweet-quote">
              <img src="/random-quote-machine/X.png" alt="X logo" className="bg-dark rounded" style={{height: 32, width: 32}}/>
            </a>
            <button type="button" id="new-quote" className="btn btn-dark" onClick={this.fetchData}>New Quote</button>
          </section>
        </main>
      </div>
    )
  }
}

const root = createRoot(document.getElementById("root"))
root.render(<App />)