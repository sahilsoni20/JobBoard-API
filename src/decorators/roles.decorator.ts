import { SetMetadata } from '@nestjs/common';

export const Roles = (...args: string[]) => SetMetadata('roles', args);

// Allow us to define roles for a routes like: @Route('EMPLOYER')