import { Image, Button, Card } from 'semantic-ui-react';

const ShowPhotos = () => {
	return (
		<Image.Group>
			<Card>
				<Image src="http://localhost:8080/img/1240219" wrapped ui={true} />
				<Button.Group fluid widths={2}>
					<Button
						onClick={() => console.log('To main photo')}
						//disabled={photo.isMain}
						//loading={loading && target === photo.id}
						basic
						positive
						content="Main"
					/>
					<Button
						//name={photo.id}
						onClick={() => console.log('delete')}
						//disabled={photo.isMain}
						//loading={loading && deleteTarget === photo.id}
						basic
						negative
						icon="trash"
					/>
				</Button.Group>
				)
			</Card>
		</Image.Group>
	);
};

export default ShowPhotos;
