// @flow
import * as React from 'react';

const {useContext, useEffect, useState} = React;
const ENTER_KEY_CODE = 13;
const SEARCH_WAIT_MS = 10;

type EtaFilterState = 'all' | 'with' | 'without';

type FilterArgs = $ReadOnly<{|
  shouldShowCompleted: ?string,
  etaFilter: EtaFilterState,
|}>;

type Props = $ReadOnly<{|
  // query: ?string,
  // setQuery: (query: ?string) => void,
  setFilters: (filters: FilterArgs) => void,
|}>;




function Filters({setFilters}: Props) {
  // const [etaFitler, setSearch] = useState();
  // const [lastTimeoutId, setLastTimeoutId] = useState(null);
  const [shouldShowCompleted, setShouldShowCompleted] = useState(false);
  const [etaFilter, setEtaFilter] = useState<EtaFilterState>('all');

  useEffect(() => {
    setFilters({
      etaFilter,
      shouldShowCompleted: shouldShowCompleted ? '1' : null,
    })
  }, [shouldShowCompleted, etaFilter])

  return (
    <div>
      <label> 
        [Show Completed<input 
          type="checkbox" 
          checked={shouldShowCompleted}
          onChange={e => setShouldShowCompleted(e.target.checked)}
        />]
      </label>
      <label>
        [ETA Filter
        <select value={etaFilter} onChange={e => setEtaFilter(e.target.value)}>
          <option value="all">all</option>
          <option value="with">with</option>
          <option vallue="without">without</option>
        </select>]
      </label>
    </div>
  )
}

export default Filters;