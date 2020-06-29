import * as React from 'react';
import ResizableTextarea from '../ResizableTextarea';

const {useState} = React;

const TAB_KEY_CODE = 9;

function TodoInput(props) {
	const [value, setValue] = useState(props.initialValue);

	function handleChange(e) {
		setValue(e.target.value);
	}

	function handleBlur() {
		if (value === props.initialValue) {
			props.onCancel();
		} else if (value === '') {
			props.onDelete();
		} else {
			props.onChange(value);
		}
	}

	function handleTab() {
		console.log('tab')
	}

	function handleShiftTab() {
		console.log('shift + tab');
	}

	function handleKeyDown(e: SyntheticInputEvent<HTMLTextAreaElement>) {
    if (e.keyCode === TAB_KEY_CODE) {
      if (e.shiftKey) {
        handleShiftTab(e);
      } else {
        handleTab(e);
      }
      e.preventDefault();
    }
    props.onKeyDown && props.onKeyDown(e);
  }

	return <ResizableTextarea 
		autofocus={true}
		value={value} 
		onBlur={handleBlur}
		onKeyDown={handleKeyDown}
		onChange={value => setValue(value)}
	/>
} 

export default TodoInput;