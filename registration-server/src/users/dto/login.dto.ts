import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class LoginDto {
  @Expose({ name: 'username' })
  email: string;

  password: string;

  @Expose()
  get token(): string {
    return Buffer.from(`${this.email}:${this.password}`).toString('base64');
  }

  constructor(partial: Partial<LoginDto>) {
    Object.assign(this, partial);
  }
}
