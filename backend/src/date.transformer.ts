import { ValueTransformer } from 'typeorm';
import dayjs from 'dayjs';

export class DateTransformer implements ValueTransformer {
  // 将数据库中的时间转换为所需时区的时间
  from(value: Date): string {
    return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
  }

  // 将应用中的时间转换为UTC时间存储到数据库
  to(value: Date): string {
    return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
  }
}
