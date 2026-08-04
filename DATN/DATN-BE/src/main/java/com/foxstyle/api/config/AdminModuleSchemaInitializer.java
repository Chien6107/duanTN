package com.foxstyle.api.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@Order(-200)
@RequiredArgsConstructor
public class AdminModuleSchemaInitializer implements ApplicationRunner {
    private final JdbcTemplate jdbc;

    @Override
    public void run(ApplicationArguments args) {
        jdbc.execute("IF COL_LENGTH('warranty_claims','serial_number') IS NULL ALTER TABLE warranty_claims ADD serial_number NVARCHAR(100) NULL");
        jdbc.execute("IF COL_LENGTH('warranty_claims','warranty_days') IS NULL ALTER TABLE warranty_claims ADD warranty_days INT NOT NULL CONSTRAINT DF_warranty_days DEFAULT 30 WITH VALUES");
        jdbc.execute("IF COL_LENGTH('warranty_claims','expiry_date') IS NULL ALTER TABLE warranty_claims ADD expiry_date DATE NULL");

        // Chuyển thương hiệu cũ đang nằm trong products.brand sang bảng brands chuẩn.
        jdbc.update("""
            INSERT INTO brands(brand_name,status)
            SELECT DISTINCT LTRIM(RTRIM(p.brand)),1 FROM products p
            WHERE NULLIF(LTRIM(RTRIM(p.brand)),'') IS NOT NULL
              AND NOT EXISTS (SELECT 1 FROM brands b WHERE b.brand_name=LTRIM(RTRIM(p.brand)))
            """);
        jdbc.update("""
            UPDATE p SET p.brand_id=b.brand_id FROM products p JOIN brands b ON b.brand_name=LTRIM(RTRIM(p.brand))
            WHERE p.brand_id IS NULL AND NULLIF(LTRIM(RTRIM(p.brand)),'') IS NOT NULL
            """);

        // Giữ khóa ngoại/lịch sử nhưng đổi tên các combo cũ từng bị gán nhầm tên sản phẩm lẻ.
        jdbc.update("UPDATE products SET product_name=N'[SET COMBO] Set Phối Đồ Công Sở Lịch Lãm' WHERE is_combo=1 AND description LIKE '%COMBO:2,5%' AND product_name NOT LIKE '[[]SET COMBO]%'");
        jdbc.update("UPDATE products SET product_name=N'[SET COMBO] Set Dạo Phố Streetwear' WHERE is_combo=1 AND description LIKE '%COMBO:3,4%' AND product_name NOT LIKE '[[]SET COMBO]%'");
        jdbc.update("UPDATE products SET product_name=N'[SET COMBO] Set Phụ Kiện Quý Ông FoxStyle' WHERE is_combo=1 AND description LIKE '%COMBO:12,13%' AND product_name NOT LIKE '[[]SET COMBO]%'");

        // Tạo dữ liệu bảo hành demo có khóa ngoại thật, không dùng mã đơn/sản phẩm giả.
        jdbc.update("""
            IF NOT EXISTS (SELECT 1 FROM warranty_claims)
            INSERT INTO warranty_claims(claim_code,order_detail_id,user_id,reason,status,resolution_note,
                                        serial_number,warranty_days,expiry_date,created_at)
            SELECT TOP 12 CONCAT('BHDEMO',RIGHT('000'+CAST(ROW_NUMBER() OVER(ORDER BY od.order_detail_id) AS VARCHAR),3)),
                   od.order_detail_id,o.user_id,
                   CASE ROW_NUMBER() OVER(ORDER BY od.order_detail_id)%4
                       WHEN 0 THEN N'Bung đường chỉ sản phẩm'
                       WHEN 1 THEN N'Lỗi khóa kéo hoặc phụ kiện'
                       WHEN 2 THEN N'Sản phẩm bị lỗi phom dáng'
                       ELSE N'Màu vải không đồng đều' END,
                   CASE ROW_NUMBER() OVER(ORDER BY od.order_detail_id)%5
                       WHEN 0 THEN 'pending' WHEN 1 THEN 'inspecting' WHEN 2 THEN 'repairing'
                       WHEN 3 THEN 'completed' ELSE 'returned' END,
                   N'Phiếu bảo hành demo liên kết với đơn hàng thật',
                   CONCAT('FS-WR-',RIGHT('00000'+CAST(od.order_detail_id AS VARCHAR),5)),30,
                   DATEADD(day,30,CAST(o.order_date AS date)),DATEADD(day,2,o.order_date)
            FROM order_details od JOIN orders o ON o.order_id=od.order_id
            ORDER BY od.order_detail_id
            """);
        jdbc.update("UPDATE warranty_claims SET reason=? WHERE reason LIKE '%?%'",
                "Yêu cầu kiểm tra và bảo hành sản phẩm");
    }
}
