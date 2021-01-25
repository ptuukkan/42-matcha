import { configure } from "mobx";
import { createContext } from "react";
import ModalStore from "./modalStore";

configure ({enforceActions: 'always'});

export class RootStore {
	modalStore: ModalStore;

	constructor() {
		this.modalStore = new ModalStore(this);
	}
}

export const RootStoreContext = createContext(new RootStore());

