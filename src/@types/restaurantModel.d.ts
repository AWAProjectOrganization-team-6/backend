import { response } from './response'

type restaurant = {
    restaurant_id: number
    user_id: number
    name: string
    address: string
    price_level: number
    star_rating: number
    type: string
    picture: string
}

type createRestaurantInfo = Omit<restaurant, 'restaurant_id' | 'star_rating'>
type modifyRetaurantInfo = Omit<restaurant, 'restaurant_id' | 'user_id' | 'star_rating'>

type operatingHours = {
    operating_hours_id: number
    restaurant_id: number
    opening_time: Date
    closing_time: Date
    kitchen_closing_time: number
    days: string
}

type createOperatingHoursInfo = Omit<operatingHours, 'operating_hours_id'>
type modifyOperatingHoursInfo = Omit<operatingHours, 'operating_hours_id' | 'restaurant_id'>

type restaurantResponse = response<restaurant>
type operatingHoursResponse = response<operatingHours>
