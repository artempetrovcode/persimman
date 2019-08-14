// @flow
// inspired by https://codepen.io/Libor_G/pen/eyzwOx
import * as React from 'react';

const {useEffect, useState, useRef} = React;

const TEXTAREA_LINE_HEIGHT = 20;
const MIN_ROWS = 3;
const MAX_ROWS = 10;
const style = {
  fontSize: `16px`, 
  lineHeight: `${TEXTAREA_LINE_HEIGHT}px`, 
  padding: '8px',
  flex: 1,
};

type Props = {
  autofocus?: boolean,
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void,
}
function ResizableTextarea(props: Props) {
	const [state, setState] = useState({
		value: props.value,
		rows: Math.max(props.value.split('\n').length, MIN_ROWS),
	});

  const textareaRef = useRef();
	useEffect(() => {
		if (props.autofocus && textareaRef.current) {
			textareaRef.current.focus();
		}
	});
  
  const handleChange = (event) => {
		const previousRows = event.target.rows;
    // reset number of rows in textarea 
  	event.target.rows = MIN_ROWS;
		
		const currentRows = ~~(event.target.scrollHeight / TEXTAREA_LINE_HEIGHT);
    
    if (currentRows === previousRows) {
    	event.target.rows = currentRows;
    }
		
		if (currentRows >= MAX_ROWS) {
			event.target.rows = MAX_ROWS;
			event.target.scrollTop = event.target.scrollHeight;
		}
    
  	setState({
    	value: event.target.value,
      rows: currentRows < MAX_ROWS ? currentRows : MAX_ROWS,
    });
    props.onChange(event.target.value);
	};

	return (
			<textarea
				style={style}
        ref={textareaRef}
				rows={state.rows}
				value={state.value}
				onChange={handleChange}
        onBlur={() => { props.onBlur && props.onBlur() }}
			/>
		);
}

export default ResizableTextarea;