import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Get the user from the request object (set by JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();
    
    // If no user is available (should not happen if JwtAuthGuard is applied first)
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if the user has any of the required roles
    const hasRole = requiredRoles.some(role => user.role === role);
    
    if (!hasRole) {
      throw new ForbiddenException(`User does not have required role: ${requiredRoles.join(', ')}`);
    }
    
    return true;
  }
} 