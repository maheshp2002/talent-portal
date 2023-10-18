/**
 * An interface representing the configuration of a message.
 *
 * @property key-value pair object where the key represents the name of the configuration property and the value
 * represents the value of the configuration property.
 */
export interface IValidationMessage {
	[key: string]: string
}
