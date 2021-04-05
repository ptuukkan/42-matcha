import { Dropdown } from 'semantic-ui-react';
import { IInterestOption } from '../../app/models/interest';

interface IProps {
	setValue: React.Dispatch<React.SetStateAction<string[]>>;
	interests: IInterestOption[];
}

const InterestsSorter: React.FC<IProps> = ({ setValue, interests }) => {

	return (
		<Dropdown
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
