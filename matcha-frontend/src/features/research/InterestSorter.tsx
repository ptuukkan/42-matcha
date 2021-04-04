import React from "react";
import { Dropdown } from "semantic-ui-react";

const test = [
{value: "die-hard", text: "die-hard"},
{value: "motorcycles", text: "motorcycles"},
{value: "yogyrt", text: "yogyrt"},
{value: "gym", text: "gym"},
{value: "organizing", text: "organizing"},
{value: "binders", text: "binders"},
{value: "cooking", text: "cooking"},
{value: "plotting", text: "plotting"},
{value: "not-working", text: "not-working"},
{value: "classical-music", text: "classical-music"},
{value: "dogs", text: "dogs"},
{value: "pizza", text: "pizza"},
{value: "chairs", text: "chairs"},]

interface IProps {
	setValue: React.Dispatch<React.SetStateAction<string[]>>;
}
 
const InterestsSorter: React.FC<IProps> = ({setValue}) => {
	return ( 
		<Dropdown
		placeholder='State'
		fluid
		multiple
		search
		selection
		onChange={ (e,d) => console.log(d.value)}
		options={test}
	  />
	 );
}
 
export default InterestsSorter;