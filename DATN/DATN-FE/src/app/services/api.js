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
import { languageService } from "./languageService";
import { paymentService } from "./paymentService";
import { chatService } from "./chatService";
import { settingService } from "./settingService";
import { articleService } from "./articleService";
import { financeService } from "./financeService";
import { mediaService } from "./mediaService";
import { wishlistService } from "./wishlistService";
import { adminDataService } from "./adminDataService";

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
    language: languageService,
    payments: paymentService,
    chats: chatService,
    settings: settingService,
    articles: articleService,
    finance: financeService,
    media: mediaService,
    wishlist: wishlistService,
    adminData: adminDataService,
};
