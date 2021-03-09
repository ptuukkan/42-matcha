import { useDropzone } from 'react-dropzone';
import { Header, Icon } from 'semantic-ui-react';
import agent from '../../app/api/agent';
import { useCallback } from 'react';
import { observer } from 'mobx-react-lite';

const ProfilePhotos = () => {
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

		agent.Profile.addImage(formdata).catch((e) => console.log(e));
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: 'image/jpeg, image/png',
	});

	return (
		<div>
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
		</div>
	);
};

export default observer(ProfilePhotos);
