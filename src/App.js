// @flow
import type {State} from './useDataReducer';
import type {Todo} from './Todo';
import * as React from 'react';
import CalendarView from './CalendarView/CalendarView';
import GoalsView from './GoalsView/GoalsView';
import TodoListView from './TodoListView/TodoListView';
import GantView from './GantView/GantView';
import WallView from './WallView/WallView';
import Search from './Search';
import Filters from './Filters';
import useDataApi from './useDataApi';
import DispatchContext from './DispatchContext';
import StateContext from './StateContext';
import useIsOnline from './useIsOnline';
 
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
  useHistory
} from 'react-router-dom';

const {useState, useEffect, useMemo} = React;

function Overlay({isVisible}) {
  const style = {
    position: 'fixed', 
    background: 'gray', 
    opacity: 0.5,
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  };

  return isVisible ? <div style={style}></div> : null;
}

declare var ENV_PUBLIC_PATH: string;

const PUBLIC_PATH = ENV_PUBLIC_PATH; 
const URL_PARAM_APP = 'app';
const URL_PARAM_QUERY = 'q';
const URL_PARAM_SHOULD_SHOW_COMPLETED = 'c';
const URL_PARAM_ETA = 'e';
const NEGATIVE_QUERY_PREFIX = '!';
// links/buttons bg: #85a7ea
// button color text: #1b1c1d
const BACKGROUND_DARK = '#1a1a1a';
const COLOR_DARK = '#fdfdfd';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function App() {
  const {
    state,
    addTodo,
    updateTodo,
    fetchData, 
    updateTodoStatus,
    deleteTodo,
    updateTodoText,
    updateTodoCompletedAt,
    updateTodoEta,
  } = useDataApi();
  
  useEffect(fetchData, []);

  return (
    <DispatchContext.Provider value={{
      addTodo,
      updateTodo,
      updateTodoStatus,
      deleteTodo,
      updateTodoText,
      updateTodoCompletedAt,
      updateTodoEta,
    }}>
      <StateContext.Provider value={state}>
        <Router>
          <Content state={state} />
        </Router>
      </StateContext.Provider>
    </DispatchContext.Provider>
  )
}

type ContentProps = {|
  state: State,
|};

function Content({state}: ContentProps) {
  const location = useLocation();
  const query = new URLSearchParams(useLocation().search);
  const history = useHistory();
  const isOnline = useIsOnline();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const timeOffsetInMsOptions = useMemo(() => {
    return [
      [0, 'Today'], 
      [-1, '1 day ago'], 
      [-2, '2 days ago']
    ].map(([offsetInDays, label]) => {
      return {
        label,
        value: 1000 * 60 * 60 * 24 * offsetInDays,
      }
    });
  }, []);
  const {setTimeOffsetInMs} = useDataApi();

  const getQuerySearch = (queryValue: ?string): ?string => {
    if (queryValue == null || queryValue === '' || queryValue === NEGATIVE_QUERY_PREFIX) {
      return null;
    } else {
      return `${URL_PARAM_QUERY}=${queryValue}`;
    }
  }
  const getShouldShowCompletedSearch = (shouldShow: ?string): ?string => {
    return shouldShow === '1' ? `${URL_PARAM_SHOULD_SHOW_COMPLETED}=1` : null;
  }
  const getEtaSearch = (eta: ?string): ?string => {
    return (eta == null || eta === 'all') ? null : `${URL_PARAM_ETA}=${eta}`;
  }

  const buildSearch = (queryValArg: ?string, shouldShowCompletedValArg: ?string, etaValArg: ?string): string => {
    const searches = [
      getQuerySearch(queryValArg),
      getShouldShowCompletedSearch(shouldShowCompletedValArg),
      getEtaSearch(etaValArg),
    ].filter(Boolean);

    if (searches.length === 0) {
      return '';
    }

    return `?${searches.join('&')}`;
  }

  const queryValue = query.get(URL_PARAM_QUERY);
  const shouldShowCompletedValue = query.get(URL_PARAM_SHOULD_SHOW_COMPLETED);
  const etaValue = query.get(URL_PARAM_ETA);

  const handleSetQuery = (queryValArg: ?string): void => {
    const search = buildSearch(queryValArg, shouldShowCompletedValue, etaValue);
    history.replace(`${location.pathname}${search}`);
  }

  const handleSetFilters = (
    filterArgs: $ReadOnly<{|
      shouldShowCompleted: ?string,
      etaFilter: 'all' | 'with' | 'without',
    |}>
  ): void => {
    const search = buildSearch(
      queryValue, 
      filterArgs.shouldShowCompleted, 
      filterArgs.etaFilter
    );
    history.replace(`${location.pathname}${search}`);
  }

  const queryTerms = queryValue != null ? queryValue.split(' ') : [];

  function filterForQuery(todos: $ReadOnlyArray<Todo>, queryValue: string) {
    const isNegativeSearch = 
      queryValue != null &&
      queryValue !== '' &&
      queryValue.substr(0, 1) === NEGATIVE_QUERY_PREFIX;
    
    const regExp = queryValue == null || queryValue === '' ?
      null :
      isNegativeSearch ?
        new RegExp(queryValue.substring(1), 'i'):
        new RegExp(queryValue, 'i');

    return regExp == null ?
      todos :
      todos.filter(todo => {
        if (!todo.text.match(regExp)) {
          return isNegativeSearch;
        }
        return !isNegativeSearch;
      });
  }

  const filteredTodos = queryTerms
    .reduce(filterForQuery, state.todos)
    .filter(todo => {
      if (etaValue === 'with' && todo.eta == null) {
        return false;
      }
      if (etaValue === 'without' && todo.eta != null) {
        return false;
      }
      if (shouldShowCompletedValue === '1') {
        return true;
      } else {
        return todo.completedAt == null;
      }
    });

  const searchForLinks = buildSearch(queryValue, shouldShowCompletedValue, etaValue);

  const style = isDarkMode ? {
    background: BACKGROUND_DARK,
    color: COLOR_DARK,
  } : {};

  return (
    <div style={style}>
      <div style={{
        display:'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginLeft: '1em',
        marginRight: '1em'
      }}> 
        <Link to={`${PUBLIC_PATH}/${searchForLinks}`}>Todos</Link>
        <Link to={`${PUBLIC_PATH}/goals${searchForLinks}`}>Goals</Link>
        <Link to={`${PUBLIC_PATH}/calendar${searchForLinks}`}>Calendar</Link>
        <Link to={`${PUBLIC_PATH}/wall${searchForLinks}`}>Wall</Link>
        <Link to={`${PUBLIC_PATH}/gant${searchForLinks}`}>Gant</Link>
        <span>{' '}{isOnline ? '✅📶 online' : '🚫📵 offline'}</span>
        <label>
          <input type="checkbox" value={isDarkMode} onChange={() => {
            setIsDarkMode(prevValue => !prevValue)
          }} />
          Dark Mode
        </label>
        <select onChange={e => setTimeOffsetInMs(Number(e.target.value))} value={state.timeOffsetInMs}>
          {timeOffsetInMsOptions.map(({label, value}) => <option key={value} value={value}>{label}</option>)}
        </select>
        <Search setQuery={handleSetQuery} query={query.get(URL_PARAM_QUERY)} />
        <Filters setFilters={handleSetFilters} />
      </div>
      <Switch>
        <Route path={`${PUBLIC_PATH}/goals`}>
          <GoalsView />
        </Route>
        <Route path={`${PUBLIC_PATH}/calendar`}>
          <CalendarView />
        </Route>
        <Route path={`${PUBLIC_PATH}/gant`}>
          <GantView todos={filteredTodos} />
        </Route>
        <Route path={`${PUBLIC_PATH}/wall`}>
          <WallView />
        </Route>
        <Route path={`${PUBLIC_PATH}/`}>
          <TodoListView todos={filteredTodos} />
        </Route>
      </Switch>
      <Overlay isVisible={state.isLoading || state.isUpdating || state.isAppending} />
    </div>
  )
}

export default App;