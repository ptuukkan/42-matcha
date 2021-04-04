import React, { Fragment, useState } from 'react';
import { Button, Header } from 'semantic-ui-react';
import { IPublicProfile } from '../../app/models/profile';

interface IProps {
	profiles: IPublicProfile[];
	setProfiles: React.Dispatch<React.SetStateAction<IPublicProfile[]>>;
}

const BrowseListSorter: React.FC<IProps> = ({ profiles, setProfiles }) => {
	const [activeSort, setActiveSort] = useState(5);
	const [ageDir, setAgeDir] = useState(true);
	const [disDir, setDisDir] = useState(true);
	const [intDir, setIntDir] = useState(true);
	const [famDir, setFamDir] = useState(true);
	const [comDir, setComDir] = useState(true);

	const sort = (sortBy: string) => {
		const newProfiles = [...profiles];
		let dir;
		switch (sortBy) {
			case 'age':
				dir = ageDir;
				if (activeSort === 1) {
					setAgeDir(!ageDir);
					dir = !dir;
				} else {
					setActiveSort(1);
				}
				if (dir) {
					newProfiles.sort((a, b) => b.age - a.age);
				} else {
					newProfiles.sort((a, b) => a.age - b.age);
				}
				setProfiles(newProfiles);
				break;
			case 'distance':
				dir = disDir;
				if (activeSort === 2) {
					setDisDir(!disDir);
					dir = !dir;
				} else {
					setActiveSort(2);
				}
				if (dir) {
					newProfiles.sort((a, b) => b.distance - a.distance);
				} else {
					newProfiles.sort((a, b) => a.distance - b.distance);
				}
				setProfiles(newProfiles);
				break;
			case 'fameRate':
				dir = famDir;
				if (activeSort === 3) {
					setFamDir(!famDir);
					dir = !dir;
				} else {
					setActiveSort(3);
				}
				if (dir) {
					newProfiles.sort((a, b) => b.fameRating - a.fameRating);
				} else {
					newProfiles.sort((a, b) => a.fameRating - b.fameRating);
				}
				setProfiles(newProfiles);
				break;
			case 'interests':
				dir = intDir;
				if (activeSort === 4) {
					setIntDir(!intDir);
					dir = !dir;
				} else {
					setActiveSort(4);
				}
				if (dir) {
					newProfiles.sort((a, b) => b.commonInterests - a.commonInterests);
				} else {
					newProfiles.sort((a, b) => a.commonInterests - b.commonInterests);
				}
				setProfiles(newProfiles);
				break;
			case 'compatibilityRating':
				dir = comDir;
				if (activeSort === 5) {
					setComDir(!comDir);
					dir = !dir;
				} else {
					setActiveSort(5);
				}
				if (dir) {
					newProfiles.sort(
						(a, b) => b.compatibilityRating - a.compatibilityRating
					);
				} else {
					newProfiles.sort(
						(a, b) => a.compatibilityRating - b.compatibilityRating
					);
				}
				setProfiles(newProfiles);
				break;
			default:
				break;
		}
	};

	return (
		<Fragment>
			<Header size="medium" content="Sort" />
			<Button
				active={activeSort === 5}
				onClick={() => sort('compatibilityRating')}
				content="Compatibility"
				icon={comDir ? 'caret down' : 'caret up'}
				labelPosition="right"
			/>
			<br />
			<br />
			<Button
				active={activeSort === 1}
				onClick={() => sort('age')}
				content="Age"
				icon={ageDir ? 'caret down' : 'caret up'}
				labelPosition="right"
			/>
			<br />
			<br />
			<Button
				active={activeSort === 2}
				onClick={() => sort('distance')}
				content="Distance"
				icon={disDir ? 'caret down' : 'caret up'}
				labelPosition="right"
			/>
			<br />
			<br />
			<Button
				active={activeSort === 3}
				onClick={() => sort('fameRate')}
				content="Fame Rating"
				icon={famDir ? 'caret down' : 'caret up'}
				labelPosition="right"
			/>
			<br />
			<br />
			<Button
				active={activeSort === 4}
				onClick={() => sort('interests')}
				content="Mutual Interests"
				icon={intDir ? 'caret down' : 'caret up'}
				labelPosition="right"
			/>
		</Fragment>
	);
};

export default BrowseListSorter;
