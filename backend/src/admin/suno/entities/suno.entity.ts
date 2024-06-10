import { Status } from 'src/common/enums/status.enum';
import { DateTransformer } from 'src/date.transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Suno {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 4096,
    type: 'varchar',
    comment: 'suno cookie',
  })
  cookie: string;

  @Column({
    comment: '账户余额',
  })
  credit: number;

  @Column({
    comment: '创作剩余次数',
  })
  count: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ENABLED,
    comment: '账号状态',
  })
  status: number;

  @CreateDateColumn({
    name: 'create_time',
    type: 'timestamp',
    comment: '创建时间',
    transformer: new DateTransformer(),
  })
  createTime: string;

  @UpdateDateColumn({
    name: 'update_time',
    type: 'timestamp',
    comment: '更新时间',
    transformer: new DateTransformer(),
  })
  updateTime: string;
}
