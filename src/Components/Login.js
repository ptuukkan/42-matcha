import React from 'react'
import { Form, Message, Button, Header } from 'semantic-ui-react'
import { useForm } from 'react-hook-form'

const Login = () => {
	const { register, handleSubmit, errors, formState } = useForm()

	const onSubmit = (data) => {
		console.log(data)
		if (formState.isSubmitted) {
			console.log('Redirect to success page')
		}
	}

	return (
		<div>
			<Header as="h1">Login to Matcha</Header>
			<Form onSubmit={handleSubmit(onSubmit)}>
				{errors.email && (
					<Message negative>{errors.email.message}</Message>
				)}
				{errors.password && (
					<Message negative>{errors.password.message}</Message>
				)}
				<Form.Group widths={2}>
					<Form.Field>
						<label>email</label>
						<input
							type="text"
							name="email"
							placeholder="email"
							ref={register({
								required: 'Email is required',
							})}
						/>
					</Form.Field>
					<Form.Field>
						<label>password</label>
						<input
							type="password"
							name="password"
							placeholder="password"
							ref={register({
								required: 'Password is required',
							})}
						/>
					</Form.Field>
				</Form.Group>
				<Button type="submit">Login</Button>
			</Form>
			<br></br>
		</div>
	)
}

export default Login
