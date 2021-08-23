import { Exclude, Expose } from 'class-transformer';

export class ZipcodeDto {
  @Expose({ name: 'zipcode' })
  cep: string;

  @Expose({ name: 'streetAddress' })
  logradouro: string;

  @Expose({ name: 'additionalInformation' })
  complemento: string;

  @Expose({ name: 'neighborhood' })
  bairro: string;

  @Expose({ name: 'city' })
  localidade: string;

  @Expose({ name: 'state' })
  uf: string;

  @Expose({ name: 'areaCode' })
  ddd: string;

  @Exclude()
  ibge: string;

  @Exclude()
  gia: string;

  @Exclude()
  siafi: string;

  constructor(partial: Partial<ZipcodeDto>) {
    Object.assign(this, partial);
  }
}
