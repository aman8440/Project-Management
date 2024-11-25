import React, { FormEvent, useEffect } from "react";
import { SearchInputProps } from "../interfaces";
import axios from "axios";

const SearchInput: React.FC<SearchInputProps> = ({
  sortBy,
  setUserData,
  sortOrder,
  input,
  setInput,
  recordsPerPage,
  page,
  setPage,
  setTotalUsers
}) => {
  const jwtToken = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/user/list?sortBy=${sortBy}&sortOrder=${sortOrder}&searchQuery=${input}&recordsPerPage=${recordsPerPage}&page=${page}`,
          {
            headers: {
              Authorization: jwtToken,
            },
          }
        );
        setUserData(response.data?.list);
        setPage(1);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [sortBy, sortOrder]);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const filteredData = await axios.get(
      `http://localhost:3001/user/list?sortBy=${sortBy}&sortOrder=${sortOrder}&searchQuery=${input}&recordsPerPage=${recordsPerPage}&page=${page}`,
      {
        headers: {
          Authorization: jwtToken,
        },
      }
    );
    await setUserData(filteredData.data?.list);
    await setPage(1);
    await setTotalUsers(filteredData.data?.list?.length)
    console.log(filteredData.data?.totalUsers)
  };

  const handleInputChange = async (e) => {
    setInput(e.target.value);
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit} className="max-w-md mx-auto">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            onChange={handleInputChange}
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-black border border-gray-300 rounded-lg bg-gray-50   dark:placeholder-gray-400  "
            placeholder="Search Mockups, Logos..."
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchInput;