import React, { useState } from 'react';
import endOfWeek from 'date-fns/endOfWeek';
import startOfWeek from 'date-fns/startOfWeek';
import { addDays, subDays } from 'date-fns';

const DateContext = React.createContext();

function DateProvider({ children }) {
	const [globalNow, handleGlobalNow] = useState(new Date());
	const setToday = () => handleGlobalNow(new Date());
	const prevWeek = () => {
		handleGlobalNow(subDays(globalNow, 7));
	};
	const nextWeek = () => {
		handleGlobalNow(addDays(globalNow, 7));
	};
	return (
		<DateContext.Provider
			value={{
				globalNow,
				handleGlobalNow,
				setToday,
				prevWeek,
				nextWeek,
				range: [startOfWeek(globalNow), endOfWeek(globalNow)]
			}}
		>
			{children}
		</DateContext.Provider>
	);
}

const DateConsumer = DateContext.Consumer;

export { DateProvider, DateConsumer };
