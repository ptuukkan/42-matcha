import React, { useCallback, useContext, useState } from 'react';
import {
	Button,
	Container,
	Header,
	Modal,
	Image,
	Grid,
} from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import { useDropzone } from 'react-dropzone';

const Step1 = () => {
	const [images, setImages] = useState<any[]>([]);

	const onDrop = useCallback((acceptedFiles) => {
		if (acceptedFiles.length > 5) {
			console.log('Max 5 photos!');
		} else {
			setImages(acceptedFiles);
			console.log(images);
		}
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
	return (
		<div>
			{images.length > 0 ? (
				<div>
					<Header>Please select your profile photo</Header>
					<Container>
						<Grid container columns={3}>
							{images.map((im) => (
								<Image
									key={im.name}
									src={URL.createObjectURL(im)}
								/>
							))}
						</Grid>
						<br></br>
						<Button content="Back" onClick={() => setImages([])} negative />
						<Button
							content="Next"
							floated="right"
							onClick={() => setImages([])}
							positive
						/>
					</Container>
				</div>
			) : (
				<div>
					<Container>
						<Header floated="left">Step 1. Add photos</Header>
					</Container>
					<p>max 5 pcs</p>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								background: '#E7E7E7',
								width: '80%',
								height: '80px',
								color: '#707070',
								borderRadius: '5px',
								padding: '20px',
								border: '1px dashed #bdbdbd',
								fontSize: '14px',
								cursor: 'pointer',
							}}
							{...getRootProps()}
						>
							<input {...getInputProps()} />
							{isDragActive ? (
								<p>Drop the files here ...</p>
							) : (
								<p>Drag 'n' drop some files here, or click to select files</p>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export interface FirstLoginProps {}

const FirstLogin: React.FC<FirstLoginProps> = () => {
	const rootStore = useContext(RootStoreContext);
	const { firstLogin, closeFirstLogin } = rootStore.modalStore;
	return (
		<>
			<Modal open={firstLogin}>
				<Modal.Header>Please fill in your personal informarion!</Modal.Header>
				<Modal.Content>
					<Step1 />
				</Modal.Content>
			</Modal>
		</>
	);
};

export default FirstLogin;