# TÃ€I LIá»†U THIáº¾T Káº¾ Háº  Táº¦NG Máº NG VÃ€ CHÃNH SÃCH Há»† THá»NG
## Dá»± Ã¡n: Há»‡ thá»‘ng ThÆ°Æ¡ng máº¡i Äiá»‡n tá»­ Thá»i trang FoxStyle
**MÃ£ dá»± Ã¡n:** FOXSTYLE-DATN  
**NgÃ y cáº­p nháº­t:** 31/07/2026  
**Tráº¡ng thÃ¡i:** TÃ€I LIá»†U CHÃNH THá»¨C  

---

## Má»¤C Lá»¤C
- [CHÆ¯Æ NG 1: THIáº¾T Káº¾ Háº  Táº¦NG Máº NG (NETWORK INFRASTRUCTURE DESIGN)](#chÆ°Æ¡ng-1-thiáº¿t-káº¿-háº¡-táº§ng-máº¡ng-network-infrastructure-design)
  - [1.1. MÃ´ hÃ¬nh Kiáº¿n trÃºc PhÃ¢n vÃ¹ng Máº¡ng (Network Security Zones)](#11-mÃ´-hÃ¬nh-kiáº¿n-trÃºc-phÃ¢n-vÃ¹ng-máº¡ng-network-security-zones)
  - [1.2. SÆ¡ Ä‘á»“ Háº¡ táº§ng Máº¡ng Tá»•ng thá»ƒ (Network Topology Diagram)](#12-sÆ¡-Ä‘á»“-háº¡-táº§ng-máº¡ng-tá»•ng-thá»ƒ-network-topology-diagram)
  - [1.3. Luá»“ng LuÃ¢n chuyá»ƒn Dá»¯ liá»‡u Máº¡ng (Data Traffic Flow)](#13-luá»“ng-luÃ¢n-chuyá»ƒn-dá»¯-liá»‡u-máº¡ng-data-traffic-flow)
  - [1.4. Báº£ng Cáº¥u hÃ¬nh Cá»•ng Máº¡ng, Giao thá»©c & Quy táº¯c Firewall](#14-báº£ng-cáº¥u-hÃ¬nh-cá»•ng-máº¡ng-giao-thá»©c--quy-táº¯c-firewall)
- [CHÆ¯Æ NG 2: Bá»˜ CHÃNH SÃCH Báº¢O Máº¬T VÃ€ Váº¬N HÃ€NH Há»† THá»NG](#chÆ°Æ¡ng-2-bá»™-chÃ­nh-sÃ¡ch-báº£o-máº­t-vÃ -váº­n-hÃ nh-há»‡-thá»‘ng)
  - [2.1. ChÃ­nh sÃ¡ch XÃ¡c thá»±c & Kiá»ƒm soÃ¡t Truy cáº­p (Authentication & Access Control Policy)](#21-chÃ­nh-sÃ¡ch-xÃ¡c-thá»±c--kiá»ƒm-soÃ¡t-truy-cáº­p-authentication--access-control-policy)
  - [2.2. ChÃ­nh sÃ¡ch An toÃ n API & PhÃ²ng thá»§ Máº¡ng (API & Network Defense Policy)](#22-chÃ­nh-sÃ¡ch-an-toÃ n-api--phÃ²ng-thá»§-máº¡ng-api--network-defense-policy)
  - [2.3. ChÃ­nh sÃ¡ch Quáº£n lÃ½ & Báº£o vá»‡ Dá»¯ liá»‡u (Data Protection & Privacy Policy)](#23-chÃ­nh-sÃ¡ch-quáº£n-lÃ½--báº£o-vá»‡-dá»¯-liá»‡u-data-protection--privacy-policy)
  - [2.4. ChÃ­nh sÃ¡ch Sao lÆ°u & KhÃ´i phá»¥c Tháº£m há»a (Backup & Disaster Recovery Policy)](#24-chÃ­nh-sÃ¡ch-sao-lÆ°u--khÃ´i-phá»¥c-tháº£m-há»a-backup--disaster-recovery-policy)
  - [2.5. ChÃ­nh sÃ¡ch Nháº­t kÃ½ Váº­n hÃ nh & GiÃ¡m sÃ¡t (Logging & Audit Trail Policy)](#25-chÃ­nh-sÃ¡ch-nháº­t-kÃ½-váº­n-hÃ nh--giÃ¡m-sÃ¡t-logging--audit-trail-policy)
  - [2.6. ChÃ­nh sÃ¡ch Báº£o trÃ¬ & Quáº£n lÃ½ Sá»± cá»‘ (Maintenance & Incident Response Policy)](#26-chÃ­nh-sÃ¡ch-báº£o-trÃ¬--quáº£n-lÃ½-sá»±-cá»‘-maintenance--incident-response-policy)

---

## CHÆ¯Æ NG 1: THIáº¾T Káº¾ Háº  Táº¦NG Máº NG (NETWORK INFRASTRUCTURE DESIGN)

### 1.1. MÃ´ hÃ¬nh Kiáº¿n trÃºc PhÃ¢n vÃ¹ng Máº¡ng (Network Security Zones)

Äá»ƒ Ä‘áº£m báº£o tÃ­nh an toÃ n cao nháº¥t cho há»‡ thá»‘ng **FoxStyle**, háº¡ táº§ng máº¡ng Ä‘Æ°á»£c phÃ¢n chia thÃ nh 4 vÃ¹ng an ninh (Security Zones) tÃ¡ch biá»‡t theo mÃ´ hÃ¬nh Defense-in-Depth (PhÃ²ng thá»§ chiá»u sÃ¢u):

1. **Public Edge Zone (VÃ¹ng BiÃªn Internet Public):**
   - Tiáº¿p nháº­n toÃ n bá»™ lÆ°u lÆ°á»£ng truy cáº­p tá»« ngÆ°á»i dÃ¹ng Internet (KhÃ¡ch mua hÃ ng vÃ  Admin).
   - TÃ­ch há»£p **Cloudflare CDN / WAF**: ÄÃ³ng vai trÃ² lÃ m TÆ°á»ng lá»­a á»©ng dá»¥ng Web, mÃ£ hÃ³a SSL/TLS Certificate, chá»‘ng táº¥n cÃ´ng DDoS (Layer 3/4/7) vÃ  phÃ¢n phá»‘i cÃ¡c tá»‡p tÄ©nh (Static Assets: hÃ¬nh áº£nh, CSS, JS).

2. **Ingress / DMZ Zone (VÃ¹ng Trung gian):**
   - Chá»©a mÃ¡y chá»§ **Nginx Reverse Proxy / Load Balancer**.
   - Chá»‹u trÃ¡ch nhiá»‡m cháº¥m dá»©t mÃ£ hÃ³a SSL (SSL Termination), cÃ¢n báº±ng táº£i request vÃ  thá»±c hiá»‡n kiá»ƒm tra Rate Limiting trÆ°á»›c khi chuyá»ƒn tiáº¿p yÃªu cáº§u vÃ o vÃ¹ng bÃªn trong.

3. **Application Private Zone (VÃ¹ng á»¨ng dá»¥ng Ná»™i bá»™):**
   - Äáº·t trong máº¡ng con riÃªng biá»‡t (Private Subnet). KhÃ´ng thá»ƒ truy cáº­p trá»±c tiáº¿p tá»« Internet cÃ´ng cá»™ng.
   - Chá»©a cluster dá»‹ch vá»¥ **Spring Boot Backend RESTful API** (Java 17) cháº¡y trong mÃ´i trÆ°á»ng Docker Container cÃ´ láº­p.
   - Giao tiáº¿p vá»›i Nginx qua cá»•ng ná»™i bá»™ 8080.

4. **Database & Data Storage Zone (VÃ¹ng Dá»¯ liá»‡u Báº­t cao):**
   - Äáº·t trong vÃ¹ng máº¡ng con Ä‘Æ°á»£c báº£o vá»‡ nghiÃªm ngáº·t nháº¥t (Isolated Database Subnet). Chá»‰ cháº¥p nháº­n káº¿t ná»‘i tá»« IP cá»§a Backend API Server.
   - Chá»©a há»‡ quáº£n trá»‹ cÆ¡ sá»Ÿ dá»¯ liá»‡u **Microsoft SQL Server** (Port 1433).
   - Káº¿t ná»‘i vá»›i dá»‹ch vá»¥ Ä‘Ã¡m mÃ¢y bÃªn thá»© ba: **Cloudinary Storage** (LÆ°u trá»¯ áº£nh sáº£n pháº©m) vÃ  **PayOS Payment Gateway** (Thanh toÃ¡n tá»± Ä‘á»™ng qua HTTPS RESTful/Webhook).

---

### 1.2. SÆ¡ Ä‘á»“ Háº¡ táº§ng Máº¡ng Tá»•ng thá»ƒ (Network Topology Diagram)

```mermaid
flowchart TD
    subgraph Internet ["ðŸŒ INTERNET PUBLIC ZONE"]
        ClientUser["ðŸ“± Mobile / Desktop User"]
        ExternalPayOS["ðŸ’³ PayOS Payment Gateway"]
        GoogleServer["ðŸ”‘ Google OAuth2 Server"]
    end

    subgraph CloudEdge ["ðŸ›¡ï¸ EDGE SECURITY & CDN ZONE (Cloudflare / WAF)"]
        WAF["TÆ°á»ng lá»­a Cloudflare WAF<br>(DDoS Protection & SSL Certificate)"]
    end

    subgraph DMZZone ["ðŸ”’ DMZ / INGRESS ZONE (Port 80 / 443)"]
        NginxProxy["Nginx Reverse Proxy / Load Balancer<br>(Rate Limit & CORS Filtering)"]
    end

    subgraph AppZone ["ðŸ“¦ APPLICATION PRIVATE ZONE (Private Subnet)"]
        FrontendServer["React 18 SPA Server / CDN Asset Distribution"]
        BackendAPI["Spring Boot API Service (Java 17)<br>Docker Container (Port 8080)"]
    end

    subgraph DataZone ["ðŸ’¾ DATA SECURE ZONE (Isolated Subnet)"]
        MSSQLDB[("Microsoft SQL Server<br>(Database Storage - Port 1433)")]
        CloudinaryStorage["Cloudinary Image Cloud Repository"]
        SMTPServer["Gmail SMTP Mail Server (Port 587)"]
    end

    %% Luá»“ng káº¿t ná»‘i
    ClientUser -->|HTTPS Port 443| WAF
    ExternalPayOS -->|Webhook Callback HTTPS| WAF
    GoogleServer <-->|OAuth2 Token Verify| BackendAPI

    WAF -->|Traffic Cleaned| NginxProxy
    NginxProxy -->|HTTP Port 80| FrontendServer
    NginxProxy -->|Proxy Pass Port 8080| BackendAPI

    BackendAPI -->|JDBC Connection Port 1433| MSSQLDB
    BackendAPI -->|HTTPS Image Upload API| CloudinaryStorage
    BackendAPI -->|TLS Mail Delivery Port 587| SMTPServer
```

---

### 1.3. Luá»“ng LuÃ¢n chuyá»ƒn Dá»¯ liá»‡u Máº¡ng (Data Traffic Flow)

#### Luá»“ng 1: KhÃ¡ch hÃ ng truy cáº­p & Thá»±c hiá»‡n Giao dá»‹ch Mua hÃ ng
1. NgÆ°á»i dÃ¹ng gá»­i yÃªu cáº§u HTTPS (`https://foxstyle.com`) âž” Äi qua **Cloudflare WAF** Ä‘á»ƒ lá»c mÃ£ Ä‘á»™c vÃ  chá»‘ng DDoS.
2. Request Ä‘Æ°á»£c chuyá»ƒn vá» **Nginx Reverse Proxy**. Nginx kiá»ƒm tra tÃ­nh há»£p lá»‡ cá»§a Header vÃ  cáº¥u hÃ¬nh CORS.
3. Request Ä‘Æ°á»£c Ä‘iá»u hÆ°á»›ng vÃ o **Spring Boot API Backend** (Port 8080).
4. Spring Boot Filter kiá»ƒm tra chuá»—i **JWT Token** xÃ¡c thá»±c.
5. Backend khá»Ÿi táº¡o káº¿t ná»‘i JDBC báº£o máº­t tá»›i **MS SQL Server** (Port 1433) trong Isolated Subnet Ä‘á»ƒ cáº­p nháº­t dá»¯ liá»‡u.

#### Luá»“ng 2: Xá»­ lÃ½ Webhook Thanh toÃ¡n tá»« PayOS
1. PayOS hoÃ n táº¥t giao dá»‹ch ngÃ¢n hÃ ng âž” PhÃ¡t tÃ­n hiá»‡u HTTP POST Webhook tá»›i URL `https://api.foxstyle.com/api/v1/payments/payos-webhook`.
2. Traffic Ä‘i qua WAF âž” Nginx âž” Backend API Handler.
3. Backend kiá»ƒm tra mÃ£ chá»¯ kÃ½ **HMAC SHA256 Checksum Signature**.
4. Náº¿u chá»¯ kÃ½ há»£p lá»‡ âž” Backend cáº­p nháº­t tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng trong SQL Server âž” Gá»­i Email xÃ¡c nháº­n qua **SMTP Mail Server** (Port 587).

---

### 1.4. Báº£ng Cáº¥u hÃ¬nh Cá»•ng Máº¡ng, Giao thá»©c & Quy táº¯c Firewall

| VÃ¹ng máº¡ng (Zone) | Dá»‹ch vá»¥ (Service) | Giao thá»©c (Protocol) | Cá»•ng (Port) | Nguá»“n (Source) | ÄÃ­ch (Destination) | HÃ nh Ä‘á»™ng (Rule) |
|---|---|---|---|---|---|---|
| Public Edge | HTTPS Web Access | TCP | 443 | Any (0.0.0.0/0) | Cloudflare WAF | ALLOW |
| DMZ / Ingress | Reverse Proxy Pass | TCP | 80 / 443 | Cloudflare IPs | Nginx Proxy | ALLOW |
| App Private | Backend Spring Boot | TCP | 8080 | Nginx Proxy IP | Backend Server IP | ALLOW |
| App Private | SSH Administration | TCP | 22 | Bastion Host IP | Backend Server IP | ALLOW (MFA required) |
| Data Zone | MS SQL Server DB | TCP | 1433 | Backend Server IP | SQL Server IP | ALLOW (Deny All Others) |
| External Outbound | Google OAuth2 Verify | TCP | 443 | Backend Server IP | Google OAuth API | ALLOW |
| External Outbound | PayOS Payment API | TCP | 443 | Backend Server IP | PayOS API | ALLOW |
| External Outbound | Mail Delivery | TCP | 587 | Backend Server IP | SMTP Server IP | ALLOW |

---

## CHÆ¯Æ NG 2: Bá»˜ CHÃNH SÃCH Báº¢O Máº¬T VÃ€ Váº¬N HÃ€NH Há»† THá»NG

### 2.1. ChÃ­nh sÃ¡ch XÃ¡c thá»±c & Kiá»ƒm soÃ¡t Truy cáº­p (Authentication & Access Control Policy)

#### POL-01: ChÃ­nh sÃ¡ch Quáº£n lÃ½ Máº­t kháº©u (Password Management Policy)
- **Äá»™ phá»©c táº¡p máº­t kháº©u:** Äá»™ dÃ i tá»‘i thiá»ƒu 8 kÃ½ tá»±, báº¯t buá»™c chá»©a Ã­t nháº¥t 1 chá»¯ cÃ¡i viáº¿t hoa, 1 chá»¯ cÃ¡i viáº¿t thÆ°á»ng, 1 chá»¯ sá»‘.
- **MÃ£ hÃ³a lÆ°u trá»¯:** Máº­t kháº©u ngÆ°á»i dÃ¹ng tuyá»‡t Ä‘á»‘i khÃ´ng lÆ°u dáº¡ng chá»¯ thÃ´ (Plain-text). Báº¯t buá»™c Ä‘Æ°á»£c bÄƒm mÃ£ hÃ³a báº±ng thuáº­t toÃ¡n `BCrypt` vá»›i cost factor = 10 trÆ°á»›c khi lÆ°u vÃ o báº£ng `users`.
- **PhÃ²ng chá»‘ng Brute Force:** Nháº­p sai máº­t kháº©u liÃªn tiáº¿p `5 láº§n` trong vÃ²ng 15 phÃºt sáº½ táº¡m thá»i khÃ³a chá»©c nÄƒng Ä‘Äƒng nháº­p cá»§a tÃ i khoáº£n Ä‘Ã³ trong `30 phÃºt` hoáº·c yÃªu cáº§u xÃ¡c thá»±c OTP qua Email.

#### POL-02: ChÃ­nh sÃ¡ch PhiÃªn lÃ m viá»‡c JWT Token (JWT Session Policy)
- **Access Token:** CÃ³ thá»i háº¡n hiá»‡u lá»±c tá»‘i Ä‘a `24 giá»`. Chá»©a thÃ´ng tin User ID, Username vÃ  Danh sÃ¡ch Role (`ROLE_CUSTOMER`, `ROLE_STAFF`, `ROLE_ADMIN`). ÄÆ°á»£c kÃ½ sá»‘ báº±ng thuáº­t toÃ¡n HMAC-SHA512 vá»›i chuá»—i mÃ£ secret mÃ£ hÃ³a 512-bit.
- **Refresh Token:** CÃ³ thá»i háº¡n hiá»‡u lá»±c `7 ngÃ y`, phá»¥c vá»¥ cÆ¡ cháº¿ tá»± Ä‘á»™ng gia háº¡n token mÃ  khÃ´ng cáº§n ngÆ°á»i dÃ¹ng nháº­p láº¡i máº­t kháº©u.
- **Thu há»“i phiÃªn lÃ m viá»‡c (Revocation):** Khi ngÆ°á»i dÃ¹ng báº¥m **ÄÄƒng xuáº¥t** hoáº·c thá»±c hiá»‡n **Äá»•i máº­t kháº©u**, Token hiá»‡n táº¡i láº­p tá»©c bá»‹ Ä‘Æ°a vÃ o danh sÃ¡ch Ä‘en (Blacklist Redis/Cache) Ä‘á»ƒ vÃ´ hiá»‡u hÃ³a ngay láº­p tá»©c.

#### POL-03: ChÃ­nh sÃ¡ch PhÃ¢n quyá»n RBAC (Role-Based Access Control)
- PhÃ¢n Ä‘á»‹nh ranh giá»›i phÃ¢n quyá»n nghiÃªm ngáº·t trÃªn Spring Security Filter Chain:
  - TÃ i khoáº£n **KhÃ¡ch vÃ£ng lai / KhÃ¡ch hÃ ng (`ROLE_CUSTOMER`)** tuyá»‡t Ä‘á»‘i khÃ´ng Ä‘Æ°á»£c phÃ©p truy cáº­p cÃ¡c URL API tiá»n tá»‘ `/api/v1/admin/**` hay `/api/v1/staff/**`. Náº¿u vi pháº¡m, há»‡ thá»‘ng tá»± Ä‘á»™ng tráº£ vá» lá»—i `HTTP 403 Forbidden` vÃ  ghi váº¿t Log cáº£nh bÃ¡o báº£o máº­t.

---

### 2.2. ChÃ­nh sÃ¡ch An toÃ n API & PhÃ²ng thá»§ Máº¡ng (API & Network Defense Policy)

#### POL-04: ChÃ­nh sÃ¡ch Giá»›i háº¡n Táº§n suáº¥t Truy cáº­p (Rate Limiting Policy)
- Äá»ƒ ngÄƒn cháº·n táº¥n cÃ´ng tá»« chá»‘i dá»‹ch vá»¥ (DoS/DDoS) vÃ  bot cÃ o dá»¯ liá»‡u, Nginx vÃ  Spring Boot API Ã¡p dá»¥ng quy táº¯c Rate Limit:
  - API Äá»c dá»¯ liá»‡u cÃ´ng khai (Sáº£n pháº©m, Danh má»¥c): Tá»‘i Ä‘a `100 requests / phÃºt / IP`.
  - API ÄÄƒng kÃ½ / ÄÄƒng nháº­p / KhÃ´i phá»¥c OTP: Tá»‘i Ä‘a `5 requests / phÃºt / IP`.
  - API Äáº·t hÃ ng & Thanh toÃ¡n: Tá»‘i Ä‘a `10 requests / phÃºt / User`.

#### POL-05: ChÃ­nh sÃ¡ch Chia sáº» TÃ i nguyÃªn KhÃ¡c Nguá»“n (CORS Policy)
- Cáº¥u hÃ¬nh chá»‰ cháº¥p nháº­n cÃ¡c yÃªu cáº§u HTTP CORS tá»« danh sÃ¡ch tÃªn miá»n Whitelist Ä‘Æ°á»£c chá»‰ Ä‘á»‹nh chÃ­nh thá»©c cá»§a Frontend (vÃ­ dá»¥: `https://foxstyle.com` hoáº·c `http://localhost:5173` trong mÃ´i trÆ°á»ng Dev).
- Cháº·n táº¥t cáº£ cÃ¡c Request tá»« cÃ¡c Domain láº¡ khÃ´ng cÃ³ trong danh má»¥c Whitelist.

#### POL-06: ChÃ­nh sÃ¡ch PhÃ²ng chá»‘ng Táº¥n cÃ´ng OWAsáº£n pháº©m Top 10
- **SQL Injection:** ToÃ n bá»™ thao tÃ¡c truy váº¥n CSDL báº¯t buá»™c sá»­ dá»¥ng Hibernate JPA Parameterized Queries hoáº·c Prepared Statements. KhÃ´ng ná»‘i chuá»—i SQL thá»§ cÃ´ng.
- **Cross-Site Scripting (XSS):** Sá»­ dá»¥ng React JSX Auto-escaping trÃªn Frontend vÃ  thá»±c hiá»‡n lá»c dá»¯ liá»‡u Ä‘áº§u vÃ o (Input Sanitization) táº¡i Backend.
- **Cross-Site Request Forgery (CSRF):** Sá»­ dá»¥ng JWT Header-based authentication thay cho Cookie truyá»n thá»‘ng Ä‘á»ƒ triá»‡t tiÃªu nguy cÆ¡ táº¥n cÃ´ng CSRF.
- **XÃ¡c thá»±c Webhook Signature:** Táº¥t cáº£ API nháº­n Webhook tá»« PayOS báº¯t buá»™c pháº£i bÄƒm kiá»ƒm tra chá»¯ kÃ½ `HMAC SHA256` trÃ¹ng khá»›p vá»›i Secret Key Ä‘Æ°á»£c cáº¥p trÆ°á»›c khi cháº¥p nháº­n xá»­ lÃ½ Ä‘Æ¡n hÃ ng.

---

### 2.3. ChÃ­nh sÃ¡ch Quáº£n lÃ½ & Báº£o vá»‡ Dá»¯ liá»‡u (Data Protection & Privacy Policy)

#### POL-07: MÃ£ hÃ³a Dá»¯ liá»‡u truyá»n táº£i & LÆ°u trá»¯ (Data Encryption Standard)
- **Data in Transit (Dá»¯ liá»‡u Ä‘ang truyá»n táº£i):** 100% lÆ°u lÆ°á»£ng máº¡ng giá»¯a Client âž” Server âž” Third-party pháº£i Ä‘Æ°á»£c mÃ£ hÃ³a qua giao thá»©c `HTTPS (TLS 1.3)`.
- **Data at Rest (Dá»¯ liá»‡u lÆ°u trá»¯):** CÆ¡ sá»Ÿ dá»¯ liá»‡u MS SQL Server báº­t tÃ­nh nÄƒng mÃ£ hÃ³a Transparent Data Encryption (TDE) Ä‘á»ƒ báº£o vá»‡ toÃ n bá»™ tá»‡p CSDL trÃªn Ä‘Ä©a cá»©ng.

#### POL-08: ChÃ­nh sÃ¡ch Báº£o máº­t ThÃ´ng tin CÃ¡ nhÃ¢n KhÃ¡ch hÃ ng (PII Privacy Policy)
- Sá»‘ Ä‘iá»‡n thoáº¡i vÃ  Ä‘á»‹a chá»‰ giao hÃ ng cá»§a khÃ¡ch hÃ ng chá»‰ Ä‘Æ°á»£c hiá»ƒn thá»‹ Ä‘áº§y Ä‘á»§ cho nhÃ¢n viÃªn phá»¥ trÃ¡ch giao hÃ ng.
- KhÃ´ng chia sáº» dá»¯ liá»‡u cÃ¡ nhÃ¢n cá»§a khÃ¡ch hÃ ng cho báº¥t ká»³ bÃªn thá»© ba nÃ o ngoÃ i cÃ¡c Ä‘á»‘i tÃ¡c váº­n chuyá»ƒn vÃ  thanh toÃ¡n Ä‘Æ°á»£c á»§y quyá»n.

---

### 2.4. ChÃ­nh sÃ¡ch Sao lÆ°u & KhÃ´i phá»¥c Tháº£m há»a (Backup & Disaster Recovery Policy)

#### POL-09: Táº§n suáº¥t & PhÆ°Æ¡ng thá»©c Sao lÆ°u Dá»¯ liá»‡u (Database Backup Strategy)
- **Full Database Backup:** Thá»±c hiá»‡n tá»± Ä‘á»™ng lÃºc `02:00 sÃ¡ng hÃ ng ngÃ y`. File backup Ä‘Æ°á»£c nÃ©n vÃ  Ä‘áº©y vá» mÃ¡y lÆ°u trá»¯ cáº¥t giá»¯ Ä‘á»™c láº­p.
- **Differential Backup:** Thá»±c hiá»‡n tá»± Ä‘á»™ng `4 tiáº¿ng má»™t láº§n` trong ngÃ y.
- **Transaction Log Backup:** Thá»±c hiá»‡n `15 phÃºt má»™t láº§n` Ä‘á»ƒ Ä‘áº£m báº£o thá»i Ä‘iá»ƒm cÃ³ thá»ƒ khÃ´i phá»¥c dá»¯ liá»‡u gáº§n vá»›i thá»i Ä‘iá»ƒm xáº£y ra sá»± cá»‘ nháº¥t.
- **Thá»i gian lÆ°u trá»¯ (Retention Period):** Báº£n sao lÆ°u Full lÆ°u giá»¯ tá»‘i thiá»ƒu `30 ngÃ y`.

#### POL-10: Chá»‰ sá»‘ Má»¥c tiÃªu KhÃ´i phá»¥c Tháº£m há»a (RTO & RPO Objectives)
- **RPO (Recovery Point Objective - Giá»›i háº¡n máº¥t mÃ¡t dá»¯ liá»‡u):** Tá»‘i Ä‘a `15 phÃºt` (nhá» cÆ¡ cháº¿ Transaction Log Backup 15p/láº§n).
- **RTO (Recovery Time Objective - Thá»i gian khÃ´i phá»¥c dá»‹ch vá»¥):** Tá»‘i Ä‘a `2 giá»` ká»ƒ tá»« khi phÃ¡t sinh sá»± cá»‘ pháº§n cá»©ng hoáº·c tháº£m há»a há»‡ thá»‘ng.

---

### 2.5. ChÃ­nh sÃ¡ch Nháº­t kÃ½ Váº­n hÃ nh & GiÃ¡m sÃ¡t (Logging & Audit Trail Policy)

#### POL-11: LÆ°u váº¿t Nháº­t kÃ½ Kiá»ƒm toÃ¡n (Audit Trail Policy)
- Táº¥t cáº£ cÃ¡c thao tÃ¡c thay Ä‘á»•i dá»¯ liá»‡u quan trá»ng thá»±c hiá»‡n bá»Ÿi vai trÃ² Admin vÃ  Staff (ThÃªm/Sá»­a/XÃ³a sáº£n pháº©m, Ä‘á»•i tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng, Ä‘á»•i giÃ¡ tiá»n, khÃ³a tÃ i khoáº£n ngÆ°á»i dÃ¹ng) báº¯t buá»™c pháº£i Ä‘Æ°á»£c ghi vÃ o báº£ng **`audit_logs`**.
- ThÃ´ng tin nháº­t kÃ½ ghi nháº­n bao gá»“m: `user_id`, `action_type`, `target_table`, `old_value`, `new_value`, `ip_address`, `timestamp`.
- Nháº­t kÃ½ kiá»ƒm toÃ¡n lÃ  dá»¯ liá»‡u **Chá»‰ Ä‘á»c (Read-only)**, tuyá»‡t Ä‘á»‘i khÃ´ng ai Ä‘Æ°á»£c phÃ©p sá»­a Ä‘á»•i hoáº·c xÃ³a bá».

#### POL-12: GiÃ¡m sÃ¡t Há»‡ thá»‘ng & Cáº£nh bÃ¡o (System Monitoring & Alerting)
- GiÃ¡m sÃ¡t tá»± Ä‘á»™ng cÃ¡c thÃ´ng sá»‘ pháº§n cá»©ng Server: Dung lÆ°á»£ng CPU (>85%), RAM (>90%), Dung lÆ°á»£ng Ä‘Ä©a cá»©ng (>80%).
- Tá»± Ä‘á»™ng phÃ¡t cáº£nh bÃ¡o Telegram / Email cho Ä‘á»™i ngÅ© ká»¹ thuáº­t khi phÃ¡t sinh lá»—i `HTTP 5xx` liÃªn tá»¥c trÃªn Backend API.

---

### 2.6. ChÃ­nh sÃ¡ch Báº£o trÃ¬ & Quáº£n lÃ½ Sá»± cá»‘ (Maintenance & Incident Response Policy)

#### POL-13: Quy trÃ¬nh Báº£o trÃ¬ Äá»‹nh ká»³ (Scheduled Maintenance Policy)
- Má»i hoáº¡t Ä‘á»™ng nÃ¢ng cáº¥p há»‡ thá»‘ng, vÃ¡ lá»—i báº£o máº­t hoáº·c cáº­p nháº­t phiÃªn báº£n má»›i pháº£i Ä‘Æ°á»£c lÃªn káº¿ hoáº¡ch trÆ°á»›c vÃ  thá»±c hiá»‡n vÃ o khung giá» tháº¥p Ä‘iá»ƒm (tá»« `01:00 Ä‘áº¿n 04:00 sÃ¡ng`).
- PhÃ¡t thÃ´ng bÃ¡o báº£o trÃ¬ trÃªn trang chá»§ trÆ°á»›c thá»i Ä‘iá»ƒm báº£o trÃ¬ Ã­t nháº¥t `24 giá»`.

#### POL-14: Quy trÃ¬nh 4 BÆ°á»›c Xá»­ lÃ½ Sá»± cá»‘ An ninh Máº¡ng (Incident Response Workflow)
1. **PhÃ¡t hiá»‡n & PhÃ¢n loáº¡i (Detection):** Tiáº¿p nháº­n cáº£nh bÃ¡o tá»« giÃ¡m sÃ¡t há»‡ thá»‘ng hoáº·c pháº£n Ã¡nh cá»§a ngÆ°á»i dÃ¹ng. PhÃ¢n loáº¡i má»©c Ä‘á»™ nghiÃªm trá»ng (Tháº¥p, Trung bÃ¬nh, Cao, Kháº©n cáº¥p).
2. **CÃ´ láº­p Sá»± cá»‘ (Containment):** Táº¡m thá»i ngáº¯t káº¿t ná»‘i cÃ¡c Docker container hoáº·c Ä‘á»‹a chá»‰ IP bá»‹ táº¥n cÃ´ng Ä‘á»ƒ ngÄƒn cháº·n sá»± cá»‘ lan rá»™ng.
3. **Kháº¯c phá»¥c & Xá»­ lÃ½ (Remediation):** VÃ¡ lá»— há»•ng an ninh, khÃ´i phá»¥c dá»¯ liá»‡u tá»« báº£n sao lÆ°u an toÃ n gáº§n nháº¥t.
4. **ÄÃ¡nh giÃ¡ & RÃºt kinh nghiá»‡m (Post-Incident Review):** Láº­p bÃ¡o cÃ¡o sá»± cá»‘, phÃ¢n tÃ­ch nguyÃªn nhÃ¢n gá»‘c rá»… (Root Cause Analysis - RCA) vÃ  cáº­p nháº­t bá»• sung chÃ­nh sÃ¡ch phÃ²ng thá»§.

---

## Lá»œI Káº¾T & TÃNH PHÃP LÃ TÃ€I LIá»†U

TÃ i liá»‡u **Thiáº¿t káº¿ Háº¡ táº§ng Máº¡ng & ChÃ­nh sÃ¡ch Há»‡ thá»‘ng FoxStyle** thiáº¿t láº­p khung chuáº©n má»±c vá» háº¡ táº§ng ká»¹ thuáº­t, an ninh thÃ´ng tin vÃ  quy trÃ¬nh váº­n hÃ nh an toÃ n. 

TÃ i liá»‡u nÃ y Ä‘Æ°á»£c Ä‘á»“ng bá»™ liÃªn káº¿t vá»›i:
- [Äáº·c táº£ YÃªu cáº§u Há»‡ thá»‘ng SRS](./yeu_cau_he_thong.md)
- [MÃ´ táº£ Chi tiáº¿t CÃ¡c Chá»©c nÄƒng Há»‡ thá»‘ng](./mo_ta_chi_tiet_chuc_nang.md)
- [SÆ¡ Ä‘á»“ & Äáº·c táº£ Ca sá»­ dá»¥ng Use Case](./so_do_use_case.md)
