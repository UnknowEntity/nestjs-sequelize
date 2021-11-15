import { Exclude } from 'class-transformer';
import { Column, Table, Model } from 'sequelize-typescript';

@Table({ tableName: 'user' })
export class UserModel extends Model {
  @Column
  username: string;

  @Column
  email: string;

  @Column
  password: string;
}

export class User {
  id?: number;

  username: string;

  email: string;

  @Exclude({ toPlainOnly: true })
  password: string;
}
