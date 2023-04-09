import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage, setMoviesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState({ column: null, direction: null });
  const [totalResults, setTototalResults] = useState(0);

  // Fetch movies data from the API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://pagination-back.onrender.com/test?page=${currentPage}&limit=${moviesPerPage}&sort=${
            sort.column ? `${sort.column}` : ""}&order=${sort.direction?`${sort.direction}`:""}`
        );
        console.log(response);
        setMovies(response.data.films);
        setTotalPages(response.data.pagination.totalPages);
        setTototalResults(response.data.pagination.totalResults);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, moviesPerPage, sort, totalResults]);

  // Handle column sorting
  const handleSort = (column) => {
    const isAscending = sort.column === column && sort.direction === "asc";
    const direction = isAscending ? "desc" : "asc";
    setSort({ column, direction });
  };

  // Handle genre filter
  const handleMoviePerpages = (event) => {
    setMoviesPerPage( event.target.value );
  };

  // Handle pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <><header>
      <h1>Pagination</h1>
    </header><div>
        {loading ? (
          <p>Loading movies...</p>
        ) : error ? (
          <p>Error loading movies: {error}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort("title")}>
                  Title {sort.column === "title" && <span>{sort.direction === "asc" ? "▲" : "▼"}</span>}
                </th>
                <th>
                  Rental Rate {sort.column === "rental_rate" && <span>{sort.direction === "asc" ? "▲" : "▼"}</span>}
                </th>
                <th>
                  Rating {sort.column === "rating" && <span>{sort.direction === "asc" ? "▲" : "▼"}</span>}
                </th>
                <th onClick={() => handleSort("name")}>
                  Genre {sort.column === "name" && <span>{sort.direction === "asc" ? "▲" : "▼"}</span>}
                </th>
                <th onClick={() => handleSort("rental_count")}>
                  Rental Count {sort.column === "rental_count" && <span>{sort.direction === "asc" ? "▲" : "▼"}</span>}
                </th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.film_id}>
                  <td>{movie.title}</td>
                  <td>{movie.rental_rate}</td>
                  <td>{movie.rating}</td>
                  <td>{movie.category}</td>
                  <td>{movie.rental_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="bottom">
          <span>Nombre de resultats: {totalResults}</span>
          <span> Nombre de lignes par page <input type="number" min={10} onChange={handleMoviePerpages} value={moviesPerPage} /></span>
        </div>
        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
      </div><footer>
        <p>Projet pagination Backend HETIC-2023</p>
      </footer></>
  );
}

function Pagination({ totalPages, currentPage, onPageChange }) {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  let visiblePages = [];

  if (currentPage <= 3) {
    visiblePages = [1, 2, 3, 4, 5, "...", totalPages];
  } else if (currentPage > 3 && currentPage < totalPages - 2) {
    visiblePages = [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages
    ];
  } else {
    visiblePages = [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages
    ];
  }

  return (
    <div className="page-navigation">
      <ul>
        <li>
          <button onClick={() => onPageChange(1)} disabled={currentPage === 1}>
            {"<<"}
          </button>
        </li>
        <li>
          <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
            {"<"}
          </button>
        </li>
        {visiblePages.map((page, index) => (
          <li key={index}>
            {page === "..." ? (
              <span>{page}</span>
            ) : (
              <button className={currentPage === page ? "selected" : ""} onClick={() => onPageChange(page)} disabled={currentPage === page}>
                {page}
              </button>
            )}
          </li>
        ))}
         <li>
          <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            {">"}
          </button>
        </li>
        <li>
          <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
            {">>"}
          </button>
        </li>
      </ul>
    </div>
  );
}



  
  export default App;
