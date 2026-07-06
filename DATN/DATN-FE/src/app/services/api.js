import { authService } from "./authService";
import { productService } from "./productService";
import { categoryService } from "./categoryService";
import { bannerService } from "./bannerService";
import { cartService } from "./cartService";
import { orderService } from "./orderService";
import { couponService } from "./couponService";
import { addressService } from "./addressService";
import { reviewService } from "./reviewService";
import { userService } from "./userService";

export const api = {
    auth: authService,
    products: productService,
    categories: categoryService,
    banners: bannerService,
    cart: cartService,
    orders: orderService,
    coupons: couponService,
    addresses: addressService,
    reviews: reviewService,
    users: userService,
};
