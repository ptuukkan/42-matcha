import React, { useContext } from 'react'
import { Modal } from 'semantic-ui-react'
import { RootStoreContext } from '../../stores/rootStore'
import { observer } from 'mobx-react-lite';

const SubModalContainer = () => {
	const rootStore = useContext(RootStoreContext);
	const {subModal: {open, body, size}, closeSubModal} = rootStore.modalStore;

	return (
		<Modal open={open} onClose={closeSubModal} size={size}>
			<Modal.Content>
				{body}
			</Modal.Content>
		</Modal>
	)
}

export default observer(SubModalContainer);
