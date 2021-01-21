import React from 'react'
import { Icon, Menu, Label } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import '../App.css'

const Navigation = () => {
	return (
		<Menu
			fixed="top"
			icon="labeled"
			size="mini"
			borderless
			className="navi"
		>
			<Link to="/profile">
				<Menu.Item name="heart">
					<Icon name="heart" color="red" />
					Matcha
				</Menu.Item>
			</Link>

			<Menu.Menu position="right">
				<Link to="/matches">
					<Menu.Item name="matches">
						<Label
							circular
							color="red"
							size="mini"
							className="notificationBall"
							content="12"
						/>
						<Icon name="fire"></Icon>
						Matches
					</Menu.Item>
				</Link>

				<Link to="/browse">
					<Menu.Item name="browse">
						<Icon name="users" />
						Browse
					</Menu.Item>
				</Link>

				<Link to="/settings">
					<Menu.Item name="myprofile">
						<Icon name="user circle" />
						My Profile
					</Menu.Item>
				</Link>

				<Link to="/chat">
					<Menu.Item name="chat">
						<Label
							circular
							color="red"
							size="mini"
							className="notificationBall"
							content="2"
						/>
						<Icon name="comments" />
						Chat
					</Menu.Item>
				</Link>
			</Menu.Menu>
		</Menu>
	)
}

export default Navigation
