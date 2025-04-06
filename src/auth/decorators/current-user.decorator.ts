import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

export interface JwtPayload {
  sub: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

export type CurrentUserOptions = {
  fetchUser?: boolean;
}

export const CurrentUser = createParamDecorator(
  (options: CurrentUserOptions = {}, ctx: ExecutionContext) => {
    const { fetchUser = true } = options; // Default to returning the full user
    const request = ctx.switchToHttp().getRequest();
    
    // Get user from request (set by JwtAuthGuard)
    const user = request.user;
    
    if (!user) {
      throw new HttpException('User not found in request. Make sure JwtAuthGuard is applied.', HttpStatus.UNAUTHORIZED);
    }
    
    // If we want the full user object
    if (fetchUser) {
      return user;
    }
    
    // Otherwise extract JWT payload fields
    return {
      sub: user.id,
      username: user.username,
      role: user.role
    };
  },
); 