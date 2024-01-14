import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function FollowerSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [showNoResults, setShowNoResults] = useState(false);

    useEffect(() => {
        const autocompleteSearch = async () => {
            try {
                if (query.trim() !== '') {
                    const response = await axios.get(`http://localhost:3000/users/userList?query=${query}`);
                    // Filter results based on the query
                    const filteredResults = response.data.filter(result =>
                        result.profile_name.toLowerCase().includes(query.toLowerCase())
                    );
                    setResults(filteredResults);
                    setShowNoResults(filteredResults.length === 0);
                } else {
                    setResults([]);
                }

            } catch (error) {
                console.error('Error fetching user list:', error);
            }
        };

        const debounceSearch = setTimeout(() => {
            autocompleteSearch();
        }, 300);

        return () => {
            clearTimeout(debounceSearch);
             setShowNoResults(false);
        }
    }, [query, isTyping]);

    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        setQuery(inputValue);
        setIsTyping(inputValue.trim() !== '');
    };

    const handleEnterKey = (event) => {
        if (event.key === 'Enter' && results.length > 0) {
            window.location.href = `http://localhost:3000/users/user/${results[0]._id}`;
        }
    };

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyPress={handleEnterKey}
                placeholder="Search Readers"
            />
             <ul>
                {results.length > 0 ? (
                    results.map((result) => (
                        <li key={result._id} onClick={() => window.location.href = `http://localhost:5173/users/user/${result._id}`}>
                            {result.profile_name}
                        </li>
                    ))
                ) : isTyping && showNoResults ? (
                    <li>No Results Match</li>
                ) : null}
            </ul>
        </div>
    );
};