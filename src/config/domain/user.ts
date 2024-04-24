interface UpdateUserBody {
  userId: bigint
  name?: string
  email?: string
  phoneNumber?: string
  password?: string
}

type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

export type UpdateUserRequestBody = AtLeastOne<UpdateUserBody, {
  name?: string
  email?: string
  phoneNumber?: string
  password?: string
}> & { userId: bigint };
