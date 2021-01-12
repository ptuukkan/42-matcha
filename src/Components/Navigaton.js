import React from 'react'
import { Icon, Menu, } from 'semantic-ui-react'

const Navigation = () => {
	return(
		<Menu fixed='top' icon='labeled'>
			<Menu.Item
				name='heart'
				onClick={() => console.log('clicked home')}
			>
				<Icon name='heart' color='red'/>
				Matcha
			</Menu.Item>
			<Menu.Menu position='right'>
				<Menu.Item
					name='browse'
					onClick={() => console.log('Clicked browse')}
				>
					<Icon name='users'/>
					Browse
				</Menu.Item>

				<Menu.Item
					name='myprofile'
					onClick={() => console.log('Clicked my profile')}
				>
					<Icon name='user circle'/>
					My Profile
				</Menu.Item>

				<Menu.Item
					name='chat'
					onClick={() => console.log('Chat')}
				>
					<Icon name='comments'/>
					Chat
				</Menu.Item>
			</Menu.Menu>
		</Menu>
	)
}

export default Navigation