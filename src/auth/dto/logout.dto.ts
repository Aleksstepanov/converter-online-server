import { ApiProperty } from '@nestjs/swagger';

export class LogoutDto {
  @ApiProperty()
  userId: number;
}
