import * as React from 'react';
const {useState, useRef, useEffect} = React;

function TodoInput(props) {
	const [value, setValue] = useState(props.initialValue);
	const inputRef = useRef();
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	});

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

	return <input 
		value={value} 
		ref={inputRef} 
		onChange={handleChange}
		onBlur={handleBlur} />;
} 

export default TodoInput;