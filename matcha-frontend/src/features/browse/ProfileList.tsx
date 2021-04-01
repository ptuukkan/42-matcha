import React, { Fragment } from 'react';
import { Image, Button, Card, Header, Icon, Rating } from 'semantic-ui-react';
import { IPublicProfile } from '../../app/models/profile';

interface IProps {
	profiles: IPublicProfile[];
}

const ProfileList: React.FC<IProps> = ({ profiles }) => {
	return (
		<Fragment>
			{profiles.map((p) => (
				<Card fluid key={p.id}>
					<Image src={p.images.find((i) => i.isMain)?.url} wrapped ui={false} />
					<div className="profileinfo">
						<Header as="h1">{`${p.firstName} ${p.lastName}, ${p.age}`}</Header>
						<Icon name={p.gender === 'Female' ? 'mars' : 'venus'} />
						Distance: {p.distance} km
						<Header>Fame Rating</Header>
						<Rating
							icon="heart"
							disabled
							rating={p.fameRating}
							maxRating={10}
						/>
						<Card.Description>{p.biography}</Card.Description>
						<br></br>
						<Button circular icon="cancel" size="massive" color="black" />
						<Button
							circular
							icon="like"
							floated="right"
							size="massive"
							color="red"
						/>
					</div>
				</Card>
			))}
		</Fragment>
	);
};

export default ProfileList;
