import { response } from './response';

type order = {
    order_id: number;
    user_id: number;
    restaurant_id: number;
    status: string;
    ready_time: Date;
};

type createOrder = Omit<order, 'order_id'>;
type modifyOrder = Omit<order, 'order_id' | 'user_id' | 'restaurant_id'>;

type orderProduct = {
    order_id: number;
    product_id: number;
};

type orderResponse = response<order>;
type orderProductResponse = response<orderProduct>;
