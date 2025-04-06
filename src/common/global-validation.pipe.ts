import { ValidationPipe, UnprocessableEntityException, ValidationError, Injectable } from '@nestjs/common';

@Injectable()
export class GlobalValidationPipe extends ValidationPipe {
	constructor() {
		super({
			whitelist: true,
			transform: true,
			errorHttpStatusCode: 422,
			exceptionFactory: (errors: ValidationError[]) => {
				const formattedErrors = errors.map((error) => ({
					field: error.property,
					errors: error.constraints ? Object.values(error.constraints) : [],
				}));
				return new UnprocessableEntityException({
					message: 'Validation failed',
					type: 'validation_error',
					errors: formattedErrors,
				});
			},
		});
	}
}
