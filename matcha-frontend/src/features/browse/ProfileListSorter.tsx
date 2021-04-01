import React, { Fragment, useState } from 'react'
import { Button } from 'semantic-ui-react';
import { IPublicProfile } from '../../app/models/profile';

interface IProps {
	profiles: IPublicProfile[]
	setProfiles: React.Dispatch<React.SetStateAction<IPublicProfile[]>>
}

const ProfileListSorter: React.FC<IProps> = ({profiles, setProfiles}) => {
	const [activeSort, setActiveSort] = useState(0);
	const [ageDir, setAgeDir] = useState(true);
	const [disDir, setDisDir] = useState(true);
	const [famDir, setFamDir] = useState(true);

	const sort = (sortBy: string) => {
		const newProfiles = [...profiles];
		switch (sortBy) {
			case 'age':
				if (activeSort === 1) {
					setAgeDir(!ageDir);
				} else {
					setActiveSort(1);
				}
				if (ageDir) {
					newProfiles.sort((a, b) => b.age - a.age);
				} else {
					newProfiles.sort((a, b) => a.age - b.age);
				}
				setProfiles(newProfiles);
				break;
			case 'distance':
				if (activeSort === 2) {
					setDisDir(!disDir);
				} else {
					setActiveSort(2);
				}
				if (disDir) {
					newProfiles.sort((a, b) => a.distance - b.distance);
				} else {
					newProfiles.sort((a, b) => b.distance - a.distance);
				}
				setProfiles(newProfiles);
				break;
			case 'fameRate':
				if (activeSort === 3) {
					setFamDir(!famDir);
				} else {
					setActiveSort(3)
				}
				if (famDir) {
					newProfiles.sort((a, b) => a.fameRating - b.fameRating);
				} else {
					newProfiles.sort((a, b) => b.fameRating - a.fameRating);
				}
				setProfiles(newProfiles);
				break;
			default:
				break;
		}
	};

	return (
		<Fragment>
				<Button
				active={activeSort === 1}
				onClick={() => sort('age')}
				content="Age"
				icon={ageDir ? 'caret down' : 'caret up'}
				labelPosition="right"
			/>
			<Button
				active={activeSort === 2}
				onClick={() => sort('distance')}
				content="Distance"
				icon={disDir ? 'caret down' : 'caret up'}
				labelPosition="right"
			/>
			<Button
				active={activeSort === 3}
				onClick={() => sort('fameRate')}
				content="Fame Rating"
				icon={famDir ? 'caret down' : 'caret up'}
				labelPosition="right"
			/>
		</Fragment>
	)
}

export default ProfileListSorter
