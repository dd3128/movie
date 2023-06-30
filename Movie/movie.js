class MovieDetailList {
  constructor(movieImage, movieName, ticketLimit) {
    this.movieImage = movieImage
    this.movieName = movieName
    this.ticketLimit = ticketLimit
    this.ticketsSold = 0
  }

  // Method to sell tickets
  sellTickets(numTickets) {
    if (this.ticketsSold >= this.ticketLimit) {
      alert(`Sorry, all tickets for ${this.movieName} are sold out.`)
      return
    }

    if (isNaN(numTickets) || numTickets <= 0) {
      alert(`Please enter a valid number of tickets. Thank you!`)
      return
    }

    if (this.ticketsSold + numTickets > this.ticketLimit) {
      alert(
        `Sorry, there are only ${
          this.ticketLimit - this.ticketsSold
        } tickets left.`
      )
      return
    }

    this.ticketsSold += numTickets
    alert(
      `You have purchased ${numTickets} tickets for ${this.movieName}. Thank you!`
    )
    displayScreenings()
    saveData()
  }

  // Method to print report
  printReport() {
    alert(`
              Movie: ${this.movieName}\n
              Tickets Sold: ${this.ticketsSold}\n
              Tickets Left: ${this.ticketLimit - this.ticketsSold}
          `)
  }
}

// Variables to store the selected movies for swapping
let firstMovieIndex = null
let secondMovieIndex = null

// Create an array to store movies
const screenings = [
  new MovieDetailList('./images/transformers.jpg', 'Transformers', 100),
  new MovieDetailList('./images/spiderman.jpg', 'Spider-Man', 90),
  new MovieDetailList('./images/flash.jpg', 'The Flash', 100),
  new MovieDetailList('./images/fast.jpg', 'Fast X', 80),
  new MovieDetailList('./images/galaxy.jpg', 'Guardians of the Galaxy', 100),
]

// Load ticket sales data from local storage
function loadData() {
  const data = localStorage.getItem('ticketSales')
  if (data) {
    const ticketSales = JSON.parse(data)
    if (Array.isArray(ticketSales)) {
      ticketSales.forEach((ticketSale, index) => {
        if (screenings[index]) {
          screenings[index].movieImage = ticketSale.movieImage
          screenings[index].movieName = ticketSale.movieName
          screenings[index].ticketsSold = ticketSale.ticketsSold
        }
      })
    }
  }
}

// Save ticket sales data to local storage
function saveData() {
  const ticketSales = screenings.map(screening => ({
    movieImage: screening.movieImage,
    movieName: screening.movieName,
    ticketsSold: screening.ticketsSold,
  }))
  localStorage.setItem('ticketSales', JSON.stringify(ticketSales))
}

// Function to sell tickets
function sellTickets(screeningIndex) {
  const screening = screenings[screeningIndex]
  const numTickets = parseInt(
    prompt(
      `How many tickets would you like for ${screening.movieName}? (${
        screening.ticketLimit - screening.ticketsSold
      } tickets left):`
    )
  )

  if (isNaN(numTickets) || numTickets <= 0) {
    alert('Invalid number of tickets. Please enter a positive number.')
    return
  }

  screening.sellTickets(numTickets)
  saveData()
}

// Function to display the movie screenings
function displayScreenings() {
  const screeningsList = document.getElementById('screeningsList')
  screeningsList.innerHTML = ''

  screenings.forEach((screening, index) => {
    const li = document.createElement('li')
    li.classList.add('movie-item')

    const img = document.createElement('img')
    img.src = screening.movieImage
    img.alt = screening.movieName
    img.classList.add('movie-image')
    img.onclick = () => sellTickets(index) // Call sellTickets with the movie index
    li.appendChild(img)

    const movieDetails = document.createElement('div')
    movieDetails.classList.add('movie-details')

    const movieName = document.createElement('span')
    movieName.textContent = screening.movieName
    movieDetails.appendChild(movieName)

    const ticketsLeft = screening.ticketLimit - screening.ticketsSold
    const ticketsLeftText = document.createElement('span')
    ticketsLeftText.textContent = ` (${ticketsLeft} tickets left)`
    ticketsLeftText.classList.add('tickets-left')
    movieDetails.appendChild(ticketsLeftText)

    li.appendChild(movieDetails)
    screeningsList.appendChild(li)
  })
}

// Change image click listen to swap ticket
function turnOnSwapMode() {
  alert('Swap mode is on. Please select a movie to swap.')
  let images = document.getElementsByClassName('movie-image')
  for (let i = 0; i < images.length; i++) {
    images[i].onclick = () => selectMovieForSwap(i)
  }
}

// Function to select a movie for swapping
function selectMovieForSwap(index) {
  if (firstMovieIndex === null) {
    // First movie selected
    firstMovieIndex = index
    alert('Please select another movie to swap with.')
  } else if (secondMovieIndex === null) {
    // Second movie selected
    secondMovieIndex = index
    swapMovies(firstMovieIndex, secondMovieIndex) // Call swapMovies with the selected movie indices
    firstMovieIndex = null
    secondMovieIndex = null
  }
}

// Function to swap movies
function swapMovies(index1, index2) {
  const orgMovie = screenings[index1].movieName
  const swapMovie = screenings[index2].movieName

  const detail = screenings[index1].movieName
  screenings[index1].movieName = screenings[index2].movieName
  screenings[index2].movieName = detail

  const image = screenings[index1].movieImage
  screenings[index1].movieImage = screenings[index2].movieImage
  screenings[index2].movieImage = image

  displayScreenings()
  saveData()

  alert(
    `Movies "${orgMovie}" and "${swapMovie}" have been swapped.
Swap Mode is off now.`
  )
}

// Function to print sales report
function salesReport() {
  let report = '--- Tickets Report ---\n'
  screenings.forEach(screening => {
    report += `Movie: ${screening.movieName}
              Tickets Sold: ${screening.ticketsSold}
              Tickets Left: ${screening.ticketLimit - screening.ticketsSold}\n`
  })

  alert(report)
}



// Function to print sales report
function printSalesReport() {
  let report = '--- Tickets Report ---\n';
  screenings.forEach(screening => {
    report += `Movie: ${screening.movieName}
              Tickets Sold: ${screening.ticketsSold}
              Tickets Left: ${screening.ticketLimit - screening.ticketsSold}\n`;
  });

  printDocument(report);
}

// Function to print a document
function printDocument(content) {
  const printWindow = window.open('', '_blank');
  printWindow.document.open();
  printWindow.document.write('<html><head><title>Print</title></head><body>');
  printWindow.document.write('<pre>' + content + '</pre>');
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
  printWindow.close();
}


// load localstorage data
loadData()

// Initial display of movie screenings
displayScreenings()
