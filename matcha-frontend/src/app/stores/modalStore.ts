import { makeAutoObservable, observable } from 'mobx';
import { RootStore } from './rootStore';

interface IModalProps {
	open: boolean;
	size: 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen';
	body: any;
}

export default class ModalStore {
	rootStore: RootStore;

	modal: IModalProps = {
		open: false,
		size: 'mini',
		body: null,
	};

	subModal: IModalProps = {
		open: false,
		body: null,
		size: 'mini',
	};

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		makeAutoObservable(this, {
			modal: observable.shallow,
			subModal: observable.shallow,
		});
	}

	openModal = (
		content: any,
		size?: 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen'
	) => {
		this.modal.open = true;
		this.modal.body = content;
		this.modal.size = size ?? 'mini';
	};

	closeModal = () => {
		this.modal.open = false;
		this.modal.body = null;
	};

	openSubModal = (content: any) => {
		this.subModal.open = true;
		this.subModal.body = content;
	};

	closeSubModal = () => {
		this.subModal.open = false;
		this.subModal.body = null;
	};
}
