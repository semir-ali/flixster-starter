# Flixster - Product Design Document

**Project:** Flixster Movie Discovery Platform  
**Author:** Semir Ali  
**Date:** June 14, 2026  
**Version:** 1.0 

---

## Executive Summary

Flixster is a dynamic, interactive web application that helps users discover movies they'll love. Built with React, the platform combines real-time movie data from The Movie Database (TMDb) API with AI-powered recommendations to create a personalized movie discovery experience. Users can search for movies, view detailed information, manage their favorites and watched lists, and receive intelligent recommendations based on their preferences.

---

## Product Vision & Goals

### Vision
Create an intuitive, Netflix-inspired movie discovery platform that helps users quickly find movies worth watching through personalized recommendations, intelligent search, and AI-powered insights.

### Key Goals
1. **Discovery**: Enable users to easily browse and discover movies currently playing in theaters
2. **Personalization**: Provide tailored movie recommendations based on user preferences and viewing history
3. **Information**: Deliver comprehensive movie details with AI-generated watch recommendations
4. **Organization**: Allow users to track their favorite movies and watched list
5. **Accessibility**: Ensure the platform is responsive, accessible, and works across all device sizes

---

## Technical Stack

- **Frontend Framework**: React 18.2.0
- **Build Tool**: Vite 5.2.0
- **Routing**: React Router v6 (for multi-page navigation)
- **Styling**: CSS3 (with responsive grid/flexbox layouts)
- **APIs**:
  - TMDb API (movie data, search, details, similar movies)
  - OpenRouter API (AI-powered watch recommendations)
- **Runtime**: Node.js
- **State Management**: React hooks (useState, useEffect, useContext for global state)
- **Storage**: localStorage (for favorites, watched list, user preferences)

---

## Visual Architecture

### Core User Journey

This diagram shows the primary user flow through the application, with explicit actions labeled on each transition:

```mermaid
flowchart TD
    Start([User Opens Flixster Website<br/>in Browser]) --> NowPlaying["Main Page Loads:<br/>Grid showing 20 'Now Playing' movies<br/>(poster, title, rating for each)"]
    NowPlaying --> Choice{What does<br/>user do next?}
    
    Choice -->|"User scrolls to bottom<br/>and clicks 'Load More' button"| LoadMore["Fetch next page from API<br/>(movies 21-40)<br/>and append to grid"]
    LoadMore --> NowPlaying
    
    Choice -->|"User clicks on any<br/>MovieCard in grid"| Modal["Modal window opens<br/>overlaying the page"]
    Modal -->|"Automatically fetches<br/>movie details from TMDb"| FetchDetails["Loading spinner shows<br/>while fetching runtime,<br/>genres, backdrop"]
    FetchDetails -->|"Details received,<br/>now fetch AI insight"| FetchAI["Loading message:<br/>'✨ Getting a recommendation...'<br/>calls OpenRouter API"]
    FetchAI -->|"AI response received"| DisplayModal["Modal displays:<br/>- Backdrop image<br/>- Title, runtime, date, genres<br/>- Overview<br/>- AI recommendation"]
    DisplayModal --> CloseModal{How does<br/>modal close?}
    CloseModal -->|"User clicks X button,<br/>presses Escape key,<br/>or clicks outside modal"| NowPlaying
    CloseModal -->|"User still reading"| DisplayModal
    
    Choice -->|"User types movie name<br/>in search bar at top"| SearchInput["Search query updates<br/>as user types<br/>(controlled input)"]
    SearchInput --> Submit{Does user<br/>submit search?}
    Submit -->|"User presses Enter<br/>or clicks Search button"| SearchAPI["Clear current movies,<br/>fetch from TMDb Search API<br/>with query term"]
    SearchAPI --> SearchView["Search Results Page:<br/>Grid showing matching movies<br/>(same layout as Now Playing)"]
    SearchView --> SearchChoice{What does<br/>user do next?}
    SearchChoice -->|"User scrolls and clicks<br/>'Load More' button"| SearchPaginate["Fetch next page<br/>of search results<br/>and append to grid"]
    SearchPaginate --> SearchView
    SearchChoice -->|"User clicks any<br/>MovieCard in results"| Modal
    SearchChoice -->|"User clicks 'Now Playing' button<br/>or clears search bar"| NowPlaying
    
    Choice -->|"User selects option from<br/>Sort dropdown menu"| Sort["Re-order currently loaded movies by:<br/>- Title (A-Z)<br/>- Release Date (Newest)<br/>- Vote Average (Highest)"]
    Sort --> NowPlaying
```

### Modal Data Flow (Sequence Diagram)

This diagram illustrates the technical flow when a user clicks a movie card, showing each component interaction and API call:

```mermaid
sequenceDiagram
    participant User as User<br/>(Browser)
    participant MovieCard as MovieCard<br/>Component
    participant App as App<br/>Component<br/>(Parent State)
    participant TMDb as TMDb API<br/>(Movie Database)
    participant OpenRouter as OpenRouter API<br/>(AI Service)
    participant MovieModal as MovieModal<br/>Component

    Note over User,MovieModal: User clicks a movie poster in the grid
    User->>MovieCard: Clicks on movie card
    MovieCard->>App: Calls onMovieClick(movieId=12345)
    Note over App: Stores which movie to show
    App->>App: setSelectedMovieId(12345)
    Note over App: Conditional rendering triggers
    App->>MovieModal: Renders MovieModal with movieId=12345
    
    Note over MovieModal: React useEffect detects movieId changed
    MovieModal->>MovieModal: useEffect: movieId changed, start fetch
    Note over MovieModal,TMDb: Fetch full movie details (runtime, genres)
    MovieModal->>TMDb: GET /movie/12345?api_key=...
    TMDb-->>MovieModal: Returns: {title, runtime, genres, backdrop_path, overview}
    MovieModal->>MovieModal: setMovieDetails(response data)
    
    Note over MovieModal: React useEffect detects movieDetails loaded
    MovieModal->>MovieModal: useEffect: details ready, get AI insight
    Note over MovieModal,OpenRouter: Request AI recommendation with movie context
    MovieModal->>OpenRouter: POST /chat/completions<br/>Body: {title, genres, overview}
    OpenRouter-->>MovieModal: Returns: "This thriller keeps you on edge..."
    MovieModal->>MovieModal: setAiInsight(AI response text)
    
    Note over MovieModal,User: All data loaded, display complete modal
    MovieModal->>User: Displays modal with:<br/>- Backdrop<br/>- Title, runtime, date, genres<br/>- Overview<br/>- AI recommendation
    
    Note over User,MovieModal: User finishes reading and closes modal
    User->>MovieModal: Clicks X button, Escape, or outside click
    MovieModal->>App: Calls onClose() callback
    Note over App: Clear the selected movie ID
    App->>App: setSelectedMovieId(null)
    Note over App: Modal unmounts, all state cleared
    App->>App: MovieModal no longer renders
```

---

## User Flows

### 1. First-Time User Flow 
1. User opens Flixster
2. Onboarding modal appears: "What are your favorite genres?"
3. User selects 2-5 genres from a list
4. Preferences saved to localStorage
5. User lands on personalized Home Screen with genre-based sections

### 2. Core Discovery Flow 
1. User lands on main page showing "Now Playing" movies in a grid
2. User scrolls through movies, clicks "Load More" to see additional pages
3. User clicks a MovieCard → Modal opens with details + AI recommendation
4. User closes modal, continues browsing
5. User enters search query → View switches to Search Results
6. User clicks "Now Playing" or clears search → Returns to Now Playing view

### 3. Search Flow 
1. User types movie title in search bar
2. Search results update in real-time (or on submit)
3. Results displayed in same grid layout
4. User can sort results by title, release date, or vote average
5. "Load More" button appends additional search result pages

### 4. Favorites & Watched Flow 
1. User hovers over MovieCard → "Heart" icon and "Watched" checkbox appear
2. User clicks heart → Movie added to Favorites (saved to localStorage)
3. User clicks watched → Movie marked as Watched (saved to localStorage)
4. User navigates to Favorites page (via navigation) → See all favorited movies
5. User navigates to Watched page → See all watched movies
6. Favorited/watched movies display visual indicator (filled heart, checkmark badge)

### 5. Recommendation System Flow 
1. User lands on Home Screen (different from main page)
2. 8 category sections displayed:
   - "Now Playing" (required)
   - "Top Rated" (required)
   - "Similar to [Favorited Movie #1]"
   - "Similar to [Favorited Movie #2]"
   - "[Favorite Genre #1] Movies"
   - "[Favorite Genre #2] Movies"
   - "Similar to [Watched Movie]"
   - [Random Genre] (fallback if not enough favorites/watched)
3. Each section shows ~20 movies in a horizontal scrollable carousel
4. Carousel wraps around to beginning after 20 items (indicates user has explored enough)
5. User clicks card → Modal opens with details

---

## Feature Requirements

### Core Features 

#### F1: Display Movies (Now Playing)
- **Description**: Fetch and display movies currently playing in theaters
- **API**: TMDb `/movie/now_playing` endpoint
- **UI**: Responsive grid layout with MovieCard components
- **Card Content**: Poster image, title, vote average
- **Pagination**: "Load More" button appends next page (20 movies/page)
- **Success Criteria**: Grid displays movies, Load More works, button disappears when all pages loaded

#### F2: Search Functionality
- **Description**: Allow users to search for movies by title
- **API**: TMDb `/search/movie` endpoint
- **UI**: Search bar at top of page with controlled input
- **Behavior**: 
  - Typing updates search query state
  - Submit (Enter key or button click) triggers search
  - View switches from Now Playing to Search Results
  - Search results displayed in same grid layout
  - "Load More" works for search results pagination
- **Toggle**: User can return to Now Playing (clear search or "Now Playing" button)
- **Success Criteria**: Search returns relevant results, pagination works, toggle between modes works

#### F3: Sort Functionality
- **Description**: Sort current movie list by different criteria
- **UI**: Dropdown with 3 options: "Title (A-Z)", "Release Date (Newest)", "Vote Average (Highest)"
- **Behavior**: 
  - Sorts currently loaded movies in state (client-side)
  - Does NOT re-fetch from API
  - Works for both Now Playing and Search Results views
- **Note**: Sorting only applies to loaded movies, not entire TMDb catalog
- **Success Criteria**: All 3 sort options work correctly

#### F4: Movie Details Modal
- **Description**: Display comprehensive movie information in an overlay
- **Trigger**: User clicks any MovieCard
- **API**: TMDb `/movie/{movie_id}` endpoint (for runtime, genres)
- **Content**:
  - Backdrop image (full-width header)
  - Title
  - Runtime (e.g., "2h 28m")
  - Release date
  - Genres (comma-separated or tags)
  - Overview (plot synopsis)
  - **AI Watch Recommendation** (see F5)
- **Close Behavior**: X button, click outside modal, or press Escape
- **State Cleanup**: Clear selected movie ID and AI response when closed
- **Success Criteria**: Modal opens, displays all content, closes properly, handles errors

#### F5: AI-Powered Watch Recommendation
- **Description**: Generate personalized recommendation when modal opens
- **API**: OpenRouter API (`https://openrouter.ai/api/v1/chat/completions`)
- **Model**: `meta-llama/llama-3.3-70b-instruct:free` or `google/gemma-3-27b-it:free`
- **Inputs**: Movie title, genres (comma-separated), overview
- **Prompt Spec**:
  - **Role**: "An enthusiastic but honest film critic"
  - **Task**: "Write a 2-3 sentence watch recommendation for this movie"
  - **Output Format**: Plain text, 2-3 sentences, no spoilers, no "I" statements
  - **Constraints**: No plot spoilers, no generic phrases like "must-see", no comparisons unless helpful
- **States**:
  - Loading: "✨ Getting a recommendation..." (while API call in progress)
  - Success: Display AI-generated text
  - Failure: "We couldn't generate a recommendation for this one — check out the overview above!"
- **Trigger**: When movie details are fetched (useEffect on movie ID change)
- **Success Criteria**: AI response appears in modal, loading state shown, failures handled gracefully

#### F6: Responsive Design
- **Description**: Grid adapts to different screen sizes
- **Breakpoints**: 
  - Mobile (<600px): 1-2 cards per row
  - Tablet (600-1024px): 3-4 cards per row
  - Desktop (>1024px): 4-6 cards per row
- **Technique**: CSS Grid with `repeat(auto-fill, minmax(200px, 1fr))` or media queries
- **Success Criteria**: Layout works on mobile, tablet, desktop; no overflow or collapsed cards

#### F7: Header & Footer
- **Header Content**: App name "Flixster", optional logo/tagline
- **Footer Content**: Copyright notice, link to TMDb, optional GitHub link
- **Position**: Header at top, Footer at bottom
- **Success Criteria**: Both components render, look polished

#### F8: Error Handling & Loading States
- **Loading States**: Displayed while fetching movies, movie details, AI recommendation
- **Error States**: 
  - API call fails → User sees helpful message (not broken UI)
  - Movie has null poster → Show fallback image
  - Movie details fail → Modal shows error message
  - AI call fails → Show fallback message (see F5)
- **Success Criteria**: No broken UI states, user always sees something meaningful

#### F9: Accessibility
- **Images**: All `<img>` elements have descriptive `alt` attributes (e.g., `alt="${movie.title} poster"`)
- **Contrast**: Text/background colors meet WCAG 2.0 Level AA (4.5:1 ratio)
- **Keyboard Navigation**: 
  - MovieCards focusable and activatable via Tab + Enter
  - Modal closeable via Escape key
  - Search bar, buttons, sort dropdown keyboard-accessible
- **Semantic HTML**: `<header>`, `<main>`, `<footer>`, `<button>`, `<input>` used correctly
- **Success Criteria**: Passes keyboard navigation test, contrast checker, semantic HTML validation

#### F10: Planning Documentation
- **File**: `planning.md` in project root
- **Committed**: Before implementation begins
- **Sections**:
  1. **Component Architecture**: List all components, responsibilities, props, state, parent-child hierarchy
  2. **API Contracts**: Document all TMDb + OpenRouter endpoints, parameters, response fields, error cases
  3. **State Architecture**: List all state variables, types, initial values, owner components, update triggers
  4. **Data Flow**: Describe how data moves from API → components → MovieCard
  5. **AI Feature Spec**: Prompt spec, endpoint, model, state variables, trigger, decisions log
- **Success Criteria**: Spec exists, covers all 5 sections, updated as implementation evolves

---

### Features 

#### S1: React Router - Multi-Page Navigation
- **Pages**:
  - `/` or `/home` - Recommendation Home Screen (Netflix-style sections)
  - `/search` - Main Search page (Now Playing + Search)
  - `/favorites` - Favorited movies grid
  - `/watched` - Watched movies grid
- **Navigation**: Header nav bar with links to all pages
- **State Persistence**: Favorites/Watched lists persist via localStorage across page changes
- **Success Criteria**: All pages accessible, navigation works, state persists

#### S2: Favorites System
- **UI**: Heart icon on MovieCard (hover to reveal, or always visible)
- **Behavior**:
  - Click heart → Add to favorites (localStorage: `flixster_favorites` array of movie IDs)
  - Click again → Remove from favorites
  - Favorited cards show filled heart icon
- **Favorites Page**: Grid of all favorited movies, fetched from TMDb by ID
- **Success Criteria**: Favorites persist on refresh, page displays correctly, unfavorite works

#### S3: Watched List System
- **UI**: Checkmark icon or "Watched" button on MovieCard
- **Behavior**:
  - Click watched → Add to watched list (localStorage: `flixster_watched` array of movie IDs)
  - Click again → Remove from watched
  - Watched cards show checkmark badge
- **Watched Page**: Grid of all watched movies
- **Success Criteria**: Watched list persists, page displays correctly, unwatch works

#### S4: Genre Onboarding Flow
- **Trigger**: First visit (check localStorage for `flixster_genres` key)
- **UI**: Modal with genre selection (checkboxes or tags)
- **Genres**: Comedy, Drama, Action, Horror, Romance, Thriller, Sci-Fi, Fantasy, etc. (from TMDb genre list)
- **Selection**: User picks 2-5 favorite genres
- **Storage**: Save to localStorage: `flixster_genres` array of genre IDs
- **Skip Option**: "Skip for now" → Select 2 random genres as default
- **Success Criteria**: Modal appears on first visit only, preferences saved, skip works

#### S5: Netflix-Style Home Screen (Recommendation System)
- **Route**: `/` or `/home`
- **Layout**: 8 horizontal scrollable sections (carousels)
- **Section Composition**:
  - **Required** (2 sections):
    1. "Now Playing" (TMDb `/movie/now_playing`)
    2. "Top Rated" (TMDb `/movie/top_rated`)
  - **Dynamic** (6 sections, priority order):
    1. "Similar to [Favorited Movie #1]" (TMDb `/movie/{id}/similar`)
    2. "Similar to [Favorited Movie #2]" (TMDb `/movie/{id}/similar`)
    3. "[Genre #1] Movies" (TMDb `/discover/movie?with_genres={id}`)
    4. "[Genre #2] Movies" (TMDb `/discover/movie?with_genres={id}`)
    5. "Because You Watched [Movie]" (TMDb `/movie/{id}/similar`)
    6. [Random Genre] (fallback if not enough favorites/watched)
- **Selection Logic**:
  - If user has 2+ favorited movies → Use 2 random favorites for "Similar to" sections
  - If user has <2 favorites → Fill remaining slots with genre-based sections
  - If user has 2+ watched movies → Use 1 random watched for "Because You Watched" section
  - If not enough content → Fill with random genre sections
- **Carousel Behavior**:
  - Display ~20 movies per section
  - Horizontal scroll (not vertical)
  - Wrap around to beginning after last item (indicates end)
  - No "Load More" on carousels
- **Success Criteria**: 8 sections display, carousels scroll, sections personalized based on user data

#### S6: Embedded Trailers
- **Location**: Movie modal
- **API**: TMDb `/movie/{movie_id}/videos` endpoint
- **Filter**: Find video where `type === "Trailer"` and `site === "YouTube"`
- **Embed**: Use YouTube iframe embed: `https://www.youtube.com/embed/{video_key}`
- **Fallback**: If no trailer available, hide trailer section
- **Success Criteria**: Trailer plays in modal, fallback works

#### S7: Deployment
- **Platform**: Render (render.com)
- **Configuration**: May require `render.yaml` or build settings
- **Environment Variables**: TMDb and OpenRouter API keys set in Render dashboard
- **Success Criteria**: App deployed, publicly accessible, APIs work in production

---

## Design Decisions

This section documents key architectural choices, the options considered, and the rationale behind each decision.

### Decision #1: Movie Details Display Pattern

**Context**: When a user clicks a MovieCard, how should we display the detailed movie information?

**Options Considered**:

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A: Modal Overlay** | Open details in centered modal over current page | ✅ Fast, no page navigation<br/>✅ User keeps browsing context<br/>✅ Less routing complexity<br/>✅ Familiar UX pattern | ❌ Limited screen space<br/>❌ Accessibility requires careful focus management |
| **B: Separate Detail Page** | Navigate to `/movie/:id` route | ✅ Full screen for content<br/>✅ Shareable URLs<br/>✅ Browser back button works | ❌ Loses browsing position<br/>❌ Slower (page load)<br/>❌ More complex state management |
| **C: Expandable Card** | Card expands in-place to show details | ✅ No navigation or overlay<br/>✅ Smooth animation | ❌ Disrupts grid layout<br/>❌ Poor UX for long descriptions<br/>❌ Difficult on mobile |

**Decision**: **Option A - Modal Overlay**

**Rationale**:
- Assignment explicitly requires a modal
- Fastest user experience (no page load)
- Keeps user in "browsing mode" - can quickly check multiple movies
- Better for discovery flow (key goal of app)
- Modal can fetch additional data (runtime, genres) without disrupting current movie list

**Tradeoffs Accepted**:
- No shareable URLs for specific movies (acceptable for MVP)
- Must implement focus trap and Escape key handling for accessibility
- Mobile users see less content at once (mitigated by scrollable modal)

**Implementation Notes**:
- Use `position: fixed` overlay with `rgba(0,0,0,0.8)` backdrop
- Fetch movie details only when modal opens (lazy loading)
- Clear modal state on close to prevent stale data

---

### Decision #2: Pagination Strategy

**Context**: How should users load additional movies beyond the initial 20 results?

**Options Considered**:

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A: "Load More" Button** | User clicks button to append next page | ✅ User controls when to load<br/>✅ Clear feedback (button disabled when done)<br/>✅ Keyboard accessible<br/>✅ Assignment requirement | ❌ Extra click required<br/>❌ Less "modern" than alternatives |
| **B: Infinite Scroll** | Automatically load next page when user scrolls to bottom | ✅ Seamless, no clicks<br/>✅ Modern UX pattern<br/>✅ Works well on mobile | ❌ User loses footer access<br/>❌ Harder to reach specific movie<br/>❌ Accessibility challenges (keyboard users) |
| **C: Traditional Pagination** | Page numbers (1, 2, 3...) with previous/next buttons | ✅ Easy to jump to specific page<br/>✅ Clear position indication | ❌ Replaces content (loses browsing context)<br/>❌ Slower (user must re-scan grid)<br/>❌ More clicks to explore |

**Decision**: **Option A - "Load More" Button**

**Rationale**:
- Explicitly required by assignment specifications
- Best balance of user control and accessibility
- Appending (not replacing) content preserves browsing context
- Clear feedback when all pages loaded
- Works well for both Now Playing and Search Results modes

**Tradeoffs Accepted**:
- Requires an extra click vs. infinite scroll (minor UX friction)
- Less visually seamless than auto-loading

**Implementation Notes**:
- Button disabled/hidden when `currentPage >= totalPages`
- Shows loading spinner while fetching
- Use `setMovies(prev => [...prev, ...newMovies])` to append

---

### Decision #3: Sorting Implementation

**Context**: Where should movie sorting logic be executed?

**Options Considered**:

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A: Client-Side Sorting** | Sort movies in browser using JavaScript `.sort()` | ✅ Instant (no API call)<br/>✅ No server load<br/>✅ Simple implementation<br/>✅ Works offline | ❌ Only sorts loaded movies<br/>❌ Not "true" global sort |
| **B: Server-Side Sorting** | Pass `sort_by` param to TMDb API | ✅ Sorts entire catalog<br/>✅ "True" sort across all pages | ❌ Requires new API call (slow)<br/>❌ Clears current movie list<br/>❌ TMDb has limited sort options<br/>❌ Doesn't work for Search results |
| **C: Hybrid Approach** | Server sort for Now Playing, client sort for Search | ✅ Best of both worlds | ❌ Inconsistent UX<br/>❌ More complex logic<br/>❌ User confusion |

**Decision**: **Option A - Client-Side Sorting**

**Rationale**:
- Instant feedback (no loading state)
- Works consistently for both Now Playing and Search Results
- Sorting "loaded movies" is sufficient for MVP use case
- User likely has loaded 2-4 pages (40-80 movies) before sorting - enough for meaningful sort
- Simpler implementation, fewer edge cases

**Tradeoffs Accepted**:
- Sorting only reorders loaded movies, not entire TMDb catalog
- If user wants "highest rated movie of all time," they'd need to Load More until they've loaded all pages (impractical)
- Document this limitation in planning.md and in-app (tooltip or help text)

**Implementation Notes**:
- Create derived `sortedMovies` array in render (don't mutate state)
- Use `[...movies].sort(compareFn)` to avoid mutating original array
- Support three comparators: title (localeCompare), release_date (date comparison), vote_average (numeric)

---

### Decision #4: Favorites/Watched Persistence 

**Context**: How should favorites and watched movies be stored?

**Options Considered**:

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A: localStorage** | Store movie IDs in browser's localStorage | ✅ No backend required<br/>✅ Simple implementation<br/>✅ Persists across sessions<br/>✅ Free | ❌ Not shareable across devices<br/>❌ Lost if user clears browser data<br/>❌ Not synced |
| **B: Backend Database** | Store in server DB (requires Node.js + Express + DB) | ✅ Shareable across devices<br/>✅ Secure<br/>✅ Supports multi-user | ❌ Requires authentication<br/>❌ Much more complex<br/>❌ Hosting costs<br/>❌ Out of scope for assignment |
| **C: URL Query Params** | Encode favorites as URL params (e.g., `?fav=123,456`) | ✅ Shareable via URL<br/>✅ No storage needed | ❌ URL length limits<br/>❌ Lost on navigation<br/>❌ Poor UX (ugly URLs) |

**Decision**: **Option A - localStorage**

**Rationale**:
- Assignment explicitly states "no authentication"
- Stretch feature scope doesn't justify backend complexity
- localStorage sufficient for learning goals (state management, persistence)
- User can export/import favorites later if needed (future feature)
- Fast read/write performance

**Tradeoffs Accepted**:
- Data not synced across devices (acceptable for personal use)
- Lost if user clears browser data (document in help text)
- No server-side validation or backup

**Implementation Notes**:
- Store as JSON arrays: `localStorage.setItem('flixster_favorites', JSON.stringify([123, 456]))`
- Read on App mount: `useState(() => JSON.parse(localStorage.getItem('flixster_favorites')) || [])`
- Write on every toggle: `localStorage.setItem('flixster_favorites', JSON.stringify(newFavorites))`
- Validate IDs exist before fetching movie details

---

### Decision #5: App Structure - Multi-Page vs Single-Page 

**Context**: Should the app use React Router for separate pages, or conditional rendering on one page?

**Options Considered**:

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A: Multi-Page with Router** | Separate routes: `/`, `/search`, `/favorites`, `/watched` | ✅ Clear URL structure<br/>✅ Browser back/forward works<br/>✅ Easier to add pages later<br/>✅ Better for SEO (if relevant) | ❌ More setup (install Router)<br/>❌ Slightly more complex state management |
| **B: Single-Page with Conditional Rendering** | One component, show/hide sections based on state | ✅ Simpler (no Router)<br/>✅ Faster transitions<br/>✅ Less boilerplate | ❌ No URL history<br/>❌ Harder to share specific views<br/>❌ Less scalable |

**Decision**: **Option A - Multi-Page with React Router** 

**Rationale**:
- Better user experience (back button works intuitively)
- Cleaner separation of concerns (Search page vs. Favorites page)
- Easier to add new pages later (e.g., Watched, Settings)
- Industry-standard pattern for multi-view apps
- MVP can start with Option B, then migrate to Option A for stretch

**Tradeoffs Accepted**:
- Slightly more initial setup (install `react-router-dom`)
- Need to lift state to App or use Context API for shared data
- Routing adds ~20KB to bundle size (negligible)

**Implementation Notes**:
- MVP: Build as single-page with conditional rendering (simpler to start)
- Stretch: Refactor to Router, move views into separate page components
- Use `<BrowserRouter>`, `<Routes>`, `<Route>`, `<Link>` from `react-router-dom`
- Keep favorites/watched state in App (or Context) to share across routes

---

## Component Architecture

### Component Hierarchy

```
App
├── Header
│   └── Navigation (stretch: links to /home, /search, /favorites, /watched)
├── Main Content (conditional rendering based on route)
│   ├── SearchPage (MVP: default view)
│   │   ├── SearchBar
│   │   ├── SortDropdown
│   │   ├── MovieList
│   │   │   └── MovieCard (multiple)
│   │   │       ├── FavoriteButton (stretch)
│   │   │       └── WatchedButton (stretch)
│   │   └── LoadMoreButton
│   ├── HomePage (stretch: recommendation system)
│   │   └── CategorySection (8 instances)
│   │       ├── SectionHeader
│   │       └── MovieCarousel
│   │           └── MovieCard (multiple)
│   ├── FavoritesPage (stretch)
│   │   └── MovieList
│   │       └── MovieCard (multiple)
│   └── WatchedPage (stretch)
│       └── MovieList
│           └── MovieCard (multiple)
├── MovieModal (conditional, rendered in App)
│   ├── ModalOverlay
│   ├── ModalContent
│   │   ├── BackdropImage
│   │   ├── MovieDetails
│   │   ├── AIRecommendation
│   │   └── TrailerEmbed (stretch)
│   └── CloseButton
└── Footer
```

### Component Specifications

#### App
- **Responsibility**: Root component, manages global state, routing (stretch)
- **State**:
  - `movies` (array): Current movie list
  - `searchQuery` (string): Current search term
  - `currentPage` (number): Current pagination page
  - `totalPages` (number): Total pages available from API
  - `sortOption` (string): Current sort selection ("title" | "release_date" | "vote_average")
  - `selectedMovieId` (number | null): ID of movie for modal
  - `isLoading` (boolean): Loading state for movie fetch
  - `error` (string | null): Error message if fetch fails
  - `mode` (string): "now_playing" | "search" 
  - `favorites` (array): Array of favorited movie IDs (stretch, from localStorage)
  - `watched` (array): Array of watched movie IDs (stretch, from localStorage)
  - `userGenres` (array): User's favorite genre IDs (stretch, from localStorage)
- **Props**: None
- **Renders**: Header, Main Content (conditional), MovieModal (conditional), Footer

#### Header
- **Responsibility**: Display app branding and navigation
- **Props**: None (stretch: `currentRoute` for active nav state)
- **State**: None
- **Renders**: App name/logo, Navigation links (stretch)

#### SearchBar
- **Responsibility**: Capture user search input
- **Props**: 
  - `searchQuery` (string): Current value
  - `onSearchChange` (function): Update search query
  - `onSearchSubmit` (function): Trigger search
  - `onClearSearch` (function): Return to Now Playing
- **State**: None (controlled component)
- **Renders**: Input field, search button, clear/reset button

#### SortDropdown
- **Responsibility**: Allow user to select sort option
- **Props**:
  - `sortOption` (string): Current selection
  - `onSortChange` (function): Update sort option
- **State**: None (controlled component)
- **Renders**: `<select>` dropdown with 3 options

#### MovieList
- **Responsibility**: Display grid of MovieCard components
- **Props**:
  - `movies` (array): List of movie objects to display
  - `onMovieClick` (function): Handle card click (open modal)
  - `favorites` (array, stretch): List of favorited movie IDs
  - `watched` (array, stretch): List of watched movie IDs
  - `onToggleFavorite` (function, stretch): Add/remove favorite
  - `onToggleWatched` (function, stretch): Add/remove watched
- **State**: None
- **Renders**: Grid container with MovieCard for each movie

#### MovieCard
- **Responsibility**: Display individual movie preview
- **Props**:
  - `movie` (object): Movie data { id, title, poster_path, vote_average }
  - `onClick` (function): Open modal with this movie
  - `isFavorited` (boolean, stretch): Whether movie is in favorites
  - `isWatched` (boolean, stretch): Whether movie is in watched list
  - `onToggleFavorite` (function, stretch): Toggle favorite status
  - `onToggleWatched` (function, stretch): Toggle watched status
- **State**: None
- **Renders**: 
  - Poster image (`https://image.tmdb.org/t/p/w500${poster_path}`)
  - Title
  - Vote average (e.g., "⭐ 7.8")
  - FavoriteButton (stretch)
  - WatchedButton (stretch)

#### LoadMoreButton
- **Responsibility**: Trigger pagination to append next page
- **Props**:
  - `onLoadMore` (function): Fetch next page
  - `isVisible` (boolean): Hide when all pages loaded
  - `isLoading` (boolean): Show loading state while fetching
- **State**: None
- **Renders**: Button with text "Load More" or loading spinner

#### MovieModal
- **Responsibility**: Display detailed movie information and AI recommendation
- **Props**:
  - `movieId` (number | null): ID of movie to display
  - `onClose` (function): Close modal callback
- **State**:
  - `movieDetails` (object | null): Fetched movie details
  - `isLoadingDetails` (boolean): Loading state for details fetch
  - `detailsError` (string | null): Error message if fetch fails
  - `aiInsight` (string | null): AI-generated recommendation
  - `isLoadingInsight` (boolean): Loading state for AI call
  - `trailer` (object | null, stretch): Trailer video data
- **Effects**:
  - Fetch movie details when `movieId` changes (TMDb `/movie/{id}`)
  - Fetch AI recommendation when details loaded (OpenRouter API)
  - Fetch trailer (stretch) when details loaded (TMDb `/movie/{id}/videos`)
- **Renders**: 
  - Overlay backdrop (click to close)
  - Modal content card
  - Backdrop image
  - Title, runtime, release date, genres, overview
  - AI recommendation section (with loading/error states)
  - Trailer embed (stretch)
  - Close button (X icon)

#### CategorySection (stretch)
- **Responsibility**: Display one horizontal category of movies
- **Props**:
  - `title` (string): Section title (e.g., "Now Playing", "Similar to Inception")
  - `movies` (array): List of 20 movies for this section
- **State**: 
  - `scrollPosition` (number): Current carousel scroll position
- **Renders**: Section header, MovieCarousel with MovieCards

#### MovieCarousel (stretch)
- **Responsibility**: Horizontal scrollable list of MovieCards
- **Props**:
  - `movies` (array): List of movies to display
  - `onMovieClick` (function): Open modal
- **State**: 
  - `currentIndex` (number): Current scroll position
- **Behavior**: Wraps around to beginning after last item
- **Renders**: Horizontal scroll container with MovieCards

#### Footer
- **Responsibility**: Display footer content
- **Props**: None
- **State**: None
- **Renders**: Copyright, TMDb link, GitHub link (optional)

---

## API Contracts

### TMDb API Base URL
```
https://api.themoviedb.org/3
```

### Authentication
All requests require `api_key` parameter: `?api_key=${import.meta.env.VITE_API_KEY}`

---

### API 1: Now Playing Movies
**Endpoint**: `GET /movie/now_playing`

**Purpose**: Fetch movies currently playing in theaters

**Parameters**:
- `api_key` (required): Your TMDb API key
- `page` (optional): Page number (default: 1)

**Response Fields Used**:
- `results[]` (array): List of movie objects
  - `id` (number): Movie ID
  - `title` (string): Movie title
  - `poster_path` (string | null): Path to poster image
  - `vote_average` (number): Rating (0-10)
- `page` (number): Current page
- `total_pages` (number): Total pages available

**Error Cases**:
- `401`: Invalid API key
- `404`: Endpoint not found
- Network failure: Show "Failed to load movies" message

**Example**:
```
GET https://api.themoviedb.org/3/movie/now_playing?api_key=YOUR_KEY&page=1
```

---

### API 2: Search Movies
**Endpoint**: `GET /search/movie`

**Purpose**: Search for movies by title

**Parameters**:
- `api_key` (required): Your TMDb API key
- `query` (required): Search term
- `page` (optional): Page number (default: 1)

**Response Fields Used**:
- Same as Now Playing (results[], page, total_pages)

**Error Cases**:
- `401`: Invalid API key
- `422`: Missing query parameter
- Network failure: Show "Search failed" message

**Example**:
```
GET https://api.themoviedb.org/3/search/movie?api_key=YOUR_KEY&query=inception&page=1
```

---

### API 3: Movie Details
**Endpoint**: `GET /movie/{movie_id}`

**Purpose**: Fetch detailed information for a specific movie (needed for runtime and genres)

**Parameters**:
- `api_key` (required): Your TMDb API key
- `{movie_id}` (path parameter): Movie ID

**Response Fields Used**:
- `id` (number): Movie ID
- `title` (string): Movie title
- `backdrop_path` (string | null): Path to backdrop image
- `runtime` (number | null): Runtime in minutes
- `release_date` (string): Release date (YYYY-MM-DD)
- `genres[]` (array): List of genre objects
  - `id` (number): Genre ID
  - `name` (string): Genre name
- `overview` (string): Plot synopsis

**Error Cases**:
- `401`: Invalid API key
- `404`: Movie not found
- Network failure: Show "Failed to load movie details" in modal

**Example**:
```
GET https://api.themoviedb.org/3/movie/550?api_key=YOUR_KEY
```

**Image URLs**:
- Poster: `https://image.tmdb.org/t/p/w500${poster_path}`
- Backdrop: `https://image.tmdb.org/t/p/original${backdrop_path}`

---

### API 4: Similar Movies 
**Endpoint**: `GET /movie/{movie_id}/similar`

**Purpose**: Get movies similar to a given movie

**Parameters**:
- `api_key` (required): Your TMDb API key
- `{movie_id}` (path parameter): Movie ID
- `page` (optional): Page number (default: 1)

**Response Fields Used**:
- Same as Now Playing (results[], page, total_pages)

**Example**:
```
GET https://api.themoviedb.org/3/movie/550/similar?api_key=YOUR_KEY
```

---

### API 5: Discover Movies by Genre 
**Endpoint**: `GET /discover/movie`

**Purpose**: Discover movies filtered by genre

**Parameters**:
- `api_key` (required): Your TMDb API key
- `with_genres` (optional): Genre ID (e.g., 28 for Action)
- `sort_by` (optional): Sort option (default: "popularity.desc")
- `page` (optional): Page number (default: 1)

**Response Fields Used**:
- Same as Now Playing (results[], page, total_pages)

**Example**:
```
GET https://api.themoviedb.org/3/discover/movie?api_key=YOUR_KEY&with_genres=28&page=1
```

---

### API 6: Top Rated Movies 
**Endpoint**: `GET /movie/top_rated`

**Purpose**: Fetch highest-rated movies

**Parameters**:
- `api_key` (required): Your TMDb API key
- `page` (optional): Page number (default: 1)

**Response Fields Used**:
- Same as Now Playing (results[], page, total_pages)

**Example**:
```
GET https://api.themoviedb.org/3/movie/top_rated?api_key=YOUR_KEY&page=1
```

---

### API 7: Movie Videos/Trailers 
**Endpoint**: `GET /movie/{movie_id}/videos`

**Purpose**: Fetch trailers and videos for a movie

**Parameters**:
- `api_key` (required): Your TMDb API key
- `{movie_id}` (path parameter): Movie ID

**Response Fields Used**:
- `results[]` (array): List of video objects
  - `key` (string): YouTube video ID
  - `site` (string): Platform (filter for "YouTube")
  - `type` (string): Video type (filter for "Trailer")
  - `name` (string): Video title

**Filter Logic**: Find first video where `site === "YouTube"` and `type === "Trailer"`

**Embed URL**: `https://www.youtube.com/embed/${key}`

**Example**:
```
GET https://api.themoviedb.org/3/movie/550/videos?api_key=YOUR_KEY
```

---

### API 8: Genre List 
**Endpoint**: `GET /genre/movie/list`

**Purpose**: Get list of all movie genres for onboarding

**Parameters**:
- `api_key` (required): Your TMDb API key

**Response Fields Used**:
- `genres[]` (array): List of genre objects
  - `id` (number): Genre ID
  - `name` (string): Genre name (e.g., "Action", "Comedy")

**Example**:
```
GET https://api.themoviedb.org/3/genre/movie/list?api_key=YOUR_KEY
```

---

### OpenRouter API

**Endpoint**: `POST https://openrouter.ai/api/v1/chat/completions`

**Purpose**: Generate AI-powered watch recommendation

**Headers**:
```json
{
  "Authorization": "Bearer YOUR_OPENROUTER_API_KEY",
  "Content-Type": "application/json"
}
```

**Request Body**:
```json
{
  "model": "meta-llama/llama-3.3-70b-instruct:free",
  "messages": [
    {
      "role": "system",
      "content": "You are an enthusiastic but honest film critic. Write a 2-3 sentence watch recommendation for movies. Be specific about what makes the movie worth watching. Avoid spoilers, generic phrases, and 'I' statements."
    },
    {
      "role": "user",
      "content": "Movie: {title}\nGenres: {genres}\nOverview: {overview}\n\nWrite a 2-3 sentence watch recommendation."
    }
  ]
}
```

**Response Fields Used**:
- `choices[0].message.content` (string): AI-generated recommendation

**Error Cases**:
- `401`: Invalid API key
- `429`: Rate limit exceeded
- `500`: Server error
- Network failure
- **Fallback Message**: "We couldn't generate a recommendation for this one — check out the overview above!"

**Example Request**:
```javascript
const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "meta-llama/llama-3.3-70b-instruct:free",
    messages: [
      {
        role: "system",
        content: "You are an enthusiastic but honest film critic..."
      },
      {
        role: "user",
        content: `Movie: Inception\nGenres: Action, Sci-Fi, Thriller\nOverview: A thief who steals corporate secrets...\n\nWrite a 2-3 sentence watch recommendation.`
      }
    ]
  })
});
```

---

## State Architecture

### Global State (App Component)

| State Variable | Type | Initial Value | Owner | Update Trigger | Used By |
|---|---|---|---|---|---|
| `movies` | `Movie[]` | `[]` | App | Fetch Now Playing/Search | MovieList |
| `searchQuery` | `string` | `""` | App | User types in SearchBar | SearchBar, API fetch |
| `currentPage` | `number` | `1` | App | Load More clicked, Search submitted | API fetch, LoadMoreButton |
| `totalPages` | `number` | `1` | App | API response | LoadMoreButton (hide when reached) |
| `sortOption` | `string` | `"vote_average"` | App | User selects from dropdown | SortDropdown, Movie sorting logic |
| `selectedMovieId` | `number \| null` | `null` | App | MovieCard clicked, Modal closed | MovieModal (determines if open) |
| `isLoading` | `boolean` | `false` | App | Fetch starts/ends | LoadMoreButton, MovieList |
| `error` | `string \| null` | `null` | App | Fetch fails | Error message display |
| `mode` | `string` | `"now_playing"` | App | Search submitted, Clear clicked | Determines which API to call |

### Features State (App Component)

| State Variable | Type | Initial Value | Owner | Update Trigger | Used By |
|---|---|---|---|---|---|
| `favorites` | `number[]` | `[]` (from localStorage) | App | User clicks favorite button | MovieCard (visual indicator), FavoritesPage |
| `watched` | `number[]` | `[]` (from localStorage) | App | User clicks watched button | MovieCard (visual indicator), WatchedPage |
| `userGenres` | `number[]` | `[]` (from localStorage) | App | User completes onboarding | HomePage (section generation) |

### Component-Level State

#### MovieModal State

| State Variable | Type | Initial Value | Owner | Update Trigger | Used By |
|---|---|---|---|---|---|
| `movieDetails` | `object \| null` | `null` | MovieModal | Fetch movie details | Modal content rendering |
| `isLoadingDetails` | `boolean` | `false` | MovieModal | Details fetch starts/ends | Loading spinner |
| `detailsError` | `string \| null` | `null` | MovieModal | Details fetch fails | Error message |
| `aiInsight` | `string \| null` | `null` | MovieModal | AI response received | AI recommendation section |
| `isLoadingInsight` | `boolean` | `false` | MovieModal | AI call starts/ends | Loading message ("✨ Getting...") |
| `trailer` | `object \| null` | `null` | MovieModal (stretch) | Fetch videos | Trailer embed |

#### CategorySection State 

| State Variable | Type | Initial Value | Owner | Update Trigger | Used By |
|---|---|---|---|---|---|
| `scrollPosition` | `number` | `0` | CategorySection | User scrolls carousel | Carousel animation |

### localStorage Keys (Features)

| Key | Type | Description | Read On | Written On |
|---|---|---|---|---|
| `flixster_favorites` | `number[]` | Array of favorited movie IDs | App mount | Favorite toggle |
| `flixster_watched` | `number[]` | Array of watched movie IDs | App mount | Watched toggle |
| `flixster_genres` | `number[]` | User's favorite genre IDs | App mount, HomePage load | Onboarding complete |

---

## Data Flow

### MVP Data Flow (Now Playing → MovieCard)

1. **App Mounts**:
   - `useEffect` runs on mount
   - Calls `fetchNowPlaying(page = 1)`
   
2. **API Fetch**:
   - `fetch()` to TMDb `/movie/now_playing?api_key=KEY&page=1`
   - Response: `{ results: [...], page: 1, total_pages: 42 }`
   
3. **State Update**:
   - Set `movies` to `response.results`
   - Set `totalPages` to `response.total_pages`
   - Set `isLoading` to `false`
   
4. **Rendering**:
   - App passes `movies` array to `<MovieList>`
   - MovieList maps over `movies`, rendering `<MovieCard>` for each
   - Each MovieCard receives `movie` object as prop: `{ id, title, poster_path, vote_average }`
   
5. **Load More**:
   - User clicks "Load More"
   - `currentPage` incremented (`setCurrentPage(prev => prev + 1)`)
   - `fetchNowPlaying(currentPage + 1)` called
   - Response: `{ results: [new 20 movies], page: 2, ... }`
   - `setMovies(prev => [...prev, ...response.results])` (append, not replace)
   - New MovieCards render for new movies

### Search Data Flow

1. **User Types**:
   - SearchBar `onChange` → `onSearchChange` callback → `setSearchQuery(value)`
   
2. **User Submits**:
   - SearchBar `onSubmit` → `onSearchSubmit` callback
   - `setMode("search")`
   - `setCurrentPage(1)`
   - `setMovies([])` (clear Now Playing results)
   - Call `fetchSearch(searchQuery, page = 1)`
   
3. **API Fetch**:
   - `fetch()` to TMDb `/search/movie?api_key=KEY&query=${searchQuery}&page=1`
   - Response: Same structure as Now Playing
   
4. **State Update & Rendering**:
   - Same as Now Playing flow
   - "Load More" now calls `fetchSearch(searchQuery, currentPage + 1)`

### Sort Data Flow

1. **User Selects Sort Option**:
   - SortDropdown `onChange` → `onSortChange` callback → `setSortOption(value)`
   
2. **Sorting Logic** (in render or before passing to MovieList):
   ```javascript
   const sortedMovies = [...movies].sort((a, b) => {
     if (sortOption === "title") {
       return a.title.localeCompare(b.title);
     } else if (sortOption === "release_date") {
       return new Date(b.release_date) - new Date(a.release_date);
     } else if (sortOption === "vote_average") {
       return b.vote_average - a.vote_average;
     }
     return 0;
   });
   ```
   
3. **Rendering**:
   - MovieList receives `sortedMovies` instead of `movies`
   - Cards re-render in new order

### Modal Data Flow

1. **User Clicks MovieCard**:
   - MovieCard `onClick` → `onMovieClick(movie.id)` callback → `setSelectedMovieId(movie.id)`
   
2. **MovieModal Renders**:
   - `selectedMovieId` prop changes from `null` to `{id}`
   - `useEffect` watches `selectedMovieId`
   
3. **Fetch Movie Details**:
   - `useEffect` runs
   - `fetchMovieDetails(selectedMovieId)`
   - API: `GET /movie/{id}?api_key=KEY`
   - Response: `{ title, backdrop_path, runtime, release_date, genres, overview }`
   - `setMovieDetails(response)`
   
4. **Fetch AI Recommendation**:
   - Second `useEffect` watches `movieDetails`
   - When `movieDetails` is set, trigger `fetchAIInsight()`
   - Extract: `title`, `genres` (map to comma-separated string), `overview`
   - Call OpenRouter API with prompt
   - Response: `{ choices: [{ message: { content: "AI text..." } }] }`
   - `setAiInsight(response.choices[0].message.content)`
   
5. **Modal Rendering**:
   - Display `movieDetails.backdrop_path` as header image
   - Display `title`, `runtime`, `release_date`, `genres`, `overview`
   - Display `aiInsight` in recommendation section (or loading/error state)
   
6. **User Closes Modal**:
   - Click X button or outside → `onClose()` callback → `setSelectedMovieId(null)`
   - `useEffect` cleanup: `setMovieDetails(null)`, `setAiInsight(null)`

### Stretch: Home Screen Data Flow (Recommendation System)

1. **HomePage Mounts**:
   - Read from localStorage: `favorites`, `watched`, `userGenres`
   
2. **Generate Section Config**:
   ```javascript
   const sections = [
     { title: "Now Playing", endpoint: "/movie/now_playing" },
     { title: "Top Rated", endpoint: "/movie/top_rated" },
     { title: "Similar to Inception", endpoint: "/movie/27205/similar" }, // if favorited
     { title: "Similar to The Matrix", endpoint: "/movie/603/similar" }, // if favorited
     { title: "Action Movies", endpoint: "/discover/movie?with_genres=28" }, // if genre selected
     { title: "Comedy Movies", endpoint: "/discover/movie?with_genres=35" }, // if genre selected
     { title: "Because You Watched Interstellar", endpoint: "/movie/157336/similar" }, // if watched
     { title: "Sci-Fi Movies", endpoint: "/discover/movie?with_genres=878" } // random fallback
   ];
   ```
   
3. **Fetch Each Section**:
   - `Promise.all()` fetch all 8 endpoints in parallel
   - Each returns 20 movies (first page only)
   
4. **Rendering**:
   - Render 8 `<CategorySection>` components
   - Each receives `title` and `movies` array
   - CategorySection renders `<MovieCarousel>` with horizontal scroll
   - MovieCarousel maps `movies` to `<MovieCard>` components

---

## UI/UX Specifications

### Visual Design Guidelines

#### Color Palette
- **Background**: Dark theme recommended for movie apps (e.g., `#121212`, `#1a1a1a`)
- **Primary Text**: Light color for contrast (e.g., `#ffffff`, `#e0e0e0`)
- **Accent Color**: Brand color for buttons, links (e.g., `#e50914` Netflix red, or custom)
- **Secondary Text**: Muted color for metadata (e.g., `#a0a0a0`)
- **Contrast**: All combinations must meet WCAG 2.0 AA (4.5:1 ratio)

#### Typography
- **Headings**: Bold, larger size (e.g., 24-32px for H1, 18-24px for H2)
- **Body**: Readable size (16-18px)
- **Font Family**: Sans-serif (e.g., Roboto, Inter, system fonts)
- **Integration**: Use Google Fonts via `@import` in CSS

#### MovieCard Design
- **Size**: ~200-250px width, auto height
- **Poster**: Full-width, maintain aspect ratio (2:3 typical)
- **Spacing**: Consistent padding (12-16px)
- **Shadow**: Subtle box-shadow (e.g., `0 2px 8px rgba(0,0,0,0.3)`)
- **Hover State**: 
  - Lift effect: `transform: translateY(-4px)`
  - Increase shadow: `0 4px 16px rgba(0,0,0,0.5)`
  - Smooth transition: `transition: all 0.3s ease`
  - Reveal favorite/watched buttons (stretch)
- **Vote Average**: Display as stars or badge (e.g., "⭐ 7.8")
- **Fallback Image**: If `poster_path` is null, show placeholder (gray box with "No Image")

#### MovieModal Design
- **Overlay**: Semi-transparent dark backdrop (e.g., `rgba(0,0,0,0.8)`)
- **Modal Box**:
  - Centered on screen
  - Max-width: 800px
  - Background: Dark card (e.g., `#1e1e1e`)
  - Border-radius: 8-12px
  - Box-shadow: Large shadow for depth
- **Backdrop Image**: Full-width header, height ~300px, `background-size: cover`
- **Content Layout**:
  - Title: Large, bold, overlaid on backdrop (bottom) or below
  - Metadata: Horizontal row (runtime, release date, genres)
  - Overview: Paragraph with line-height 1.6 for readability
  - AI Recommendation: Distinct section with label, italic or different background
- **Close Button**:
  - Position: Top-right corner (absolute)
  - Icon: X or ✕
  - Hover: Increase size or change color
  - Keyboard: Closes on Escape key

#### Grid Layout
- **Desktop (>1024px)**: 4-6 columns
- **Tablet (600-1024px)**: 3-4 columns
- **Mobile (<600px)**: 1-2 columns
- **Gap**: 16-24px between cards
- **Technique**: CSS Grid with `repeat(auto-fill, minmax(200px, 1fr))`

#### Carousel Layout 
- **Direction**: Horizontal scroll
- **Overflow**: `overflow-x: scroll` or `overflow-x: auto`
- **Scroll Behavior**: `scroll-behavior: smooth`
- **Cards**: Same design as grid MovieCards, but smaller (150-180px)
- **Gap**: 12px between cards
- **Scrollbar**: Hide or style to be subtle

### Loading States
- **MovieList Loading**: Display skeleton screens (gray placeholder cards) or spinner
- **Modal Details Loading**: Show spinner or "Loading..." text
- **AI Loading**: "✨ Getting a recommendation..." with animated ellipsis or spinner
- **Load More Loading**: Button shows spinner and "Loading..." text

### Error States
- **API Fetch Error**: 
  - Display friendly message: "We couldn't load movies right now. Please try again later."
  - Show retry button
- **Modal Error**: 
  - "Failed to load movie details. Please try another movie."
  - Still allow user to close modal
- **AI Error**: 
  - "We couldn't generate a recommendation for this one — check out the overview above!"
  - Modal still displays other content

### Empty States
- **No Search Results**: "No movies found for '{query}'. Try a different search."
- **No Favorites** (stretch): "You haven't favorited any movies yet. Click the heart icon on any movie to add it!"
- **No Watched** (stretch): "You haven't marked any movies as watched yet. Click the checkmark on any movie to add it!"

---

## Accessibility Requirements

### Keyboard Navigation
- **Tab Order**: Logical flow (header → search → sort → cards → load more → footer)
- **MovieCard**: `tabIndex={0}` and `onKeyDown` to open modal on Enter/Space
- **Modal**: 
  - Focus trapped inside modal while open
  - Close button focusable
  - Escape key closes modal
  - Focus returns to triggering card when closed
- **Buttons**: Native `<button>` elements (focusable by default)
- **Inputs**: Native `<input>` and `<select>` (focusable by default)

### Screen Reader Support
- **Images**: 
  - `alt={${movie.title} poster}` for posters
  - `alt={${movie.title} backdrop}` for backdrop images
  - `alt=""` for decorative images
- **Buttons**: 
  - `aria-label` for icon-only buttons (e.g., `aria-label="Close modal"`)
  - "Favorite" and "Watched" buttons need clear labels (stretch)
- **Modal**: 
  - `role="dialog"`
  - `aria-modal="true"`
  - `aria-labelledby` pointing to modal title
- **Loading**: `aria-live="polite"` for loading messages
- **Error**: `role="alert"` for error messages

### Visual Accessibility
- **Color Contrast**: WCAG 2.0 AA compliance (4.5:1 for normal text, 3:1 for large text)
- **Focus Indicators**: Visible outline on focused elements (default or custom)
- **Font Size**: Minimum 16px for body text
- **Interactive Targets**: Minimum 44x44px touch target size (mobile)

### Semantic HTML
- `<header>`: Header component
- `<main>`: Main content area
- `<footer>`: Footer component
- `<button>`: Clickable actions (not `<div>` with `onClick`)
- `<input>`: Search field
- `<select>`: Sort dropdown
- `<article>` or `<div>`: MovieCard (semantic choice)

---

## Error Handling & Edge Cases

### Network Errors
- **Scenario**: User's internet disconnects during API fetch
- **Handling**: Catch fetch error, display retry button, log error to console

### Invalid API Key
- **Scenario**: `.env` file missing or API key invalid
- **Handling**: 401 response → Show "API key error. Please check your configuration."

### Rate Limiting
- **Scenario**: Too many API requests (TMDb or OpenRouter)
- **Handling**: 429 response → Show "Too many requests. Please wait a moment and try again."

### Empty Search Results
- **Scenario**: User searches for nonsense query (e.g., "asdfghjkl")
- **Handling**: API returns `results: []` → Show "No movies found" message

### Null Poster Path
- **Scenario**: Movie has no poster image (`poster_path: null`)
- **Handling**: Display fallback image or gray box with "No Image" text

### Null Backdrop Path
- **Scenario**: Movie has no backdrop image
- **Handling**: Use solid color background for modal header, or poster as fallback

### Missing Runtime/Genres
- **Scenario**: Movie details API returns `runtime: null` or `genres: []`
- **Handling**: Don't display those fields (or show "N/A")

### AI API Failure
- **Scenario**: OpenRouter returns error or times out
- **Handling**: Display fallback message, log error, don't break modal

### No Trailers Available 
- **Scenario**: `/videos` endpoint returns empty array
- **Handling**: Hide trailer section, don't show broken embed

### localStorage Unavailable
- **Scenario**: User has disabled localStorage (privacy mode)
- **Handling**: Favorites/watched features still work in-session, but don't persist

### No Favorites/Watched for Recommendations 
- **Scenario**: User has no favorites or watched movies
- **Handling**: Fill recommendation sections with random genres

### Pagination Overflow
- **Scenario**: User tries to load page beyond `total_pages`
- **Handling**: Hide/disable "Load More" button when `currentPage >= totalPages`

---


## Testing & Validation Checklist

### Core Features 

- [ ] Now Playing movies load on mount
- [ ] Grid displays 20 movies per page
- [ ] "Load More" appends next page (not replaces)
- [ ] "Load More" hidden when all pages loaded
- [ ] Search bar accepts input
- [ ] Search returns relevant results
- [ ] Search results paginate correctly
- [ ] Toggle back to Now Playing works
- [ ] Sort by Title (A-Z) works
- [ ] Sort by Release Date (Newest first) works
- [ ] Sort by Vote Average (Highest first) works
- [ ] MovieCard displays poster, title, vote average
- [ ] MovieCard fallback image for null poster
- [ ] Clicking MovieCard opens modal
- [ ] Modal fetches and displays movie details
- [ ] Modal displays AI recommendation
- [ ] AI loading state displays
- [ ] AI error fallback displays
- [ ] Modal closes via X button
- [ ] Modal closes via Escape key
- [ ] Modal closes via clicking outside
- [ ] Modal clears state on close
- [ ] Grid responsive on mobile, tablet, desktop
- [ ] Header displays app name
- [ ] Footer displays copyright and TMDb link
- [ ] Loading states display for all API calls
- [ ] Error messages display for failed API calls
- [ ] All images have alt attributes
- [ ] Color contrast meets WCAG 2.0 AA
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Semantic HTML used throughout
- [ ] planning.md exists and covers all 5 sections

### Features

- [ ] React Router installed and configured
- [ ] SearchPage route works
- [ ] HomePage route works
- [ ] FavoritesPage route works
- [ ] WatchedPage route works
- [ ] Navigation links work
- [ ] Favorite button adds/removes from favorites
- [ ] Favorited movies persist on refresh
- [ ] Favorited movies visually distinguished
- [ ] Watched button adds/removes from watched
- [ ] Watched movies persist on refresh
- [ ] Watched movies visually distinguished
- [ ] Genre onboarding modal appears on first visit
- [ ] Genre preferences save to localStorage
- [ ] HomePage displays 8 sections
- [ ] "Now Playing" and "Top Rated" sections always present
- [ ] "Similar to" sections use TMDb similar endpoint
- [ ] Genre sections use TMDb discover endpoint
- [ ] Sections personalized based on user data
- [ ] Carousels scroll horizontally
- [ ] Carousels wrap around after 20 items
- [ ] Trailer fetches from TMDb videos endpoint
- [ ] Trailer embeds in modal
- [ ] No trailer fallback works
- [ ] App deployed to Render
- [ ] Production build works
- [ ] Environment variables configured in Render

---

## Appendix: Key Decisions & Rationale

### Why React?
- **Component-based**: Modular, reusable MovieCard, Modal, etc.
- **State management**: React hooks handle complex state (movies, search, pagination, favorites)
- **Ecosystem**: Large community, easy to find solutions

### Why Vite?
- **Fast**: Instant dev server startup, HMR
- **Simple**: Minimal config out of the box
- **Modern**: ES modules, optimized builds

### Why localStorage for Features?
- **Simple**: No backend required
- **Sufficient**: For learning project, persistence across sessions
- **Limitations**: Data visible in DevTools, can be cleared by user, not shareable across devices

### Why TMDb API?
- **Free tier**: Generous limits for development
- **Comprehensive**: Movies, search, details, similar, genres, videos
- **Well-documented**: Clear API reference

### Why OpenRouter?
- **Free tier**: Access to powerful LLMs (LLaMA, Gemini)
- **Simple**: Same API pattern as OpenAI
- **Learning**: Practice prompt engineering

### Why Client-Side Sorting?
- **Fast**: No API call delay
- **Simple**: Built-in JavaScript `.sort()`
- **Tradeoff**: Only sorts loaded movies (not entire catalog)

### Why "Load More" Instead of Infinite Scroll?
- **Assignment Requirement**: Spec calls for "Load More" button
- **User Control**: User decides when to load more
- **Accessibility**: Easier to navigate with keyboard

### Why Separate `/movie/{id}` Fetch for Details?
- **Data Availability**: Now Playing endpoint doesn't include runtime or genres
- **Efficiency**: Don't fetch full details for 20 movies upfront, only when user clicks

### Why Modal Instead of New Page for Details?
- **UX**: Faster, less disruptive, user stays in browsing context
- **Assignment Requirement**: Spec calls for modal

### Why 8 Sections for Home Screen?
- **Netflix Inspiration**: Similar to Netflix's multi-section layout
- **Variety**: Mix of required, personalized, and random content
- **Constraint**: Keeps page manageable (not infinite)

---

## Success Metrics

### Core Features 
- **Functionality**: All required features work without errors
- **Code Quality**: Components follow spec, state managed correctly, APIs handled properly
- **UX**: Responsive, accessible, polished visuals
- **Documentation**: `planning.md` complete and accurate

### Features
- **Functionality**: All stretch features work without errors
- **Persistence**: Favorites/watched persist across sessions
- **Personalization**: Recommendations adapt to user preferences
- **Deployment**: App accessible via public URL

### Learning Goals
- **React Proficiency**: Comfortable with components, state, effects, props
- **API Integration**: Can fetch, transform, display external data with error handling
- **AI Integration**: Can write effective prompts, handle async AI calls, manage state
- **Planning**: Can write comprehensive spec before implementation, update as you learn
- **Collaboration**: Can articulate design decisions, ask clarifying questions, receive feedback

---

## Notes for Implementation
- **Build incrementally**: One feature at a time. Commit often.
- **Test early, test often**: Open browser after every change. Don't write 100 lines before testing.
- **Use Claude strategically**: 
  - Ask Claude to scaffold components from your spec (Edit mode)
  - Ask Claude to review your code against your spec (Chat mode)
  - Ask Claude to debug specific issues (be specific about the problem)
- **Don't over-engineer**: MVP first, stretch features second. Resist the urge to add features not in the spec.
- **Read error messages**: They usually tell you exactly what's wrong.
- **Check DevTools Network tab**: Inspect API responses to understand data structure.
- **Update `planning.md` as you go**: If you diverge from the plan, update the spec. It's a living document.

---

## References

- [TMDb API Documentation](https://developers.themoviedb.org/3)
- [OpenRouter API Documentation](https://openrouter.ai/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [React Router Documentation](https://reactrouter.com)
- [WCAG 2.0 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

**End of Design Document**
