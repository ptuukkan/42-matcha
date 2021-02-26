import React from 'react';
import { Segment, Button, Header, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
	return (
		<div className="notfound">
			<Header icon>
				<Icon name="search" />
				No matches here!
			</Header>
			<br />
			<Button as={Link} to="/" primary>
				Return to home page.
			</Button>
		</div>
	);
};

export default NotFound;
