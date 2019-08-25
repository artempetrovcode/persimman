import * as React from 'react';
import ResizableTextarea from '../ResizableTextarea';
import {getISODateString, getISOTimeString} from '../lib/timeUtils';

const {useState} = React;

type Props = {
}

function TodoDateTimeInput(props: Props) {
	const [dateISOValue, setDateISOValue] = useState(getISODateString(new Date(props.timestamp)));
	const [timeISOValue, setTimeISOValue] = useState(getISOTimeString(new Date(props.timestamp)));

	function handleDateChange(e) {
		setDateISOValue(e.target.value);
	}

	function handleDateBlur() {
		if (dateISOValue === '') {
			props.onCancel();
			return
		}	

		const timeStampDiff = (new Date(dateISOValue)).getTime() - (new Date(getISODateString(new Date(props.timestamp)))).getTime();

		if (timeStampDiff === 0) {
			props.onCancel();
		} else {
			props.onChange(props.timestamp + timeStampDiff);
		}
	}

	return <>
		<input 
			type="date" 
			value={dateISOValue} 
			onBlur={handleDateBlur}
			onChange={handleDateChange}
		/>
		<input type="time" value={timeISOValue} disabled={true} />
	</>;
} 

export default TodoDateTimeInput;