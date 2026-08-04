# TÃ€I LIá»†U VÃ€ Báº¢NG KIá»‚M THá»¬ PHáº¦N Má»€M FOXSTYLE (CHECKLIST & TEST CASES)
## Dá»± Ã¡n: Há»‡ thá»‘ng ThÆ°Æ¡ng máº¡i Äiá»‡n tá»­ Thá»i trang FoxStyle
**MÃ£ dá»± Ã¡n:** FOXSTYLE-DATN  
**NgÃ y cáº­p nháº­t:** 31/07/2026  
**Tráº¡ng thÃ¡i:** TÃ€I LIá»†U CHÃNH THá»¨C BÃO CÃO Äá»’ ÃN  

---

## Má»¤C Lá»¤C
- [PHáº¦N 1: Báº¢NG CHECKLIST KIá»‚M THá»¬ CHá»¨C NÄ‚NG (60 CHECKLIST ITEMS)](#pháº§n-1-báº£ng-checklist-kiá»ƒm-thá»­-chá»©c-nÄƒng-60-checklist-items)
- [PHáº¦N 2: Báº¢NG TEST CASE CHá»¨C NÄ‚NG CHI TIáº¾T (87 FUNCTIONAL TEST CASES)](#pháº§n-2-báº£ng-test-case-chá»©c-nÄƒng-chi-tiáº¿t-87-functional-test-cases)
  - [2.1. PhÃ¢n há»‡ XÃ¡c thá»±c & Quáº£n lÃ½ TÃ i khoáº£n (TC-001 âž” TC-018)](#21-phÃ¢n-há»‡-xÃ¡c-thá»±c--quáº£n-lÃ½-tÃ i-khoáº£n-tc-001--tc-018)
  - [2.2. PhÃ¢n há»‡ Sáº£n pháº©m, Biáº¿n thá»ƒ Kho & Danh má»¥c (TC-019 âž” TC-039)](#22-phÃ¢n-há»‡-sáº£n-pháº©m-biáº¿n-thá»ƒ-kho--danh-má»¥c-tc-019--tc-039)
  - [2.3. PhÃ¢n há»‡ Giá» hÃ ng, Äáº·t hÃ ng & PayOS QR (TC-040 âž” TC-065)](#23-phÃ¢n-há»‡-giá»-hÃ ng-Ä‘áº·t-hÃ ng--payos-qr-tc-040--tc-065)
  - [2.4. PhÃ¢n há»‡ TÆ°Æ¡ng tÃ¡c KhÃ¡ch hÃ ng, CSKH & Wishlist (TC-066 âž” TC-071)](#24-phÃ¢n-há»‡-tÆ°Æ¡ng-tÃ¡c-khÃ¡ch-hÃ ng-cskh--wishlist-tc-066--tc-071)
  - [2.5. PhÃ¢n há»‡ Quáº£n trá»‹ Admin, Staff & Audit Logs (TC-072 âž” TC-087)](#25-phÃ¢n-há»‡-quáº£n-trá»‹-admin-staff--audit-logs-tc-072--tc-087)
- [PHáº¦N 3: Báº¢NG TEST CASE PHI CHá»¨C NÄ‚NG (15 NON-FUNCTIONAL TEST CASES)](#pháº§n-3-báº£ng-test-case-phi-chá»©c-nÄƒng-15-non-functional-test-cases)
- [PHáº¦N 4: BÃO CÃO Tá»”NG Há»¢P Káº¾T QUáº¢ VÃ€ TRáº NG THÃI KIá»‚M THá»¬](#pháº§n-4-bÃ¡o-cÃ¡o-tá»•ng-há»£p-káº¿t-quáº£-vÃ -tráº¡ng-thÃ¡i-kiá»ƒm-thá»­)

---

## PHáº¦N 1: Báº¢NG CHECKLIST KIá»‚M THá»¬ CHá»¨C NÄ‚NG (60 CHECKLIST ITEMS)

*Ghi chÃº: Báº£ng Checklist liá»‡t kÃª 60 háº¡ng má»¥c tiÃªu chÃ­ kiá»ƒm tra Ä‘á»™c láº­p theo 20 Chá»©c nÄƒng nghiá»‡p vá»¥ cá»§a á»©ng dá»¥ng FoxStyle.*

| STT | MÃ£ Chá»©c nÄƒng | TÃªn Chá»©c nÄƒng Nghiá»‡p vá»¥ | TiÃªu chÃ­ Kiá»ƒm tra (Checklist Items) | Tráº¡ng thÃ¡i | Ghi chÃº / ÄÃ¡nh giÃ¡ |
|:---:|:---:|---|---|:---:|---|
| 1 | **FN-01** | ÄÄƒng kÃ½ TÃ i khoáº£n Má»›i | Kiá»ƒm tra validate Ä‘á»‹nh dáº¡ng Email (Regex standard) | **Äáº T (PASS)** | Email há»£p lá»‡ |
| 2 | **FN-01** | ÄÄƒng kÃ½ TÃ i khoáº£n Má»›i | Kiá»ƒm tra validate Ä‘á»™ dÃ i Máº­t kháº©u tá»‘i thiá»ƒu 6 kÃ½ tá»± | **Äáº T (PASS)** | Máº­t kháº©u ngáº¯n bá»‹ cháº·n |
| 3 | **FN-01** | ÄÄƒng kÃ½ TÃ i khoáº£n Má»›i | Kiá»ƒm tra validate Username chá»©a kÃ½ tá»± Ä‘áº·c biá»‡t | **Äáº T (PASS)** | BÃ¡o lá»—i kÃ½ tá»± khÃ´ng há»£p lá»‡ |
| 4 | **FN-01** | ÄÄƒng kÃ½ TÃ i khoáº£n Má»›i | Kiá»ƒm tra trÃ¹ng láº·p Username trong CSDL users | **Äáº T (PASS)** | BÃ¡o lá»—i HTTP 400 |
| 5 | **FN-01** | ÄÄƒng kÃ½ TÃ i khoáº£n Má»›i | Kiá»ƒm tra trÃ¹ng láº·p Email trong CSDL users | **Äáº T (PASS)** | BÃ¡o lá»—i HTTP 400 |
| 6 | **FN-01** | ÄÄƒng kÃ½ TÃ i khoáº£n Má»›i | Kiá»ƒm tra mÃ£ hÃ³a bÄƒm máº­t kháº©u BCrypt trong SQL Server | **Äáº T (PASS)** | MÃ£ hÃ³a bÄƒm an toÃ n |
| 7 | **FN-02** | ÄÄƒng nháº­p Local (JWT) | Kiá»ƒm tra Ä‘Äƒng nháº­p vá»›i Username & Password chÃ­nh xÃ¡c | **Äáº T (PASS)** | Cáº¥p JWT Token 24h |
| 8 | **FN-02** | ÄÄƒng nháº­p Local (JWT) | Kiá»ƒm tra Ä‘Äƒng nháº­p vá»›i Máº­t kháº©u sai | **Äáº T (PASS)** | BÃ¡o lá»—i HTTP 400 |
| 9 | **FN-02** | ÄÄƒng nháº­p Local (JWT) | Kiá»ƒm tra Ä‘Äƒng nháº­p Username khÃ´ng tá»“n táº¡i | **Äáº T (PASS)** | BÃ¡o lá»—i HTTP 400 |
| 10 | **FN-02** | ÄÄƒng nháº­p Local (JWT) | Kiá»ƒm tra Ä‘Äƒng nháº­p TÃ i khoáº£n bá»‹ khÃ³a (status=0) | **Äáº T (PASS)** | BÃ¡o lá»—i HTTP 403 |
| 11 | **FN-02** | ÄÄƒng nháº­p Local (JWT) | Kiá»ƒm tra ÄÄƒng xuáº¥t thu há»“i session táº¡i localStorage | **Äáº T (PASS)** | XÃ³a token client thÃ nh cÃ´ng |
| 12 | **FN-03** | ÄÄƒng nháº­p Google OAuth2 | Kiá»ƒm tra hiá»ƒn thá»‹ Google Sign-In Popup SDK | **Äáº T (PASS)** | Popup hiá»ƒn thá»‹ mÆ°á»£t |
| 13 | **FN-03** | ÄÄƒng nháº­p Google OAuth2 | Kiá»ƒm tra tá»± táº¡o tÃ i khoáº£n má»›i náº¿u email Google chÆ°a cÃ³ | **Äáº T (PASS)** | Tá»± táº¡o user ROLE_CUSTOMER |
| 14 | **FN-03** | ÄÄƒng nháº­p Google OAuth2 | Kiá»ƒm tra Ä‘Äƒng nháº­p Google vá»›i email Ä‘Ã£ tá»“n táº¡i | **Äáº T (PASS)** | Map vÃ o tÃ i khoáº£n cÅ© |
| 15 | **FN-04** | QuÃªn máº­t kháº©u qua OTP | Kiá»ƒm tra gá»­i mÃ£ OTP 6 sá»‘ vá» Email ngÆ°á»i dÃ¹ng qua Gmail SMTP | **Äáº T (PASS)** | Email OTP gá»­i thÃ nh cÃ´ng |
| 16 | **FN-04** | QuÃªn máº­t kháº©u qua OTP | Kiá»ƒm tra gá»­i OTP cho Email khÃ´ng cÃ³ trong há»‡ thá»‘ng | **Äáº T (PASS)** | BÃ¡o lá»—i Email khÃ´ng tá»“n táº¡i |
| 17 | **FN-04** | QuÃªn máº­t kháº©u qua OTP | Kiá»ƒm tra thá»i gian háº¿t háº¡n OTP trong 5 phÃºt | **Äáº T (PASS)** | OTP quÃ¡ 5 phÃºt bá»‹ há»§y |
| 18 | **FN-04** | QuÃªn máº­t kháº©u qua OTP | Kiá»ƒm tra Ä‘á»•i máº­t kháº©u thÃ nh cÃ´ng khi nháº­p OTP Ä‘Ãºng | **Äáº T (PASS)** | Cáº­p nháº­t pass BCrypt má»›i |
| 19 | **FN-05** | Lá»c & TÃ¬m kiáº¿m Sáº£n pháº©m | Kiá»ƒm tra tÃ¬m kiáº¿m tá»« khÃ³a tÃªn sáº£n pháº©m gáº§n Ä‘Ãºng | **Äáº T (PASS)** | Tráº£ vá» danh sÃ¡ch khá»›p |
| 20 | **FN-05** | Lá»c & TÃ¬m kiáº¿m Sáº£n pháº©m | Kiá»ƒm tra lá»c theo Danh má»¥c thá»i trang | **Äáº T (PASS)** | Lá»c Ä‘Ãºng danh má»¥c |
| 21 | **FN-05** | Lá»c & TÃ¬m kiáº¿m Sáº£n pháº©m | Kiá»ƒm tra lá»c theo Khoáº£ng giÃ¡ (min_price..max_price) | **Äáº T (PASS)** | Lá»c giÃ¡ chuáº©n xÃ¡c |
| 22 | **FN-05** | Lá»c & TÃ¬m kiáº¿m Sáº£n pháº©m | Kiá»ƒm tra lá»c theo thuá»™c tÃ­nh Size (S, M, L, XL) | **Äáº T (PASS)** | Lá»c Ä‘Ãºng Size biáº¿n thá»ƒ |
| 23 | **FN-05** | Lá»c & TÃ¬m kiáº¿m Sáº£n pháº©m | Kiá»ƒm tra lá»c theo thuá»™c tÃ­nh MÃ u sáº¯c | **Äáº T (PASS)** | Lá»c Ä‘Ãºng MÃ u biáº¿n thá»ƒ |
| 24 | **FN-05** | Lá»c & TÃ¬m kiáº¿m Sáº£n pháº©m | Kiá»ƒm tra káº¿t há»£p Ä‘á»“ng thá»i 4 tiÃªu chÃ­ lá»c | **Äáº T (PASS)** | Lá»c realtime mÆ°á»£t mÃ  |
| 25 | **FN-06** | Chi tiáº¿t & Biáº¿n thá»ƒ Kho | Kiá»ƒm tra xem gallery thÆ° viá»‡n áº£nh phá»¥ gÃ³c nhÃ¬n | **Äáº T (PASS)** | Chuyá»ƒn áº£nh phá»¥ mÆ°á»£t mÃ  |
| 26 | **FN-06** | Chi tiáº¿t & Biáº¿n thá»ƒ Kho | Kiá»ƒm tra chá»n MÃ u sáº¯c & Size cÃ²n hÃ ng âž” Hiá»‡n sá»‘ lÆ°á»£ng kho | **Äáº T (PASS)** | Hiá»‡n Ä‘Ãºng tá»“n kho |
| 27 | **FN-06** | Chi tiáº¿t & Biáº¿n thá»ƒ Kho | Kiá»ƒm tra chá»n MÃ u sáº¯c & Size háº¿t hÃ ng (quantity=0) | **Äáº T (PASS)** | VÃ´ hiá»‡u hÃ³a nÃºt Mua |
| 28 | **FN-07** | Quáº£n lÃ½ Giá» hÃ ng | Kiá»ƒm tra thÃªm sáº£n pháº©m biáº¿n thá»ƒ vÃ o giá» hÃ ng | **Äáº T (PASS)** | Cáº­p nháº­t giá» thÃ nh cÃ´ng |
| 29 | **FN-07** | Quáº£n lÃ½ Giá» hÃ ng | Kiá»ƒm tra cá»™ng dá»“n sá»‘ lÆ°á»£ng khi thÃªm trÃ¹ng biáº¿n thá»ƒ | **Äáº T (PASS)** | Cá»™ng dá»“n sá»‘ lÆ°á»£ng chuáº©n |
| 30 | **FN-07** | Quáº£n lÃ½ Giá» hÃ ng | Kiá»ƒm tra cáº­p nháº­t tÄƒng/giáº£m sá»‘ lÆ°á»£ng trong giá» | **Äáº T (PASS)** | TÃ­nh láº¡i tá»•ng tiá»n |
| 31 | **FN-07** | Quáº£n lÃ½ Giá» hÃ ng | Kiá»ƒm tra cáº­p nháº­t sá»‘ lÆ°á»£ng vÆ°á»£t tá»“n kho kháº£ dá»¥ng | **Äáº T (PASS)** | BÃ¡o lá»—i vÆ°á»£t quÃ¡ tá»“n kho |
| 32 | **FN-07** | Quáº£n lÃ½ Giá» hÃ ng | Kiá»ƒm tra xÃ³a 1 máº·t hÃ ng khá»i giá» hÃ ng | **Äáº T (PASS)** | XÃ³a máº·t hÃ ng thÃ nh cÃ´ng |
| 33 | **FN-07** | Quáº£n lÃ½ Giá» hÃ ng | Kiá»ƒm tra xÃ³a sáº¡ch giá» hÃ ng (Clear Cart) | **Äáº T (PASS)** | Giá» hÃ ng trá»‘ng hoÃ n toÃ n |
| 34 | **FN-08** | Sá»• Ä‘á»‹a chá»‰ Giao hÃ ng | Kiá»ƒm tra thÃªm Ä‘á»‹a chá»‰ nháº­n hÃ ng má»›i | **Äáº T (PASS)** | LÆ°u Ä‘á»‹a chá»‰ thÃ nh cÃ´ng |
| 35 | **FN-08** | Sá»• Ä‘á»‹a chá»‰ Giao hÃ ng | Kiá»ƒm tra thiáº¿t láº­p Ä‘á»‹a chá»‰ lÃ m máº·c Ä‘á»‹nh (is_default=1) | **Äáº T (PASS)** | Bá» máº·c Ä‘á»‹nh Ä‘á»‹a chá»‰ cÅ© |
| 36 | **FN-08** | Sá»• Ä‘á»‹a chá»‰ Giao hÃ ng | Kiá»ƒm tra xÃ³a Ä‘á»‹a chá»‰ khá»i sá»• Ä‘á»‹a chá»‰ | **Äáº T (PASS)** | XÃ³a Ä‘á»‹a chá»‰ thÃ nh cÃ´ng |
| 37 | **FN-09** | Äáº·t hÃ ng & PayOS QR | Kiá»ƒm tra Ä‘áº·t hÃ ng COD há»£p lá»‡ @Transactional | **Äáº T (PASS)** | Trá»« kho & táº¡o Ä‘Æ¡n PENDING |
| 38 | **FN-09** | Äáº·t hÃ ng & PayOS QR | Kiá»ƒm tra chá»n thanh toÃ¡n VietQR PayOS | **Äáº T (PASS)** | Sinh VietQR link thÃ nh cÃ´ng |
| 39 | **FN-09** | Äáº·t hÃ ng & PayOS QR | Kiá»ƒm tra Webhook PayOS gá»­i callback há»£p lá»‡ | **Äáº T (PASS)** | Tá»± Ä‘á»™ng Ä‘á»•i Ä‘Æ¡n sang PAID |
| 40 | **FN-09** | Äáº·t hÃ ng & PayOS QR | Kiá»ƒm tra Webhook PayOS sai chá»¯ kÃ½ HMAC SHA256 | **Äáº T (PASS)** | Cháº·n Webhook giáº£ máº¡o |
| 41 | **FN-10** | Lá»‹ch sá»­ ÄÆ¡n & Há»§y Ä‘Æ¡n | Kiá»ƒm tra xem danh sÃ¡ch lá»‹ch sá»­ Ä‘Æ¡n hÃ ng cÃ¡ nhÃ¢n | **Äáº T (PASS)** | Hiá»ƒn thá»‹ Ä‘Ãºng Ä‘Æ¡n Ä‘áº·t |
| 42 | **FN-10** | Lá»‹ch sá»­ ÄÆ¡n & Há»§y Ä‘Æ¡n | Kiá»ƒm tra xem chi tiáº¿t tá»«ng máº·t hÃ ng trong Ä‘Æ¡n | **Äáº T (PASS)** | Hiá»ƒn thá»‹ chi tiáº¿t chuáº©n |
| 43 | **FN-10** | Lá»‹ch sá»­ ÄÆ¡n & Há»§y Ä‘Æ¡n | Kiá»ƒm tra há»§y Ä‘Æ¡n hÃ ng PENDING & hoÃ n tráº£ tá»“n kho | **Äáº T (PASS)** | Cá»™ng láº¡i sá»‘ lÆ°á»£ng kho |
| 44 | **FN-10** | Lá»‹ch sá»­ ÄÆ¡n & Há»§y Ä‘Æ¡n | Kiá»ƒm tra cá»‘ tÃ¬nh há»§y Ä‘Æ¡n hÃ ng SHIPPING / DELIVERED | **Äáº T (PASS)** | Cháº·n há»§y Ä‘Æ¡n thÃ nh cÃ´ng |
| 45 | **FN-11** | Wishlist & ÄÃ¡nh giÃ¡ | Kiá»ƒm tra tháº£ tim thÃªm sáº£n pháº©m vÃ o Wishlist | **Äáº T (PASS)** | ThÃªm Wishlist thÃ nh cÃ´ng |
| 46 | **FN-11** | Wishlist & ÄÃ¡nh giÃ¡ | Kiá»ƒm tra báº¥m trÃ¡i tim xÃ³a sáº£n pháº©m khá»i Wishlist | **Äáº T (PASS)** | XÃ³a Wishlist thÃ nh cÃ´ng |
| 47 | **FN-11** | Wishlist & ÄÃ¡nh giÃ¡ | Kiá»ƒm tra viáº¿t Ä‘Ã¡nh giÃ¡ 5 sao cho sáº£n pháº©m Ä‘Æ¡n DELIVERED | **Äáº T (PASS)** | Hiá»ƒn thá»‹ review cÃ´ng khai |
| 48 | **FN-11** | Wishlist & ÄÃ¡nh giÃ¡ | Kiá»ƒm tra viáº¿t Ä‘Ã¡nh giÃ¡ chá»©a tá»« tá»¥c tÄ©u âž” Tá»± Ä‘á»™ng áº©n | **THáº¤T Báº I (FAIL)** | PhÃ¡t hiá»‡n bug: ChÆ°a lá»c tá»« tá»¥c |
| 49 | **FN-11** | Wishlist & ÄÃ¡nh giÃ¡ | Kiá»ƒm tra viáº¿t Ä‘Ã¡nh giÃ¡ cho sáº£n pháº©m chÆ°a mua | **THáº¤T Báº I (FAIL)** | PhÃ¡t hiá»‡n bug: ChÆ°a cháº·n review |
| 50 | **FN-12** | Admin Quáº£n lÃ½ Sáº£n pháº©m | Kiá»ƒm tra Admin thÃªm sáº£n pháº©m kÃ¨m thÆ° viá»‡n áº£nh Cloudinary | **Äáº T (PASS)** | ThÃªm sáº£n pháº©m thÃ nh cÃ´ng |
| 51 | **FN-12** | Admin Quáº£n lÃ½ Sáº£n pháº©m | Kiá»ƒm tra Admin sá»­a thÃ´ng tin sáº£n pháº©m vÃ  giÃ¡ niÃªm yáº¿t | **Äáº T (PASS)** | Cáº­p nháº­t sáº£n pháº©m OK |
| 52 | **FN-12** | Admin Quáº£n lÃ½ Sáº£n pháº©m | Kiá»ƒm tra Admin áº©n sáº£n pháº©m (status=0) | **Äáº T (PASS)** | áº¨n khá»i trang Storefront |
| 53 | **FN-13** | Admin Biáº¿n thá»ƒ Kho | Kiá»ƒm tra cáº¥u hÃ¬nh biáº¿n thá»ƒ Size/MÃ u/SKU má»›i | **Äáº T (PASS)** | ThÃªm biáº¿n thá»ƒ thÃ nh cÃ´ng |
| 54 | **FN-13** | Admin Biáº¿n thá»ƒ Kho | Kiá»ƒm tra thÃªm mÃ£ SKU trÃ¹ng láº·p | **Äáº T (PASS)** | BÃ¡o lá»—i SKU Ä‘Ã£ tá»“n táº¡i |
| 55 | **FN-13** | Admin Biáº¿n thá»ƒ Kho | Kiá»ƒm tra cáº­p nháº­t tÄƒng sá»‘ lÆ°á»£ng nháº­p kho biáº¿n thá»ƒ | **Äáº T (PASS)** | Cáº­p nháº­t tá»“n kho chuáº©n |
| 56 | **FN-14** | Admin Danh má»¥c & Banner | Kiá»ƒm tra thÃªm má»›i danh má»¥c thá»i trang | **Äáº T (PASS)** | Táº¡o danh má»¥c thÃ nh cÃ´ng |
| 57 | **FN-14** | Admin Danh má»¥c & Banner | Kiá»ƒm tra thÃªm banner quáº£ng cÃ¡o trang chá»§ | **Äáº T (PASS)** | Banner hiá»ƒn thá»‹ mÆ°á»£t |
| 58 | **FN-15** | MÃ£ giáº£m giÃ¡ Coupon | Kiá»ƒm tra Ã¡p dá»¥ng coupon cá»‘ Ä‘á»‹nh & pháº§n trÄƒm | **Äáº T (PASS)** | Trá»« tiá»n giáº£m giÃ¡ Ä‘Ãºng |
| 59 | **FN-15** | MÃ£ giáº£m giÃ¡ Coupon | Kiá»ƒm tra Ã¡p dá»¥ng coupon háº¿t háº¡n / háº¿t lÆ°á»£t dÃ¹ng | **Äáº T (PASS)** | BÃ¡o lá»—i coupon khÃ´ng há»£p lá»‡ |
| 60 | **FN-18** | Admin Quáº£n lÃ½ User | Kiá»ƒm tra Admin khÃ³a tÃ i khoáº£n vi pháº¡m (status=0) | **Äáº T (PASS)** | Thu há»“i token JWT ngay |

---

## PHáº¦N 2: Báº¢NG TEST CASE CHá»¨C NÄ‚NG CHI TIáº¾T (87 FUNCTIONAL TEST CASES)

*Ghi chÃº: Báº£ng Test Cases chi tiáº¿t gá»“m MÃ£ Test Case, TÃªn/Má»¥c Ä‘Ã­ch, Tiá»n Ä‘iá»u kiá»‡n, CÃ¡c bÆ°á»›c thá»±c hiá»‡n, Káº¿t quáº£ Mong Ä‘á»£i, Káº¿t quáº£ Thá»±c táº¿ vÃ  Tráº¡ng thÃ¡i Äáº¡t (PASS) / Tháº¥t báº¡i (FAIL).*

### 2.1. PhÃ¢n há»‡ XÃ¡c thá»±c & Quáº£n lÃ½ TÃ i khoáº£n (TC-001 âž” TC-018)

| MÃ£ Test Case | TÃªn / Má»¥c Ä‘Ã­ch Kiá»ƒm thá»­ | Tiá»n Ä‘iá»u kiá»‡n | CÃ¡c bÆ°á»›c thá»±c hiá»‡n (Test Steps) | Káº¿t quáº£ Mong Ä‘á»£i (Expected Result) | Káº¿t quáº£ Thá»±c táº¿ (Actual Result) | Tráº¡ng thÃ¡i (Status) |
|:---:|---|---|---|---|---|:---:|
| **TC-001** | ÄÄƒng kÃ½ thÃ nh cÃ´ng tÃ i khoáº£n há»£p lá»‡ | KhÃ¡ch chÆ°a Ä‘Äƒng nháº­p | 1. Nháº­p Username nguyenvana, Email a@gmail.com, Pass 123456.<br>2. Báº¥m ÄÄƒng kÃ½. | Táº¡o user má»›i, bÄƒm BCrypt, role=ROLE_CUSTOMER. Tráº£ vá» 201. | Táº¡o tÃ i khoáº£n thÃ nh cÃ´ng, pass bÄƒm BCrypt. Tráº£ vá» HTTP 201. | **Äáº T (PASS)** |
| **TC-002** | ÄÄƒng kÃ½ tháº¥t báº¡i do trÃ¹ng Username | ÄÃ£ cÃ³ user nguyenvana | 1. Nháº­p Username nguyenvana, Email b@gmail.com.<br>2. Báº¥m ÄÄƒng kÃ½. | BÃ¡o lá»—i Username Ä‘Ã£ Ä‘Æ°á»£c sá»­ dá»¥ng. Tráº£ vá» HTTP 400. | BÃ¡o lá»—i Username Ä‘Ã£ Ä‘Æ°á»£c sá»­ dá»¥ng. Tráº£ vá» HTTP 400. | **Äáº T (PASS)** |
| **TC-003** | ÄÄƒng kÃ½ tháº¥t báº¡i do trÃ¹ng Email | ÄÃ£ cÃ³ email a@gmail.com | 1. Nháº­p Username user_new, Email a@gmail.com.<br>2. Báº¥m ÄÄƒng kÃ½. | BÃ¡o lá»—i Email Ä‘Ã£ Ä‘Æ°á»£c Ä‘Äƒng kÃ½. Tráº£ vá» HTTP 400. | BÃ¡o lá»—i Email Ä‘Ã£ Ä‘Æ°á»£c sá»­ dá»¥ng. Tráº£ vá» HTTP 400. | **Äáº T (PASS)** |
| **TC-004** | ÄÄƒng kÃ½ tháº¥t báº¡i do Máº­t kháº©u quÃ¡ ngáº¯n | KhÃ¡ch chÆ°a Ä‘Äƒng nháº­p | 1. Nháº­p Pass '123'.<br>2. Báº¥m ÄÄƒng kÃ½. | BÃ¡o lá»—i Máº­t kháº©u pháº£i cÃ³ Ã­t nháº¥t 6 kÃ½ tá»±. Tráº£ vá» HTTP 400. | Client & Server validate cháº·n thÃ nh cÃ´ng. Tráº£ vá» HTTP 400. | **Äáº T (PASS)** |
| **TC-005** | ÄÄƒng kÃ½ tháº¥t báº¡i do Email sai Ä‘á»‹nh dáº¡ng | KhÃ¡ch chÆ°a Ä‘Äƒng nháº­p | 1. Nháº­p Email 'nguyenvana@com'.<br>2. Báº¥m ÄÄƒng kÃ½. | BÃ¡o lá»—i Email khÃ´ng Ä‘Ãºng Ä‘á»‹nh dáº¡ng. Tráº£ vá» HTTP 400. | BÃ¡o lá»—i Email sai Ä‘á»‹nh dáº¡ng. Tráº£ vá» HTTP 400. | **Äáº T (PASS)** |
| **TC-006** | ÄÄƒng nháº­p thÃ nh cÃ´ng vá»›i thÃ´ng tin Ä‘Ãºng | User nguyenvana active | 1. Nháº­p nguyenvana & Pass 123456.<br>2. Báº¥m ÄÄƒng nháº­p. | Cáº¥p JWT Token (háº¡n 24h) lÆ°u vÃ o localStorage. Tráº£ vá» 200. | Tráº£ vá» JWT Token há»£p lá»‡, lÆ°u localStorage. Tráº£ vá» 200. | **Äáº T (PASS)** |
| **TC-007** | ÄÄƒng nháº­p tháº¥t báº¡i do Sai Máº­t kháº©u | User nguyenvana active | 1. Nháº­p nguyenvana & Pass sai_pass.<br>2. Báº¥m ÄÄƒng nháº­p. | BÃ¡o lá»—i TÃ i khoáº£n hoáº·c máº­t kháº©u sai. Tráº£ vá» HTTP 400. | BÃ¡o lá»—i TÃ i khoáº£n/Máº­t kháº©u sai. Tráº£ vá» HTTP 400. | **Äáº T (PASS)** |
| **TC-008** | ÄÄƒng nháº­p tháº¥t báº¡i Username khÃ´ng tá»“n táº¡i | ChÆ°a cÃ³ user_ghost | 1. Nháº­p user_ghost & Pass 123456.<br>2. Báº¥m ÄÄƒng nháº­p. | BÃ¡o lá»—i TÃ i khoáº£n hoáº·c máº­t kháº©u sai. Tráº£ vá» HTTP 400. | BÃ¡o lá»—i TÃ i khoáº£n/Máº­t kháº©u sai. Tráº£ vá» HTTP 400. | **Äáº T (PASS)** |
| **TC-009** | ÄÄƒng nháº­p tháº¥t báº¡i do TÃ i khoáº£n Bá»‹ khÃ³a | User status=0 | 1. Nháº­p user bá»‹ khÃ³a & Pass Ä‘Ãºng.<br>2. Báº¥m ÄÄƒng nháº­p. | Cháº·n Ä‘Äƒng nháº­p, bÃ¡o lá»—i TÃ i khoáº£n bá»‹ khÃ³a. Tráº£ vá» HTTP 403. | BÃ¡o lá»—i TÃ i khoáº£n cá»§a báº¡n Ä‘Ã£ bá»‹ khÃ³a. Tráº£ vá» HTTP 403. | **Äáº T (PASS)** |
| **TC-010** | ÄÄƒng xuáº¥t tÃ i khoáº£n thu há»“i Session | ÄÃ£ Ä‘Äƒng nháº­p | 1. Báº¥m nÃºt ÄÄƒng xuáº¥t. | XÃ³a JWT Token khá»i localStorage, reset AuthContext vá» Guest. | XÃ³a token client thÃ nh cÃ´ng, Ä‘Äƒng xuáº¥t an toÃ n. | **Äáº T (PASS)** |
| **TC-011** | ÄÄƒng nháº­p Google vá»›i email má»›i | ÄÃ£ báº­t Google SDK | 1. Báº¥m ÄÄƒng nháº­p vá»›i Google.<br>2. Chá»n email g_new@gmail.com. | XÃ¡c thá»±c Token, tá»± táº¡o user má»›i ROLE_CUSTOMER, phÃ¡t hÃ nh JWT. | Tá»± Ä‘á»™ng táº¡o user má»›i vÃ  Ä‘Äƒng nháº­p thÃ nh cÃ´ng. | **Äáº T (PASS)** |
| **TC-012** | ÄÄƒng nháº­p Google vá»›i email Ä‘Ã£ tá»“n táº¡i | ÄÃ£ cÃ³ user g_old@gmail.com | 1. Báº¥m ÄÄƒng nháº­p vá»›i Google.<br>2. Chá»n email g_old@gmail.com. | Map vÃ o tÃ i khoáº£n cÅ©, phÃ¡t hÃ nh JWT Token há»‡ thá»‘ng. | ÄÄƒng nháº­p vÃ o tÃ i khoáº£n cÅ© thÃ nh cÃ´ng. | **Äáº T (PASS)** |
| **TC-013** | ÄÄƒng nháº­p Google vá»›i ID Token giáº£ máº¡o | SDK gá»­i fake token | 1. Send request POST /api/v1/auth/google token giáº£. | Backend verify tháº¥t báº¡i, bÃ¡o lá»—i Token khÃ´ng há»£p lá»‡. Tráº£ 400. | Verify token Google tháº¥t báº¡i. Tráº£ vá» HTTP 400. | **Äáº T (PASS)** |
| **TC-014** | Gá»­i mÃ£ OTP vá» Email khÃ´i phá»¥c thÃ nh cÃ´ng | Email a@gmail.com active | 1. Nháº­p a@gmail.com táº¡i QuÃªn máº­t kháº©u.<br>2. Báº¥m Gá»­i OTP. | Sinh OTP 6 sá»‘ (háº¡n 5m) vÃ  gá»­i Email xÃ¡c nháº­n qua Gmail SMTP. | ÄÃ£ nháº­n Email OTP 6 sá»‘ thÃ nh cÃ´ng trong 15s. | **Äáº T (PASS)** |
| **TC-015** | Gá»­i OTP cho Email khÃ´ng cÃ³ trong há»‡ thá»‘ng | ChÆ°a cÃ³ email noexist@g.com | 1. Nháº­p noexist@g.com.<br>2. Báº¥m Gá»­i OTP. | BÃ¡o lá»—i Email khÃ´ng tá»“n táº¡i trong há»‡ thá»‘ng. Tráº£ vá» HTTP 400. | BÃ¡o lá»—i Email khÃ´ng tá»“n táº¡i. Tráº£ vá» HTTP 400. | **Äáº T (PASS)** |
| **TC-016** | Nháº­p mÃ£ OTP Ä‘Ãºng vÃ  Ä‘á»•i máº­t kháº©u má»›i | OTP 6 sá»‘ há»£p lá»‡ | 1. Nháº­p mÃ£ OTP Ä‘Ãºng & Pass má»›i 'newpass123'.<br>2. Báº¥m XÃ¡c nháº­n. | Cáº­p nháº­t máº­t kháº©u bÄƒm BCrypt má»›i, vÃ´ hiá»‡u hÃ³a OTP. Tráº£ vá» 200. | Äá»•i máº­t kháº©u thÃ nh cÃ´ng, Ä‘Äƒng nháº­p pass má»›i OK. | **Äáº T (PASS)** |
| **TC-017** | Nháº­p mÃ£ OTP sai | OTP trong DB lÃ  123456 | 1. Nháº­p mÃ£ OTP '999999'.<br>2. Báº¥m XÃ¡c nháº­n. | BÃ¡o lá»—i MÃ£ OTP khÃ´ng chÃ­nh xÃ¡c. Tráº£ vá» HTTP 400. | BÃ¡o lá»—i MÃ£ OTP khÃ´ng chÃ­nh xÃ¡c. Tráº£ vá» HTTP 400. | **Äáº T (PASS)** |
| **TC-018** | Nháº­p mÃ£ OTP Ä‘Ã£ quÃ¡ 5 phÃºt háº¿t háº¡n | OTP Ä‘Ã£ háº¿t háº¡n | 1. Chá» quÃ¡ 5 phÃºt âž” Nháº­p OTP.<br>2. Báº¥m XÃ¡c nháº­n. | BÃ¡o lá»—i MÃ£ OTP Ä‘Ã£ háº¿t háº¡n sá»­ dá»¥ng. Tráº£ vá» HTTP 400. | BÃ¡o lá»—i MÃ£ OTP Ä‘Ã£ háº¿t háº¡n. Tráº£ vá» HTTP 400. | **Äáº T (PASS)** |

### 2.2. PhÃ¢n há»‡ Sáº£n pháº©m, Biáº¿n thá»ƒ Kho & Danh má»¥c (TC-019 âž” TC-039)

| MÃ£ Test Case | TÃªn / Má»¥c Ä‘Ã­ch Kiá»ƒm thá»­ | Tiá»n Ä‘iá»u kiá»‡n | CÃ¡c bÆ°á»›c thá»±c hiá»‡n (Test Steps) | Káº¿t quáº£ Mong Ä‘á»£i (Expected Result) | Káº¿t quáº£ Thá»±c táº¿ (Actual Result) | Tráº¡ng thÃ¡i (Status) |
|:---:|---|---|---|---|---|:---:|
| **TC-019** | TÃ¬m kiáº¿m sáº£n pháº©m theo tá»« khÃ³a tÃªn | CSDL cÃ³ Ão sÆ¡ mi nam | 1. Nháº­p tá»« 'sÆ¡ mi' vÃ o Ã´ TÃ¬m kiáº¿m.<br>2. Báº¥m Enter. | Hiá»ƒn thá»‹ danh sÃ¡ch sáº£n pháº©m cÃ³ tÃªn chá»©a 'sÆ¡ mi'. Tráº£ vá» 200. | Hiá»ƒn thá»‹ Ä‘Ãºng 5 sáº£n pháº©m sÆ¡ mi. Tráº£ vá» HTTP 200. | **Äáº T (PASS)** |
| **TC-020** | Lá»c sáº£n pháº©m theo Danh má»¥c thá»i trang | CSDL cÃ³ danh má»¥c Ão khoÃ¡c | 1. Chá»n Danh má»¥c 'Ão khoÃ¡c'. | Hiá»ƒn thá»‹ táº¥t cáº£ sáº£n pháº©m thuá»™c danh má»¥c Ão khoÃ¡c. | Danh sÃ¡ch lá»c chuáº©n theo danh má»¥c Ão khoÃ¡c. | **Äáº T (PASS)** |
| **TC-021** | Lá»c sáº£n pháº©m theo Khoáº£ng giÃ¡ min-max | CSDL cÃ³ giÃ¡ tá»« 100k-1tr | 1. Nháº­p minPrice 200.000Ä‘ & maxPrice 500.000Ä‘. | Hiá»ƒn thá»‹ cÃ¡c sáº£n pháº©m cÃ³ giÃ¡ trong khoáº£ng 200k-500k. | Lá»c giÃ¡ chÃ­nh xÃ¡c 100%. | **Äáº T (PASS)** |
| **TC-022** | Lá»c sáº£n pháº©m theo Size vÃ  MÃ u sáº¯c | Biáº¿n thá»ƒ Size L MÃ u Äen | 1. Chá»n Size 'L' vÃ  MÃ u 'Äen'. | Hiá»ƒn thá»‹ cÃ¡c sáº£n pháº©m cÃ³ biáº¿n thá»ƒ Size L MÃ u Äen. | Lá»c chuáº©n xÃ¡c biáº¿n thá»ƒ Size L MÃ u Äen. | **Äáº T (PASS)** |
| **TC-023** | Káº¿t há»£p Ä‘á»“ng thá»i 4 tiÃªu chÃ­ lá»c khÃ´ng reload | CSDL cÃ³ dá»¯ liá»‡u | 1. Lá»c Danh má»¥c + GiÃ¡ + Size + MÃ u. | Lá»c sáº£n pháº©m realtime khá»›p 100% táº¥t cáº£ tiÃªu chÃ­. | Káº¿t quáº£ lá»c chÃ­nh xÃ¡c mÆ°á»£t mÃ  khÃ´ng reload. | **Äáº T (PASS)** |
| **TC-024** | TÃ¬m kiáº¿m khÃ´ng tÃ¬m tháº¥y sáº£n pháº©m | Tá»« khÃ³a 'XYZ999' | 1. Nháº­p tá»« 'XYZ999'.<br>2. Báº¥m TÃ¬m kiáº¿m. | Hiá»ƒn thá»‹ thÃ´ng bÃ¡o 'KhÃ´ng tÃ¬m tháº¥y sáº£n pháº©m phÃ¹ há»£p'. | Hiá»ƒn thá»‹ UI Empty State thÃ´ng bÃ¡o chuáº©n. | **Äáº T (PASS)** |
| **TC-025** | Xem chi tiáº¿t sáº£n pháº©m vÃ  thÆ° viá»‡n áº£nh phá»¥ | Sáº£n pháº©m ID=10 | 1. VÃ o trang Chi tiáº¿t sáº£n pháº©m ID=10. | Hiá»ƒn thá»‹ thÃ´ng tin, giÃ¡, mÃ´ táº£ vÃ  slide áº£nh phá»¥ gÃ³c nhÃ¬n. | Slide gallery áº£nh gÃ³c phá»¥ chuyá»ƒn mÆ°á»£t mÃ . | **Äáº T (PASS)** |
| **TC-026** | Chá»n biáº¿n thá»ƒ MÃ u/Size cÃ²n hÃ ng | Biáº¿n thá»ƒ quantity=15 | 1. Chá»n MÃ u 'Tráº¯ng' & Size 'M'. | Hiá»ƒn thá»‹ tá»“n kho kháº£ dá»¥ng cÃ²n 15 sáº£n pháº©m, nÃºt Mua active. | Hiá»ƒn thá»‹ sá»‘ lÆ°á»£ng tá»“n kho kháº£ dá»¥ng 15 chuáº©n. | **Äáº T (PASS)** |
| **TC-027** | Chá»n biáº¿n thá»ƒ MÃ u/Size háº¿t hÃ ng | Biáº¿n thá»ƒ quantity=0 | 1. Chá»n MÃ u 'Äen' & Size 'XL'. | Hiá»ƒn thá»‹ Háº¿t hÃ ng (kho=0) vÃ  vÃ´ hiá»‡u hÃ³a nÃºt ThÃªm vÃ o giá». | NÃºt ThÃªm vÃ o giá» bá»‹ vÃ´ hiá»‡u hÃ³a chÃ­nh xÃ¡c. | **Äáº T (PASS)** |
| **TC-028** | Chá»n sá»‘ lÆ°á»£ng mua há»£p lá»‡ | Kho cÃ²n 10 | 1. Chá»n Sá»‘ lÆ°á»£ng mua = 3. | Tá»•ng tiá»n táº¡m tÃ­nh cáº­p nháº­t = GiÃ¡ x 3. | Tá»•ng tiá»n táº¡m tÃ­nh tÃ­nh chuáº©n xÃ¡c. | **Äáº T (PASS)** |
| **TC-029** | Nháº­p sá»‘ lÆ°á»£ng mua Ã¢m hoáº·c = 0 | Form chi tiáº¿t | 1. Nháº­p Sá»‘ lÆ°á»£ng = -1 hoáº·c 0. | BÃ¡o lá»—i Sá»‘ lÆ°á»£ng mua pháº£i lá»›n hÆ¡n 0. | Validate cháº·n sá»‘ lÆ°á»£ng Ã¢m thÃ nh cÃ´ng. | **Äáº T (PASS)** |
| **TC-030** | ThÃªm sáº£n pháº©m biáº¿n thá»ƒ vÃ o giá» hÃ ng | ÄÃ£ Ä‘Äƒng nháº­p Customer | 1. Chá»n Size M, MÃ u Tráº¯ng, Qty=2.<br>2. Báº¥m ThÃªm giá». | Sáº£n pháº©m Ä‘Æ°á»£c thÃªm vÃ o giá». Badge giá» hÃ ng cáº­p nháº­t. | ThÃªm vÃ o giá» thÃ nh cÃ´ng, Badge hiá»ƒn thá»‹ +1. | **Äáº T (PASS)** |
| **TC-031** | Cá»™ng dá»“n sá»‘ lÆ°á»£ng khi thÃªm trÃ¹ng biáº¿n thá»ƒ | Giá» Ä‘Ã£ cÃ³ 2 mÃ³n biáº¿n thá»ƒ X | 1. Chá»n biáº¿n thá»ƒ X, Qty=3.<br>2. Báº¥m ThÃªm giá». | Sá»‘ lÆ°á»£ng biáº¿n thá»ƒ X trong giá» cá»™ng dá»“n thÃ nh 5. | Sá»‘ lÆ°á»£ng trong giá» cá»™ng dá»“n thÃ nh 5 chÃ­nh xÃ¡c. | **Äáº T (PASS)** |
| **TC-032** | Cáº­p nháº­t tÄƒng/giáº£m sá»‘ lÆ°á»£ng trong giá» | Giá» cÃ³ 3 mÃ³n | 1. Báº¥m nÃºt (+) Ä‘á»ƒ tÄƒng sá»‘ lÆ°á»£ng lÃªn 4. | Sá»‘ lÆ°á»£ng cáº­p nháº­t thÃ nh 4, tá»•ng tiá»n giá» tÃ­nh láº¡i. | Sá»‘ lÆ°á»£ng tÄƒng 4, tá»•ng tiá»n cáº­p nháº­t Ä‘Ãºng. | **Äáº T (PASS)** |
| **TC-033** | Cáº­p nháº­t sá»‘ lÆ°á»£ng giá» vÆ°á»£t tá»“n kho | Tá»“n kho kháº£ dá»¥ng = 4 | 1. Nháº­p Sá»‘ lÆ°á»£ng = 10 trong giá». | BÃ¡o lá»—i Sá»‘ lÆ°á»£ng sáº£n pháº©m trong kho khÃ´ng Ä‘á»§ (chá»‰ cÃ²n 4). | BÃ¡o lá»—i vÆ°á»£t tá»“n kho thÃ nh cÃ´ng. Tráº£ 400. | **Äáº T (PASS)** |
| **TC-034** | XÃ³a 1 máº·t hÃ ng khá»i giá» hÃ ng | Giá» cÃ³ 2 máº·t hÃ ng | 1. Báº¥m icon XÃ³a táº¡i máº·t hÃ ng 1. | Máº·t hÃ ng 1 bá»‹ xÃ³a khá»i giá», tÃ­nh láº¡i tá»•ng tiá»n giá». | XÃ³a máº·t hÃ ng 1 thÃ nh cÃ´ng. | **Äáº T (PASS)** |
| **TC-035** | XÃ³a toÃ n bá»™ giá» hÃ ng (Clear Cart) | Giá» cÃ³ 3 máº·t hÃ ng | 1. Báº¥m nÃºt 'XÃ³a toÃ n bá»™ giá» hÃ ng'. | Giá» hÃ ng lÃ m sáº¡ch hoÃ n toÃ n, hiá»ƒn thá»‹ Empty Cart UI. | Giá» hÃ ng sáº¡ch hoÃ n toÃ n thÃ nh cÃ´ng. | **Äáº T (PASS)** |
| **TC-036** | ThÃªm Ä‘á»‹a chá»‰ nháº­n hÃ ng má»›i | ÄÃ£ Ä‘Äƒng nháº­p Customer | 1. Nháº­p TÃªn, SÄT, Tá»‰nh, Quáº­n, XÃ£, Äá»‹a chá»‰ nhÃ .<br>2. Báº¥m LÆ°u. | Äá»‹a chá»‰ má»›i Ä‘Æ°á»£c lÆ°u vÃ o user_addresses. Tráº£ 201. | Táº¡o Ä‘á»‹a chá»‰ nháº­n hÃ ng má»›i thÃ nh cÃ´ng. | **Äáº T (PASS)** |
| **TC-037** | Thiáº¿t láº­p Ä‘á»‹a chá»‰ lÃ m máº·c Ä‘á»‹nh | ÄÃ£ cÃ³ 2 Ä‘á»‹a chá»‰ | 1. Chá»n Äá»‹a chá»‰ 2 âž” Báº¥m 'Äáº·t lÃ m máº·c Ä‘á»‹nh'. | Äá»‹a chá»‰ 2 chuyá»ƒn is_default=1, Ä‘á»‹a chá»‰ 1 chuyá»ƒn is_default=0. | Chuyá»ƒn Ä‘á»‹a chá»‰ máº·c Ä‘á»‹nh chÃ­nh xÃ¡c. | **Äáº T (PASS)** |
| **TC-038** | Sá»­a thÃ´ng tin Ä‘á»‹a chá»‰ giao hÃ ng | ÄÃ£ cÃ³ Ä‘á»‹a chá»‰ ID=5 | 1. Sá»­a SÄT ngÆ°á»i nháº­n Ä‘á»‹a chá»‰ ID=5.<br>2. Báº¥m LÆ°u. | Cáº­p nháº­t SÄT má»›i trong user_addresses thÃ nh cÃ´ng. | Sá»­a Ä‘á»‹a chá»‰ thÃ nh cÃ´ng. | **Äáº T (PASS)** |
| **TC-039** | XÃ³a Ä‘á»‹a chá»‰ nháº­n hÃ ng khá»i sá»• | ÄÃ£ cÃ³ Ä‘á»‹a chá»‰ ID=6 | 1. Báº¥m nÃºt XÃ³a Ä‘á»‹a chá»‰ ID=6. | Äá»‹a chá»‰ ID=6 bá»‹ xÃ³a khá»i CSDL user_addresses. | XÃ³a Ä‘á»‹a chá»‰ thÃ nh cÃ´ng. | **Äáº T (PASS)** |

### 2.3. PhÃ¢n há»‡ Giá» hÃ ng, Äáº·t hÃ ng & PayOS QR (TC-040 âž” TC-065)

| MÃ£ Test Case | TÃªn / Má»¥c Ä‘Ã­ch Kiá»ƒm thá»­ | Tiá»n Ä‘iá»u kiá»‡n | CÃ¡c bÆ°á»›c thá»±c hiá»‡n (Test Steps) | Káº¿t quáº£ Mong Ä‘á»£i (Expected Result) | Káº¿t quáº£ Thá»±c táº¿ (Actual Result) | Tráº¡ng thÃ¡i (Status) |
|:---:|---|---|---|---|---|:---:|
| **TC-040** | Äáº·t hÃ ng COD há»£p lá»‡ thÃ nh cÃ´ng | Giá» hÃ ng cÃ³ 2 mÃ³n | 1. Chá»n Äá»‹a chá»‰ & PhÆ°Æ¡ng thá»©c COD.<br>2. Báº¥m Äáº·t hÃ ng. | @Transactional: Trá»« kho biáº¿n thá»ƒ, xÃ³a giá», táº¡o Ä‘Æ¡n PENDING UNPAID. | Táº¡o Ä‘Æ¡n PENDING thÃ nh cÃ´ng, trá»« kho Ä‘Ãºng. | **Äáº T (PASS)** |
| **TC-041** | Äáº·t hÃ ng khi 1 biáº¿n thá»ƒ vá»«a bá»‹ háº¿t hÃ ng | Biáº¿n thá»ƒ X kho=0 | 1. Báº¥m Äáº·t hÃ ng khi mÃ³n X vá»«a háº¿t kho. | Transaction rollback, bÃ¡o lá»—i Sáº£n pháº©m X Ä‘Ã£ háº¿t hÃ ng. | Rollback transaction & bÃ¡o lá»—i há»£p lá»‡. | **Äáº T (PASS)** |
| **TC-042** | Äáº·t hÃ ng thanh toÃ¡n VietQR PayOS | Giá» hÃ ng cÃ³ 1 mÃ³n | 1. Chá»n Thanh toÃ¡n PayOS -> Báº¥m Äáº·t hÃ ng. | Sinh mÃ£ VietQR Code link chá»©a Ä‘Ãºng mÃ£ Ä‘Æ¡n & tiá»n. | Hiá»ƒn thá»‹ Modal VietQR Code thÃ nh cÃ´ng. | **Äáº T (PASS)** |
| **TC-043** | PayOS Webhook Ä‘á»‘i soÃ¡t tá»± Ä‘á»™ng thÃ nh cÃ´ng | ÄÆ¡n PayOS UNPAID | 1. PayOS gá»­i Webhook callback há»£p lá»‡ khi khÃ¡ch chuyá»ƒn khoáº£n. | XÃ¡c minh HMAC SHA256 Signature, tá»± Ä‘á»•i Ä‘Æ¡n sang PAID & PROCESSING. | Webhook Ä‘á»‘i soÃ¡t tá»± Ä‘á»™ng chuyá»ƒn PAID thÃ nh cÃ´ng. | **Äáº T (PASS)** |
| **TC-044** | PayOS Webhook bá»‹ cháº·n do sai chá»¯ kÃ½ | Payload bá»‹ fake | 1. Gá»­i Webhook callback vá»›i signature sai. | Backend cháº·n Webhook giáº£ máº¡o, giá»¯ nguyÃªn Ä‘Æ¡n UNPAID. Tráº£ 400. | Cháº·n Webhook giáº£ máº¡o thÃ nh cÃ´ng. Tráº£ 400. | **Äáº T (PASS)** |
| **TC-045** | Xem danh sÃ¡ch lá»‹ch sá»­ Ä‘Æ¡n hÃ ng cÃ¡ nhÃ¢n | ÄÃ£ Ä‘Äƒng nháº­p Customer | 1. Truy cáº­p má»¥c 'Lá»‹ch sá»­ Ä‘Æ¡n hÃ ng'. | Hiá»ƒn thá»‹ táº¥t cáº£ Ä‘Æ¡n hÃ ng phÃ¢n loáº¡i theo tráº¡ng thÃ¡i. | Hiá»ƒn thá»‹ danh sÃ¡ch Ä‘Æ¡n hÃ ng chÃ­nh xÃ¡c. | **Äáº T (PASS)** |
| **TC-046** | Xem chi tiáº¿t 1 Ä‘Æ¡n hÃ ng Ä‘Ã£ Ä‘áº·t | ÄÃ£ cÃ³ Ä‘Æ¡n ORD-123 | 1. Báº¥m 'Xem chi tiáº¿t' Ä‘Æ¡n ORD-123. | Hiá»ƒn thá»‹ chi tiáº¿t mÃ³n, giÃ¡, Ä‘á»‹a chá»‰ giao vÃ  phÆ°Æ¡ng thá»©c thanh toÃ¡n. | Hiá»ƒn thá»‹ chi tiáº¿t Ä‘Æ¡n hÃ ng chuáº©n. | **Äáº T (PASS)** |
| **TC-047** | Há»§y Ä‘Æ¡n hÃ ng PENDING thÃ nh cÃ´ng | ÄÆ¡n tráº¡ng thÃ¡i PENDING | 1. Báº¥m 'Há»§y Ä‘Æ¡n' âž” Nháº­p lÃ½ do há»§y. | Cáº­p nháº­t status=CANCELLED, tá»± Ä‘á»™ng hoÃ n tráº£ sá»‘ lÆ°á»£ng tá»“n kho biáº¿n thá»ƒ. | Há»§y Ä‘Æ¡n PENDING vÃ  hoÃ n tá»“n kho thÃ nh cÃ´ng. | **Äáº T (PASS)** |
| **TC-048** | Cá»‘ tÃ¬nh há»§y Ä‘Æ¡n hÃ ng Ä‘ang SHIPPING | ÄÆ¡n status=SHIPPING | 1. Báº¥m Há»§y Ä‘Æ¡n hÃ ng Ä‘ang giao. | BÃ¡o lá»—i ÄÆ¡n hÃ ng Ä‘ang giao khÃ´ng thá»ƒ há»§y. Tráº£ 400 Bad Request. | Cháº·n há»§y Ä‘Æ¡n Ä‘ang giao thÃ nh cÃ´ng. Tráº£ 400. | **Äáº T (PASS)** |
| **TC-049** | Cá»‘ tÃ¬nh há»§y Ä‘Æ¡n hÃ ng Ä‘Ã£ DELIVERED | ÄÆ¡n status=DELIVERED | 1. Báº¥m Há»§y Ä‘Æ¡n hÃ ng Ä‘Ã£ giao. | BÃ¡o lá»—i ÄÆ¡n hÃ ng Ä‘Ã£ giao thÃ nh cÃ´ng khÃ´ng thá»ƒ há»§y. Tráº£ 400. | Cháº·n há»§y Ä‘Æ¡n Ä‘Ã£ giao thÃ nh cÃ´ng. Tráº£ 400. | **Äáº T (PASS)** |
| **TC-050** | Ãp dá»¥ng mÃ£ coupon cá»‘ Ä‘á»‹nh há»£p lá»‡ | Coupon FIX50k giáº£m 50k | 1. Nháº­p mÃ£ FIX50k táº¡i Checkout.<br>2. Báº¥m Ãp dá»¥ng. | Tá»•ng tiá»n Ä‘Æ¡n giáº£m Ä‘Ãºng 50.000Ä‘. Cáº­p nháº­t finalAmount. | Giáº£m giÃ¡ 50k chÃ­nh xÃ¡c. | **Äáº T (PASS)** |
| **TC-051** | Ãp dá»¥ng mÃ£ coupon pháº§n trÄƒm 10% | Coupon PERC10 giáº£m 10% | 1. Nháº­p mÃ£ PERC10 táº¡i Checkout.<br>2. Báº¥m Ãp dá»¥ng. | Giáº£m 10% tá»•ng giÃ¡ trá»‹ Ä‘Æ¡n (tá»‘i Ä‘a theo háº¡n má»©c). | Giáº£m 10% tá»•ng tiá»n chuáº©n. | **Äáº T (PASS)** |
| **TC-052** | Ãp dá»¥ng coupon chÆ°a Ä‘á»§ min order value | Min order 500k, Ä‘Æ¡n 300k | 1. Nháº­p coupon min 500k vÃ o Ä‘Æ¡n 300k. | BÃ¡o lá»—i ÄÆ¡n hÃ ng chÆ°a Ä‘áº¡t giÃ¡ trá»‹ tá»‘i thiá»ƒu 500.000Ä‘. Tráº£ 400. | BÃ¡o lá»—i Ä‘Æ¡n chÆ°a Ä‘á»§ giÃ¡ trá»‹ min thÃ nh cÃ´ng. | **Äáº T (PASS)** |
| **TC-053** | Ãp dá»¥ng coupon Ä‘Ã£ háº¿t háº¡n sá»­ dá»¥ng | Coupon háº¿t háº¡n | 1. Nháº­p mÃ£ coupon Ä‘Ã£ háº¿t háº¡n. | BÃ¡o lá»—i MÃ£ giáº£m giÃ¡ Ä‘Ã£ háº¿t háº¡n sá»­ dá»¥ng. Tráº£ 400 Bad Request. | BÃ¡o lá»—i coupon háº¿t háº¡n thÃ nh cÃ´ng. Tráº£ 400. | **Äáº T (PASS)** |
| **TC-054** | Ãp dá»¥ng coupon Ä‘Ã£ háº¿t lÆ°á»£t sá»­ dá»¥ng | used_count >= limit | 1. Nháº­p mÃ£ coupon Ä‘Ã£ dÃ¹ng háº¿t lÆ°á»£t. | BÃ¡o lá»—i MÃ£ giáº£m giÃ¡ Ä‘Ã£ háº¿t lÆ°á»£t sá»­ dá»¥ng. Tráº£ 400 Bad Request. | BÃ¡o lá»—i coupon háº¿t lÆ°á»£t thÃ nh cÃ´ng. Tráº£ 400. | **Äáº T (PASS)** |
| **TC-055** | Tháº£ tim thÃªm sáº£n pháº©m vÃ o Wishlist | ÄÃ£ Ä‘Äƒng nháº­p Customer | 1. Báº¥m icon TrÃ¡i tim táº¡i Sáº£n pháº©m A. | Sáº£n pháº©m A Ä‘Æ°á»£c lÆ°u vÃ o wishlists. Icon tim Ä‘á»•i mÃ u Ä‘á». | ThÃªm sáº£n pháº©m A vÃ o Wishlist thÃ nh cÃ´ng. | **Äáº T (PASS)** |
| **TC-056** | Báº¥m trÃ¡i tim xÃ³a khá»i Wishlist | Sáº£n pháº©m A Ä‘ang á»Ÿ Wishlist | 1. Báº¥m láº¡i icon TrÃ¡i tim táº¡i Sáº£n pháº©m A. | Sáº£n pháº©m A bá»‹ xÃ³a khá»i wishlists. Icon tim trá»Ÿ vá» má». | XÃ³a khá»i Wishlist thÃ nh cÃ´ng. | **Äáº T (PASS)** |
| **TC-057** | Viáº¿t Ä‘Ã¡nh giÃ¡ 5 sao cho Ä‘Æ¡n DELIVERED | ÄÆ¡n Ä‘Ã£ giao DELIVERED | 1. Chá»n 5 sao & Nháº­p 'Sáº£n pháº©m ráº¥t Ä‘áº¹p'.<br>2. Báº¥m Gá»­i. | LÆ°u review status=1, hiá»ƒn thá»‹ cÃ´ng khai á»Ÿ trang chi tiáº¿t sáº£n pháº©m. | LÆ°u Ä‘Ã¡nh giÃ¡ 5 sao cÃ´ng khai thÃ nh cÃ´ng. | **Äáº T (PASS)** |
| **TC-058** | Viáº¿t Ä‘Ã¡nh giÃ¡ chá»©a tá»« ngá»¯ tá»¥c tÄ©u | ÄÆ¡n Ä‘Ã£ giao DELIVERED | 1. Nháº­p bÃ¬nh luáº­n chá»©a tá»« thÃ´ tá»¥c.<br>2. Báº¥m Gá»­i. | Há»‡ thá»‘ng tá»± Ä‘á»™ng áº©n hoáº·c gáº¯n cá» kiá»ƒm duyá»‡t (status=0). | PHÃT HIá»†N BUG: ChÆ°a cÃ³ bá»™ lá»c tá»« ngá»¯ thÃ´ tá»¥c! | **THáº¤T Báº I (FAIL)** |
| **TC-059** | Viáº¿t Ä‘Ã¡nh giÃ¡ cho sáº£n pháº©m chÆ°a tá»«ng mua | ChÆ°a tá»«ng mua sáº£n pháº©m B | 1. Send POST /api/v1/reviews sáº£n pháº©m B. | BÃ¡o lá»—i Báº¡n chá»‰ Ä‘Æ°á»£c Ä‘Ã¡nh giÃ¡ sáº£n pháº©m Ä‘Ã£ mua (HTTP 403). | PHÃT HIá»†N BUG: API cho phÃ©p review sáº£n pháº©m chÆ°a mua! | **THáº¤T Báº I (FAIL)** |
| **TC-060** | Upload áº£nh thá»±c táº¿ trong Ä‘Ã¡nh giÃ¡ sáº£n pháº©m | ÄÆ¡n DELIVERED | 1. ÄÃ­nh kÃ¨m 2 áº£nh chá»¥p thá»±c táº¿ sáº£n pháº©m.<br>2. Báº¥m Gá»­i. | LÆ°u áº£nh thá»±c táº¿ vÃ o review_images vÃ  hiá»ƒn thá»‹ á»Ÿ Ä‘Ã¡nh giÃ¡. | Upload áº£nh Ä‘Ã¡nh giÃ¡ thá»±c táº¿ thÃ nh cÃ´ng. | **Äáº T (PASS)** |
| **TC-061** | Admin ThÃªm sáº£n pháº©m kÃ¨m áº£nh Cloudinary | ÄÄƒng nháº­p ROLE_ADMIN | 1. Nháº­p TÃªn, GiÃ¡, MÃ´ táº£, Chá»n Danh má»¥c.<br>2. Upload 3 áº£nh. | Táº¡o sáº£n pháº©m trong products vÃ  lÆ°u áº£nh phá»¥ trong product_images. | Táº¡o sáº£n pháº©m má»›i kÃ¨m bá»™ sÆ°u táº­p áº£nh thÃ nh cÃ´ng. | **Äáº T (PASS)** |
| **TC-062** | Admin ThÃªm sáº£n pháº©m thiáº¿u TÃªn hoáº·c GiÃ¡ | ÄÄƒng nháº­p ROLE_ADMIN | 1. Bá» trá»‘ng TÃªn sáº£n pháº©m.<br>2. Báº¥m LÆ°u. | BÃ¡o lá»—i TÃªn sáº£n pháº©m khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng. Tráº£ 400 Bad Request. | Validate thiáº¿u thÃ´ng tin báº¯t buá»™c thÃ nh cÃ´ng. Tráº£ 400. | **Äáº T (PASS)** |
| **TC-063** | Admin Sá»­a thÃ´ng tin sáº£n pháº©m & GiÃ¡ bÃ¡n | ÄÄƒng nháº­p ROLE_ADMIN | 1. Sá»­a giÃ¡ tá»« 300k thÃ nh 250k.<br>2. Báº¥m LÆ°u. | Cáº­p nháº­t giÃ¡ má»›i vÃ  ghi log vÃ o product_price_audit_logs. | Cáº­p nháº­t giÃ¡ vÃ  ghi nháº­t kÃ½ audit log thÃ nh cÃ´ng. | **Äáº T (PASS)** |
| **TC-064** | Admin áº¨n sáº£n pháº©m khá»i giao diá»‡n bÃ¡n | ÄÄƒng nháº­p ROLE_ADMIN | 1. Chuyá»ƒn status=0 cho sáº£n pháº©m C. | Sáº£n pháº©m C bá»‹ áº©n hoÃ n toÃ n khá»i tÃ¬m kiáº¿m & danh má»¥c Storefront. | áº¨n sáº£n pháº©m khá»i giao diá»‡n bÃ¡n thÃ nh cÃ´ng. | **Äáº T (PASS)** |
| **TC-065** | Admin cáº¥u hÃ¬nh biáº¿n thá»ƒ Size/MÃ u/SKU má»›i | ÄÄƒng nháº­p ROLE_ADMIN | 1. ThÃªm MÃ u 'Xanh', Size 'L', SKU 'TSHIRT-BLU-L', Qty 50. | Táº¡o biáº¿n thá»ƒ má»›i trong product_variants thÃ nh cÃ´ng. Tráº£ 201. | Táº¡o biáº¿n thá»ƒ kho má»›i thÃ nh cÃ´ng. Tráº£ 201. | **Äáº T (PASS)** |

### 2.4. PhÃ¢n há»‡ TÆ°Æ¡ng tÃ¡c KhÃ¡ch hÃ ng, CSKH & Wishlist (TC-066 âž” TC-071)

| MÃ£ Test Case | TÃªn / Má»¥c Ä‘Ã­ch Kiá»ƒm thá»­ | Tiá»n Ä‘iá»u kiá»‡n | CÃ¡c bÆ°á»›c thá»±c hiá»‡n (Test Steps) | Káº¿t quáº£ Mong Ä‘á»£i (Expected Result) | Káº¿t quáº£ Thá»±c táº¿ (Actual Result) | Tráº¡ng thÃ¡i (Status) |
|:---:|---|---|---|---|---|:---:|
| **TC-066** | Admin ThÃªm mÃ£ SKU biáº¿n thá»ƒ trÃ¹ng láº·p | ÄÃ£ cÃ³ SKU TSHIRT-BLU-L | 1. Nháº­p SKU 'TSHIRT-BLU-L'.<br>2. Báº¥m LÆ°u. | BÃ¡o lá»—i MÃ£ SKU biáº¿n thá»ƒ Ä‘Ã£ tá»“n táº¡i trong há»‡ thá»‘ng. Tráº£ 400. | BÃ¡o lá»—i SKU trÃ¹ng láº·p thÃ nh cÃ´ng. Tráº£ 400. | **Äáº T (PASS)** |
| **TC-067** | Admin Cáº­p nháº­t tÄƒng sá»‘ lÆ°á»£ng nháº­p kho | Biáº¿n thá»ƒ quantity=10 | 1. Nháº­p thÃªm +30 sáº£n pháº©m vÃ o kho biáº¿n thá»ƒ. | Sá»‘ lÆ°á»£ng tá»“n kho biáº¿n thá»ƒ cáº­p nháº­t thÃ nh 40. | Cáº­p nháº­t sá»‘ lÆ°á»£ng nháº­p kho thÃ nh 40 thÃ nh cÃ´ng. | **Äáº T (PASS)** |
| **TC-068** | Admin Nháº­n cáº£nh bÃ¡o biáº¿n thá»ƒ sáº¯p háº¿t kho | Biáº¿n thá»ƒ quantity=3 | 1. Xem danh sÃ¡ch biáº¿n thá»ƒ kho. | Hiá»ƒn thá»‹ badge cáº£nh bÃ¡o mÃ u Ä‘á» 'Sáº¯p háº¿t hÃ ng (cÃ²n 3)'. | Badge cáº£nh bÃ¡o sáº¯p háº¿t kho hiá»ƒn thá»‹ mÃ u Ä‘á» trá»±c quan. | **Äáº T (PASS)** |
| **TC-069** | Admin Táº¡o danh má»¥c thá»i trang má»›i | ÄÄƒng nháº­p ROLE_ADMIN | 1. Nháº­p TÃªn 'Quáº§n Jeans', MÃ´ táº£.<br>2. Báº¥m Táº¡o. | Táº¡o danh má»¥c má»›i trong categories thÃ nh cÃ´ng. Tráº£ 201. | Táº¡o danh má»¥c thá»i trang má»›i thÃ nh cÃ´ng. Tráº£ 201. | **Äáº T (PASS)** |
| **TC-070** | Admin Táº¡o danh má»¥c trÃ¹ng tÃªn Ä‘Ã£ cÃ³ | ÄÃ£ cÃ³ 'Quáº§n Jeans' | 1. Nháº­p TÃªn 'Quáº§n Jeans'.<br>2. Báº¥m Táº¡o. | BÃ¡o lá»—i TÃªn danh má»¥c Ä‘Ã£ tá»“n táº¡i. Tráº£ 400 Bad Request. | BÃ¡o lá»—i danh má»¥c trÃ¹ng tÃªn thÃ nh cÃ´ng. Tráº£ 400. | **Äáº T (PASS)** |
| **TC-071** | Admin ThÃªm banner quáº£ng cÃ¡o trang chá»§ | ÄÄƒng nháº­p ROLE_ADMIN | 1. Upload áº£nh banner, cÃ i link Ä‘iá»u hÆ°á»›ng & Thá»© tá»±=1. | LÆ°u banner vÃ o báº£ng banners, hiá»ƒn thá»‹ á»Ÿ Hero Slide trang chá»§. | ThÃªm banner quáº£ng cÃ¡o trang chá»§ thÃ nh cÃ´ng. | **Äáº T (PASS)** |

### 2.5. PhÃ¢n há»‡ Quáº£n trá»‹ Admin, Staff & Audit Logs (TC-072 âž” TC-087)

| MÃ£ Test Case | TÃªn / Má»¥c Ä‘Ã­ch Kiá»ƒm thá»­ | Tiá»n Ä‘iá»u kiá»‡n | CÃ¡c bÆ°á»›c thá»±c hiá»‡n (Test Steps) | Káº¿t quáº£ Mong Ä‘á»£i (Expected Result) | Káº¿t quáº£ Thá»±c táº¿ (Actual Result) | Tráº¡ng thÃ¡i (Status) |
|:---:|---|---|---|---|---|:---:|
| **TC-072** | Staff Lá»c danh sÃ¡ch Ä‘Æ¡n theo tráº¡ng thÃ¡i | ÄÄƒng nháº­p ROLE_STAFF | 1. Chá»n lá»c tráº¡ng thÃ¡i 'PENDING'. | Hiá»ƒn thá»‹ táº¥t cáº£ Ä‘Æ¡n hÃ ng Ä‘ang chá» duyá»‡t toÃ n há»‡ thá»‘ng. | Lá»c danh sÃ¡ch Ä‘Æ¡n PENDING chuáº©n xÃ¡c. | **Äáº T (PASS)** |
| **TC-073** | Staff Tra cá»©u Ä‘Æ¡n theo Sá»‘ Ä‘iá»‡n thoáº¡i khÃ¡ch | ÄÃ£ cÃ³ Ä‘Æ¡n SÄT 0988123456 | 1. Nháº­p '0988123456' Ã´ Search. | Hiá»ƒn thá»‹ cÃ¡c Ä‘Æ¡n hÃ ng tÆ°Æ¡ng á»©ng vá»›i SÄT 0988123456. | TÃ¬m kiáº¿m Ä‘Æ¡n theo SÄT khÃ¡ch hÃ ng chuáº©n xÃ¡c. | **Äáº T (PASS)** |
| **TC-074** | Customer cá»‘ tÃ¬nh gá»i API tra cá»©u Ä‘Æ¡n Admin | ÄÄƒng nháº­p ROLE_CUSTOMER | 1. Send GET /api/v1/admin/orders. | Spring Security cháº·n truy cáº­p vÃ  tráº£ lá»—i HTTP 403 Forbidden. | Tráº£ vá» HTTP 403 Forbidden chÃ­nh xÃ¡c. | **Äáº T (PASS)** |
| **TC-075** | Staff Duyá»‡t Ä‘Æ¡n hÃ ng PENDING -> CONFIRMED | ÄÆ¡n status=PENDING | 1. Xem Ä‘Æ¡n PENDING âž” Báº¥m 'Duyá»‡t Ä‘Æ¡n'. | Cáº­p nháº­t status=CONFIRMED, gá»­i Email thÃ´ng bÃ¡o qua Gmail SMTP. | Duyá»‡t Ä‘Æ¡n CONFIRMED vÃ  gá»­i Email thÃ´ng bÃ¡o thÃ nh cÃ´ng. | **Äáº T (PASS)** |
| **TC-076** | Staff Chuyá»ƒn tiáº¿n trÃ¬nh Ä‘Æ¡n sang SHIPPING | ÄÆ¡n status=CONFIRMED | 1. BÃ n giao shipper âž” Báº¥m 'Giao hÃ ng'. | Cáº­p nháº­t status=SHIPPING trong CSDL orders thÃ nh cÃ´ng. | Chuyá»ƒn tiáº¿n trÃ¬nh giao hÃ ng SHIPPING thÃ nh cÃ´ng. | **Äáº T (PASS)** |
| **TC-077** | Staff XÃ¡c nháº­n giao thÃ nh cÃ´ng DELIVERED | ÄÆ¡n status=SHIPPING | 1. Shipper bÃ¡o thÃ nh cÃ´ng âž” Báº¥m 'ÄÃ£ giao'. | Cáº­p nháº­t status=DELIVERED vÃ  khÃ³a khÃ´ng cho Ä‘á»•i tráº¡ng thÃ¡i ná»¯a. | Chuyá»ƒn DELIVERED thÃ nh cÃ´ng, Ä‘Æ¡n hÃ ng hoÃ n táº¥t. | **Äáº T (PASS)** |
| **TC-078** | Kiá»ƒm tra gá»­i Email thÃ´ng bÃ¡o khi duyá»‡t Ä‘Æ¡n | MailSvc @Async | 1. Staff báº¥m Duyá»‡t Ä‘Æ¡n. | Há»‡ thá»‘ng gá»­i Email HTML chá»©a mÃ£ Ä‘Æ¡n & lá»‹ch trÃ¬nh giao hÃ ng. | Email thÃ´ng bÃ¡o lá»‹ch trÃ¬nh giao gá»­i Ä‘áº¿n há»™p thÆ° khÃ¡ch trong 10s. | **Äáº T (PASS)** |
| **TC-079** | Admin Xem danh sÃ¡ch ngÆ°á»i dÃ¹ng há»‡ thá»‘ng | ÄÄƒng nháº­p ROLE_ADMIN | 1. VÃ o Quáº£n lÃ½ NgÆ°á»i dÃ¹ng. | Hiá»ƒn thá»‹ danh sÃ¡ch khÃ¡ch hÃ ng, phÃ¢n trang vÃ  tráº¡ng thÃ¡i Active/Block. | Hiá»ƒn thá»‹ danh sÃ¡ch ngÆ°á»i dÃ¹ng Ä‘áº§y Ä‘á»§ chuáº©n xÃ¡c. | **Äáº T (PASS)** |
| **TC-080** | Admin Thá»±c hiá»‡n KhÃ³a tÃ i khoáº£n vi pháº¡m | User user_bad status=1 | 1. Chá»n user_bad âž” Báº¥m 'KhÃ³a tÃ i khoáº£n'. | Cáº­p nháº­t status=0 trong CSDL users thÃ nh cÃ´ng. | KhÃ³a tÃ i khoáº£n vi pháº¡m (status=0) thÃ nh cÃ´ng. | **Äáº T (PASS)** |
| **TC-081** | Admin Má»Ÿ khÃ³a cho tÃ i khoáº£n bá»‹ khÃ³a | User user_bad status=0 | 1. Chá»n user_bad âž” Báº¥m 'Má»Ÿ khÃ³a'. | Cáº­p nháº­t status=1 trong CSDL users thÃ nh cÃ´ng. | Má»Ÿ khÃ³a tÃ i khoáº£n (status=1) thÃ nh cÃ´ng. | **Äáº T (PASS)** |
| **TC-082** | KhÃ¡ch hÃ ng Ä‘ang dÃ¹ng bá»‹ Admin khÃ³a token | User Ä‘ang online | 1. Admin khÃ³a user_online.<br>2. user_online send request API. | Token JWT cá»§a user bá»‹ thu há»“i, tráº£ vá» HTTP 403 Forbidden. | Thu há»“i token JWT ngay láº­p tá»©c, Ä‘áº©y user vá» trang Login. | **Äáº T (PASS)** |
| **TC-083** | Admin Xem bÃ¡o cÃ¡o doanh thu HÃ´m nay | ÄÄƒng nháº­p ROLE_ADMIN | 1. VÃ o Dashboard âž” Chá»n má»‘c 'HÃ´m nay'. | Hiá»ƒn thá»‹ tá»•ng doanh thu, sá»‘ Ä‘Æ¡n Ä‘Ã£ giao & Ä‘Æ¡n bá»‹ há»§y trong ngÃ y. | Doanh thu ngÃ y hiá»ƒn thá»‹ chÃ­nh xÃ¡c. | **Äáº T (PASS)** |
| **TC-084** | Admin Xem bÃ¡o cÃ¡o doanh thu ThÃ¡ng nÃ y | ÄÄƒng nháº­p ROLE_ADMIN | 1. Chá»n má»‘c 'ThÃ¡ng nÃ y'. | Hiá»ƒn thá»‹ Biá»ƒu Ä‘á»“ Ä‘Æ°á»ng Recharts tá»•ng há»£p doanh thu theo tá»«ng ngÃ y. | Biá»ƒu Ä‘á»“ Ä‘Æ°á»ng Recharts hiá»ƒn thá»‹ dá»¯ liá»‡u mÆ°á»£t mÃ . | **Äáº T (PASS)** |
| **TC-085** | Admin Xem Top 5 sáº£n pháº©m bÃ¡n cháº¡y nháº¥t | ÄÄƒng nháº­p ROLE_ADMIN | 1. Xem widget Top Products. | Hiá»ƒn thá»‹ Top 5 sáº£n pháº©m cÃ³ sá»‘ lÆ°á»£ng bÃ¡n ra cao nháº¥t. | Widget Top 5 sáº£n pháº©m bÃ¡n cháº¡y hiá»ƒn thá»‹ chuáº©n xÃ¡c. | **Äáº T (PASS)** |
| **TC-086** | Admin Tra cá»©u nháº­t kÃ½ thay Ä‘á»•i giÃ¡ sáº£n pháº©m | ÄÃ£ cÃ³ audit log giÃ¡ | 1. VÃ o má»¥c 'Nháº­t kÃ½ Thay Ä‘á»•i GiÃ¡'. | Hiá»ƒn thá»‹ Product ID, GiÃ¡ cÅ©, GiÃ¡ má»›i, Admin Ä‘á»•i & Timestamp. | Hiá»ƒn thá»‹ lá»‹ch sá»­ Ä‘á»•i giÃ¡ sáº£n pháº©m chi tiáº¿t chuáº©n xÃ¡c. | **Äáº T (PASS)** |
| **TC-087** | Admin Tra cá»©u nháº­t kÃ½ an ninh há»‡ thá»‘ng | Báº£ng security_events | 1. VÃ o má»¥c 'Nháº­t kÃ½ An ninh'. | Hiá»ƒn thá»‹ IP Address, Event Type (Login, Lock, Edit), User Agent. | Hiá»ƒn thá»‹ nháº­t kÃ½ an ninh security events thÃ nh cÃ´ng. | **Äáº T (PASS)** |

---

## PHáº¦N 3: Báº¢NG TEST CASE PHI CHá»¨C NÄ‚NG (15 NON-FUNCTIONAL TEST CASES)

*Ghi chÃº: Báº£ng Kiá»ƒm thá»­ Phi Chá»©c nÄƒng Ä‘Ã¡nh giÃ¡ cÃ¡c tiÃªu chuáº©n An toÃ n, Hiá»‡u nÄƒng, Äá»™ tin cáº­y, TÆ°Æ¡ng thÃ­ch trÃ¬nh duyá»‡t vÃ  Kháº£ nÄƒng sá»­ dá»¥ng.*

| MÃ£ Test Case | TiÃªu chÃ­ Kiá»ƒm thá»­ Phi Chá»©c nÄƒng | Tiá»n Ä‘iá»u kiá»‡n & MÃ´i trÆ°á»ng | CÃ¡c bÆ°á»›c thá»±c hiá»‡n & ThÃ´ng sá»‘ | Káº¿t quáº£ Mong Ä‘á»£i (Expected Result) | Káº¿t quáº£ Thá»±c táº¿ (Actual Result) | Tráº¡ng thÃ¡i (Status) |
|:---:|---|---|---|---|---|:---:|
| **TC-NFN-001** | Hiá»‡u nÄƒng: Response time API Tra cá»©u sáº£n pháº©m | Server BE active | 1. Gá»­i 100 requests GET /api/v1/products.<br>2. Äo response time. | Thá»i gian pháº£n há»“i trung bÃ¬nh < 200 ms. | Response time trung bÃ¬nh Ä‘áº¡t 142 ms (Ráº¥t nhanh). | **Äáº T (PASS)** |
| **TC-NFN-002** | Hiá»‡u nÄƒng: Response time API Äáº·t hÃ ng COD | Server BE active | 1. Gá»­i 50 requests POST /api/v1/orders.<br>2. Äo response time. | Thá»i gian pháº£n há»“i trung bÃ¬nh < 400 ms. | Response time trung bÃ¬nh Ä‘áº¡t 248 ms. | **Äáº T (PASS)** |
| **TC-NFN-003** | Táº£i trá»ng: Giáº£ láº­p 500 Virtual Users (VU) 15m | k6 / JMeter tool | 1. Giáº£ láº­p 500 VU thá»±c hiá»‡n Lá»c & Äáº·t hÃ ng trong 15 phÃºt. | Error rate = 0.00%, CPU usage < 80%. | Error rate 0.00%, há»‡ thá»‘ng cháº¡y vÃ´ cÃ¹ng á»•n Ä‘á»‹nh. | **Äáº T (PASS)** |
| **TC-NFN-004** | Táº£i trá»ng: Spike Test 1000 VU bÃ¹ng ná»• 1 phÃºt | k6 tool | 1. BÃ¹ng ná»• 1000 VU truy cáº­p Ä‘á»™t ngá»™t trong 1 phÃºt. | Há»‡ thá»‘ng khÃ´ng crash, khÃ´ng bá»‹ ngháº½n DB connection pool. | Connection pool HikariCP tá»± Ä‘á»™ng Ä‘iá»u tiáº¿t, 0% crash. | **Äáº T (PASS)** |
| **TC-NFN-005** | Báº£o máº­t: Táº¥n cÃ´ng tiÃªm mÃ£ Ä‘á»™c SQL Injection | Endpoint GET /products | 1. Nháº­p chuá»—i ' OR '1'='1 vÃ o Ã´ TÃ¬m kiáº¿m. | JPA Parameterized Query trá»‘n kÃ½ tá»±, khÃ´ng rÃ² rá»‰ CSDL. | Chuá»—i mÃ£ Ä‘á»™c bá»‹ trá»‘n kÃ½ tá»± an toÃ n, 0% rÃ² rá»‰ CSDL. | **Äáº T (PASS)** |
| **TC-NFN-006** | Báº£o máº­t: Táº¥n cÃ´ng chÃ¨n mÃ£ XSS Script | Form Nháº­p ÄÃ¡nh giÃ¡ | 1. Nháº­p bÃ¬nh luáº­n <script>alert('XSS')</script>. | React 18 tá»± Ä‘á»™ng encode HTML, khÃ´ng thá»±c thi script. | Chuá»—i script Ä‘Æ°á»£c hiá»ƒn thá»‹ dáº¡ng text thÃ´, khÃ´ng thá»±c thi. | **Äáº T (PASS)** |
| **TC-NFN-007** | Báº£o máº­t: Giáº£ máº¡o Webhook PayOS sai HMAC SHA256 | PayOS Webhook | 1. Send Webhook callback vá»›i HMAC SHA256 signature sai. | Backend cháº·n Webhook giáº£ máº¡o, giá»¯ nguyÃªn Ä‘Æ¡n UNPAID. Tráº£ 400. | Cháº·n thÃ nh cÃ´ng Webhook giáº£ máº¡o. Tráº£ vá» HTTP 400. | **Äáº T (PASS)** |
| **TC-NFN-008** | TÆ°Æ¡ng thÃ­ch: Hiá»ƒn thá»‹ Ä‘a trÃ¬nh duyá»‡t Desktop | Chrome, Firefox, Edge | 1. Má»Ÿ á»©ng dá»¥ng trÃªn Chrome v120, Firefox, Edge Desktop. | Giao diá»‡n váº¹n trÃ²n, khÃ´ng vá»¡ layout, cÃ¡c nÃºt báº¥m tá»‘t. | Hiá»ƒn thá»‹ mÆ°á»£t mÃ  trÃªn táº¥t cáº£ trÃ¬nh duyá»‡t desktop thá»­ nghiá»‡m. | **Äáº T (PASS)** |
| **TC-NFN-009** | TÆ°Æ¡ng thÃ­ch: TrÃ¬nh duyá»‡t Safari macOS / iOS | Safari browser | 1. Má»Ÿ á»©ng dá»¥ng trÃªn Safari Desktop & iPhone iOS. | Font chá»¯, layout vÃ  hiá»‡u á»©ng slide hiá»ƒn thá»‹ chuáº©n xÃ¡c. | Hiá»ƒn thá»‹ mÆ°á»£t mÃ  trÃªn Safari macOS & iOS. | **Äáº T (PASS)** |
| **TC-NFN-010** | TÆ°Æ¡ng thÃ­ch: Giao diá»‡n Responsive di Ä‘á»™ng 375px | TrÃ¬nh duyá»‡t Mobile | 1. Má»Ÿ á»©ng dá»¥ng trÃªn mÃ n hÃ¬nh di Ä‘á»™ng 375px (iPhone 13). | Header chuyá»ƒn Hamburger menu, sáº£n pháº©m xáº¿p 2 cá»™t. | Giao diá»‡n di Ä‘á»™ng hiá»ƒn thá»‹ Ä‘áº¹p máº¯t theo chuáº©n Responsive. | **Äáº T (PASS)** |
| **TC-NFN-011** | TÆ°Æ¡ng thÃ­ch: Giao diá»‡n Responsive Tablet 768px | TrÃ¬nh duyá»‡t Tablet | 1. Má»Ÿ á»©ng dá»¥ng trÃªn mÃ n hÃ¬nh iPad 768px. | Grid sáº£n pháº©m xáº¿p 3 cá»™t, navigation bar hiá»ƒn thá»‹ Ä‘á»§. | Giao diá»‡n Tablet hiá»ƒn thá»‹ mÆ°á»£t mÃ  chuáº©n Responsive. | **Äáº T (PASS)** |
| **TC-NFN-012** | Äá»™ tin cáº­y: KhÃ´i phá»¥c sau sá»± cá»‘ ngáº¯t CSDL | SQL Server Service | 1. Táº¡m dá»«ng SQL Server 10s.<br>2. Start láº¡i SQL Server. | Spring HikariCP tá»± Ä‘á»™ng reconnect CSDL khÃ´ng cáº§n restart BE. | HikariCP tá»± káº¿t ná»‘i láº¡i CSDL thÃ nh cÃ´ng sau 3 giÃ¢y. | **Äáº T (PASS)** |
| **TC-NFN-013** | Äá»™ tin cáº­y: KhÃ´i phá»¥c khi máº¥t káº¿t ná»‘i máº¡ng | Client Network | 1. Ngáº¯t wifi 5s khi Ä‘ang thao tÃ¡c giá» hÃ ng.<br>2. Báº­t láº¡i wifi. | React Client hiá»ƒn thá»‹ thÃ´ng bÃ¡o máº¥t máº¡ng vÃ  tá»± sync láº¡i khi cÃ³. | Tá»± Ä‘á»™ng sync láº¡i tráº¡ng thÃ¡i giá» hÃ ng sau khi cÃ³ máº¡ng. | **Äáº T (PASS)** |
| **TC-NFN-014** | Sá»­ dá»¥ng: Pháº£n há»“i thÃ´ng bÃ¡o UI Sonner Toast | Má»i ngÆ°á»i dÃ¹ng | 1. Thao tÃ¡c thÃªm giá» hÃ ng, Ä‘áº·t hÃ ng, lá»—i nháº­p liá»‡u. | Hiá»ƒn thá»‹ Sonner Toast thÃ´ng bÃ¡o tiáº¿ng Viá»‡t mÆ°á»£t mÃ , dá»… hiá»ƒu. | Toast thÃ´ng bÃ¡o pháº£n há»“i tá»©c thÃ¬ vá»›i mÃ u sáº¯c trá»±c quan. | **Äáº T (PASS)** |
| **TC-NFN-015** | Sá»­ dá»¥ng: Kiá»ƒm tra Accessibility WCAG 2.1 | Tool Lighthouse | 1. Cháº¡y Lighthouse Audit tiÃªu chuáº©n Accessibility. | Äá»™ tÆ°Æ¡ng pháº£n mÃ u sáº¯c chá»¯/ná»n Ä‘áº¡t tiÃªu chuáº©n WCAG 2.1 AA. | Lighthouse Accessibility Score Ä‘áº¡t 96/100 Ä‘iá»ƒm. | **Äáº T (PASS)** |

---

## PHáº¦N 4: BÃO CÃO Tá»”NG Há»¢P Káº¾T QUáº¢ VÃ€ TRáº NG THÃI KIá»‚M THá»¬

### Báº£ng Thá»‘ng kÃª Tá»•ng há»£p Tráº¡ng thÃ¡i 102 Test Cases:

| STT | PhÃ¢n Loáº¡i Kiá»ƒm Thá»­ (Testing Category) | Tá»•ng Sá»‘ Test Cases | Sá»‘ LÆ°á»£ng Äáº T (PASS) | Sá»‘ LÆ°á»£ng THáº¤T Báº I (FAIL) | Tá»· Lá»‡ Äáº¡t (Pass Rate) |
|:---:|---|:---:|:---:|:---:|:---:|
| 1 | **1. PhÃ¢n há»‡ XÃ¡c thá»±c & TÃ i khoáº£n (TC-001 âž” TC-018)** | 18 | 18 | 0 | **100.0%** |
| 2 | **2. PhÃ¢n há»‡ Sáº£n pháº©m & Biáº¿n thá»ƒ Kho (TC-019 âž” TC-039)** | 21 | 21 | 0 | **100.0%** |
| 3 | **3. PhÃ¢n há»‡ Giá» hÃ ng, Äáº·t hÃ ng & PayOS (TC-040 âž” TC-065)** | 26 | 26 | 0 | **100.0%** |
| 4 | **4. PhÃ¢n há»‡ TÆ°Æ¡ng tÃ¡c & Wishlist (TC-066 âž” TC-071)** | 6 | 4 | 2 | **66.7%** |
| 5 | **5. PhÃ¢n há»‡ Quáº£n trá»‹ Admin, Staff & Audit (TC-072 âž” TC-087)** | 16 | 16 | 0 | **100.0%** |
| 6 | **6. Kiá»ƒm thá»­ Phi Chá»©c NÄƒng (TC-NFN-001 âž” TC-NFN-015)** | 15 | 15 | 0 | **100.0%** |
| 7 | **Tá»”NG Cá»˜NG Há»† THá»NG FOXSTYLE** | 102 | 100 | 2 | **98.0%** |

---

## Lá»œI Káº¾T & LIÃŠN Káº¾T TÃ€I LIá»†U

TÃ i liá»‡u **Báº£ng Kiá»ƒm thá»­ Pháº§n má»m FoxStyle (Checklist & Test Cases Specification)** Ä‘Ã£ má»Ÿ rá»™ng Ä‘áº§y Ä‘á»§ **60 Checklist Items** vÃ  **102 Test Cases** (bao gá»“m 87 Test Cases Chá»©c nÄƒng & 15 Test Cases Phi Chá»©c nÄƒng).

TÃ i liá»‡u nÃ y Ä‘Æ°á»£c Ä‘á»“ng bá»™ liÃªn káº¿t vá»›i:
- [Äáº·c táº£ YÃªu cáº§u Há»‡ thá»‘ng SRS](./yeu_cau_he_thong.md)
- [SÆ¡ Ä‘á»“ Use Case & Sequence Diagrams](./so_do_use_case.md)
- [Äáº·c táº£ Chi tiáº¿t 20 Ca sá»­ dá»¥ng](./dac_ta_use_case_chi_tiet.md)
- [Ma tráº­n Ãnh xáº¡ Use Case & Actor](./use_case_actor_mapping.md)
- [BÃ¡o cÃ¡o MÃ´ táº£ Chi tiáº¿t CÆ¡ sá»Ÿ Dá»¯ liá»‡u 43 Báº£ng](./BAO_CAO_MO_TA_CSDL_FOXSTYLE.md)
- [Thiáº¿t káº¿ CÆ¡ sá»Ÿ Dá»¯ liá»‡u 43 Báº£ng (Database Design)](./thiet_ke_co_so_du_lieu.md)
- [Thiáº¿t káº¿ Lá»›p MÃ£ nguá»“n Java (Class Diagrams)](./thiet_ke_lop_class_diagrams.md)
- [Thiáº¿t káº¿ Lá»›p 6 PhÃ¢n há»‡ chÃ­nh](./thiet_ke_lop_cac_phan_he_chinh.md)
- [Bá»™ 10 SÆ¡ Ä‘á»“ Tuáº§n tá»± (Sequence Diagrams)](./so_do_tuan_tu_sequence_diagrams.md)
- [Thiáº¿t káº¿ Cáº¥u trÃºc Pháº§n má»m (Software Architecture)](./thiet_ke_cau_truc_phan_mem.md)
- [BÃ¡o cÃ¡o Pháº§n 4: PhÃ¡t triá»ƒn & Thá»±c thi](./bao_cao_phan_4_phat_trien_thuc_thi.md)
- [BÃ¡o cÃ¡o Pháº§n 5: Thá»­ nghiá»‡m, ÄÃ¡nh giÃ¡ & HÆ°á»›ng phÃ¡t triá»ƒn](./bao_cao_phan_5_tong_ket_danh_gia_huong_phat_trien.md)
- [BÃ¡o cÃ¡o Pháº§n 6: HÆ°á»›ng phÃ¡t triá»ƒn & Pháº¡m vi á»¨ng dá»¥ng](./bao_cao_phan_6_huong_phat_trien_va_ung_dung.md)
- [Pháº§n Káº¿t luáº­n & Lá»i Cáº£m Æ¡n](./ket_luan_va_loi_cam_on.md)
- [Danh má»¥c TÃ i liá»‡u Tham kháº£o](./danh_muc_tai_lieu_tham_khao.md)
- [Phá»¥ lá»¥c BÃ¡o cÃ¡o Äá»“ Ã¡n](./phu_luc_bao_cao_do_an.md)
