
import { Tainted } from './types';

interface x_string_invalid {
    new (name: string): Error;
}

interface x_name_invalid {
    new (name: string, min_length: number): Error;
}

type Validate_String = {
	min_length?: number;
	max_length?: number;
	match?:      RegExp;
}

export class Validate {
	static _ensure_valid_name (x_class: x_name_invalid, value: Tainted, min_length?: number) {
		min_length ||= 3;

		try {
			Validate._ensure_valid_string (
				Error,
				value,
				{
					match: new RegExp (
						Array (min_length)
							.fill ('[a-z]+')
							.join ('(?:[^a-z])*')
						,
						'i'
					),
				}
			);
		} catch (err) {
			throw new x_class (value, min_length);
		}
	}

	static _ensure_valid_public_id (x_class: x_string_invalid, value: Tainted) {
		const uuid_regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

		Validate._ensure_valid_string (
			x_class,
			value,
			{
				match: uuid_regex,
			}
		);
	}

	static _ensure_valid_string (x_class: x_string_invalid, value: string, options?: Validate_String) {
		let valid = typeof value == 'string';

		if (valid && options) {
			const check_value = value.trim ();

			if (typeof options.min_length == 'number') {
				valid &&= check_value.length >= options.min_length;
			}

			if (typeof options.max_length == 'number') {
				valid &&= check_value.length >= options.max_length;
			}

			if (options.match instanceof RegExp) {
				valid &&= !! check_value.match (options.match);
			}
		}

		if (! valid) {
			throw new x_class (value);
		}
	}

}

