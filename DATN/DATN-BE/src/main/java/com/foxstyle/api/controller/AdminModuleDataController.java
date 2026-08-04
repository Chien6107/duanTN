package com.foxstyle.api.controller;

import com.foxstyle.api.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/admin-data")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminModuleDataController {
    private static final Set<String> MODULES = Set.of("brands", "topics", "warranties");
    private final JdbcTemplate jdbc;

    @GetMapping("/{module}")
    public ApiResponse<List<Map<String, Object>>> list(@PathVariable String module) {
        validate(module);
        return response(switch (module) {
            case "brands" -> jdbc.queryForList("""
                SELECT brand_id id, brand_name name, logo_url logo, country, website_url website,
                       description, status, is_featured isFeatured
                FROM brands ORDER BY brand_id DESC
                """);
            case "topics" -> jdbc.queryForList("""
                SELECT t.topic_id id, t.topic_name name, t.slug, t.description, t.status,
                       COUNT(a.article_id) articleCount
                FROM article_topics t LEFT JOIN articles a ON a.topic_id=t.topic_id
                GROUP BY t.topic_id,t.topic_name,t.slug,t.description,t.status
                ORDER BY t.topic_id DESC
                """);
            default -> warrantyRows(null);
        });
    }

    @PostMapping("/{module}")
    public ApiResponse<Map<String, Object>> create(@PathVariable String module,
                                                    @RequestBody Map<String, Object> body) {
        validate(module);
        Long id = switch (module) {
            case "brands" -> createBrand(body);
            case "topics" -> createTopic(body);
            default -> createWarranty(body);
        };
        return response(findOne(module, id));
    }

    @PutMapping("/{module}/{id}")
    public ApiResponse<Map<String, Object>> update(@PathVariable String module, @PathVariable Long id,
                                                    @RequestBody Map<String, Object> body) {
        validate(module);
        int changed = switch (module) {
            case "brands" -> updateBrand(id, body);
            case "topics" -> updateTopic(id, body);
            default -> jdbc.update("""
                UPDATE warranty_claims SET status=?,reason=?,resolution_note=CAST(? AS NVARCHAR(MAX)),serial_number=CAST(? AS NVARCHAR(100)),
                    warranty_days=?,expiry_date=CAST(? AS DATE),completed_at=CASE WHEN ? IN ('completed','returned')
                    THEN COALESCE(completed_at,SYSDATETIME()) ELSE completed_at END WHERE claim_id=?
                """, text(body,"status"), text(body,"issue"), nullable(body,"note"), nullable(body,"serialNumber"),
                    integer(body,"warrantyDays",30), nullable(body,"expiryDate"), text(body,"status"), id);
        };
        if (changed == 0) throw new IllegalArgumentException("Không tìm thấy dữ liệu cần cập nhật");
        return response(findOne(module, id));
    }

    @DeleteMapping("/{module}/{id}")
    public ApiResponse<Void> delete(@PathVariable String module, @PathVariable Long id) {
        validate(module);
        int changed = switch (module) {
            case "brands" -> jdbc.update("DELETE FROM brands WHERE brand_id=?", id);
            case "topics" -> jdbc.update("DELETE FROM article_topics WHERE topic_id=?", id);
            default -> jdbc.update("DELETE FROM warranty_claims WHERE claim_id=?", id);
        };
        if (changed == 0) throw new IllegalArgumentException("Không tìm thấy dữ liệu cần xóa");
        return response(null);
    }

    private Long createWarranty(Map<String,Object> body) {
        Integer orderId = numericCode(body.get("orderCode"));
        Integer productId = integer(body,"productId",null);
        if (orderId == null || productId == null) {
            throw new IllegalArgumentException("Phiếu bảo hành phải gắn với đơn hàng và sản phẩm hợp lệ");
        }
        Map<String,Object> source = jdbc.queryForMap("""
            SELECT TOP 1 od.order_detail_id, o.user_id
            FROM order_details od JOIN orders o ON o.order_id=od.order_id
            JOIN product_variants v ON v.variant_id=od.variant_id
            WHERE o.order_id=? AND v.product_id=? ORDER BY od.order_detail_id
            """, orderId, productId);
        return jdbc.queryForObject("""
            INSERT INTO warranty_claims(claim_code,order_detail_id,user_id,reason,status,resolution_note,
                serial_number,warranty_days,expiry_date)
            OUTPUT INSERTED.claim_id VALUES (?,?,?,?,?,CAST(? AS NVARCHAR(MAX)),CAST(? AS NVARCHAR(100)),?,CAST(? AS DATE))
            """, Long.class, text(body,"code"), source.get("order_detail_id"), source.get("user_id"),
                text(body,"issue"), text(body,"status"), nullable(body,"note"), nullable(body,"serialNumber"),
                integer(body,"warrantyDays",30), nullable(body,"expiryDate"));
    }

    private Long createTopic(Map<String, Object> body) {
        String name = normalizedTopicName(body);
        ensureUniqueTopic(name, null);
        return jdbc.queryForObject("""
            INSERT INTO article_topics(topic_name,slug,description,status)
            OUTPUT INSERTED.topic_id VALUES (?,?,?,?)
            """, Long.class, name, text(body,"slug"), nullable(body,"description"), status(body));
    }

    private Long createBrand(Map<String, Object> body) {
        String name = normalizedBrandName(body);
        ensureUniqueBrand(name, null);
        return jdbc.queryForObject("""
            INSERT INTO brands(brand_name,logo_url,country,website_url,description,is_featured,status)
            OUTPUT INSERTED.brand_id VALUES (?,?,?,?,?,?,?)
            """, Long.class, name, nullable(body,"logo"), nullable(body,"country"),
                nullable(body,"website"), nullable(body,"description"), bool(body,"isFeatured"), status(body));
    }

    private int updateBrand(Long id, Map<String, Object> body) {
        String name = normalizedBrandName(body);
        ensureUniqueBrand(name, id);
        return jdbc.update("""
            UPDATE brands SET brand_name=?,logo_url=?,country=?,website_url=?,description=?,
                is_featured=?,status=?,updated_at=SYSDATETIME() WHERE brand_id=?
            """, name, nullable(body,"logo"), nullable(body,"country"), nullable(body,"website"),
                nullable(body,"description"), bool(body,"isFeatured"), status(body), id);
    }

    private String normalizedBrandName(Map<String, Object> body) {
        return text(body, "name").replaceAll("\\s+", " ");
    }

    private void ensureUniqueBrand(String name, Long excludedId) {
        Integer count = excludedId == null
                ? jdbc.queryForObject("SELECT COUNT(*) FROM brands WHERE LOWER(LTRIM(RTRIM(brand_name)))=LOWER(?)", Integer.class, name)
                : jdbc.queryForObject("SELECT COUNT(*) FROM brands WHERE LOWER(LTRIM(RTRIM(brand_name)))=LOWER(?) AND brand_id<>?", Integer.class, name, excludedId);
        if (count != null && count > 0) {
            throw new IllegalArgumentException("Tên thương hiệu đã tồn tại: " + name);
        }
    }

    private int updateTopic(Long id, Map<String, Object> body) {
        String name = normalizedTopicName(body);
        ensureUniqueTopic(name, id);
        return jdbc.update("""
            UPDATE article_topics SET topic_name=?,slug=?,description=?,status=? WHERE topic_id=?
            """, name, text(body,"slug"), nullable(body,"description"), status(body), id);
    }

    private String normalizedTopicName(Map<String, Object> body) {
        return text(body, "name").replaceAll("\\s+", " ");
    }

    private void ensureUniqueTopic(String name, Long excludedId) {
        Integer count = excludedId == null
                ? jdbc.queryForObject("SELECT COUNT(*) FROM article_topics WHERE LOWER(LTRIM(RTRIM(topic_name)))=LOWER(?)", Integer.class, name)
                : jdbc.queryForObject("SELECT COUNT(*) FROM article_topics WHERE LOWER(LTRIM(RTRIM(topic_name)))=LOWER(?) AND topic_id<>?", Integer.class, name, excludedId);
        if (count != null && count > 0) {
            throw new IllegalArgumentException("Tên chủ đề đã tồn tại: " + name);
        }
    }

    private List<Map<String,Object>> warrantyRows(Long id) {
        String sql = """
            SELECT wc.claim_id id,wc.claim_code code,u.full_name customerName,u.phone,u.email,
                   CONCAT('DH',o.order_id) orderCode,o.recipient_name orderName,p.product_id productId,
                   p.product_name productName,wc.serial_number serialNumber,CAST(o.order_date AS date) purchaseDate,
                   wc.warranty_days warrantyDays,wc.reason issue,wc.resolution_note note,wc.status,
                   wc.created_at createdAt,CAST(wc.expiry_date AS date) expiryDate
            FROM warranty_claims wc JOIN users u ON u.user_id=wc.user_id
            JOIN order_details od ON od.order_detail_id=wc.order_detail_id
            JOIN orders o ON o.order_id=od.order_id JOIN product_variants v ON v.variant_id=od.variant_id
            JOIN products p ON p.product_id=v.product_id
            """ + (id == null ? " ORDER BY wc.claim_id DESC" : " WHERE wc.claim_id=?");
        return id == null ? jdbc.queryForList(sql) : jdbc.queryForList(sql,id);
    }

    private Map<String,Object> findOne(String module, Long id) {
        List<Map<String,Object>> rows = switch (module) {
            case "brands" -> jdbc.queryForList("SELECT brand_id id,brand_name name,logo_url logo,country,website_url website,description,status,is_featured isFeatured FROM brands WHERE brand_id=?",id);
            case "topics" -> jdbc.queryForList("SELECT topic_id id,topic_name name,slug,description,status,(SELECT COUNT(*) FROM articles a WHERE a.topic_id=article_topics.topic_id) articleCount FROM article_topics WHERE topic_id=?",id);
            default -> warrantyRows(id);
        };
        if (rows.isEmpty()) throw new IllegalArgumentException("Không tìm thấy dữ liệu");
        return rows.get(0);
    }

    private String text(Map<String,Object> body,String key){ Object value=body.get(key); if(value==null||value.toString().isBlank()) throw new IllegalArgumentException(key+" không được để trống"); return value.toString().trim(); }
    private Object nullable(Map<String,Object> body,String key){ Object value=body.get(key); return value==null||value.toString().isBlank()?null:value; }
    private boolean bool(Map<String,Object> body,String key){ return Boolean.parseBoolean(String.valueOf(body.getOrDefault(key,false))); }
    private byte status(Map<String,Object> body){ return Byte.parseByte(String.valueOf(body.getOrDefault("status",1))); }
    private Integer integer(Map<String,Object> body,String key,Integer fallback){ try{return Integer.valueOf(String.valueOf(body.get(key)));}catch(Exception e){return fallback;} }
    private Integer numericCode(Object value){ if(value==null)return null; String digits=value.toString().replaceAll("\\D",""); return digits.isBlank()?null:Integer.valueOf(digits); }
    private void validate(String module){ if(!MODULES.contains(module)) throw new IllegalArgumentException("Module không hợp lệ"); }
    private <T> ApiResponse<T> response(T data){ return ApiResponse.<T>builder().status("success").message("Đồng bộ SQL thành công").data(data).timestamp(LocalDateTime.now()).build(); }
}
