import * as React from 'react';
import ResizableTextarea from '../ResizableTextarea';

const {useState} = React;

const TAB_KEY_CODE = 9;

type Props = $ReadOnly<{
	initialValue: string,
	onCancel: () => {},
	onDelete: () => {},
	onChange: (value: string) => {},
	onKeyDown: (e: SyntheticInputEvent<HTMLTextAreaElement>) => {},
	onLevelUp: () => {},
	onLevelDown: () => {},
}>;

function TodoInput(props: Props) {
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
		props.onLevelDown && props.onLevelDown();
	}

	function handleShiftTab() {
		props.onLevelUp && props.onLevelUp();
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