import React, { useEffect, useState } from 'react';
import { Dropdown } from 'semantic-ui-react';
import agent from '../../app/api/agent';
import { IInterestOption } from '../../app/models/interest';

interface IProps {
	setValue: React.Dispatch<React.SetStateAction<string[]>>;
}

const InterestsSorter: React.FC<IProps> = ({ setValue }) => {
	const [interests, setInterests] = useState<IInterestOption[]>([]);
	const [interestsLoading, setInterestsLoading] = useState(false);

	useEffect(() => {
		if (interests.length === 0) {
			setInterestsLoading(true);
			agent.Interests.get()
				.then((interests) => setInterests(interests))
				.catch((error) => console.log(error))
				.finally(() => setInterestsLoading(false));
		}
	}, [interests.length]);

	return (
		<Dropdown
			loading={interestsLoading}
			placeholder="State"
			fluid
			multiple
			search
			selection
			onChange={(event ,{value}: any) => setValue(value)}
			options={interests}
		/>
	);
};

export default InterestsSorter;
