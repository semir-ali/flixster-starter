### Component Architecture
App Component:
1. Responsibility: The main component that coordinates state and renders all child components
2. Render: Header, SearchBar, SortDropdown, MovieList, LoadMoreButton, MovieModal, Footer
Props: N/A
States: searchQuery (string - the current search term), currentPage (number - the current loaded page), totalPages (number - total pages available from the API for the given search term), sortOption (string - which sort selection is chosen), selectedMovieId (Id for the current movie), mode (string - determines whether to call Now Playing or Search API)

MovieList Component:
1. Responsibility: Fetch movie data from the API and render each of the movie cards
2. Render: SearchBar, Grid container with MovieCard components, LoadMoreButton
3. Props: onMovieClick (function that is called whenever a movie card in the list is clicked)
State: movies (array of objects - handles the list of movies currently displayed), isLoading (boolean - whether or not the page is loading API calls), error (string - error message given API fails), currentPage (number - the current loaded page), totalPages (number - total pages available from the API), searchQuery (string - the current search term), mode (string - determines whether to call Now Playing or Search API, values: "now_playing" or "search")

MovieCard Component:
1. Responsibility: Display the preview information for any given movie
2. Render: Cover image, movie title, and vote average rating
3: Props: movie (data about the movie), onClick (function that handles when the modal for movies is called)
State: N/A

MovieModal Component:
Responsibility: Show movie information in overlay view including AI-generated recommendation
Renders: Semi-transparent modal card with a backdrop image, title, runtime, release date, genres, and overview. Along with this, there's an AI recommendation section and close button to close the overlay
Props: movieId (number - ID of movie that's displayed), onClose (function - handles when modal closes)

Header Component:
Responsibility: Show the application's title/brand on top of page
Renders: The title (Flixster) and logo
Props: N/A
State: N/A

SearchBar Component:
Responsibility: Acquires the search inputs for movie search and displays current mode
Renders: Mode title ("Now Playing" or "Search Results for {query}"), "Now Playing" button (when in search mode), Text input, search button, and clear button
Props: searchQuery (string - current search value), onSearchChange (function - handles when a user types information), onSearchSubmit (function - handles when user submits search), onClearSearch (function - handles when the user clears information or clicks "Now Playing"), mode (string - current view mode to display proper title)

SortDropdown Component:
Responsibility: Helps user decide how to sort information based on the movie list
Renders: A dropdown menu with the options "Title (A-Z)," "Release Date (Newest)", and "Vote Average (Highest)."
Props: sortOption (string - the current sort selection), onSortChange (function - handles when user changes sort option)
State: N/A

LoadMoreMoviesButton Component:
Responsibility: Fetches new page of movies to add to movie list
Renders: Button with "Load More" text, and a loading spinner when specifically fetching information
Props: onLoadMore (function - handles when user requests to fetch new page), isVisible (boolean - handles when there's more pages to load), isLoading (boolean - checks if the API is still getting fetched or not)

Footer Component:
Responsibility: Display footer information
Renders: Copyright Notice and link to Movie Database (TMDb)
Props: N/A
State: N/A

### API Contracts
1. Now Playing Movies API Endpoint
Endpoint: GET /movie/now_playing
Purpose: Fetch all movies playing current in theaters for main page grid
URL Example: https://api.themoviedb.org/3/movie/now_playing?api_key=YOUR_KEY&page=1
Required parameters: API key
Response Fields Used: page (number - current page displayed), total_pages (number - total pages available), results (array - array of movie objects with id, title, post_path to image, and vote_average)
Error Cases to Handle: 401 (missing API key), 404 (Invalid endpoint, show "Service unavailable" message), Network Error (Show "Failed to load movies. Check your connection."), poster_path is null (No image to display; show placeholder image)

2. Search Movies API Endpoint
Endpoint: GET /search/movie
Purpose: Find movies based on title when the user puts search query
URL Example: https://api.themoviedb.org/3/search/movie?api_key=YOUR_KEY&query=inception&page=1
Required parameters: api_key, query_term
Response Fields Used: page (number - current page), total_pages (number - Total pages available), results (array - array of movie objects including their id, title, poster_path to image, and voter average)
Error Cases to Handle: 401 (missing API key), 404 (Invalid endpoint, show "Service unavailable" message), Network Error (Show "Failed to load movies. Check your connection."), empty results array (show no matches found for (query-term))

3. Movie Details API Endpoint
Endpoint: GET /movie/{movie_id}
Purpose: Get specific information for a movie when the modal opens (including its runtime/genre)
URL Example: https://api.themoviedb.org/3/movie/550?api_key=YOUR_KEY
Required Parameters: api_key, movie_id (movie ID from the path)
Response Fields Used: movie id, title, backdrop_path, runtime, release_date, genres, and overview
Error Cases to Handle: 401 (missing API key), 404 (Invalid endpoint, show "Service unavailable" message), Network Error (Show "Failed to load movies. Check your connection."), backdrop is null (use default image), runtime is null (don't show runtime), genres is an empty array (Show "Genre information unavailable)


### State Architecture
movies
Type: array
Initial Value: []
Update Trigger: Based on API response from Now Playing or Search
Purpose: Holds list of movies to display

searchQuery
Type: string
Initial Value: ""
Update Trigger: User types in the search bar
Purpose: Tracks current search term for API call

currentPage 
Type: number
Initial Value: 1
Update Trigger: "Load More" button is clicked or search is submitted
Purpose: Tracks which page needs to get fetched from the API

totalPages
Type: number
Initial Value: 1
Update Trigger: API response for total number of pages received
Purpose: Stores the total amount of pages available to hide "Load More" button when hit the maximum number of pages

sortOption
Type: string
Initial Value: "title"
Update Trigger: User chooses from sort dropdown
Purpose: Decides how to sort movies

selectedMovieId
Type: number
Initial Value: null
Update Trigger: Specific movie card is clicked or the movie modal is closed
Purpose: ID of movie that needs to be shown in the modal

isLoading
Type: boolean
Initial Value: false
Update Trigger: When API fetch for loading more movies starts and ends
Purpose: Shows loading state while fetching movies

error
Type: string/null
Initial Value: null
Update Trigger: When an API fetch fails
Purpose: Stores an error message that can get displayed to the user

mode
Type: string
Initial Value: "now_playing"
Update Trigger: Whenever the search is submitted or "Now Playing" is clicked
Purpose: Determines whether to call Now Playing or Search API

moveDetails
Type: object/null
Initial Value: null
Update Trigger: TDMb Movie Details API responds
Purpose: Shows the movie's full details (i.e. runtime, genres, backdrop, overview)


### Data Flow
Once the App component mounts, it takes the movie from the TMDb Now Playing endpoint and puts it into the results array (changing its state). Then this information about the movie's raw data (id, title, poster_path, vote_average, and poster_path to the movie's image) can be used to render the MovieCard component. When a user clicks the MovieCard, its onClick handler calls the onClick prop that it got from its parent component (MovieList) which calls onMovieClick (another prop) which passes the ID back up to the App component and also renders the MovieModal such that this movie is displayed.

### AI Feature Spec

Which component will display the AI insight? (Hint: MovieModal)
The MovieModal will have display the AI insight.

What movie data will you send to the AI as context? (title, genres, overview)
The context necessary are the title, genres, and overview.

What do you want the AI to return? (e.g., a 2–3 sentence "watch recommendation")
The AI should return 2-3 sentence that gives a watch recommendation that describes whether if the movie should be watched NOT including spoilers or generic phrases

Where does the AI response live in state?
The MovieModal component should hold the AI response in state, specifically in a variable called aiInsight which is a string/null with the default value of null.