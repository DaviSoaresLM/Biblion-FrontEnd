import React from 'react';
import { SearchForm, GenreFilters } from '../content/ContentComponents.jsx';

const SearchSection = () => {
    return (
        <section className="search-section">
            <div className="search-container">
                <SearchForm />
                <GenreFilters />
            </div>
        </section>
    );
};

export default SearchSection;
