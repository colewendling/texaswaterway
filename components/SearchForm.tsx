import React from 'react';
import Form from 'next/form';
import SearchFormReset from './SearchFormReset';
import { Search } from 'lucide-react';

const SearchForm = ({ query }: { query?: string }) => {
  return (
    <Form action="/" scroll={false} className="search-form">
      <input
        name="query"
        defaultValue={query}
        className="search-form-input"
        placeholder="Search"
      />
      <div className="search-form-button-container">
        {query && <SearchFormReset />}
        <button type="submit" className="search-form-button">
          <Search className="search-form-button-icon" />
        </button>
      </div>
    </Form>
  );
};

export default SearchForm;
