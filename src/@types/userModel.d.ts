
type userCredentials = {
    username: string,
    password: Buffer
}

type user = {
    user_id: number,
    type: 'SUPER' | 'ADMIN' | 'USER',
    username: string,
    password: Buffer,
    first_name: string,
    last_name: string,
    phone: string,
    email: string
}

type createUserInfo = {
    type: 'ADMIN' | 'USER',
    username: string,
    password: Buffer,
    first_name: string,
    last_name: string,
    phone: string,
    email: string
}

type modifyUserInfo = {
    password: Buffer,
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

type paymentInformation = {
    payment_information_id: number,
    user_id: number,
    type: string,
    card_num: string,
    ccv: string,
    expiration_date: string,
    street_address: string,
    city: string,
    postcode: string,
    first_name: string,
    last_name: string
}

type response<T> = T[] & { count: number, command: string, columns: any };

export type userCredentialsResponse = response<userCredentials>
export type userReponse = response<user>
export type addressResponse = response<address>
export type paymentInfoResponse = response<paymentInformation>