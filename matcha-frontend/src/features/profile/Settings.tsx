import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Header, Form, Dropdown } from 'semantic-ui-react'

const interests_data = [
	{ key: 'angular', text: 'Angular', value: 'angular' },
	{ key: 'css', text: 'CSS', value: 'css' },
	{ key: 'design', text: 'Graphic Design', value: 'design' },
	{ key: 'ember', text: 'Ember', value: 'ember' },
	{ key: 'html', text: 'HTML', value: 'html' },
	{ key: 'ia', text: 'Information Architecture', value: 'ia' },
	{ key: 'javascript', text: 'Javascript', value: 'javascript' },
	{ key: 'mech', text: 'Mechanical Engineering', value: 'mech' },
	{ key: 'meteor', text: 'Meteor', value: 'meteor' },
	{ key: 'node', text: 'NodeJS', value: 'node' },
	{ key: 'plumbing', text: 'Plumbing', value: 'plumbing' },
	{ key: 'python', text: 'Python', value: 'python' },
	{ key: 'rails', text: 'Rails', value: 'rails' },
	{ key: 'react', text: 'React', value: 'react' },
	{ key: 'repair', text: 'Kitchen Repair', value: 'repair' },
	{ key: 'ruby', text: 'Ruby', value: 'ruby' },
	{ key: 'ui', text: 'UI Design', value: 'ui' },
	{ key: 'ux', text: 'User Experience', value: 'ux' },
]

const Settings = () => {
	/* 	const [location, setLocation] = useState('') */
	const [radius, setRadius] = useState(1)
	const [interests, setInterest] = useState(interests_data)
	const [inters, setInterestSelect] = useState({ selectedIterest: [] })
	const { register, handleSubmit, reset, setValue } = useForm()

	useEffect(() => {
		reset({
			firstame: 'firstnameFromDatabase',
			lastname: 'lastnameFromDatabase',
			gender: 'Male',
			sexpreference: 'Heterosexual',
		})
	}, [reset])

	/* 	const getLocation = () => {
		navigator.geolocation.getCurrentPosition((position) => {
			setLocation(
				`Latitude: ${position.coords.longitude} Longitude: ${position.coords.longitude}`
			)
		})
	} */

	const handleMultiChange = (selectedOption: any) => {
		let selectedIterest = selectedOption.value
		setValue('selectInterest', selectedOption.value)
		setInterestSelect({ selectedIterest })
	}

	const handleAddition = (newOption: any) => {
		interests.push({
			key: newOption.value,
			text: newOption.value,
			value: newOption.value,
		})
		setInterest(interests)
	}

	const handleRadius = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		setRadius(Number(e.target.value))
	}

	useEffect(() => {
		register({ name: 'selectInterest' })
	}, [register])

	const onSubmit = (data: any) => console.log(data)

	return (
		<div>
			<Header as="h1">Settings</Header>
			<Form onSubmit={handleSubmit(onSubmit)}>
				Account Settings
				<Form.Group>
					<Form.Field>
						<label>Name</label>
						<input
							type="text"
							name="firstname"
							placeholder="firstname"
							ref={register({
								required: 'Firstname is required',
							})}
						></input>
						<input
							type="text"
							name="lastname"
							placeholder="lastname"
							ref={register({
								required: 'Lastname is required',
							})}
						></input>
					</Form.Field>
				</Form.Group>
				Gender / Sex:
				<Form.Group>
					<input
						list="genders"
						name="gender"
						placeholder="Gender"
						ref={register({})}
					/>
					<datalist id="genders">
						<option value="Male"></option>
						<option value="Female"></option>
					</datalist>
					<input
						list="sexpreference"
						name="sexpreference"
						placeholder="Sexual preference"
						ref={register({})}
					/>
					<datalist id="sexpreference">
						<option value="Heterosexual"></option>
						<option value="Bi-sexual"></option>
						<option value="Gay"></option>
						<option value="Asexual"></option>
					</datalist>
				</Form.Group>
				<Header as='h4'>Location</Header>
				<label>Search radius</label>
				<Form.Group>
					<br></br>
					<input
						type="range"
						min={1}
						max={100}
						name="radius"
						value={radius}
						onChange={handleRadius}
						ref={register()}
					></input>
					<br></br>
					{radius} km
				</Form.Group>
				Interests
				<Form.Group>
					<Dropdown
						multiple
						fluid
						search
						name="selectInterest"
						selection
						options={interests}
						value={inters.selectedIterest}
						allowAdditions
						additionLabel={
							<i style={{ color: 'red' }}>New interest: </i>
						}
						onAddItem={handleAddition}
						onChange={handleMultiChange}
					></Dropdown>
				</Form.Group>
				<Button type="submit">Save</Button>
			</Form>
		</div>
	)
}

export default Settings
