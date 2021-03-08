import { useDropzone } from 'react-dropzone';
import { Grid, Header, Image, Icon, Modal, Button } from 'semantic-ui-react';
import agent from '../../app/api/agent';
import { useCallback, useContext, useState } from 'react';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';

const ProfilePhotos = () => {
	const rootStore = useContext(RootStoreContext);
	const { profilePhotoOpen, closeProfilePhoto, firstLogin } = rootStore.modalStore;
	const [images, setImages] = useState<any[]>([]);

	const dropzoneStyles = {
		border: 'dashed 3px',
		borderColor: '#eee',
		borderRadius: '5px',
		paddingTop: '30px',
		textAlign: 'center' as 'center',
		height: '200px',
	};

	const dropzoneActive = {
		borderColor: 'green',
	};

	const onDrop = useCallback((acceptedFiles) => {
		if (acceptedFiles.length > 5) {
			return alert('Max 5 Photos!!');
		}
		const formdata = new FormData();
		acceptedFiles.forEach((file: Blob) => {
			formdata.append('image', file);
		});
		setImages(acceptedFiles);
		agent.Profile.addImage(formdata)
			.then(() => console.log('success'))
			.catch((e) => console.log(e));
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: 'image/jpeg, image/png',
	});

	return (
		<Modal size="large" open={profilePhotoOpen} onClose={closeProfilePhoto} closeIcon>
			<Modal.Header as="h4">Profile photo</Modal.Header>
			<Modal.Content>
				<div
					{...getRootProps()}
					style={
						isDragActive
							? { ...dropzoneStyles, ...dropzoneActive }
							: dropzoneStyles
					}
				>
					<input {...getInputProps()} />
					<Icon name="upload" size="huge" />
					<Header content="Drop image here" />
				</div>
			</Modal.Content>
			<Modal.Actions>
			<Header floated="left">Select your profile photo below</Header>
				<Grid container columns={5}>
					{images.length > 0 ? (
						images.map((im) => (
							<Grid.Column key={im.lastModified + Date.now()}>
								<Image
									src={URL.createObjectURL(im)}
									onClick={() => console.log('Call setMain with this image id')}
									rounded
									size="small"
								/>
								<Button
									name={im.lastModified}
									onClick={() => console.log('Call /profile/image/{id} ')}
									basic
									negative
									icon="trash"
								/>
							</Grid.Column>
						))
					) : (
						<Image.Group size="tiny">
							<Image src={'/placeholder.png'} size="tiny"  rounded/>
							<Button
								name={'a'}
								onClick={() => console.log('delete')}
								basic
								negative
								icon="trash"
							/>
						</Image.Group>
					)}
				</Grid>
				<Button
					primary
					positive
				>Save</Button>
			</Modal.Actions>
		</Modal>
	);
};

export default observer(ProfilePhotos);
