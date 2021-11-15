
type user = {
    user_id: number,
    type: 'SUPER' | 'ADMIN' | 'USER',
    username: string,
    password: string,
    first_name: string,
    last_name: string,
    phone: string,
    email: string
}

type address = {
    address_id: number,
    user_id: number,
    street_address: string,
    city: string,
    postcode: string,
}

type response<T> = T[] &  {count: number, command: string, columns: any};

export type userReponse = response<user>
export type addressResponse = response<address>