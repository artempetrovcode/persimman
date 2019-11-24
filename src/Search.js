// @flow
import * as React from 'react';

const {useContext, useState} = React;
const ENTER_KEY_CODE = 13;
const SEARCH_WAIT_MS = 10;

type Props = $ReadOnly<{|
  query: ?string,
  setQuery: (query: ?string) => void,
|}>;

function Search({query, setQuery}: Props) {
  const [search, setSearch] = useState(query == null ? '' : query);
  const [lastTimeoutId, setLastTimeoutId] = useState(null);

  function handleSeachChange(e) {
    const value = e.target.value;
    lastTimeoutId && window.clearTimeout(lastTimeoutId);
    setSearch(value);
    setLastTimeoutId(window.setTimeout(() => setQuery(value), SEARCH_WAIT_MS))
  }

  function handleClearClick() {
    lastTimeoutId && window.clearTimeout(lastTimeoutId);
    setSearch('');
    setQuery(null);
  }

  return (
    <div>
      Search
      <input 
        type="text"
        value={search == null ? '' : search}
        onChange={handleSeachChange}
      />
      <button onClick={handleClearClick}>Clear Search</button>
    </div>
  )
}

export default Search;