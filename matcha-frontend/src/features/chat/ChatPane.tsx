import { Tab } from 'semantic-ui-react'
import { IMessage } from '../../app/models/chat'

interface IProps {
	messages: IMessage[]
}

const ChatPane:React.FC<IProps> = ({messages}) => {
	return (
		<Tab.Pane>
			{messages.map((m, i)=> <p key={i}>{m.timestamp} {m.from} {m.message}</p>)}
		</Tab.Pane>
	)
}

export default ChatPane

