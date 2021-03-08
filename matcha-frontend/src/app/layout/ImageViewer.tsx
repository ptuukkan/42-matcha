import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import agent from '../api/agent';

interface IParams {
	id: string;
}

const ImageViewer = () => {
	const [image, setImage] = useState<string | null>(null);
	const { id } = useParams<IParams>();

	useEffect(() => {
		agent.Image.get(id).then((img) => {
			setImage(img);
		})
	}, []);

	if (image === null) return;

	return (
		<img src={`data:image/jpeg;base64,${image}`} />
	)
};

export default ImageViewer;
