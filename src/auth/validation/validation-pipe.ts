import {
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class RegisterUserRoleValidation implements PipeTransform {
  private readonly logger = new Logger(RegisterUserRoleValidation.name);

  transform(value: object) {
    if (value.hasOwnProperty('role')) {
      this.logger.error('Error registering user');
      this.logger.error('Description: Role is not allowed');
      throw new BadRequestException('Role is not allowed');
    }
    return value;
  }
}
