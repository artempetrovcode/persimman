// @flow
// inspired by https://codepen.io/Libor_G/pen/eyzwOx
import * as React from 'react';

const {useEffect, useRef} = React;

const TEXTAREA_LINE_HEIGHT = 19;
const MIN_ROWS = 1;
const MAX_ROWS = 10;
const style = {
  fontSize: `14px`, 
  lineHeight: `${TEXTAREA_LINE_HEIGHT}px`, 
  padding: '2px',
  border: '1p solid black',
  fontFamily: 'Roboto,RobotoDraft,Helvetica,Arial,sans-serif',
  flex: 1,
};

type Props = {
  autofocus?: boolean,
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void,
  onKeyUp?: (e: any) => void,
  onKeyDown?: (e: any) => void,
}

function ResizableTextarea(props: Props) {
  const rows = Math.max(props.value.split('\n').length, MIN_ROWS);
  const textareaRef = useRef();
	useEffect(() => {
		if (props.autofocus && textareaRef.current) {
			textareaRef.current.focus();
		}
	});

	return (
			<textarea
				style={style}
        ref={textareaRef}
				rows={rows}
				value={props.value}
				onChange={event => { props.onChange(event.target.value); }}
        onBlur={() => { props.onBlur && props.onBlur() }}
        onKeyUp={(e) => { props.onKeyUp && props.onKeyUp(e) }}
        onKeyDown={(e) => { props.onKeyDown && props.onKeyDown(e) }}
			/>
		);
}

export default ResizableTextarea;