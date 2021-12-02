import { response } from './response';

type user = {
    user_id: number;
    type: 'SUPER' | 'ADMIN' | 'USER';
    username: string;
    password: Buffer | string;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
};

type userCredentials = Omit<user, 'type' | 'first_name' | 'last_name' | 'email' | 'phone'>;
type createUserInfo = Omit<user, 'user_id'> & { type: 'ADMIN' | 'USER' };
type modifyUserInfo = Omit<user, 'user_id' | 'type' | 'username'>;

type address = {
    address_id: number;
    user_id: number;
    street_address: string;
    city: string;
    postcode: string;
};

type createAddressInfo = Omit<address, 'address_id'>;

type paymentInformation = {
    payment_information_id: number;
    user_id: number;
    type: string;
    card_num: string;
    ccv: string;
    expiration_date: string;
    street_address: string;
    city: string;
    postcode: string;
    first_name: string;
    last_name: string;
};

type createPaymentInfo = Omit<paymentInformation, 'payment_information_id'>;

type userCredentialsResponse = response<userCredentials>;
type userReponse = response<user>;
type addressResponse = response<address>;
type paymentInfoResponse = response<paymentInformation>;
