import * as React from 'react';
import ResizableTextarea from '../ResizableTextarea';

const {useState} = React;

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

	return <ResizableTextarea 
		autofocus={true}
		value={value} 
		onBlur={handleBlur}
		onChange={value => setValue(value)}/>
} 

export default TodoInput;