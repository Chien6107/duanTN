# TÃ€I LIá»†U SÆ  Äá»’ VÃ€ Äáº¶C Táº¢ CA Sá»¬ Dá»¤NG (USE CASE SPECIFICATION)
## Dá»± Ã¡n: Há»‡ thá»‘ng ThÆ°Æ¡ng máº¡i Äiá»‡n tá»­ Thá»i trang FoxStyle
**MÃ£ dá»± Ã¡n:** FOXSTYLE-DATN  
**NgÃ y cáº­p nháº­t:** 31/07/2026  
**Tráº¡ng thÃ¡i:** TÃ€I LIá»†U CHÃNH THá»¨C  

---

## Má»¤C Lá»¤C
- [CHÆ¯Æ NG 1: Tá»”NG QUAN TÃC NHÃ‚N (ACTORS) & PHÃ‚N RÃƒ CA Sá»¬ Dá»¤NG](#chÆ°Æ¡ng-1-tá»•ng-quan-tÃ¡c-nhÃ¢n-actors--phÃ¢n-rÃ£-ca-sá»­-dá»¥ng)
- [CHÆ¯Æ NG 2: SÆ  Äá»’ CA Sá»¬ Dá»¤NG Tá»”NG QUÃT & THEO PHÃ‚N Há»†](#chÆ°Æ¡ng-2-sÆ¡-Ä‘á»“-ca-sá»­-dá»¥ng-tá»•ng-quÃ¡t--theo-phÃ¢n-há»‡)
  - [2.1. SÆ¡ Ä‘á»“ Use Case Tá»•ng quÃ¡t Há»‡ thá»‘ng](#21-sÆ¡-Ä‘á»“-use-case-tá»•ng-quÃ¡t-há»‡-thá»‘ng)
  - [2.2. SÆ¡ Ä‘á»“ Use Case PhÃ¢n há»‡ KhÃ¡ch hÃ ng (Storefront)](#22-sÆ¡-Ä‘á»“-use-case-phÃ¢n-há»‡-khÃ¡ch-hÃ ng-storefront)
  - [2.3. SÆ¡ Ä‘á»“ Use Case PhÃ¢n há»‡ Quáº£n trá»‹ (Admin & Staff Portal)](#23-sÆ¡-Ä‘á»“-use-case-phÃ¢n-há»‡-quáº£n-trá»‹-admin--staff-portal)
  - [2.4. SÆ¡ Ä‘á»“ Quan há»‡ Má»‘i liÃªn káº¿t Use Case (Include & Extend)](#24-sÆ¡-Ä‘á»“-quan-há»‡-má»‘i-liÃªn-káº¿t-use-case-include--extend)
  - [2.5. SÆ¡ Ä‘á»“ Tráº¡ng thÃ¡i VÃ²ng Ä‘á»i ÄÆ¡n hÃ ng (Order State Machine)](#25-sÆ¡-Ä‘á»“-tráº¡ng-thÃ¡i-vÃ²ng-Ä‘á»i-Ä‘Æ¡n-hÃ ng-order-state-machine)
- [CHÆ¯Æ NG 3: Äáº¶C Táº¢ CHI TIáº¾T CÃC CA Sá»¬ Dá»¤NG CHÃNH & SÆ  Äá»’ TUáº¦N Tá»° (SEQUENCE DIAGRAMS)](#chÆ°Æ¡ng-3-Ä‘áº·c-táº£-chi-tiáº¿t-cÃ¡c-ca-sá»­-dá»¥ng-chÃ­nh--sÆ¡-Ä‘á»“-tuáº§n-tá»±-sequence-diagrams)
  - [UC-01: ÄÄƒng kÃ½ & ÄÄƒng nháº­p TÃ i khoáº£n (Local & Google OAuth2)](#uc-01-Ä‘Äƒng-kÃ½--Ä‘Äƒng-nháº­p-tÃ i-khoáº£n-local--google-oauth2)
  - [UC-02: TÃ¬m kiáº¿m & Lá»c Sáº£n pháº©m Äa tiÃªu chÃ­](#uc-02-tÃ¬m-kiáº¿m--lá»c-sáº£n-pháº©m-Ä‘a-tiÃªu-chÃ­)
  - [UC-03: Chá»n Biáº¿n thá»ƒ (Size/MÃ u) & Quáº£n lÃ½ Giá» hÃ ng](#uc-03-chá»n-biáº¿n-thá»ƒ-sizemÃ u--quáº£n-lÃ½-giá»-hÃ ng)
  - [UC-04: Äáº·t hÃ ng & Thanh toÃ¡n Tá»± Ä‘á»™ng PayOS QR Code](#uc-04-Ä‘áº·t-hÃ ng--thanh-toÃ¡n-tá»±-Ä‘á»™ng-payos-qr-code)
  - [UC-05: Ãp dá»¥ng MÃ£ giáº£m giÃ¡ (Coupon Code)](#uc-05-Ã¡p-dá»¥ng-mÃ£-giáº£m-giÃ¡-coupon-code)
  - [UC-06: Quáº£n lÃ½ Sá»• Ä‘á»‹a chá»‰ Giao hÃ ng (`user_addresses`)](#uc-06-quáº£n-lÃ½-sá»•-Ä‘á»‹a-chá»‰-giao-hÃ ng-user_addresses)
  - [UC-07: Viáº¿t ÄÃ¡nh giÃ¡ & Cháº¥m sao Sáº£n pháº©m](#uc-07-viáº¿t-Ä‘Ã¡nh-giÃ¡--cháº¥m-sao-sáº£n-pháº©m)
  - [UC-08: Quáº£n lÃ½ Sáº£n pháº©m, ThÆ° viá»‡n áº¢nh & Biáº¿n thá»ƒ (Admin)](#uc-08-quáº£n-lÃ½-sáº£n-pháº©m-thÆ°-viá»‡n-áº£nh--biáº¿n-thá»ƒ-admin)
  - [UC-09: Quáº£n lÃ½ & Cáº­p nháº­t Tiáº¿n trÃ¬nh ÄÆ¡n hÃ ng (Admin/Staff)](#uc-09-quáº£n-lÃ½--cáº­p-nhat-tiáº¿n-trÃ¬nh-Ä‘Æ¡n-hÃ ng-adminstaff)
  - [UC-10: Xem BÃ¡o cÃ¡o & Thá»‘ng kÃª Doanh thu (Admin)](#uc-10-xem-bÃ¡o-cÃ¡o--thá»‘ng-kÃª-doanh-thu-admin)

---

## CHÆ¯Æ NG 1: Tá»”NG QUAN TÃC NHÃ‚N (ACTORS) & PHÃ‚N RÃƒ CA Sá»¬ Dá»¤NG

### 1.1. Danh má»¥c TÃ¡c nhÃ¢n (Actors)

Há»‡ thá»‘ng FoxStyle bao gá»“m 4 tÃ¡c nhÃ¢n con ngÆ°á»i vÃ  3 tÃ¡c nhÃ¢n há»‡ thá»‘ng bÃªn ngoÃ i:

```mermaid
graph TD
    subgraph Human Actors
        Guest[KhÃ¡ch vÃ£ng lai]
        Customer[KhÃ¡ch hÃ ng]
        Staff[NhÃ¢n viÃªn]
        Admin[Quáº£n trá»‹ viÃªn]
    end

    subgraph External System Actors
        PayOS[PayOS Payment Gateway]
        Google[Google OAuth2 Service]
        SMTP[SMTP Mail Server]
    end

    Guest <|-- Customer
    Staff <|-- Admin
```

1. **KhÃ¡ch vÃ£ng lai (Guest):** NgÆ°á»i dÃ¹ng truy cáº­p há»‡ thá»‘ng chÆ°a thá»±c hiá»‡n Ä‘Äƒng nháº­p.
2. **KhÃ¡ch hÃ ng (Customer):** NgÆ°á»i dÃ¹ng Ä‘Ã£ cÃ³ tÃ i khoáº£n vÃ  Ä‘Äƒng nháº­p thÃ nh cÃ´ng. Thá»«a hÆ°á»Ÿng toÃ n bá»™ quyá»n cá»§a KhÃ¡ch vÃ£ng lai vÃ  cÃ³ thÃªm quyá»n thá»±c hiá»‡n giao dá»‹ch mua sáº¯m.
3. **NhÃ¢n viÃªn (Staff):** TÃ i khoáº£n ban váº­n hÃ nh cá»­a hÃ ng (`ROLE_STAFF`). Quáº£n lÃ½ Ä‘Æ¡n hÃ ng, theo dÃµi tá»“n kho vÃ  há»— trá»£ khÃ¡ch hÃ ng.
4. **Quáº£n trá»‹ viÃªn (Admin):** NgÆ°á»i Ä‘iá»u hÃ nh toÃ n quyá»n (`ROLE_ADMIN`). Thá»«a hÆ°á»Ÿng quyá»n cá»§a NhÃ¢n viÃªn vÃ  cÃ³ toÃ n quyá»n quáº£n lÃ½ sáº£n pháº©m, biáº¿n thá»ƒ, mÃ£ giáº£m giÃ¡, banner, tÃ i khoáº£n vÃ  doanh thu.
5. **PayOS Gateway:** Há»‡ thá»‘ng cá»•ng thanh toÃ¡n bÃªn thá»© ba xá»­ lÃ½ giao dá»‹ch quÃ©t mÃ£ QR ngÃ¢n hÃ ng vÃ  pháº£n há»“i Webhook callback.
6. **Google OAuth2 Service:** Dá»‹ch vá»¥ xÃ¡c thá»±c tÃ i khoáº£n Google nhanh.
7. **SMTP Mail Server:** Dá»‹ch vá»¥ gá»­i email thÃ´ng bÃ¡o tá»± Ä‘á»™ng.

---

## CHÆ¯Æ NG 2: SÆ  Äá»’ CA Sá»¬ Dá»¤NG Tá»”NG QUÃT & THEO PHÃ‚N Há»†

### 2.1. SÆ¡ Ä‘á»“ Use Case Tá»•ng quÃ¡t Há»‡ thá»‘ng (Äáº§y Ä‘á»§ 4 TÃ¡c nhÃ¢n)

SÆ¡ Ä‘á»“ Use Case dÆ°á»›i Ä‘Ã¢y thá»ƒ hiá»‡n toÃ n bá»™ cÃ¡c chá»©c nÄƒng nghiá»‡p vá»¥ cá»§a há»‡ thá»‘ng **FoxStyle**, phÃ¢n Ä‘á»‹nh rÃµ tháº©m quyá»n tÆ°Æ¡ng tÃ¡c cá»§a **4 TÃ¡c nhÃ¢n (Actors) chÃ­nh**:
1. ðŸ‘¤ **KhÃ¡ch vÃ£ng lai (Guest):** NgÆ°á»i dÃ¹ng truy cáº­p há»‡ thá»‘ng nhÆ°ng **chÆ°a cÃ³ tÃ i khoáº£n / chÆ°a Ä‘Äƒng nháº­p**.
2. ðŸ‘¤ **KhÃ¡ch hÃ ng (Customer):** NgÆ°á»i dÃ¹ng **Ä‘Ã£ Ä‘Äƒng kÃ½ tÃ i khoáº£n** vÃ  Ä‘Äƒng nháº­p thÃ nh cÃ´ng.
3. ðŸ‘” **NhÃ¢n viÃªn (Staff):** NhÃ¢n viÃªn váº­n hÃ nh cá»­a hÃ ng (`ROLE_STAFF`) xá»­ lÃ½ Ä‘Æ¡n hÃ ng vÃ  theo dÃµi tá»“n kho.
4. ðŸ‘‘ **Quáº£n trá»‹ viÃªn (Admin):** NgÆ°á»i quáº£n trá»‹ toÃ n quyá»n há»‡ thá»‘ng (`ROLE_ADMIN`).

```mermaid
graph LR
    subgraph TÃC NHÃ‚N CON NGÆ¯á»œI
        Guest["ðŸ‘¤ KhÃ¡ch vÃ£ng lai<br>(ChÆ°a cÃ³ tÃ i khoáº£n)"]
        Customer["ðŸ‘¤ KhÃ¡ch hÃ ng<br>(ÄÃ£ cÃ³ tÃ i khoáº£n)"]
        Staff["ðŸ‘” NhÃ¢n viÃªn (Staff)"]
        Admin["ðŸ‘‘ Quáº£n trá»‹ viÃªn (Admin)"]
    end

    subgraph PhÃ¢n há»‡ KhÃ¡ch hÃ ng (Storefront)
        UC_ViewProd([Xem danh sÃ¡ch & Chi tiáº¿t sáº£n pháº©m])
        UC_Search([TÃ¬m kiáº¿m & Lá»c sáº£n pháº©m Size/MÃ u/GiÃ¡])
        UC_AddToCart([Chá»n biáº¿n thá»ƒ & ThÃªm giá» hÃ ng])
        UC_Register([ÄÄƒng kÃ½ tÃ i khoáº£n má»›i])
        UC_Login([ÄÄƒng nháº­p ThÆ°á»ng / Google OAuth2])
        UC_Profile([Quáº£n lÃ½ Há»“ sÆ¡ & Sá»• Ä‘á»‹a chá»‰])
        UC_Checkout([Äáº·t hÃ ng & Thanh toÃ¡n PayOS / COD])
        UC_Coupon([Ãp dá»¥ng MÃ£ giáº£m giÃ¡])
        UC_OrderHistory([Xem Lá»‹ch sá»­ ÄÆ¡n hÃ ng & Há»§y Ä‘Æ¡n])
        UC_Wishlist([Quáº£n lÃ½ Sáº£n pháº©m yÃªu thÃ­ch])
        UC_Review([Viáº¿t ÄÃ¡nh giÃ¡ & Cháº¥m sao])
    end

    subgraph PhÃ¢n há»‡ Quáº£n trá»‹ & Váº­n hÃ nh (Admin & Staff Portal)
        UC_ManageOrders([Xem danh sÃ¡ch & TÃ¬m kiáº¿m ÄÆ¡n hÃ ng])
        UC_UpdateOrderStatus([Duyá»‡t & Cáº­p nháº­t Tráº¡ng thÃ¡i Váº­n chuyá»ƒn])
        UC_CheckInventory([Kiá»ƒm tra Tá»“n kho biáº¿n thá»ƒ])
        UC_ManageProducts([Quáº£n lÃ½ Sáº£n pháº©m & ThÆ° viá»‡n áº¢nh phá»¥])
        UC_ManageVariants([Quáº£n lÃ½ Biáº¿n thá»ƒ Size/MÃ u/SKU/Quantity])
        UC_ManageCategories([Quáº£n lÃ½ Danh má»¥c & Banner trang chá»§])
        UC_ManageCoupons([Quáº£n lÃ½ MÃ£ giáº£m giÃ¡ Coupon])
        UC_ManageUsers([Quáº£n lÃ½ & KhÃ³a/Má»Ÿ tÃ i khoáº£n KhÃ¡ch hÃ ng])
        UC_Dashboard([Xem Biá»ƒu Ä‘á»“ BÃ¡o cÃ¡o Doanh thu Recharts])
    end

    %% Má»‘i quan há»‡ Káº¿ thá»«a giá»¯a TÃ¡c nhÃ¢n
    Guest <|-- Customer
    Staff <|-- Admin

    %% Káº¿t ná»‘i KhÃ¡ch vÃ£ng lai (ChÆ°a cÃ³ tÃ i khoáº£n)
    Guest --> UC_ViewProd
    Guest --> UC_Search
    Guest --> UC_AddToCart
    Guest --> UC_Register
    Guest --> UC_Login

    %% Káº¿t ná»‘i KhÃ¡ch hÃ ng (ÄÃ£ cÃ³ tÃ i khoáº£n)
    Customer --> UC_Profile
    Customer --> UC_Checkout
    Customer --> UC_Coupon
    Customer --> UC_OrderHistory
    Customer --> UC_Wishlist
    Customer --> UC_Review

    %% Káº¿t ná»‘i NhÃ¢n viÃªn (Staff)
    Staff --> UC_ManageOrders
    Staff --> UC_UpdateOrderStatus
    Staff --> UC_CheckInventory

    %% Káº¿t ná»‘i Quáº£n trá»‹ viÃªn (Admin)
    Admin --> UC_ManageProducts
    Admin --> UC_ManageVariants
    Admin --> UC_ManageCategories
    Admin --> UC_ManageCoupons
    Admin --> UC_ManageUsers
    Admin --> UC_Dashboard
```

---

### 2.2. SÆ¡ Ä‘á»“ Use Case PhÃ¢n há»‡ KhÃ¡ch hÃ ng (Storefront)

```mermaid
graph LR
    actorGuest((KhÃ¡ch vÃ£ng lai))
    actorCustomer((KhÃ¡ch hÃ ng))
    actorPayOS((PayOS Payment))

    subgraph PhÃ¢n há»‡ KhÃ¡ch hÃ ng Storefront
        UC01(UC-01: ÄÄƒng kÃ½ & ÄÄƒng nháº­p)
        UC02(UC-02: TÃ¬m kiáº¿m & Lá»c sáº£n pháº©m)
        UC03(UC-03: Chá»n Biáº¿n thá»ƒ & ThÃªm Giá» hÃ ng)
        UC04(UC-04: Quáº£n lÃ½ Sá»• Ä‘á»‹a chá»‰)
        UC05(UC-05: Ãp dá»¥ng MÃ£ giáº£m giÃ¡)
        UC06(UC-06: Äáº·t hÃ ng & Thanh toÃ¡n PayOS/COD)
        UC07(UC-07: Xem Lá»‹ch sá»­ ÄÆ¡n & Há»§y Ä‘Æ¡n)
        UC08(UC-08: Viáº¿t ÄÃ¡nh giÃ¡ & Cháº¥m sao)
        UC09(UC-09: Quáº£n lÃ½ YÃªu thÃ­ch Wishlist)
    end

    actorGuest --> UC01
    actorGuest --> UC02
    actorGuest --> UC03

    actorCustomer --> UC01
    actorCustomer --> UC02
    actorCustomer --> UC03
    actorCustomer --> UC04
    actorCustomer --> UC05
    actorCustomer --> UC06
    actorCustomer --> UC07
    actorCustomer --> UC08
    actorCustomer --> UC09

    UC06 <--> actorPayOS
```

---

### 2.3. SÆ¡ Ä‘á»“ Use Case PhÃ¢n há»‡ Quáº£n trá»‹ (Admin & Staff Portal)

```mermaid
graph LR
    actorStaff((NhÃ¢n viÃªn Staff))
    actorAdmin((Quáº£n trá»‹ viÃªn Admin))

    subgraph PhÃ¢n há»‡ Quáº£n trá»‹ & Váº­n hÃ nh
        UC10(UC-10: Xem danh sÃ¡ch ÄÆ¡n hÃ ng)
        UC11(UC-11: Duyá»‡t & Cáº­p nháº­t Tráº¡ng thÃ¡i ÄÆ¡n)
        UC12(UC-12: Quáº£n lÃ½ Sáº£n pháº©m & áº¢nh phá»¥)
        UC13(UC-13: Quáº£n lÃ½ Biáº¿n thá»ƒ & Tá»“n kho)
        UC14(UC-14: Quáº£n lÃ½ Danh má»¥c & Banner)
        UC15(UC-15: Quáº£n lÃ½ MÃ£ giáº£m giÃ¡ Coupon)
        UC16(UC-16: Quáº£n lÃ½ & KhÃ³a TÃ i khoáº£n)
        UC17(UC-17: Xem BÃ¡o cÃ¡o Doanh thu)
    end

    actorStaff --> UC10
    actorStaff --> UC11

    actorAdmin --> UC10
    actorAdmin --> UC11
    actorAdmin --> UC12
    actorAdmin --> UC13
    actorAdmin --> UC14
    actorAdmin --> UC15
    actorAdmin --> UC16
    actorAdmin --> UC17
```

---

### 2.4. SÆ¡ Ä‘á»“ Quan há»‡ Má»‘i liÃªn káº¿t Use Case (Include & Extend)

```mermaid
graph TD
    actorCustomer((KhÃ¡ch hÃ ng))
    actorAdmin((Admin / Staff))

    subgraph Base Use Cases
        UC_Checkout([UC-04: Äáº·t hÃ ng & Thanh toÃ¡n])
        UC_AddToCart([UC-03: Chá»n Biáº¿n thá»ƒ & Giá» hÃ ng])
        UC_Login([UC-01: ÄÄƒng nháº­p TÃ i khoáº£n])
        UC_ProdMgmt([UC-08: Quáº£n lÃ½ Sáº£n pháº©m])
    end

    subgraph Sub / Relational Use Cases
        UC_Address([UC-06: Chá»n Sá»• Ä‘á»‹a chá»‰])
        UC_Coupon([UC-05: Ãp dá»¥ng MÃ£ Coupon])
        UC_StockCheck([Kiá»ƒm tra Tá»“n kho Biáº¿n thá»ƒ])
        UC_JWTAuth([XÃ¡c thá»±c MÃ£ Token JWT])
        UC_PayOS([Thanh toÃ¡n QR Code PayOS])
        UC_COD([Thanh toÃ¡n COD])
        UC_OAuth2([ÄÄƒng nháº­p Google OAuth2])
        UC_Images([Quáº£n lÃ½ ThÆ° viá»‡n áº¢nh phá»¥])
        UC_Variants([Quáº£n lÃ½ Biáº¿n thá»ƒ Size/MÃ u])
    end

    actorCustomer --> UC_Checkout
    actorCustomer --> UC_AddToCart
    actorCustomer --> UC_Login
    actorAdmin --> UC_ProdMgmt

    UC_Checkout -. "<<include>>" .-> UC_Address
    UC_Checkout -. "<<include>>" .-> UC_StockCheck
    UC_Checkout -. "<<include>>" .-> UC_JWTAuth
    UC_Checkout -. "<<include>>" .-> UC_Coupon

    UC_AddToCart -. "<<include>>" .-> UC_StockCheck

    UC_ProdMgmt -. "<<include>>" .-> UC_Images
    UC_ProdMgmt -. "<<include>>" .-> UC_Variants

    UC_PayOS -. "<<extend>>" .-> UC_Checkout
    UC_COD -. "<<extend>>" .-> UC_Checkout
    UC_OAuth2 -. "<<extend>>" .-> UC_Login
```

---

### 2.5. SÆ¡ Ä‘á»“ Tráº¡ng thÃ¡i VÃ²ng Ä‘á»i ÄÆ¡n hÃ ng (Order State Machine)

```mermaid
stateDiagram-v2
    [*] --> PENDING: Khá»Ÿi táº¡o Äáº·t hÃ ng (COD / PayOS QR)
    
    state PENDING {
        [*] --> WaitingPayment: Chá»n phÆ°Æ¡ng thá»©c PayOS QR
        [*] --> WaitingApproval: Chá»n phÆ°Æ¡ng thá»©c COD
    }

    WaitingPayment --> PAID: PayOS Webhook xÃ¡c thá»±c chuyá»ƒn khoáº£n thÃ nh cÃ´ng
    WaitingApproval --> CONFIRMED: Admin/Staff duyá»‡t Ä‘Æ¡n COD
    
    PENDING --> CANCELLED: KhÃ¡ch hÃ ng báº¥m Há»§y Ä‘Æ¡n / QuÃ¡ háº¡n thanh toÃ¡n (15 phÃºt)

    PAID --> PROCESSING: ÄÃ³ng gÃ³i sáº£n pháº©m & Chuáº©n bá»‹ Ä‘Æ¡n
    CONFIRMED --> PROCESSING: ÄÃ³ng gÃ³i sáº£n pháº©m & Chuáº©n bá»‹ Ä‘Æ¡n

    PROCESSING --> SHIPPING: BÃ n giao Ä‘Æ¡n vá»‹ váº­n chuyá»ƒn
    SHIPPING --> DELIVERED: ÄÆ¡n vá»‹ váº­n chuyá»ƒn xÃ¡c nháº­n giao thÃ nh cÃ´ng
    SHIPPING --> CANCELLED: KhÃ¡ch tá»« chá»‘i nháº­n hÃ ng / HoÃ n Ä‘Æ¡n

    DELIVERED --> [*]: KhÃ¡ch hÃ ng viáº¿t ÄÃ¡nh giÃ¡ sáº£n pháº©m
    CANCELLED --> [*]: HoÃ n tráº£ Tá»“n kho Biáº¿n thá»ƒ
```

---

## CHÆ¯Æ NG 3: Äáº¶C Táº¢ CHI TIáº¾T CÃC CA Sá»¬ Dá»¤NG CHÃNH & SÆ  Äá»’ TUáº¦N Tá»° (SEQUENCE DIAGRAMS)

### UC-01: ÄÄƒng kÃ½ & ÄÄƒng nháº­p TÃ i khoáº£n (Local & Google OAuth2)

| Thuá»™c tÃ­nh | Chi tiáº¿t Ä‘áº·c táº£ |
| :--- | :--- |
| **MÃ£ Use Case** | `UC-01` |
| **TÃªn Use Case** | ÄÄƒng kÃ½ & ÄÄƒng nháº­p TÃ i khoáº£n |
| **TÃ¡c nhÃ¢n chÃ­nh** | KhÃ¡ch vÃ£ng lai, KhÃ¡ch hÃ ng, Google OAuth2 Service |
| **MÃ´ táº£ ngáº¯n** | Cho phÃ©p ngÆ°á»i dÃ¹ng Ä‘Äƒng kÃ½ tÃ i khoáº£n má»›i hoáº·c Ä‘Äƒng nháº­p vÃ o há»‡ thá»‘ng báº±ng Username/Password hoáº·c qua tÃ i khoáº£n Google. |
| **Tiá»n Ä‘iá»u kiá»‡n** | NgÆ°á»i dÃ¹ng truy cáº­p vÃ o trang Web FoxStyle. |
| **Háº­u Ä‘iá»u kiá»‡n** | Há»‡ thá»‘ng xÃ¡c thá»±c thÃ nh cÃ´ng, cáº¥p mÃ£ **JWT Token** lÆ°u táº¡i Client vÃ  chuyá»ƒn tráº¡ng thÃ¡i ngÆ°á»i dÃ¹ng thÃ nh Ä‘Ã£ Ä‘Äƒng nháº­p. |
| **Luá»“ng sá»± kiá»‡n chÃ­nh (Basic Flow)** | 1. NgÆ°á»i dÃ¹ng báº¥m **"ÄÄƒng nháº­p"** trÃªn Header.<br>2. Form Ä‘Äƒng nháº­p xuáº¥t hiá»‡n. NgÆ°á»i dÃ¹ng chá»n phÆ°Æ¡ng thá»©c: ÄÄƒng nháº­p ná»™i bá»™ hoáº·c ÄÄƒng nháº­p Google.<br>3. **Náº¿u chá»n ÄÄƒng nháº­p ná»™i bá»™:** Nháº­p Username/Email vÃ  Password -> Báº¥m "ÄÄƒng nháº­p" -> API xÃ¡c thá»±c máº­t kháº©u bÄƒm BCrypt trong CSDL -> Tráº£ vá» JWT Token.<br>4. **Náº¿u chá»n Google OAuth2:** Click nÃºt "ÄÄƒng nháº­p vá»›i Google" -> Há»™p thoáº¡i Google OAuth xuáº¥t hiá»‡n -> XÃ¡c nháº­n tÃ i khoáº£n -> API nháº­n ID Token -> Tá»± Ä‘á»™ng táº¡o user má»›i náº¿u chÆ°a tá»“n táº¡i -> Tráº£ vá» JWT Token.<br>5. Frontend lÆ°u JWT Token vÃ o `localStorage` vÃ  cáº­p nháº­t giao diá»‡n ngÆ°á»i dÃ¹ng. |
| **Luá»“ng ráº½ nhÃ¡nh & Ngoáº¡i lá»‡** | * **3a. Sai thÃ´ng tin:** Nháº­p sai máº­t kháº©u -> BÃ¡o lá»—i "TÃ i khoáº£n hoáº·c máº­t kháº©u khÃ´ng chÃ­nh xÃ¡c".<br>* **3b. TÃ i khoáº£n bá»‹ khÃ³a:** Cá»™t `status = 0` -> BÃ¡o lá»—i "TÃ i khoáº£n cá»§a báº¡n Ä‘Ã£ bá»‹ khÃ³a. Vui lÃ²ng liÃªn há»‡ há»— trá»£". |

#### SÆ¡ Ä‘á»“ Tuáº§n tá»± (Sequence Diagram) - ÄÄƒng nháº­p Google OAuth2:

```mermaid
sequenceDiagram
    autonumber
    actor User as NgÆ°á»i dÃ¹ng
    participant FE as React Frontend
    participant Google as Google OAuth2 API
    participant BE as Spring Boot API
    participant DB as MS SQL Server

    User->>FE: Báº¥m "ÄÄƒng nháº­p vá»›i Google"
    FE->>Google: Khá»Ÿi táº¡o luá»“ng Google SDK Popup
    User->>Google: Nháº­p Email & Máº­t kháº©u Google
    Google-->>FE: Tráº£ vá» Google ID Token
    FE->>BE: POST /api/v1/auth/google (ID Token)
    BE->>Google: Verify ID Token vá»›i Google Servers
    Google-->>BE: Tráº£ vá» thÃ´ng tin Profile (Email, Name, Avatar)
    BE->>DB: Truy váº¥n SELECT * FROM users WHERE email = ?
    alt ChÆ°a tá»“n táº¡i tÃ i khoáº£n
        BE->>DB: INSERT INTO users (email, full_name, role, status)
    end
    BE->>BE: Sinh mÃ£ JWT Token (UserId, Email, Role)
    BE-->>FE: Tráº£ vá» HTTP 200 OK + JWT Token
    FE->>FE: LÆ°u JWT Token vÃ o localStorage
    FE-->>User: ÄÄƒng nháº­p thÃ nh cÃ´ng! Cáº­p nháº­t Header Avatar
```

---

### UC-02: TÃ¬m kiáº¿m & Lá»c Sáº£n pháº©m Äa tiÃªu chÃ­

| Thuá»™c tÃ­nh | Chi tiáº¿t Ä‘áº·c táº£ |
| :--- | :--- |
| **MÃ£ Use Case** | `UC-02` |
| **TÃªn Use Case** | TÃ¬m kiáº¿m & Lá»c Sáº£n pháº©m Äa tiÃªu chÃ­ |
| **TÃ¡c nhÃ¢n chÃ­nh** | KhÃ¡ch vÃ£ng lai, KhÃ¡ch hÃ ng |
| **MÃ´ táº£ ngáº¯n** | KhÃ¡ch hÃ ng tÃ¬m kiáº¿m sáº£n pháº©m theo tá»« khÃ³a vÃ  lá»c danh sÃ¡ch sáº£n pháº©m theo danh má»¥c, size, mÃ u sáº¯c, khoáº£ng giÃ¡ mÃ  khÃ´ng cáº§n táº£i láº¡i trang. |
| **Tiá»n Ä‘iá»u kiá»‡n** | Há»‡ thá»‘ng Ä‘Ã£ cÃ³ dá»¯ liá»‡u danh má»¥c vÃ  sáº£n pháº©m Ä‘ang hoáº¡t Ä‘á»™ng. |
| **Háº­u Ä‘iá»u kiá»‡n** | Danh sÃ¡ch sáº£n pháº©m hiá»ƒn thá»‹ Ä‘Ãºng theo tiÃªu chÃ­ lá»c Ä‘Æ°á»£c chá»n. |
| **Luá»“ng sá»± kiá»‡n chÃ­nh (Basic Flow)** | 1. KhÃ¡ch hÃ ng nháº­p tá»« khÃ³a vÃ o Ã´ tÃ¬m kiáº¿m (vÃ­ dá»¥: "Ão sÆ¡ mi") hoáº·c truy cáº­p trang Sáº£n pháº©m.<br>2. KhÃ¡ch chá»n cÃ¡c bá»™ lá»c mong muá»‘n á»Ÿ thanh bÃªn (Sidebar Filter): Danh má»¥c Ão, KÃ­ch thÆ°á»›c M, MÃ u Äen, Má»©c giÃ¡ tá»« 200.000Ä‘ - 500.000Ä‘.<br>3. Frontend gá»­i request API `GET /api/v1/products?search=...&categoryId=...&size=M&color=Black&minPrice=200000&maxPrice=500000`.<br>4. Backend truy váº¥n JPA Repository kÃ¨m bá»™ lá»c tÆ°Æ¡ng á»©ng.<br>5. Hiá»ƒn thá»‹ danh sÃ¡ch sáº£n pháº©m khá»›p Ä‘iá»u kiá»‡n kÃ¨m phÃ¢n trang mÆ°á»£t mÃ . |

---

### UC-03: Chá»n Biáº¿n thá»ƒ (Size/MÃ u) & Quáº£n lÃ½ Giá» hÃ ng

| Thuá»™c tÃ­nh | Chi tiáº¿t Ä‘áº·c táº£ |
| :--- | :--- |
| **MÃ£ Use Case** | `UC-03` |
| **TÃªn Use Case** | Chá»n Biáº¿n thá»ƒ Sáº£n pháº©m & Quáº£n lÃ½ Giá» hÃ ng |
| **TÃ¡c nhÃ¢n chÃ­nh** | KhÃ¡ch vÃ£ng lai, KhÃ¡ch hÃ ng |
| **MÃ´ táº£ ngáº¯n** | Chá»n mÃ u sáº¯c, kÃ­ch cá»¡, kiá»ƒm tra tá»“n kho biáº¿n thá»ƒ vÃ  thÃªm/sá»­a/xÃ³a sáº£n pháº©m trong giá» hÃ ng. |
| **Tiá»n Ä‘iá»u kiá»‡n** | KhÃ¡ch hÃ ng Ä‘ang á»Ÿ mÃ n hÃ¬nh Chi tiáº¿t sáº£n pháº©m. |
| **Háº­u Ä‘iá»u kiá»‡n** | Giá» hÃ ng Ä‘Æ°á»£c cáº­p nháº­t sáº£n pháº©m biáº¿n thá»ƒ Ä‘Ã£ chá»n vÃ  tÃ­nh toÃ¡n tá»•ng tiá»n. |
| **Luá»“ng sá»± kiá»‡n chÃ­nh (Basic Flow)** | 1. KhÃ¡ch hÃ ng xem trang Chi tiáº¿t sáº£n pháº©m.<br>2. KhÃ¡ch báº¥m chá»n nÃºt **MÃ u sáº¯c** (Äen) vÃ  **KÃ­ch thÆ°á»›c** (Size L).<br>3. Há»‡ thá»‘ng gá»­i yÃªu cáº§u kiá»ƒm tra báº£ng `product_variants` Ä‘á»ƒ láº¥y sá»‘ lÆ°á»£ng tá»“n kho kháº£ dá»¥ng (`quantity`).<br>4. Náº¿u tá»“n kho > 0: Khá»Ÿi táº¡o nÃºt "ThÃªm vÃ o giá»" vÃ  cho phÃ©p chá»n sá»‘ lÆ°á»£ng. KhÃ¡ch báº¥m **"ThÃªm vÃ o giá» hÃ ng"**.<br>5. Há»‡ thá»‘ng cá»™ng dá»“n sáº£n pháº©m biáº¿n thá»ƒ nÃ y vÃ o Giá» hÃ ng vÃ  hiá»ƒn thá»‹ thÃ´ng bÃ¡o Toast thÃ nh cÃ´ng. |
| **Luá»“ng ngoáº¡i lá»‡** | * **3a. Biáº¿n thá»ƒ háº¿t hÃ ng:** Tá»“n kho `quantity = 0` -> NÃºt Ä‘á»•i thÃ nh "Háº¿t hÃ ng" (VÃ´ hiá»‡u hÃ³a click). |

#### SÆ¡ Ä‘á»“ Tuáº§n tá»± (Sequence Diagram) - Chá»n Biáº¿n thá»ƒ & ThÃªm vÃ o Giá»:

```mermaid
sequenceDiagram
    autonumber
    actor Customer as KhÃ¡ch hÃ ng
    participant FE as React Frontend
    participant BE as Spring Boot API
    participant DB as MS SQL Server

    Customer->>FE: Báº¥m chá»n MÃ u "Äen" & Size "L"
    FE->>BE: GET /api/v1/products/{id}/variants?color=Black&size=L
    BE->>DB: SELECT * FROM product_variants WHERE product_id=? AND color=? AND size=?
    DB-->>BE: Tráº£ vá» variantRecord (quantity = 15)
    BE-->>FE: Tráº£ vá» { variantId: 102, quantity: 15, inStock: true }
    FE-->>Customer: Cáº­p nháº­t giao diá»‡n: Hiá»ƒn thá»‹ "CÃ²n 15 sáº£n pháº©m"
    
    Customer->>FE: Chá»n sá»‘ lÆ°á»£ng = 2 & Báº¥m "ThÃªm vÃ o giá» hÃ ng"
    FE->>BE: POST /api/v1/cart/items (Authorization JWT, variantId=102, quantity=2)
    BE->>BE: Verify JWT Token
    BE->>DB: INSERT / UPDATE cart_items SET quantity = quantity + 2
    DB-->>BE: OK
    BE-->>FE: Tráº£ vá» CartSummary DTO (Tá»•ng tiá»n má»›i, danh sÃ¡ch má»¥c giá»)
    FE-->>Customer: Sonner Toast: "ÄÃ£ thÃªm sáº£n pháº©m vÃ o giá» hÃ ng!"
```

---

### UC-04: Äáº·t hÃ ng & Thanh toÃ¡n Tá»± Ä‘á»™ng PayOS QR Code

| Thuá»™c tÃ­nh | Chi tiáº¿t Ä‘áº·c táº£ |
| :--- | :--- |
| **MÃ£ Use Case** | `UC-04` |
| **TÃªn Use Case** | Äáº·t hÃ ng & Thanh toÃ¡n Tá»± Ä‘á»™ng qua Cá»•ng PayOS |
| **TÃ¡c nhÃ¢n chÃ­nh** | KhÃ¡ch hÃ ng, Cá»•ng thanh toÃ¡n PayOS |
| **MÃ´ táº£ ngáº¯n** | Äáº·t Ä‘Æ¡n hÃ ng vÃ  thá»±c hiá»‡n chuyá»ƒn khoáº£n ngÃ¢n hÃ ng tá»± Ä‘á»™ng qua quÃ©t mÃ£ QR PayOS. |
| **Tiá»n Ä‘iá»u kiá»‡n** | 1. KhÃ¡ch hÃ ng Ä‘Ã£ Ä‘Äƒng nháº­p.<br>2. Giá» hÃ ng cÃ³ Ã­t nháº¥t 1 sáº£n pháº©m há»£p lá»‡. |
| **Háº­u Ä‘iá»u kiá»‡n** | 1. ÄÆ¡n hÃ ng táº¡o thÃ nh cÃ´ng vá»›i tráº¡ng thÃ¡i `PAID` / `PROCESSING`.<br>2. Tá»“n kho biáº¿n thá»ƒ tÆ°Æ¡ng á»©ng bá»‹ trá»«.<br>3. Giá» hÃ ng hiá»‡n táº¡i bá»‹ xÃ³a sáº¡ch. |
| **Luá»“ng sá»± kiá»‡n chÃ­nh (Basic Flow)** | 1. KhÃ¡ch hÃ ng báº¥m **"Thanh toÃ¡n"** táº¡i Giá» hÃ ng.<br>2. Chá»n Äá»‹a chá»‰ giao hÃ ng tá»« Sá»• Ä‘á»‹a chá»‰ (`user_addresses`).<br>3. Chá»n phÆ°Æ¡ng thá»©c **"Thanh toÃ¡n Chuyá»ƒn khoáº£n QR (PayOS)"** vÃ  báº¥m **"Äáº·t hÃ ng"**.<br>4. Backend má»Ÿ Transaction: Äáº·t Ä‘Æ¡n `PENDING`, trá»« táº¡m tá»“n kho biáº¿n thá»ƒ, gá»i PayOS API táº¡o Payment Link.<br>5. Backend tráº£ vá» thÃ´ng tin Ä‘Æ¡n + MÃ£ QR Code VietQR.<br>6. KhÃ¡ch quÃ©t mÃ£ QR báº±ng App NgÃ¢n hÃ ng vÃ  thá»±c hiá»‡n chuyá»ƒn tiá»n.<br>7. PayOS gá»­i Webhook callback sang API Backend (`POST /api/v1/payments/payos-webhook`).<br>8. Backend verify `HMAC SHA256 Signature` -> Cáº­p nháº­t tráº¡ng thÃ¡i Ä‘Æ¡n thÃ nh `PAID` -> Gá»­i Email xÃ¡c nháº­n Ä‘Æ¡n hÃ ng.<br>9. Giao diá»‡n Frontend nháº­n tÃ­n hiá»‡u cáº­p nháº­t thÃ nh cÃ´ng vÃ  chuyá»ƒn hÆ°á»›ng Ä‘áº¿n trang HoÃ n táº¥t ÄÆ¡n hÃ ng. |
| **Luá»“ng ngoáº¡i lá»‡** | * **4a. Sáº£n pháº©m háº¿t hÃ ng Ä‘á»™t ngá»™t:** BÃ¡o lá»—i sáº£n pháº©m Ä‘Ã£ háº¿t hÃ ng trong kho, Rollback transaction.<br>* **7a. KhÃ¡ch há»§y thanh toÃ¡n:** Tráº¡ng thÃ¡i giá»¯ nguyÃªn `PENDING`, sau 15 phÃºt khÃ´ng chuyá»ƒn tiá»n tá»± Ä‘á»™ng há»§y Ä‘Æ¡n vÃ  hoÃ n tráº£ tá»“n kho. |

#### SÆ¡ Ä‘á»“ Tuáº§n tá»± (Sequence Diagram) - Äáº·t hÃ ng PayOS QR Code:

```mermaid
sequenceDiagram
    autonumber
    actor Customer as KhÃ¡ch hÃ ng
    participant FE as React Frontend
    participant BE as Spring Boot API
    participant DB as MS SQL Server
    participant PayOS as PayOS Payment Gateway

    Customer->>FE: Báº¥m "Thanh toÃ¡n QR PayOS"
    FE->>BE: POST /api/v1/orders (addressId, couponCode, paymentMethod="PAYOS")
    BE->>DB: BEGIN TRANSACTION: Check & Deduct product_variants stock
    BE->>DB: INSERT INTO orders & order_details (status="PENDING")
    BE->>PayOS: POST /v2/payment-requests (OrderCode, Amount, Description)
    PayOS-->>BE: Tráº£ vá» { qrCode: "000201...", checkoutUrl: "..." }
    BE->>DB: COMMIT TRANSACTION
    BE-->>FE: HTTP 200 OK + qrCode
    FE-->>Customer: Hiá»ƒn thá»‹ Modal QuÃ©t mÃ£ VietQR

    Customer->>PayOS: QuÃ©t mÃ£ QR & Chuyá»ƒn khoáº£n trÃªn App NgÃ¢n hÃ ng
    PayOS->>BE: Webhook HTTP POST /api/v1/payments/payos-webhook (Data, Signature)
    BE->>BE: Verify HMAC SHA256 Signature
    BE->>DB: UPDATE orders SET payment_status="PAID", status="PROCESSING"
    BE-->>PayOS: HTTP 200 OK Response
    FE->>BE: Long Polling GET /api/v1/orders/{id}/status
    BE-->>FE: status = "PAID"
    FE-->>Customer: Hiá»ƒn thá»‹ mÃ n hÃ¬nh "Thanh toÃ¡n ThÃ nh cÃ´ng!"
```

---

### UC-05: Ãp dá»¥ng MÃ£ giáº£m giÃ¡ (Coupon Code)

| Thuá»™c tÃ­nh | Chi tiáº¿t Ä‘áº·c táº£ |
| :--- | :--- |
| **MÃ£ Use Case** | `UC-05` |
| **TÃªn Use Case** | Ãp dá»¥ng MÃ£ giáº£m giÃ¡ (Apply Coupon) |
| **TÃ¡c nhÃ¢n chÃ­nh** | KhÃ¡ch hÃ ng |
| **MÃ´ táº£ ngáº¯n** | Nháº­p mÃ£ coupon Ä‘á»ƒ nháº­n Æ°u Ä‘Ã£i giáº£m giÃ¡ trá»±c tiáº¿p vÃ o hÃ³a Ä‘Æ¡n checkout. |
| **Tiá»n Ä‘iá»u kiá»‡n** | Äang á»Ÿ mÃ n hÃ¬nh Thanh toÃ¡n Checkout. |
| **Háº­u Ä‘iá»u kiá»‡n** | Tá»•ng giÃ¡ trá»‹ hÃ³a Ä‘Æ¡n Ä‘Æ°á»£c giáº£m má»™t khoáº£n tiá»n tÆ°Æ¡ng á»©ng quy Ä‘á»‹nh coupon. |
| **Luá»“ng sá»± kiá»‡n chÃ­nh (Basic Flow)** | 1. KhÃ¡ch nháº­p mÃ£ giáº£m giÃ¡ (vÃ­ dá»¥: `FOXSTYLE100`) vÃ  báº¥m **"Ãp dá»¥ng"**.<br>2. Backend kiá»ƒm tra mÃ£ trong báº£ng `coupons` (xem tráº¡ng thÃ¡i `status = 1`, háº¡n sá»­ dá»¥ng `start_date` & `end_date`).<br>3. Backend kiá»ƒm tra tá»•ng giÃ¡ trá»‹ Ä‘Æ¡n hÃ ng >= `min_order_value`.<br>4. Backend kiá»ƒm tra giá»›i háº¡n lÆ°á»£t dÃ¹ng chung (`usage_limit > used_count`).<br>5. Backend tÃ­nh tiá»n giáº£m (cá»‘ Ä‘á»‹nh hoáº·c % cÃ³ giá»›i háº¡n `max_discount_value`) vÃ  trá»« vÃ o tá»•ng hÃ³a Ä‘Æ¡n. |
| **Luá»“ng ngoáº¡i lá»‡** | * **2a. MÃ£ khÃ´ng há»£p lá»‡ / Háº¿t háº¡n / ÄÃ£ háº¿t lÆ°á»£t:** BÃ¡o lá»—i chi tiáº¿t lÃ½ do mÃ£ khÃ´ng Ä‘Æ°á»£c cháº¥p nháº­n. |

---

### UC-06: Quáº£n lÃ½ Sá»• Ä‘á»‹a chá»‰ Giao hÃ ng (`user_addresses`)

| Thuá»™c tÃ­nh | Chi tiáº¿t Ä‘áº·c táº£ |
| :--- | :--- |
| **MÃ£ Use Case** | `UC-06` |
| **TÃªn Use Case** | Quáº£n lÃ½ Sá»• Ä‘á»‹a chá»‰ Giao hÃ ng |
| **TÃ¡c nhÃ¢n chÃ­nh** | KhÃ¡ch hÃ ng |
| **MÃ´ táº£ ngáº¯n** | ThÃªm má»›i, chá»‰nh sá»­a, xÃ³a vÃ  thiáº¿t láº­p Ä‘á»‹a chá»‰ máº·c Ä‘á»‹nh Ä‘á»ƒ nháº­n hÃ ng mua sáº¯m. |
| **Tiá»n Ä‘iá»u kiá»‡n** | KhÃ¡ch hÃ ng Ä‘Ã£ Ä‘Äƒng nháº­p tÃ i khoáº£n. |
| **Háº­u Ä‘iá»u kiá»‡n** | Danh sÃ¡ch Ä‘á»‹a chá»‰ trong báº£ng `user_addresses` Ä‘Æ°á»£c cáº­p nháº­t chÃ­nh xÃ¡c. |
| **Luá»“ng sá»± kiá»‡n chÃ­nh (Basic Flow)** | 1. KhÃ¡ch truy cáº­p má»¥c **"Sá»• Ä‘á»‹a chá»‰"** trong Trang cÃ¡ nhÃ¢n.<br>2. Click **"ThÃªm Ä‘á»‹a chá»‰ má»›i"**.<br>3. Nháº­p Há» tÃªn ngÆ°á»i nháº­n, Sá»‘ Ä‘iá»‡n thoáº¡i, Tá»‰nh/ThÃ nh, Quáº­n/Huyá»‡n, XÃ£/PhÆ°á»ng, Äá»‹a chá»‰ nhÃ .<br>4. ÄÃ¡nh dáº¥u tÃ­ch **"Äáº·t lÃ m Ä‘á»‹a chá»‰ máº·c Ä‘á»‹nh"** (`is_default = 1`).<br>5. Báº¥m **"LÆ°u"** -> Há»‡ thá»‘ng tá»± Ä‘á»™ng bá» máº·c Ä‘á»‹nh cÃ¡c Ä‘á»‹a chá»‰ cÅ© vÃ  lÆ°u Ä‘á»‹a chá»‰ má»›i lÃ m máº·c Ä‘á»‹nh. |

---

### UC-07: Viáº¿t ÄÃ¡nh giÃ¡ & Cháº¥m sao Sáº£n pháº©m

| Thuá»™c tÃ­nh | Chi tiáº¿t Ä‘áº·c táº£ |
| :--- | :--- |
| **MÃ£ Use Case** | `UC-07` |
| **TÃªn Use Case** | Viáº¿t ÄÃ¡nh giÃ¡ & Cháº¥m sao Sáº£n pháº©m |
| **TÃ¡c nhÃ¢n chÃ­nh** | KhÃ¡ch hÃ ng |
| **MÃ´ táº£ ngáº¯n** | KhÃ¡ch hÃ ng viáº¿t bÃ¬nh luáº­n vÃ  cháº¥m 1-5 sao cho sáº£n pháº©m Ä‘Ã£ mua thÃ nh cÃ´ng. |
| **Tiá»n Ä‘iá»u kiá»‡n** | KhÃ¡ch hÃ ng Ä‘Ã£ cÃ³ Ä‘Æ¡n hÃ ng chá»©a sáº£n pháº©m á»Ÿ tráº¡ng thÃ¡i `DELIVERED` (ÄÃ£ giao thÃ nh cÃ´ng). |
| **Háº­u Ä‘iá»u kiá»‡n** | ÄÃ¡nh giÃ¡ Ä‘Æ°á»£c lÆ°u vÃ o báº£ng `reviews` vÃ  hiá»ƒn thá»‹ cÃ´ng khai á»Ÿ chi tiáº¿t sáº£n pháº©m. |
| **Luá»“ng sá»± kiá»‡n chÃ­nh (Basic Flow)** | 1. KhÃ¡ch hÃ ng vÃ o **"Lá»‹ch sá»­ Ä‘Æ¡n hÃ ng"** -> Chá»n Ä‘Æ¡n hÃ ng á»Ÿ tráº¡ng thÃ¡i **ÄÃ£ giao**.<br>2. Báº¥m nÃºt **"ÄÃ¡nh giÃ¡ sáº£n pháº©m"**.<br>3. Chá»n sá»‘ sao tá»« 1 Ä‘áº¿n 5 sao vÃ  nháº­p nháº­n xÃ©t tráº£i nghiá»‡m.<br>4. Báº¥m **"Gá»­i Ä‘Ã¡nh giÃ¡"** -> API kiá»ƒm tra xÃ¡c thá»±c quyá»n mua hÃ ng -> LÆ°u review vÃ o CSDL. |

---

### UC-08: Quáº£n lÃ½ Sáº£n pháº©m, ThÆ° viá»‡n áº¢nh & Biáº¿n thá»ƒ (Admin)

| Thuá»™c tÃ­nh | Chi tiáº¿t Ä‘áº·c táº£ |
| :--- | :--- |
| **MÃ£ Use Case** | `UC-08` |
| **TÃªn Use Case** | Quáº£n lÃ½ Sáº£n pháº©m, ThÆ° viá»‡n áº¢nh & Biáº¿n thá»ƒ |
| **TÃ¡c nhÃ¢n chÃ­nh** | Quáº£n trá»‹ viÃªn (Admin) |
| **MÃ´ táº£ ngáº¯n** | ThÃªm má»›i, chá»‰nh sá»­a thÃ´ng tin sáº£n pháº©m, quáº£n lÃ½ bá»™ sÆ°u táº­p áº£nh gÃ³c phá»¥ (`product_images`) vÃ  thiáº¿t láº­p sá»‘ lÆ°á»£ng tá»“n kho theo biáº¿n thá»ƒ Size/MÃ u (`product_variants`). |
| **Tiá»n Ä‘iá»u kiá»‡n** | ÄÃ£ Ä‘Äƒng nháº­p vá»›i tÃ i khoáº£n cÃ³ quyá»n `ROLE_ADMIN`. |
| **Háº­u Ä‘iá»u kiá»‡n** | Sáº£n pháº©m vÃ  cÃ¡c biáº¿n thá»ƒ kho hÃ ng Ä‘Æ°á»£c cáº­p nháº­t hoÃ n chá»‰nh trong CSDL. |
| **Luá»“ng sá»± kiá»‡n chÃ­nh (Basic Flow)** | 1. Admin vÃ o Admin Portal -> Má»¥c **"Quáº£n lÃ½ Sáº£n pháº©m"** -> Báº¥m **"ThÃªm sáº£n pháº©m má»›i"**.<br>2. Nháº­p thÃ´ng tin chung: TÃªn, MÃ´ táº£, GiÃ¡ bÃ¡n, GiÃ¡ gá»‘c, Danh má»¥c.<br>3. Táº£i lÃªn danh sÃ¡ch áº£nh gÃ³c phá»¥, chá»n 1 áº£nh lÃ m áº£nh Ä‘áº¡i diá»‡n chÃ­nh (`is_primary = 1`).<br>4. Chuyá»ƒn sang tab **"Biáº¿n thá»ƒ & Tá»“n kho"**: Khá»Ÿi táº¡o danh sÃ¡ch cÃ¡c cáº·p MÃ u sáº¯c - Size (VÃ­ dá»¥: Äen - M, Äen - L, Tráº¯ng - M) kÃ¨m MÃ£ SKU vÃ  sá»‘ lÆ°á»£ng tá»“n kho cho tá»«ng cáº·p.<br>5. Báº¥m **"LÆ°u sáº£n pháº©m"** -> Há»‡ thá»‘ng lÆ°u dá»¯ liá»‡u Ä‘á»“ng thá»i vÃ o cÃ¡c báº£ng `products`, `product_images`, `product_variants`. |

#### SÆ¡ Ä‘á»“ Tuáº§n tá»± (Sequence Diagram) - Admin ThÃªm Sáº£n pháº©m & Biáº¿n thá»ƒ:

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Quáº£n trá»‹ viÃªn
    participant FE as Admin React Portal
    participant BE as Spring Boot API
    participant Storage as Cloudinary / Local Storage
    participant DB as MS SQL Server

    Admin->>FE: Báº¥m "ThÃªm sáº£n pháº©m má»›i" & Nháº­p TÃªn, GiÃ¡, MÃ´ táº£
    Admin->>FE: Upload 3 áº¢nh gÃ³c phá»¥
    FE->>Storage: POST Multi-part Image Files
    Storage-->>FE: Tráº£ vá» Image URLs [url1, url2, url3]
    Admin->>FE: Cáº¥u hÃ¬nh danh sÃ¡ch Biáº¿n thá»ƒ Size/MÃ u & Sá»‘ lÆ°á»£ng kho
    FE->>BE: POST /api/v1/admin/products (ProductData, ImagesList, VariantsList)
    BE->>BE: Check Admin Authorization (JWT ROLE_ADMIN)
    BE->>DB: BEGIN TRANSACTION
    BE->>DB: INSERT INTO products RETURNING product_id
    BE->>DB: INSERT INTO product_images (product_id, image_url, is_primary)
    BE->>DB: INSERT INTO product_variants (product_id, color, size, quantity, sku)
    BE->>DB: COMMIT TRANSACTION
    BE-->>FE: HTTP 201 Created + ProductDetailDTO
    FE-->>Admin: Hiá»ƒn thá»‹ thÃ´ng bÃ¡o "Táº¡o sáº£n pháº©m thÃ nh cÃ´ng!"
```

---

### UC-09: Quáº£n lÃ½ & Cáº­p nháº­t Tiáº¿n trÃ¬nh ÄÆ¡n hÃ ng (Admin/Staff)

| Thuá»™c tÃ­nh | Chi tiáº¿t Ä‘áº·c táº£ |
| :--- | :--- |
| **MÃ£ Use Case** | `UC-09` |
| **TÃªn Use Case** | Quáº£n lÃ½ & Cáº­p nháº­t Tiáº¿n trÃ¬nh ÄÆ¡n hÃ ng |
| **TÃ¡c nhÃ¢n chÃ­nh** | NhÃ¢n viÃªn (Staff), Quáº£n trá»‹ viÃªn (Admin) |
| **MÃ´ táº£ ngáº¯n** | Xem danh sÃ¡ch Ä‘Æ¡n hÃ ng toÃ n há»‡ thá»‘ng, kiá»ƒm tra thÃ´ng tin thanh toÃ¡n vÃ  chuyá»ƒn tráº¡ng thÃ¡i váº­n chuyá»ƒn Ä‘Æ¡n hÃ ng. |
| **Tiá»n Ä‘iá»u kiá»‡n** | ÄÄƒng nháº­p tÃ i khoáº£n cÃ³ quyá»n `ROLE_STAFF` hoáº·c `ROLE_ADMIN`. |
| **Háº­u Ä‘iá»u kiá»‡n** | Tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng Ä‘Æ°á»£c cáº­p nháº­t vÃ  thÃ´ng bÃ¡o cho khÃ¡ch hÃ ng. |
| **Luá»“ng sá»± kiá»‡n chÃ­nh (Basic Flow)** | 1. NhÃ¢n viÃªn truy cáº­p má»¥c **"Quáº£n lÃ½ ÄÆ¡n hÃ ng"**.<br>2. Lá»c danh sÃ¡ch cÃ¡c Ä‘Æ¡n hÃ ng má»›i á»Ÿ tráº¡ng thÃ¡i `PENDING` (Chá» duyá»‡t).<br>3. Kiá»ƒm tra chi tiáº¿t Ä‘Æ¡n: ThÃ´ng tin ngÆ°á»i nháº­n, PhÆ°Æ¡ng thá»©c thanh toÃ¡n (COD hoáº·c PayOS Ä‘Ã£ thanh toÃ¡n).<br>4. Báº¥m **"Duyá»‡t Ä‘Æ¡n"** -> Tráº¡ng thÃ¡i Ä‘Æ¡n chuyá»ƒn sang `CONFIRMED`.<br>5. Khi giao hÃ ng cho Ä‘Æ¡n vá»‹ váº­n chuyá»ƒn -> Chuyá»ƒn sang `SHIPPING`.<br>6. Khi Ä‘Æ¡n vá»‹ váº­n chuyá»ƒn xÃ¡c nháº­n giao thÃ nh cÃ´ng -> Chuyá»ƒn sang `DELIVERED`. Há»‡ thá»‘ng khÃ³a khÃ´ng cho thay Ä‘á»•i tráº¡ng thÃ¡i Ä‘Æ¡n ná»¯a. |

---

### UC-10: Xem BÃ¡o cÃ¡o & Thá»‘ng kÃª Doanh thu (Admin)

| Thuá»™c tÃ­nh | Chi tiáº¿t Ä‘áº·c táº£ |
| :--- | :--- |
| **MÃ£ Use Case** | `UC-10` |
| **TÃªn Use Case** | Xem BÃ¡o cÃ¡o & Thá»‘ng kÃª Doanh thu |
| **TÃ¡c nhÃ¢n chÃ­nh** | Quáº£n trá»‹ viÃªn (Admin) |
| **MÃ´ táº£ ngáº¯n** | Xem biá»ƒu Ä‘á»“ trá»±c quan thá»‘ng kÃª doanh thu thá»±c táº¿, sá»‘ lÆ°á»£ng Ä‘Æ¡n Ä‘áº·t hÃ ng, tá»· lá»‡ há»§y Ä‘Æ¡n vÃ  bÃ¡o cÃ¡o hÃ ng tá»“n kho. |
| **Tiá»n Ä‘iá»u kiá»‡n** | ÄÄƒng nháº­p tÃ i khoáº£n `ROLE_ADMIN`. |
| **Háº­u Ä‘iá»u kiá»‡n** | Dá»¯ liá»‡u bÃ¡o cÃ¡o thá»‘ng kÃª hiá»ƒn thá»‹ chÃ­nh xÃ¡c theo thá»i gian thá»±c. |
| **Luá»“ng sá»± kiá»‡n chÃ­nh (Basic Flow)** | 1. Admin vÃ o Admin Portal -> Má»¥c **"Dashboard / Thá»‘ng kÃª"**.<br>2. Chá»n má»‘c thá»i gian xem bÃ¡o cÃ¡o (HÃ´m nay, 7 ngÃ y qua, Thá»‘ng kÃª theo ThÃ¡ng, NÄƒm).<br>3. API tÃ­nh toÃ¡n dá»¯ liá»‡u tá»•ng quÃ¡t tá»« CSDL.<br>4. Giao diá»‡n hiá»ƒn thá»‹ cÃ¡c biá»ƒu Ä‘á»“ Recharts: Biá»ƒu Ä‘á»“ Ä‘Æ°á»ng doanh thu, Biá»ƒu Ä‘á»“ cá»™t sáº£n pháº©m bÃ¡n cháº¡y nháº¥t, Thá»‘ng kÃª Ä‘Æ¡n thÃ nh cÃ´ng/há»§y vÃ  Cáº£nh bÃ¡o danh sÃ¡ch biáº¿n thá»ƒ sáº£n pháº©m sáº¯p háº¿t hÃ ng (tá»“n kho < 5). |

---

## Lá»œI Káº¾T & LIÃŠN Káº¾T TÃ€I LIá»†U
Báº£n Ä‘áº·c táº£ **SÆ¡ Ä‘á»“ & Äáº·c táº£ Ca sá»­ dá»¥ng FoxStyle** nÃ y cung cáº¥p mÃ´ táº£ chi tiáº¿t, minh báº¡ch vá» táº¥t cáº£ cÃ¡c luá»“ng tÆ°Æ¡ng tÃ¡c giá»¯a TÃ¡c nhÃ¢n vÃ  Há»‡ thá»‘ng. 

TÃ i liá»‡u nÃ y liÃªn káº¿t trá»±c tiáº¿p vÃ  Ä‘á»“ng bá»™ vá»›i:
- [Äáº·c táº£ YÃªu cáº§u Há»‡ thá»‘ng SRS](./yeu_cau_he_thong.md)
- [BÃ¡o cÃ¡o MÃ´ táº£ CÆ¡ sá»Ÿ Dá»¯ liá»‡u](./BAO_CAO_MO_TA_CSDL_FOXSTYLE.md)
- [Danh sÃ¡ch Test Cases chi tiáº¿t](./FULL_TEST_CASES.md)
