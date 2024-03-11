
import StatusCodes from 'http-status-codes';

/* eslint-disable  @typescript-eslint/no-explicit-any */
export default function (error: any, request: any, response: any, next: any) {
/* eslint-enable  @typescript-eslint/no-explicit-any */
	if (! error) return next ();

	if (error.boom && error.boom.isBoom () && error.boom.statusCode !== StatusCodes.OK) {
		return error;
	}

	return response.boom.badImplementation (JSON.stringify (error));
}
