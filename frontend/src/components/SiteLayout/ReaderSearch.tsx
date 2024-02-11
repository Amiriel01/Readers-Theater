import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import { UserInterface } from '../../interfaces/user.interface';
import { ChangeEvent, KeyboardEvent } from 'react';

export default function FollowerSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [showNoResults, setShowNoResults] = useState(false);

    useEffect(() => {
        const autocompleteSearch = async () => {
            try {
                if (query.trim() !== '') {
                    const response = await axios.get<UserInterface[]>(`http://localhost:3000/users/userList?query=${query}`);
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

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setQuery(inputValue);
        setIsTyping(inputValue.trim() !== '');
    };

    const handleEnterKey = (event: KeyboardEvent) => {
        if (event.key === 'Enter' && results.length > 0) {
            window.location.href = `http://localhost:3000/users/user/${results[0]._id}`;
        }
    };

    return (
        <div id='search-bar-container'>
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">
                    <span className="material-symbols-outlined" id='magnifying-glass'>
                        search
                    </span>
                </InputGroup.Text>
                <Form.Control
                    id='readers-search-input'
                    type="text"
                    value={query}
                    placeholder="Find Other Readers"
                    onChange={handleInputChange}
                    onKeyPress={handleEnterKey}
                />
            </InputGroup>
            <ul>
                {results.length > 0 ? (
                    results.map((result) => (
                        <li key={result._id}>
                                <Link id='search-results-link' to={`/users/user/${result._id}`}>
                                    {result.profile_name}
                                </Link>
                            </li>
                    ))
                ) : isTyping && showNoResults ? (
                    <li>No Results Match</li>
                ) : null}
            </ul>
        </div>
    );
};