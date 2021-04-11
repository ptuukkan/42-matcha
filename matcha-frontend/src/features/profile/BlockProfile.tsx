import React, { useState } from 'react';
import { Button } from 'semantic-ui-react';
import agent from '../../app/api/agent';

export interface BlockProfileProps {
	id: string;
	blocked: boolean;
}

const BlockProfile: React.SFC<BlockProfileProps> = ({ id, blocked }) => {
	const [stateValue, setStateValue] = useState(blocked);
	return !stateValue ? (
		<Button
			floated="right"
			size="tiny"
			color="black"
			onClick={() => agent.Profile.block(id) && setStateValue(!stateValue)}
		>
			Block user
		</Button>
	) : (
		<Button
			floated="right"
			size="tiny"
			color="black"
			onClick={() => agent.Profile.unblock(id) && setStateValue(!stateValue)}
		>
			Unblock user
		</Button>
	);
};

export default BlockProfile;
