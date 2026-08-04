# TÃ€I LIá»†U PHÃ‚N TÃCH YÃŠU Cáº¦U Há»† THá»NG (SYSTEM REQUIREMENTS SPECIFICATION)
## Dá»± Ã¡n: Há»‡ thá»‘ng ThÆ°Æ¡ng máº¡i Äiá»‡n tá»­ Thá»i trang FoxStyle
**MÃ£ dá»± Ã¡n:** FOXSTYLE-DATN  
**NgÃ y cáº­p nháº­t:** 31/07/2026  
**Tráº¡ng thÃ¡i:** TÃ€I LIá»†U CHÃNH THá»¨C  

> ðŸ“Œ **TÃ i liá»‡u liÃªn quan:** 
> - Xem Ä‘áº§y Ä‘á»§ SÆ¡ Ä‘á»“ vÃ  Äáº·c táº£ Chi tiáº¿t 10 Ca sá»­ dá»¥ng táº¡i **[docs/so_do_use_case.md](./so_do_use_case.md)**
> - Xem Báº£ng Äáº·c táº£ Chi tiáº¿t 20 Ca sá»­ dá»¥ng Ä‘áº§y Ä‘á»§ táº¡i **[docs/dac_ta_use_case_chi_tiet.md](./dac_ta_use_case_chi_tiet.md)**
> - Xem Ma tráº­n Ãnh xáº¡ Use Case & Actor táº¡i **[docs/use_case_actor_mapping.md](./use_case_actor_mapping.md)**
> - Xem Bá»™ 10 SÆ¡ Ä‘á»“ Tuáº§n tá»± (Sequence Diagrams) táº¡i **[docs/so_do_tuan_tu_sequence_diagrams.md](./so_do_tuan_tu_sequence_diagrams.md)**
> - Xem Thiáº¿t káº¿ CÆ¡ sá»Ÿ Dá»¯ liá»‡u 43 Báº£ng táº¡i **[docs/thiet_ke_co_so_du_lieu.md](./thiet_ke_co_so_du_lieu.md)**
> - Xem Thiáº¿t káº¿ Cáº¥u trÃºc Pháº§n má»m (Software Architecture) táº¡i **[docs/thiet_ke_cau_truc_phan_mem.md](./thiet_ke_cau_truc_phan_mem.md)**
> - Xem Thiáº¿t káº¿ Lá»›p MÃ£ nguá»“n Java (Class Diagrams) táº¡i **[docs/thiet_ke_lop_class_diagrams.md](./thiet_ke_lop_class_diagrams.md)**
> - Xem Thiáº¿t káº¿ Lá»›p 6 PhÃ¢n há»‡ chÃ­nh táº¡i **[docs/thiet_ke_lop_cac_phan_he_chinh.md](./thiet_ke_lop_cac_phan_he_chinh.md)**
> - Xem BÃ¡o cÃ¡o Pháº§n 4: PhÃ¡t triá»ƒn & Thá»±c thi táº¡i **[docs/bao_cao_phan_4_phat_trien_thuc_thi.md](./bao_cao_phan_4_phat_trien_thuc_thi.md)**
> - Xem BÃ¡o cÃ¡o Pháº§n 5: Thá»­ nghiá»‡m, ÄÃ¡nh giÃ¡ & HÆ°á»›ng phÃ¡t triá»ƒn táº¡i **[docs/bao_cao_phan_5_tong_ket_danh_gia_huong_phat_trien.md](./bao_cao_phan_5_tong_ket_danh_gia_huong_phat_trien.md)**
> - Xem BÃ¡o cÃ¡o Pháº§n 6: HÆ°á»›ng phÃ¡t triá»ƒn & Pháº¡m vi á»¨ng dá»¥ng táº¡i **[docs/bao_cao_phan_6_huong_phat_trien_va_ung_dung.md](./bao_cao_phan_6_huong_phat_trien_va_ung_dung.md)**
> - Xem Báº£ng Kiá»ƒm thá»­ & Checklist táº¡i **[docs/bang_kiem_thu_va_checklist.md](./bang_kiem_thu_va_checklist.md)** (Hoáº·c má»Ÿ file Excel táº¡i **[docs/BANG_KIEM_THU_FOXSTYLE.xlsx](./BANG_KIEM_THU_FOXSTYLE.xlsx)**)
> - Xem Pháº§n Káº¿t luáº­n & Lá»i Cáº£m Æ¡n táº¡i **[docs/ket_luan_va_loi_cam_on.md](./ket_luan_va_loi_cam_on.md)**
> - Xem Danh má»¥c TÃ i liá»‡u Tham kháº£o táº¡i **[docs/danh_muc_tai_lieu_tham_khao.md](./danh_muc_tai_lieu_tham_khao.md)**
> - Xem Phá»¥ lá»¥c BÃ¡o cÃ¡o Äá»“ Ã¡n táº¡i **[docs/phu_luc_bao_cao_do_an.md](./phu_luc_bao_cao_do_an.md)**
> - Xem MÃ´ táº£ Chi tiáº¿t tá»«ng Chá»©c nÄƒng Há»‡ thá»‘ng táº¡i **[docs/mo_ta_chi_tiet_chuc_nang.md](./mo_ta_chi_tiet_chuc_nang.md)**
> - Xem Thiáº¿t káº¿ Háº¡ táº§ng Máº¡ng & Bá»™ ChÃ­nh sÃ¡ch Há»‡ thá»‘ng táº¡i **[docs/thiet_ke_ha_tang_mang_va_chinh_sach.md](./thiet_ke_ha_tang_mang_va_chinh_sach.md)**

---

## Má»¤C Lá»¤C
- [CHÆ¯Æ NG 1: Tá»”NG QUAN & PHáº M VI Há»† THá»NG](#chÆ°Æ¡ng-1-tá»•ng-quan--pháº¡m-vi-há»‡-thá»‘ng)
  - [1.1. Bá»‘i cáº£nh & LÃ½ do thá»±c hiá»‡n Ä‘á» tÃ i](#11-bá»‘i-cáº£nh--lÃ½-do-thá»±c-hiá»‡n-Ä‘á»-tÃ i)
  - [1.2. Má»¥c tiÃªu cá»§a há»‡ thá»‘ng](#12-má»¥c-tiÃªu-cá»§a-há»‡-thá»‘ng)
  - [1.3. Pháº¡m vi há»‡ thá»‘ng](#13-pháº¡m-vi-há»‡-thá»‘ng)
  - [1.4. MÃ´ hÃ¬nh Kiáº¿n trÃºc Tá»•ng thá»ƒ](#14-mÃ´-hÃ¬nh-kiáº¿n-trÃºc-tá»•ng-thá»ƒ)
- [CHÆ¯Æ NG 2: YÃŠU Cáº¦U CHá»¨C NÄ‚NG (FUNCTIONAL REQUIREMENTS)](#chÆ°Æ¡ng-2-yÃªu-cáº§u-chá»©c-nÄƒng-functional-requirements)
  - [2.1. Danh má»¥c TÃ¡c nhÃ¢n (Actors)](#21-danh-má»¥c-tÃ¡c-nhÃ¢n-actors)
  - [2.2. PhÃ¢n há»‡ KhÃ¡ch hÃ ng (Storefront User)](#22-phÃ¢n-há»‡-khÃ¡ch-hÃ ng-storefront-user)
  - [2.3. PhÃ¢n há»‡ Quáº£n trá»‹ & NhÃ¢n viÃªn (Admin & Staff Portal)](#23-phÃ¢n-há»‡-quáº£n-trá»‹--nhÃ¢n-viÃªn-admin--staff-portal)
  - [2.4. PhÃ¢n há»‡ Tá»± Ä‘á»™ng & Xá»­ lÃ½ Ngáº§m (Background & Integration)](#24-phÃ¢n-há»‡-tá»±-Ä‘á»™ng--xá»­-lÃ½-ngáº§m-background--integration)
  - [2.5. Ma tráº­n PhÃ¢n quyá»n TÃ¡c vá»¥ (RBAC Matrix)](#25-ma-tráº­n-phÃ¢n-quyá»n-tÃ¡c-vá»¥-rbac-matrix)
- [CHÆ¯Æ NG 3: YÃŠU Cáº¦U PHI CHá»¨C NÄ‚NG (NON-FUNCTIONAL REQUIREMENTS)](#chÆ°Æ¡ng-3-yÃªu-cáº§u-phi-chá»©c-nÄƒng-non-functional-requirements)
  - [3.1. Hiá»‡u nÄƒng & Kháº£ nÄƒng má»Ÿ rá»™ng (Performance & Scalability)](#31-hiá»‡u-nÄƒng--kháº£-nÄƒng-má»Ÿ-rá»™ng-performance--scalability)
  - [3.2. Báº£o máº­t & Máº­t mÃ£ (Security & Cryptography)](#32-báº£o-máº­t--máº­t-mÃ£-security--cryptography)
  - [3.3. Äá»™ tin cáº­y & TÃ­nh sáºµn sÃ ng (Reliability & Availability)](#33-Ä‘á»™-tin-cáº­y--tÃ­nh-sáºµn-sÃ ng-reliability--availability)
  - [3.4. Tráº£i nghiá»‡m ngÆ°á»i dÃ¹ng & Giao diá»‡n (Usability & UX)](#34-tráº£i-nghiá»‡m-ngÆ°á»i-dÃ¹ng--giao-diá»‡n-usability--ux)
  - [3.5. TÃ­nh báº£o trÃ¬ & Cáº¥u trÃºc MÃ£ nguá»“n (Maintainability)](#35-tÃ­nh-báº£o-trÃ¬--cáº¥u-trÃºc-mÃ£-nguá»“n-maintainability)
- [CHÆ¯Æ NG 4: RÃ€NG BUá»˜C Ká»¸ THUáº¬T & TÃCH Há»¢P Há»† THá»NG](#chÆ°Æ¡ng-4-rÃ ng-buá»™c-ká»¹-thuáº­t--tÃ­ch-há»£p-há»‡-thá»‘ng)
  - [4.1. CÃ´ng nghá»‡ & MÃ´i trÆ°á»ng Triá»ƒn khai](#41-cÃ´ng-nghá»‡--mÃ´i-trÆ°á»ng-triá»ƒn-khai)
  - [4.2. TÃ­ch há»£p Cá»•ng Thanh toÃ¡n PayOS API](#42-tÃ­ch-há»£p-cá»•ng-thanh-toÃ¡n-payos-api)
  - [4.3. TÃ­ch há»£p XÃ¡c thá»±c Google OAuth2](#43-tÃ­ch-há»£p-xÃ¡c-thá»±c-google-oauth2)
  - [4.4. TÃ­ch há»£p Dá»‹ch vá»¥ Email (Spring Mail / SMTP)](#44-tÃ­ch-há»£p-dá»‹ch-vá»¥-email-spring-mail--smtp)
- [CHÆ¯Æ NG 5: QUY TRÃŒNH NGHIá»†P Vá»¤ QUAN TRá»ŒNG](#chÆ°Æ¡ng-5-quy-trÃ¬nh-nghiá»‡p-vá»¥-quan-trá»ng)
  - [5.1. Quy trÃ¬nh Äáº·t hÃ ng & Thanh toÃ¡n PayOS QR Code](#51-quy-trÃ¬nh-Ä‘áº·t-hÃ ng--thanh-toÃ¡n-payos-qr-code)
  - [5.2. Quy trÃ¬nh Kiá»ƒm tra & Cáº­p nháº­t Tá»“n kho Biáº¿n thá»ƒ](#52-quy-trÃ¬nh-kiá»ƒm-tra--cáº­p-nhat-tá»“n-kho-biáº¿n-thá»ƒ)

---

## CHÆ¯Æ NG 1: Tá»”NG QUAN & PHáº M VI Há»† THá»NG

### 1.1. Bá»‘i cáº£nh & LÃ½ do thá»±c hiá»‡n Ä‘á» tÃ i
Trong ngÃ nh bÃ¡n láº» thá»i trang hiá»‡n Ä‘áº¡i, nhu cáº§u mua sáº¯m trá»±c tuyáº¿n Ä‘Ã²i há»i há»‡ thá»‘ng pháº£i Ä‘Ã¡p á»©ng nhanh chÃ³ng cÃ¡c tiÃªu chÃ­: tráº£i nghiá»‡m giao diá»‡n ngÆ°á»i dÃ¹ng mÆ°á»£t mÃ , kháº£ nÄƒng quáº£n lÃ½ biáº¿n thá»ƒ sáº£n pháº©m chi tiáº¿t (kÃ­ch cá»¡, mÃ u sáº¯c, tá»“n kho theo biáº¿n thá»ƒ), tá»± Ä‘á»™ng hÃ³a thanh toÃ¡n vÃ  xá»­ lÃ½ Ä‘Æ¡n hÃ ng chÃ­nh xÃ¡c. 

Há»‡ thá»‘ng **FoxStyle** Ä‘Æ°á»£c xÃ¢y dá»±ng nháº±m giáº£i quyáº¿t bÃ i toÃ¡n kinh doanh thá»±c táº¿ cá»§a thÆ°Æ¡ng hiá»‡u thá»i trang, káº¿t há»£p cÃ´ng nghá»‡ kiáº¿n trÃºc tÃ¡ch biá»‡t (Decoupled Architecture) giá»¯a RESTful Backend Service vÃ  React Single Page Application (SPA).

### 1.2. Má»¥c tiÃªu cá»§a há»‡ thá»‘ng
1. **Äá»‘i vá»›i KhÃ¡ch hÃ ng:** Cung cáº¥p tráº£i nghiá»‡m mua sáº¯m trá»±c quan, há»— trá»£ tÃ¬m kiáº¿m/lá»c nhanh sáº£n pháº©m, Ä‘áº·t hÃ ng linh hoáº¡t vá»›i nhiá»u phÆ°Æ¡ng thá»©c thanh toÃ¡n (COD hoáº·c quÃ©t mÃ£ QR PayOS tá»± Ä‘á»™ng khá»›p lá»‡nh), theo dÃµi Ä‘Æ¡n hÃ ng vÃ  tÆ°Æ¡ng tÃ¡c Ä‘Ã¡nh giÃ¡ sáº£n pháº©m.
2. **Äá»‘i vá»›i Quáº£n trá»‹ viÃªn / NhÃ¢n viÃªn:** Cung cáº¥p cÃ´ng cá»¥ quáº£n trá»‹ táº­p trung (Admin Portal) giÃºp quáº£n lÃ½ danh má»¥c, chi tiáº¿t biáº¿n thá»ƒ sáº£n pháº©m, bá»™ sÆ°u táº­p hÃ¬nh áº£nh, mÃ£ giáº£m giÃ¡, theo dÃµi tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng vÃ  phÃ¢n tÃ­ch doanh thu báº±ng biá»ƒu Ä‘á»“ trá»±c quan.
3. **Äá»‘i vá»›i Há»‡ thá»‘ng Ká»¹ thuáº­t:** Äáº£m báº£o kháº£ nÄƒng má»Ÿ rá»™ng, báº£o máº­t cao báº±ng JWT Token & Spring Security, ACID compliance cho giao dá»‹ch Ä‘Æ¡n hÃ ng vÃ  tÃ­ch há»£p linh hoáº¡t vá»›i cÃ¡c dá»‹ch vá»¥ bÃªn thá»© ba (PayOS, Google OAuth2, Cloudinary, Mail Server).

### 1.3. Pháº¡m vi há»‡ thá»‘ng
- **PhÃ¢n há»‡ Storefront (KhÃ¡ch hÃ ng):** Cháº¡y trÃªn ná»n táº£ng Web App (Responsive Web), há»— trá»£ khÃ¡ch vÃ£ng lai vÃ  ngÆ°á»i dÃ¹ng Ä‘Ã£ Ä‘Äƒng nháº­p.
- **PhÃ¢n há»‡ Admin & Staff Portal (Quáº£n trá»‹ & NhÃ¢n viÃªn):** Giao diá»‡n quáº£n trá»‹ riÃªng biá»‡t phÃ¢n quyá»n theo vai trÃ² (ADMIN, STAFF).
- **Há»‡ thá»‘ng Backend API:** Chuáº©n RESTful API pháº£n há»“i JSON, Ä‘Ã³ng gÃ³i Ä‘á»™c láº­p.

### 1.4. MÃ´ hÃ¬nh Kiáº¿n trÃºc Tá»•ng thá»ƒ
Há»‡ thá»‘ng FoxStyle Ä‘Æ°á»£c thiáº¿t káº¿ theo kiáº¿n trÃºc 3 lá»›p decoupled:

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                        FRONTEND CLIENT (React 18 / Vite)              â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”‚
â”‚  â”‚   Storefront Web (Customer)   â”‚   â”‚  Admin Portal (Admin/Staff)   â”‚ â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                  â”‚  HTTPS / RESTful JSON / JWT       â”‚
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                   BACKEND API (Spring Boot 3.2.5 / Java 17)            â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
â”‚  â”‚ Security (JWT)   â”‚ â”‚ Business Logic   â”‚ â”‚ JPA Data Access Layer   â”‚  â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
         â”‚ SQL (JDBC)              â”‚ Webhook / REST          â”‚ SMTP / Cloud
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ Database (MS SQL Server)â”‚ â”‚  PayOS Payment Gatewayâ”‚ â”‚ Google OAuth2/Mailâ”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

## CHÆ¯Æ NG 2: YÃŠU Cáº¦U CHá»¨C NÄ‚NG (FUNCTIONAL REQUIREMENTS)

### 2.1. Danh má»¥c TÃ¡c nhÃ¢n (Actors)
| STT | TÃ¡c nhÃ¢n (Actor) | MÃ´ táº£ vai trÃ² & Quyá»n háº¡n |
|---|---|---|
| 1 | **KhÃ¡ch vÃ£ng lai (Guest)** | NgÆ°á»i dÃ¹ng truy cáº­p há»‡ thá»‘ng chÆ°a Ä‘Äƒng nháº­p. CÃ³ quyá»n xem danh sÃ¡ch sáº£n pháº©m, tÃ¬m kiáº¿m, lá»c, xem chi tiáº¿t vÃ  thÃªm vÃ o giá» hÃ ng táº¡m thá»i. |
| 2 | **KhÃ¡ch hÃ ng (Customer)** | KhÃ¡ch Ä‘Ã£ Ä‘Äƒng kÃ½/Ä‘Äƒng nháº­p tÃ i khoáº£n. CÃ³ Ä‘áº§y Ä‘á»§ quyá»n mua hÃ ng, quáº£n lÃ½ sá»• Ä‘á»‹a chá»‰, Ä‘áº·t hÃ ng PayOS/COD, xem lá»‹ch sá»­ Ä‘Æ¡n, quáº£n lÃ½ wishlist vÃ  Ä‘Ã¡nh giÃ¡ sáº£n pháº©m. |
| 3 | **NhÃ¢n viÃªn (Staff)** | NhÃ¢n viÃªn cá»­a hÃ ng cÃ³ tÃ i khoáº£n thuá»™c vai trÃ² ROLE_STAFF. CÃ³ quyá»n xem Ä‘Æ¡n hÃ ng, cáº­p nháº­t tráº¡ng thÃ¡i váº­n chuyá»ƒn, kiá»ƒm tra tá»“n kho vÃ  há»— trá»£ khÃ¡ch hÃ ng. |
| 4 | **Quáº£n trá»‹ viÃªn (Admin)** | Quyá»n háº¡n cao nháº¥t (ROLE_ADMIN). Quáº£n lÃ½ toÃ n bá»™ danh má»¥c, sáº£n pháº©m, biáº¿n thá»ƒ, hÃ¬nh áº£nh, mÃ£ giáº£m giÃ¡, banner, phÃ¢n quyá»n tÃ i khoáº£n ngÆ°á»i dÃ¹ng vÃ  xem bÃ¡o cÃ¡o doanh thu. |
| 5 | **Há»‡ thá»‘ng bÃªn thá»© 3 (External Systems)** | Cá»•ng thanh toÃ¡n PayOS (gá»­i Webhook thanh toÃ¡n), Google OAuth2 (xÃ¡c thá»±c Ä‘Äƒng nháº­p), SMTP Server (gá»­i mail). |

---

### 2.2. PhÃ¢n há»‡ KhÃ¡ch hÃ ng (Storefront User)

#### FR-01: ÄÄƒng kÃ½ & ÄÄƒng nháº­p TÃ i khoáº£n
- **ÄÄƒng kÃ½ ná»™i bá»™ (Local Signup):** NgÆ°á»i dÃ¹ng nháº­p Username, Email, Máº­t kháº©u, Há» tÃªn. Há»‡ thá»‘ng kiá»ƒm tra trÃ¹ng láº·p Email vÃ  Username trong DB, bÄƒm máº­t kháº©u báº±ng thuáº­t toÃ¡n BCrypt trÆ°á»›c khi lÆ°u.
- **ÄÄƒng nháº­p ná»™i bá»™ (Local Login):** XÃ¡c thá»±c Username/Email vÃ  Password. Tráº£ vá» mÃ£ JWT Token chá»©a thÃ´ng tin User ID, Username vÃ  Roles.
- **ÄÄƒng nháº­p Google OAuth2:** NgÆ°á»i dÃ¹ng Ä‘Äƒng nháº­p qua tÃ i khoáº£n Google. Há»‡ thá»‘ng tá»± Ä‘á»™ng láº¥y Email & thÃ´ng tin há»“ sÆ¡ Google, táº¡o tÃ i khoáº£n má»›i náº¿u chÆ°a cÃ³ trong DB vÃ  phÃ¡t hÃ nh JWT Token.
- **Äá»•i máº­t kháº©u / KhÃ´i phá»¥c máº­t kháº©u:** YÃªu cáº§u nháº­p máº­t kháº©u cÅ© Ä‘á»ƒ Ä‘á»•i máº­t kháº©u má»›i. Há»— trá»£ gá»­i OTP khÃ´i phá»¥c máº­t kháº©u qua Email (SMTP).

#### FR-02: TÃ¬m kiáº¿m & Lá»c Sáº£n pháº©m
- **TÃ¬m kiáº¿m tá»« khÃ³a (Full-Text Search):** TÃ¬m kiáº¿m theo tÃªn sáº£n pháº©m (`product_name`), mÃ£ SKU hoáº·c bÃ i mÃ´ táº£ (`description`).
- **Lá»c Ä‘a tiÃªu chÃ­ (Dynamic Filter):**
  - Lá»c theo Danh má»¥c thá»i trang (`category_id`).
  - Lá»c theo KÃ­ch thÆ°á»›c (Size: S, M, L, XL, XXL...).
  - Lá»c theo MÃ u sáº¯c (Äen, Tráº¯ng, Be, Xanh, Red...).
  - Lá»c theo Khoáº£ng giÃ¡ (GiÃ¡ tá»‘i thiá»ƒu - GiÃ¡ tá»‘i Ä‘a).
  - Lá»c theo Sáº£n pháº©m Ä‘ang Giáº£m giÃ¡ (cÃ³ `original_price > price`).
- **Sáº¯p xáº¿p (Sorting):** Sáº¯p xáº¿p theo GiÃ¡ tÄƒng/giáº£m dáº§n, Sáº£n pháº©m má»›i nháº¥t, Sáº£n pháº©m bÃ¡n cháº¡y nháº¥t.

#### FR-03: Chi tiáº¿t Sáº£n pháº©m & Quáº£n lÃ½ Biáº¿n thá»ƒ
- Hiá»ƒn thá»‹ Ä‘áº§y Ä‘á»§ thÃ´ng tin: TÃªn sáº£n pháº©m, GiÃ¡ bÃ¡n hiá»‡n táº¡i, GiÃ¡ gá»‘c, MÃ´ táº£ chi tiáº¿t, Cháº¥t liá»‡u, HÆ°á»›ng dáº«n báº£o quáº£n.
- Hiá»ƒn thá»‹ thÆ° viá»‡n áº£nh phá»¥ (`product_images`) dáº¡ng Slide Carousel / Thumbnails.
- Chá»n biáº¿n thá»ƒ Ä‘á»™ng: Khi khÃ¡ch chá»n MÃ u sáº¯c & Size, há»‡ thá»‘ng tá»± Ä‘á»™ng kiá»ƒm tra sá»‘ lÆ°á»£ng tá»“n kho kháº£ dá»¥ng (`quantity` trong `product_variants`). Náº¿u tá»“n kho = 0, hiá»ƒn thá»‹ tráº¡ng thÃ¡i "Háº¿t hÃ ng" vÃ  vÃ´ hiá»‡u hÃ³a nÃºt ThÃªm vÃ o giá».

#### FR-04: Quáº£n lÃ½ Giá» hÃ ng (Shopping Cart)
- ThÃªm biáº¿n thá»ƒ sáº£n pháº©m (Product Variant ID + Sá»‘ lÆ°á»£ng) vÃ o giá» hÃ ng.
- Cáº­p nháº­t sá»‘ lÆ°á»£ng máº·t hÃ ng trá»±c tiáº¿p trong giá» (tá»± Ä‘á»™ng kiá»ƒm tra giá»›i háº¡n tá»“n kho tá»‘i Ä‘a).
- XÃ³a tá»«ng máº·t hÃ ng hoáº·c XÃ³a toÃ n bá»™ giá» hÃ ng (Clear Cart).
- TÃ­nh toÃ¡n tá»•ng tiá»n hÃ ng, tiá»n giáº£m giÃ¡ tá»« Coupon vÃ  táº¡m tÃ­nh phÃ­ giao hÃ ng.

#### FR-05: Quáº£n lÃ½ Sá»• Ä‘á»‹a chá»‰ Nháº­n hÃ ng (`user_addresses`)
- Cho phÃ©p lÆ°u trá»¯ nhiá»u Ä‘á»‹a chá»‰ nháº­n hÃ ng cho má»—i tÃ i khoáº£n.
- ThÃ´ng tin Ä‘á»‹a chá»‰ gá»“m: TÃªn ngÆ°á»i nháº­n, Sá»‘ Ä‘iá»‡n thoáº¡i, Tá»‰nh/ThÃ nh phá»‘, Quáº­n/Huyá»‡n, PhÆ°á»ng/XÃ£, Äá»‹a chá»‰ chi tiáº¿t.
- Cho phÃ©p chá»n 1 Ä‘á»‹a chá»‰ lÃ m **Äá»‹a chá»‰ máº·c Ä‘á»‹nh (`is_default = 1`)** Ä‘á»ƒ tá»± Ä‘á»™ng Ä‘iá»n khi thanh toÃ¡n.

#### FR-06: Äáº·t hÃ ng & Thanh toÃ¡n Äa phÆ°Æ¡ng thá»©c
- **Thanh toÃ¡n COD (Cash on Delivery):** Táº¡o Ä‘Æ¡n hÃ ng vá»›i tráº¡ng thÃ¡i `PENDING` (Chá» duyá»‡t), phÆ°Æ¡ng thá»©c `COD`.
- **Thanh toÃ¡n Tá»± Ä‘á»™ng PayOS (QR Code Banking):**
  - Há»‡ thá»‘ng gá»i PayOS API sinh mÃ£ QR thanh toÃ¡n Ä‘á»™ng chá»©a Ä‘Ãºng sá»‘ tiá»n Ä‘Æ¡n hÃ ng vÃ  ná»™i dung chuyá»ƒn khoáº£n mÃ£ Ä‘Æ¡n (`ORDER_XXXX`).
  - KhÃ¡ch hÃ ng thá»±c hiá»‡n quÃ©t mÃ£ QR qua á»©ng dá»¥ng NgÃ¢n hÃ ng (VietQR / Mobile Banking).
  - Webhook Backend nháº­n callback tá»« PayOS -> Tá»± Ä‘á»™ng xÃ¡c thá»±c chá»¯ kÃ½ báº£o máº­t (Checksum Signature) -> Chuyá»ƒn tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng sang `PAID` / `PROCESSING` mÃ  khÃ´ng cáº§n duyá»‡t thá»§ cÃ´ng.

#### FR-07: Lá»‹ch sá»­ ÄÆ¡n hÃ ng & ÄÃ¡nh giÃ¡ Sáº£n pháº©m
- Theo dÃµi danh sÃ¡ch Ä‘Æ¡n hÃ ng Ä‘Ã£ Ä‘áº·t theo cÃ¡c tráº¡ng thÃ¡i: *Chá» duyá»‡t, ÄÃ£ xÃ¡c nháº­n, Äang giao hÃ ng, ÄÃ£ giao thÃ nh cÃ´ng, ÄÃ£ há»§y*.
- Cho phÃ©p KhÃ¡ch hÃ ng **Há»§y Ä‘Æ¡n hÃ ng** náº¿u Ä‘Æ¡n hÃ ng Ä‘ang á»Ÿ tráº¡ng thÃ¡i `PENDING` (Chá» duyá»‡t).
- **ÄÃ¡nh giÃ¡ sáº£n pháº©m:** KhÃ¡ch hÃ ng chá»‰ Ä‘Æ°á»£c phÃ©p Ä‘Ã¡nh giÃ¡ (1-5 sao kÃ¨m ná»™i dung nháº­n xÃ©t) cho cÃ¡c sáº£n pháº©m thuá»™c Ä‘Æ¡n hÃ ng Ä‘Ã£ á»Ÿ tráº¡ng thÃ¡i `DELIVERED` (ÄÃ£ giao thÃ nh cÃ´ng).

#### FR-08: Danh sÃ¡ch Sáº£n pháº©m YÃªu thÃ­ch (Wishlist)
- ThÃªm/XÃ³a sáº£n pháº©m khá»i danh sÃ¡ch yÃªu thÃ­ch báº±ng biá»ƒu tÆ°á»£ng trÃ¡i tim.
- Xem danh sÃ¡ch sáº£n pháº©m yÃªu thÃ­ch vÃ  chuyá»ƒn nhanh vÃ o giá» hÃ ng.

---

### 2.3. PhÃ¢n há»‡ Quáº£n trá»‹ & NhÃ¢n viÃªn (Admin & Staff Portal)

#### FR-09: Quáº£n lÃ½ Sáº£n pháº©m & ThÆ° viá»‡n áº¢nh
- **CRUD Sáº£n pháº©m:** ThÃªm má»›i, chá»‰nh sá»­a thÃ´ng tin, áº©n/hiá»‡n sáº£n pháº©m hoáº·c xÃ³a sáº£n pháº©m.
- **Quáº£n lÃ½ ThÆ° viá»‡n áº£nh phá»¥ (`product_images`):** Táº£i lÃªn nhiá»u áº£nh chá»¥p gÃ³c chi tiáº¿t cá»§a sáº£n pháº©m, Ä‘Ã¡nh dáº¥u áº£nh chÃ­nh (`is_primary`) vÃ  sáº¯p xáº¿p thá»© tá»± hiá»ƒn thá»‹ (`display_order`).

#### FR-10: Quáº£n lÃ½ Biáº¿n thá»ƒ Sáº£n pháº©m (`product_variants`)
- Quáº£n lÃ½ chi tiáº¿t tá»«ng biáº¿n thá»ƒ MÃ u sáº¯c - KÃ­ch thÆ°á»›c (vÃ­ dá»¥: Ão sÆ¡ mi Tráº¯ng - Size L - SKU: SOMI-TRANG-L).
- Cáº­p nháº­t sá»‘ lÆ°á»£ng tá»“n kho (`quantity`) cho tá»«ng biáº¿n thá»ƒ cá»¥ thá»ƒ.
- Kiá»ƒm soÃ¡t cáº£nh bÃ¡o sáº£n pháº©m sáº¯p háº¿t hÃ ng trong kho.

#### FR-11: Quáº£n lÃ½ Danh má»¥c & Banners Quáº£ng cÃ¡o
- Táº¡o má»›i, sá»­a, xÃ³a danh má»¥c thá»i trang (Ão, Quáº§n, VÃ¡y, Phá»¥ kiá»‡n...).
- Quáº£n lÃ½ danh sÃ¡ch Banner hÃ¬nh áº£nh trÃªn trang chá»§, thiáº¿t láº­p liÃªn káº¿t Ä‘iá»u hÆ°á»›ng vÃ  thá»© tá»± xuáº¥t hiá»‡n.

#### FR-12: Quáº£n lÃ½ MÃ£ giáº£m giÃ¡ (Coupons)
- Táº¡o mÃ£ giáº£m giÃ¡ theo Sá»‘ tiá»n cá»‘ Ä‘á»‹nh (Fixed Amount) hoáº·c Theo pháº§n trÄƒm (Percentage - kÃ¨m sá»‘ tiá»n giáº£m tá»‘i Ä‘a).
- Thiáº¿t láº­p Ä‘iá»u kiá»‡n Ã¡p dá»¥ng: GiÃ¡ trá»‹ Ä‘Æ¡n hÃ ng tá»‘i thiá»ƒu, Sá»‘ láº§n sá»­ dá»¥ng tá»‘i Ä‘a cá»§a mÃ£ (`usage_limit`), Thá»i háº¡n hiá»‡u lá»±c (NgÃ y báº¯t Ä‘áº§u - NgÃ y káº¿t thÃºc).

#### FR-13: Quáº£n lÃ½ & Duyá»‡t ÄÆ¡n hÃ ng
- Xem danh sÃ¡ch táº¥t cáº£ Ä‘Æ¡n hÃ ng phÃ¡t sinh trÃªn toÃ n há»‡ thá»‘ng kÃ¨m bá»™ lá»c tráº¡ng thÃ¡i vÃ  lá»c theo ngÃ y.
- Cáº­p nháº­t tiáº¿n trÃ¬nh Ä‘Æ¡n hÃ ng: `PENDING` âž” `CONFIRMED` âž” `SHIPPING` âž” `DELIVERED` (hoáº·c `CANCELLED`).
- Xem chi tiáº¿t Ä‘Æ¡n hÃ ng (Sáº£n pháº©m Ä‘áº·t, biáº¿n thá»ƒ size/mÃ u, Ä‘á»‹a chá»‰ nháº­n hÃ ng, lá»‹ch sá»­ thanh toÃ¡n PayOS/COD).

#### FR-14: Quáº£n lÃ½ KhÃ¡ch hÃ ng & PhÃ¢n quyá»n
- Xem danh sÃ¡ch cÃ¡c tÃ i khoáº£n trong há»‡ thá»‘ng.
- Thá»±c hiá»‡n KhÃ³a tÃ i khoáº£n (`status = 0`) hoáº·c Má»Ÿ khÃ³a tÃ i khoáº£n Ä‘á»‘i vá»›i ngÆ°á»i dÃ¹ng vi pháº¡m Ä‘iá»u khoáº£n.

#### FR-15: BÃ¡o cÃ¡o Thá»‘ng kÃª Doanh thu & Kinh doanh
- Biá»ƒu Ä‘á»“ doanh thu theo thá»i gian (NgÃ y, Tuáº§n, ThÃ¡ng, NÄƒm) sá»­ dá»¥ng thÆ° viá»‡n Recharts.
- Thá»‘ng kÃª tá»•ng sá»‘ Ä‘Æ¡n hÃ ng, sá»‘ Ä‘Æ¡n há»§y, tá»•ng sá»‘ khÃ¡ch hÃ ng má»›i.
- Thá»‘ng kÃª Top sáº£n pháº©m bÃ¡n cháº¡y nháº¥t vÃ  thá»‘ng kÃª tá»“n kho theo danh má»¥c.

---

### 2.4. PhÃ¢n há»‡ Tá»± Ä‘á»™ng & Xá»­ lÃ½ Ngáº§m (Background & Integration)

#### FR-16: Xá»­ lÃ½ Webhook PayOS Tá»± Ä‘á»™ng
- Láº¯ng nghe sá»± kiá»‡n thanh toÃ¡n tá»« PayOS Webhook endpoint.
- Kiá»ƒm tra tÃ­nh há»£p lá»‡ cá»§a Webhook Data báº±ng `HMAC SHA256 Signature`.
- Tá»± Ä‘á»™ng cáº­p nháº­t `payment_status = PAID` vÃ  Ä‘áº©y Ä‘Æ¡n hÃ ng sang tiáº¿n trÃ¬nh xá»­ lÃ½ tá»± Ä‘á»™ng.

#### FR-17: Dá»‹ch vá»¥ Email ThÃ´ng bÃ¡o (SMTP Service)
- Tá»± Ä‘á»™ng gá»­i Email xÃ¡c nháº­n thÃ´ng tin Ä‘Æ¡n hÃ ng tá»›i khÃ¡ch hÃ ng ngay sau khi Ä‘áº·t hÃ ng thÃ nh cÃ´ng.
- Gá»­i Email mÃ£ OTP khÃ´i phá»¥c máº­t kháº©u khi ngÆ°á»i dÃ¹ng yÃªu cáº§u.

---

### 2.5. Ma tráº­n PhÃ¢n quyá»n TÃ¡c vá»¥ (RBAC Matrix)

| Chá»©c nÄƒng / HÃ nh Ä‘á»™ng | Guest | Customer | Staff | Admin |
|---|:---:|:---:|:---:|:---:|
| Xem danh sÃ¡ch & Chi tiáº¿t sáº£n pháº©m | âœ” | âœ” | âœ” | âœ” |
| TÃ¬m kiáº¿m & Lá»c sáº£n pháº©m | âœ” | âœ” | âœ” | âœ” |
| ThÃªm sáº£n pháº©m vÃ o Giá» hÃ ng | âœ” | âœ” | âœ” | âœ” |
| ÄÄƒng kÃ½ & ÄÄƒng nháº­p (Local/Google) | âœ” | âœ” | âœ” | âœ” |
| Quáº£n lÃ½ Há»“ sÆ¡ & Sá»• Ä‘á»‹a chá»‰ cÃ¡ nhÃ¢n | âŒ | âœ” | âœ” | âœ” |
| Äáº·t hÃ ng & Thanh toÃ¡n (COD / PayOS) | âŒ | âœ” | âœ” | âœ” |
| Xem Lá»‹ch sá»­ & Há»§y Ä‘Æ¡n hÃ ng cÃ¡ nhÃ¢n | âŒ | âœ” | âœ” | âœ” |
| Viáº¿t ÄÃ¡nh giÃ¡ / Cháº¥m sao sáº£n pháº©m | âŒ | âœ” (ÄÃ£ mua) | âŒ | âŒ |
| ThÃªm/XÃ³a danh sÃ¡ch YÃªu thÃ­ch (Wishlist) | âŒ | âœ” | âœ” | âœ” |
| Xem danh sÃ¡ch Ä‘Æ¡n hÃ ng toÃ n há»‡ thá»‘ng | âŒ | âŒ | âœ” | âœ” |
| Duyá»‡t & Cáº­p nháº­t tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng | âŒ | âŒ | âœ” | âœ” |
| Quáº£n lÃ½ Sáº£n pháº©m, Biáº¿n thá»ƒ & Danh má»¥c | âŒ | âŒ | âŒ | âœ” |
| Quáº£n lÃ½ MÃ£ giáº£m giÃ¡ (Coupons) & Banners | âŒ | âŒ | âŒ | âœ” |
| KhÃ³a/Má»Ÿ khÃ³a TÃ i khoáº£n ngÆ°á»i dÃ¹ng | âŒ | âŒ | âŒ | âœ” |
| Xem BÃ¡o cÃ¡o & Thá»‘ng kÃª Doanh thu | âŒ | âŒ | âŒ | âœ” |

---

## CHÆ¯Æ NG 3: YÃŠU Cáº¦U PHI CHá»¨C NÄ‚NG (NON-FUNCTIONAL REQUIREMENTS)

### 3.1. Hiá»‡u nÄƒng & Kháº£ nÄƒng má»Ÿ rá»™ng (Performance & Scalability)
- **Thá»i gian pháº£n há»“i API (Latency):** 95% cÃ¡c yÃªu cáº§u truy váº¥n API Ä‘á»c (Read Operations: láº¥y danh sÃ¡ch sáº£n pháº©m, chi tiáº¿t sáº£n pháº©m) Ä‘áº¡t thá»i gian pháº£n há»“i `< 150ms`. YÃªu cáº§u ghi (Write Operations: Ä‘áº·t hÃ ng, thanh toÃ¡n) Ä‘áº¡t `< 300ms`.
- **Táº£i trang Frontend (Page Load Time):** Trang chá»§ vÃ  trang danh má»¥c táº£i mÆ°á»£t mÃ  dÆ°á»›i `1.5 giÃ¢y` nhá» cÆ¡ cháº¿ Code-Splitting vÃ  Lazy Loading trong Vite / React.
- **Kháº£ nÄƒng chá»‹u táº£i (Concurrency):** Há»‡ thá»‘ng Ä‘Ã¡p á»©ng tá»‘i thiá»ƒu `500 ngÆ°á»i dÃ¹ng truy cáº­p Ä‘á»“ng thá»i` (Concurrent Users) mÃ  khÃ´ng gáº·p lá»—i ngháº½n giao dá»‹ch.

### 3.2. Báº£o máº­t & Máº­t mÃ£ (Security & Cryptography)
- **XÃ¡c thá»±c & PhÃ¢n quyá»n:** Sá»­ dá»¥ng chuáº©n `JSON Web Token (JWT)` ngáº«u nhiÃªn kÃ½ theo thuáº­t toÃ¡n HMAC-SHA512. PhÃ¢n quyá»n cháº·t cháº½ trÃªn Spring Security Filter Chain.
- **MÃ£ hÃ³a máº­t kháº©u:** Máº­t kháº©u ngÆ°á»i dÃ¹ng báº¯t buá»™c Ä‘Æ°á»£c bÄƒm báº±ng thuáº­t toÃ¡n `BCrypt` vá»›i Ä‘á»™ dÃ i Salt chuáº©n trÆ°á»›c khi lÆ°u trá»¯ dÆ°á»›i CSDL SQL Server.
- **Báº£o vá»‡ Dá»¯ liá»‡u API:** Chá»‘ng cÃ¡c nguy cÆ¡ táº¥n cÃ´ng nguy hiá»ƒm:
  - *SQL Injection:* Sá»­ dá»¥ng Hibernate JPA Parameterized Queries.
  - *Cross-Site Scripting (XSS):* Sanitization dá»¯ liá»‡u Ä‘áº§u vÃ o vÃ  React JSX Auto-Escaping.
  - *CORS (Cross-Origin Resource Sharing):* Cáº¥u hÃ¬nh chá»‰ cho phÃ©p cÃ¡c Domain chá»‰ Ä‘á»‹nh cá»§a Frontend gá»i API.
- **Checksum Webhook:** XÃ¡c minh chá»¯ kÃ½ báº£o máº­t (HMAC SHA256) trÃªn cÃ¡c dá»¯ liá»‡u nháº­n tá»« PayOS Webhook.

### 3.3. Äá»™ tin cáº­y & TÃ­nh sáºµn sÃ ng (Reliability & Availability)
- **Uptime:** Äáº£m báº£o há»‡ thá»‘ng Ä‘áº¡t Ä‘á»™ sáºµn sÃ ng `99.5%` thá»i gian hoáº¡t Ä‘á»™ng.
- **ToÃ n váº¹n Giao dá»‹ch (Transaction Integrity):** Táº¥t cáº£ cÃ¡c thao tÃ¡c Äáº·t hÃ ng âž” Trá»« tá»“n kho biáº¿n thá»ƒ âž” Ãp mÃ£ giáº£m giÃ¡ Ä‘Æ°á»£c bá»c trong `@Transactional` cá»§a Spring Boot, tuÃ¢n thá»§ nguyÃªn táº¯c **ACID**. Náº¿u phÃ¡t sinh lá»—i á»Ÿ báº¥t ká»³ bÆ°á»›c nÃ o, toÃ n bá»™ giao dá»‹ch sáº½ tá»± Ä‘á»™ng Rollback.
- **Xá»­ lÃ½ ngoáº¡i lá»‡ táº­p trung (Global Exception Handling):** Sá»­ dá»¥ng `@RestControllerAdvice` trong Spring Boot Ä‘á»ƒ báº¯t má»i ngoáº¡i lá»‡ vÃ  tráº£ vá» pháº£n há»“i lá»—i chuáº©n dáº¡ng JSON format (`timestamp`, `status`, `message`, `details`), trÃ¡nh rÃ² rá»‰ StackTrace ká»¹ thuáº­t ra bÃªn ngoÃ i.

### 3.4. Tráº£i nghiá»‡m ngÆ°á»i dÃ¹ng & Giao diá»‡n (Usability & UX)
- **Thiáº¿t káº¿ Responsive:** Giao diá»‡n tÆ°Æ¡ng thÃ­ch hoÃ n háº£o trÃªn cÃ¡c thiáº¿t bá»‹ Mobile (iOS/Android), Tablet vÃ  Desktop PC.
- **Thiáº¿t káº¿ Hiá»‡n Ä‘áº¡i (Modern UI Aesthetics):** Sá»­ dá»¥ng báº£ng mÃ u phá»‘i há»£p hÃ i hÃ²a, icon Lucide trá»±c quan, animation mÆ°á»£t mÃ  tá»« Framer Motion / Motion.
- **Pháº£n há»“i tá»©c thÃ¬ (Instant Feedback):** Táº¥t cáº£ hÃ nh Ä‘á»™ng cá»§a ngÆ°á»i dÃ¹ng (thÃªm giá» hÃ ng thÃ nh cÃ´ng, bÃ¡o lá»—i háº¿t hÃ ng, thanh toÃ¡n thÃ nh cÃ´ng) Ä‘á»u hiá»ƒn thá»‹ thÃ´ng bÃ¡o Sonner Toast trá»±c quan.

### 3.5. TÃ­nh báº£o trÃ¬ & Cáº¥u trÃºc MÃ£ nguá»“n (Maintainability)
- **Kiáº¿n trÃºc phÃ¢n táº§ng rÃµ rÃ ng (Layered Architecture):** MÃ£ nguá»“n Backend chia thÃ nh Controller - Service - Repository - DTO - Entity.
- **TÃ i liá»‡u hÃ³a API tá»± Ä‘á»™ng:** TÃ­ch há»£p `Springdoc OpenAPI 3 / Swagger UI` táº¡i Ä‘Æ°á»ng dáº«n `/swagger-ui.html` giÃºp láº­p trÃ¬nh viÃªn dá»… dÃ ng thá»­ nghiá»‡m API.
- **Quáº£n lÃ½ phiÃªn báº£n mÃ£ nguá»“n:** Sá»­ dá»¥ng Git theo mÃ´ hÃ¬nh phÃ¢n nhÃ¡nh chuáº©n (GitFlow / Feature Branch).

---

## CHÆ¯Æ NG 4: RÃ€NG BUá»˜C Ká»¸ THUáº¬T & TÃCH Há»¢P Há»† THá»NG

### 4.1. CÃ´ng nghá»‡ & MÃ´i trÆ°á»ng Triá»ƒn khai

#### Backend Tech Stack:
- **NgÃ´n ngá»¯ & Framework:** Java 17, Spring Boot 3.2.5
- **Security & Token:** Spring Security, io.jsonwebtoken (JJWT 0.11.5)
- **Data Access:** Spring Data JPA, Hibernate ORM
- **MÃ´ hÃ¬nh CSDL:** Microsoft SQL Server chuáº©n hÃ³a **43 báº£ng dá»¯ liá»‡u** thuá»™c 9 phÃ¢n há»‡ nghiá»‡p vá»¥ (TÃ i khoáº£n, Sáº£n pháº©m & Biáº¿n thá»ƒ, Giá» hÃ ng, ÄÆ¡n hÃ ng & PayOS, TÆ°Æ¡ng tÃ¡c & Livechat, Content Blog, Báº£o hÃ nh, Váº­n chuyá»ƒn & GPS, Báº£o máº­t & CRM).

#### Frontend Tech Stack:
- **Framework & Build tool:** React 18, Vite 6
- **Styling:** TailwindCSS 4, Radix UI / Shadcn Components
- **Icons & Motion:** Lucide-React, Framer Motion
- **Biá»ƒu Ä‘á»“:** Recharts
- **State & Routing:** React Router v7, React Hook Form

### 4.2. TÃ­ch há»£p Cá»•ng Thanh toÃ¡n PayOS API
- **Chuáº©n tÃ­ch há»£p:** RESTful API & Webhook Service cá»§a PayOS.
- **Quy trÃ¬nh:**
  1. Frontend gá»i Backend táº¡o Ä‘Æ¡n hÃ ng (`POST /api/v1/orders`).
  2. Backend khá»Ÿi táº¡o giao dá»‹ch PayOS qua API, nháº­n vá» `checkoutUrl` vÃ  chuá»—i `qrCode`.
  3. Frontend hiá»ƒn thá»‹ mÃ£ QR cho khÃ¡ch quÃ©t tiá»n.
  4. NgÃ¢n hÃ ng xÃ¡c nháº­n âž” PayOS Ä‘áº©y HTTP POST Webhook vá» Backend (`POST /api/v1/payments/payos-webhook`).
  5. Backend kiá»ƒm tra chá»¯ kÃ½ âž” Cáº­p nháº­t tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng.

### 4.3. TÃ­ch há»£p XÃ¡c thá»±c Google OAuth2
- Sá»­ dá»¥ng Google OAuth2 Client ID & Client Secret.
- Client React má»Ÿ há»™p thoáº¡i Ä‘Äƒng nháº­p Google âž” Láº¥y `id_token` / `access_token` âž” Gá»­i vá» Backend (`POST /api/v1/auth/google`).
- Backend xÃ¡c thá»±c token vá»›i Google Server, kiá»ƒm tra/táº¡o thÃ´ng tin ngÆ°á»i dÃ¹ng trong CSDL vÃ  tráº£ vá» JWT Session cá»§a há»‡ thá»‘ng.

### 4.4. TÃ­ch há»£p Dá»‹ch vá»¥ Email (Spring Mail / SMTP)
- Sá»­ dá»¥ng Gmail SMTP / Mailtrap Server Ä‘á»ƒ gá»­i email HTML Ä‘á»‹nh dáº¡ng Ä‘áº¹p.
- Email Ä‘Æ°á»£c gá»­i báº¥t Ä‘á»“ng bá»™ (Asynchronous processing `@Async`) Ä‘á»ƒ khÃ´ng lÃ m giÃ¡n Ä‘oáº¡n luá»“ng pháº£n há»“i API Ä‘áº¿n khÃ¡ch hÃ ng.

---

## CHÆ¯Æ NG 5: QUY TRÃŒNH NGHIá»†P Vá»¤ QUAN TRá»ŒNG

### 5.1. Quy trÃ¬nh Äáº·t hÃ ng & Thanh toÃ¡n PayOS QR Code

```mermaid
sequenceDiagram
    autonumber
    actor Customer as KhÃ¡ch hÃ ng
    participant FE as React Frontend
    participant BE as Spring Boot API
    participant DB as MS SQL Server
    participant PayOS as PayOS Gateway

    Customer->>FE: Báº¥m "Äáº·t hÃ ng & Thanh toÃ¡n QR"
    FE->>BE: POST /api/v1/orders (Äá»‹a chá»‰, MÃ£ Coupon, Danh sÃ¡ch biáº¿n thá»ƒ)
    BE->>DB: Kiá»ƒm tra tá»“n kho tá»«ng biáº¿n thá»ƒ trong product_variants
    alt Háº¿t hÃ ng
        BE-->>FE: Tráº£ lá»—i 400 (Sáº£n pháº©m X háº¿t hÃ ng)
        FE-->>Customer: Hiá»ƒn thá»‹ thÃ´ng bÃ¡o Toast lá»—i
    else CÃ²n Ä‘á»§ hÃ ng
        BE->>DB: Báº¯t Ä‘áº§u Transaction: Táº¡o Order + OrderDetails
        BE->>PayOS: Gá»i API táº¡o Payment Link (Sá»‘ tiá»n, MÃ£ Ä‘Æ¡n)
        PayOS-->>BE: Tráº£ vá» qrCode & checkoutUrl
        BE->>DB: Commit Transaction (Tráº¡ng thÃ¡i Ä‘Æ¡n PENDING)
        BE-->>FE: Tráº£ vá» thÃ´ng tin Ä‘Æ¡n hÃ ng + mÃ£ QR
        FE-->>Customer: Hiá»ƒn thá»‹ Modal QuÃ©t mÃ£ QR Banking
        
        Customer->>PayOS: Chuyá»ƒn khoáº£n ngÃ¢n hÃ ng qua mÃ£ QR
        PayOS->>BE: Gá»­i Webhook callback (Data + Signature)
        BE->>BE: XÃ¡c minh Checksum Signature
        BE->>DB: Update status Order = PAID / PROCESSING
        BE-->>PayOS: Tráº£ vá» HTTP 200 OK
        FE->>BE: Polling / Websocket kiá»ƒm tra tráº¡ng thÃ¡i Ä‘Æ¡n
        BE-->>FE: Tráº¡ng thÃ¡i ÄÃ£ thanh toÃ¡n!
        FE-->>Customer: Chuyá»ƒn hÆ°á»›ng sang trang ThÃ nh cÃ´ng (Order Success)
    end
```

---

### 5.2. Quy trÃ¬nh Kiá»ƒm tra & Cáº­p nháº­t Tá»“n kho Biáº¿n thá»ƒ

```mermaid
flowchart TD
    A[KhÃ¡ch hÃ ng thÃªm sáº£n pháº©m vÃ o Giá» / Äáº·t hÃ ng] --> B{Kiá»ƒm tra variant_id}
    B -->|Truy váº¥n CSDL| C[Láº¥y quantity trong product_variants]
    C --> D{Sá»‘ lÆ°á»£ng yÃªu cáº§u <= Tá»“n kho?}
    D -- KhÃ´ng --> E[Tá»« chá»‘i giao dá»‹ch & BÃ¡o lá»—i quÃ¡ sá»‘ lÆ°á»£ng cho phÃ©p]
    D -- CÃ³ --> F[Khá»Ÿi táº¡o Transaction Äáº·t hÃ ng]
    F --> G[Táº¡m trá»« tá»“n kho: quantity = quantity - requested_qty]
    G --> H{Thanh toÃ¡n / Äáº·t Ä‘Æ¡n thÃ nh cÃ´ng?}
    H -- CÃ³ --> I[XÃ¡c nháº­n trá»« kho vÄ©nh viá»…n & Chuyá»ƒn Ä‘Æ¡n sang Processing]
    H -- Há»§y Ä‘Æ¡n / QuÃ¡ giá» thanh toÃ¡n --> J[HoÃ n tráº£ tá»“n kho: quantity = quantity + requested_qty]
```

---

## Lá»œI Káº¾T & ÄÃNH GIÃ TÃNH KHáº¢ THI

TÃ i liá»‡u **PhÃ¢n tÃ­ch YÃªu cáº§u Há»‡ thá»‘ng FoxStyle** nÃ y cung cáº¥p gÃ³c nhÃ¬n toÃ n diá»‡n, cháº·t cháº½ vÃ  chuáº©n hÃ³a tá»« má»©c Ä‘á»™ tá»•ng quan Ä‘áº¿n Ä‘áº·c táº£ chi tiáº¿t tá»«ng chá»©c nÄƒng nghiá»‡p vá»¥, ma tráº­n phÃ¢n quyá»n, yÃªu cáº§u phi chá»©c nÄƒng vÃ  kiáº¿n trÃºc ká»¹ thuáº­t tÃ­ch há»£p. 

TÃ i liá»‡u phá»¥c vá»¥ lÃ m cÆ¡ sá»Ÿ Ä‘á»‘i chiáº¿u cho quÃ¡ trÃ¬nh phÃ¡t triá»ƒn mÃ£ nguá»“n, kiá»ƒm thá»­ há»‡ thá»‘ng (Test Cases) cÅ©ng nhÆ° viáº¿t bÃ¡o cÃ¡o Äá»“ Ã¡n Tá»‘t nghiá»‡p chuyÃªn nghiá»‡p.
