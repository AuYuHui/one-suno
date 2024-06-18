import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AccountType } from 'src/common/enums/account.enum';
import { Status } from 'src/common/enums/status.enum';

export class CreateSunoDto {
  @IsNotEmpty({
    message: '账号 不能为空',
  })
  @IsString()
  account: string;

  @IsNotEmpty({
    message: '密码 不能为空',
  })
  @IsString()
  password: string;

  /** Cookie */
  @IsNotEmpty({
    message: 'cookie 不能为空',
  })
  @IsString()
  cookie: string;

  /** 账户余额 */
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  credit: number;

  /** 剩余创作次数 */
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  count: number;

  /** 状态 */
  @IsEnum(AccountType, {
    message: 'accountType 必须是有效枚举值',
  })
  @IsOptional()
  accountType: AccountType = AccountType.GOOGLE;

  /** 状态 */
  @IsEnum(Status, {
    message: 'status 必须是有效枚举值',
  })
  @IsOptional()
  status: Status = Status.ENABLED;
}
