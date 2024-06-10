import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Status } from 'src/common/enums/status.enum';

export class CreateSunoDto {
  /** Cookie */
  @IsNotEmpty({
    message: 'cookie 不能为空',
  })
  @IsString()
  cookie: string;

  /** 账户余额 */
  @IsNotEmpty()
  @IsNumber()
  credit: number;

  /** 剩余创作次数 */
  @IsNotEmpty()
  @IsNumber()
  count: number;

  /** 状态 */
  @IsEnum(Status, {
    message: 'status 必须是有效枚举值',
  })
  @IsOptional()
  status: Status = Status.ENABLED;
}
