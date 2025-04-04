import { ValidationPipe, UnprocessableEntityException, ValidationError } from '@nestjs/common';

export const GlobalValidationPipe = new ValidationPipe({
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
