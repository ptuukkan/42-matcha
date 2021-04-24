import React, { Fragment, useContext } from 'react';
import { Link } from 'react-router-dom';
import { List, Image, Header } from 'semantic-ui-react';
import { IProfileThumbnail } from '../../app/models/profile';
import { RootStoreContext } from '../../app/stores/rootStore';

interface IProps {
	profileThumbnails: IProfileThumbnail[];
	title: string;
}

const ProfileStatistics: React.FC<IProps> = ({ profileThumbnails, title }) => {
	const rootStore = useContext(RootStoreContext);
	const { closeModal } = rootStore.modalStore;

	return (
		<Fragment>
			<Header as="h2" content={title} color="pink" />
			<List
				selection
				verticalAlign="middle"
				style={{ maxHeight: '50vh', overflow: 'auto' }}
			>
				{profileThumbnails.map((p) => (
					<List.Item
						key={p.id}
						as={Link}
						to={`/profile/${p.id}`}
						onClick={closeModal}
					>
						<Image avatar src={p.image.url} />
						<List.Content>
							<List.Header>{p.firstName}</List.Header>
						</List.Content>
					</List.Item>
				))}
			</List>
		</Fragment>
	);
};

export default ProfileStatistics;
