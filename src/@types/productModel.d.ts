import { response } from './response';

type product = {
    product_id: number;
    restaurant_id: number;
    name: string;
    description: string;
    price: number;
    type: string;
    picture: string;
};

type createProduct = Omit<product, 'product_id'>;
type modifyProduct = Omit<product, 'restaurant_id'>;

type specialOffer = {
    special_offer_id: number;
    product_id: number;
    percent_off: number;
};

type createSpecialOffer = Omit<specialOffer, 'special_offer_id'>;
type modifySpecialOffer = Omit<specialOffer, 'special_offer_id' | 'product_id'>;

type productReponse = response<product>;
type specialOfferResponse = response<specialOffer>;
