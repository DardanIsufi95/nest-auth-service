import { Payload } from '@nestjs/microservices';
import { ValidatedPayloadPipe } from './validated-payload.pipe';

export function ValidatedPayload(dto: any): ParameterDecorator {
	return Payload(new ValidatedPayloadPipe(dto));
}
