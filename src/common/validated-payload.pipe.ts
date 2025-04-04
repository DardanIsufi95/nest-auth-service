import { PipeTransform, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidatedPayloadPipe implements PipeTransform {
	constructor(private readonly dto: any) {}

	async transform(value: any) {
		// Transform the plain payload to an instance of the DTO class.
		const object = plainToInstance(this.dto, value);
		// Perform asynchronous validation.
		const errors = await validate(object, {
			whitelist: true,
			forbidNonWhitelisted: true,
		});
		if (errors.length > 0) {
			const formattedErrors = errors.map((error) => ({
				field: error.property,
				errors: error.constraints ? Object.values(error.constraints) : [],
			}));
			console.log('Validation errors:', formattedErrors);
			throw new RpcException({
				error: true,
				message: 'Validation failed',
				type: 'validation_error',
				errors: formattedErrors,
			});
		}
		return object;
	}
}
