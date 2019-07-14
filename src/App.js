// @flow
import * as React from 'react';
import useDataApi from './useDataApi';

function App() {
	const [state, setUrl] = useDataApi('', { initial: true });

  console.log('state', state);

  return <div>hello</div>;
}

export default App;