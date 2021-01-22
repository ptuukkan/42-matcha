import React from 'react'
import { Comment, Header, Segment, Divider } from 'semantic-ui-react'

const Chat = () => {
	return (
		<>
		<Segment>
			<Header size='large'>Get more matchas to chat with!</Header>
		</Segment>
		<Comment.Group minimal>
		<Header as='h3' dividing>
		  Messages
		</Header>

		<Comment>
		  <Comment.Avatar as='a' src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
		  <Comment.Content>
			<Comment.Author as='a'>Matt</Comment.Author>
			<Comment.Metadata>
			  <span>Today at 5:42PM</span>
			</Comment.Metadata>
			<Comment.Text>How artistic!</Comment.Text>
		  </Comment.Content>
		</Comment>
	
		<Divider/>

		<Comment>
		  <Comment.Avatar as='a' src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />
		  <Comment.Content>
			<Comment.Author as='a'>Elliot Fu</Comment.Author>
			<Comment.Metadata>
			  <span>Yesterday at 12:30AM</span>
			</Comment.Metadata>
			<Comment.Text>
			  <p>This has been very useful for my research. Thanks as well!</p>
			</Comment.Text>
		  </Comment.Content>
	
		  <Divider/>

			<Comment>
			  <Comment.Avatar as='a' src='https://react.semantic-ui.com/images/avatar/small/jenny.jpg' />
			  <Comment.Content>
				<Comment.Author as='a'>Jenny Hess</Comment.Author>
				<Comment.Metadata>
				  <span>Just now</span>
				</Comment.Metadata>
				<Comment.Text>Elliot you are always so right :)</Comment.Text>
			  </Comment.Content>
			</Comment>
		</Comment>
	
		<Divider/>

		<Comment>
		  <Comment.Avatar as='a' src='https://react.semantic-ui.com/images/avatar/small/joe.jpg' />
		  <Comment.Content>
			<Comment.Author as='a'>Joe Henderson</Comment.Author>
			<Comment.Metadata>
			  <span>5 days ago</span>
			</Comment.Metadata>
			<Comment.Text>Dude, this is awesome. Thanks so much</Comment.Text>
		  </Comment.Content>
		</Comment>
	  </Comment.Group>
		</>
	)
}

export default Chat