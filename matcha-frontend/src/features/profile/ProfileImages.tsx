import { Fragment, useContext, useState } from 'react';
import { Button } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileImagesDisplay from './ProfileImagesDisplay';
import ImageUpload from '../../app/common/imageUpload/ImageUpload';

const ProfileImages = () => {
	const [addImageMode, setAddImageMode] = useState(false);
	const rootStore = useContext(RootStoreContext);
	const {
		profile,
		loading,
		removeImage,
		addImage,
		setMain,
	} = rootStore.profileStore;

	return (
		<Fragment>
			<Button
				floated="right"
				basic
				content={addImageMode ? 'Cancel' : 'Add Photo'}
				onClick={() => setAddImageMode(!addImageMode)}
			/>
			{addImageMode && profile ? (
				<ImageUpload
					setAddImageMode={setAddImageMode}
					addImage={addImage}
					loading={loading}
				/>
			) : (
				<ProfileImagesDisplay
					removeImage={removeImage}
					setMain={setMain}
					profile={profile}
				/>
			)}
		</Fragment>
	);
};

export default ProfileImages;
