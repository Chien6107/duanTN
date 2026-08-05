package com.foxstyle.api.service.impl;

import com.foxstyle.api.entity.Order;
import com.foxstyle.api.entity.OrderDetail;
import com.foxstyle.api.exception.BadRequestException;
import com.foxstyle.api.service.MailService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Sends transactional email either over SMTP (default) or through the Brevo
 * HTTP API, selected via app.mail.provider (MAIL_PROVIDER env var: "smtp" or
 * "http"/"brevo"). The HTTP path exists because some hosts (e.g. Railway)
 * block outbound SMTP ports at the network level, in which case JavaMailSender
 * can never open a TCP connection out no matter how it's configured.
 */
@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService {

    private static final String BREVO_SEND_URL = "https://api.brevo.com/v3/smtp/email";

    private final JavaMailSender mailSender;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.mail.provider:smtp}")
    private String mailProvider;

    @Value("${brevo.api-key:}")
    private String brevoApiKey;

    @Value("${spring.mail.username:}")
    private String senderEmail;

    @Value("${MAIL_FROM_NAME}")
    private String senderName;

    @Override
    @Async("taskExecutor")
    public void sendOtpEmail(String email, String otpCode) {
        StringBuilder sb = new StringBuilder();
        sb.append("<div style=\"font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #f0f0f0; border-radius: 16px;\">");
        sb.append("<h2 style=\"color: #ea580c; text-align: center; text-transform: uppercase; margin-bottom: 8px;\">Xác thực tài khoản</h2>");
        sb.append("<p style=\"color: #4b5563; font-size: 14px; text-align: center; margin-bottom: 24px;\">Hệ thống thời trang FoxStyle Fashion Store</p>");
        sb.append("<p>Chào bạn,</p>");
        sb.append("<p>Bạn đang thực hiện thao tác yêu cầu mã xác thực OTP tại FoxStyle Store.</p>");

        sb.append("<div style=\"background-color: #fcf8f5; border: 1px solid #ffedd5; padding: 18px; text-align: center; border-radius: 12px; margin: 24px 0;\">");
        sb.append("<p style=\"margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; color: #ea580c; font-weight: bold; letter-spacing: 1px;\">Mã xác thực OTP (6 chữ số)</p>");
        sb.append("<span style=\"font-size: 28px; font-weight: 900; letter-spacing: 6px; color: #ea580c;\">").append(otpCode).append("</span>");
        sb.append("</div>");

        sb.append("<p style=\"color: #ef4444; font-size: 12px; font-weight: bold;\">⚠️ Lưu ý: Mã xác thực có giá trị trong vòng 3 phút. Tuyệt đối không chia sẻ mã này với bất kỳ ai để đảm bảo an toàn thông tin.</p>");
        sb.append("<p style=\"font-size: 11px; color: #9ca3af; text-align: center; margin-top: 32px; border-top: 1px solid #f3f4f6; padding-top: 16px;\">");
        sb.append("Hệ thống tự động bởi FoxStyle Store. Vui lòng không phản hồi email này.");
        sb.append("</p>");
        sb.append("</div>");

        try {
            sendEmail(email, "FoxStyle - Mã xác thực tài khoản", sb.toString());
            System.out.println("[MAIL/" + mailProvider + "] Gửi email xác thực OTP thành công tới: " + email);
        } catch (Exception e) {
            System.err.println("[MAIL/" + mailProvider + "] Gửi email xác thực OTP thất bại: " + e.getMessage());
            System.out.println("[MAIL-FALLBACK] MÃ OTP CỦA EMAIL " + email + " LÀ: " + otpCode);
            throw new BadRequestException("Gửi mail OTP thất bại: " + e.getMessage());
        }
    }

    @Override
    @Async("taskExecutor")
    public void sendOrderConfirmationEmail(Order order, String recipientEmail) {
        try {
            if (recipientEmail == null || recipientEmail.trim().isEmpty()) {
                recipientEmail = order.getUser() != null ? order.getUser().getEmail() : null;
            }
            if (recipientEmail == null || recipientEmail.trim().isEmpty()) {
                System.out.println("[MAIL] Không gửi được mail xác nhận đơn hàng do địa chỉ email trống.");
                return;
            }

            // Build HTML Content
            StringBuilder sb = new StringBuilder();
            sb.append("<div style=\"font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #f0f0f0; border-radius: 16px;\">");
            sb.append("<h2 style=\"color: #ea580c; text-align: center; text-transform: uppercase;\">Cảm ơn quý khách đã mua sắm!</h2>");
            sb.append("<p>Xin chào <strong>").append(order.getRecipientName()).append("</strong>,</p>");
            sb.append("<p>Đơn hàng của quý khách đã được tạo thành công trên hệ thống FoxStyle Store và đang chờ duyệt.</p>");

            sb.append("<div style=\"background-color: #fcf8f5; border: 1px solid #ffedd5; padding: 16px; border-radius: 12px; margin: 20px 0;\">");
            sb.append("<h4 style=\"margin: 0 0 10px 0; color: #ea580c;\">Chi tiết đơn hàng:</h4>");
            sb.append("<p style=\"margin: 4px 0;\"><strong>Mã đơn hàng:</strong> #").append(order.getOrderId()).append("</p>");
            sb.append("<p style=\"margin: 4px 0;\"><strong>Người nhận:</strong> ").append(order.getRecipientName()).append("</p>");
            sb.append("<p style=\"margin: 4px 0;\"><strong>Số điện thoại:</strong> ").append(order.getRecipientPhone()).append("</p>");
            sb.append("<p style=\"margin: 4px 0;\"><strong>Địa chỉ giao nhận:</strong> ").append(order.getShippingAddress()).append("</p>");

            // List order items
            if (order.getOrderDetails() != null && !order.getOrderDetails().isEmpty()) {
                sb.append("<table style=\"width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 14px;\">");
                sb.append("<thead><tr style=\"background-color: #ffedd5; color: #ea580c; text-align: left;\">");
                sb.append("<th style=\"padding: 8px; border: 1px solid #fed7aa;\">Sản phẩm</th>");
                sb.append("<th style=\"padding: 8px; border: 1px solid #fed7aa; text-align: center;\">SL</th>");
                sb.append("<th style=\"padding: 8px; border: 1px solid #fed7aa; text-align: right;\">Đơn giá</th>");
                sb.append("</tr></thead><tbody>");
                for (OrderDetail detail : order.getOrderDetails()) {
                    String productName = detail.getVariant() != null && detail.getVariant().getProduct() != null
                            ? detail.getVariant().getProduct().getProductName() : "Sản phẩm";
                    String size = detail.getVariant() != null ? detail.getVariant().getSize() : "";
                    String color = detail.getVariant() != null ? detail.getVariant().getColor() : "";
                    sb.append("<tr>");
                    sb.append("<td style=\"padding: 8px; border: 1px solid #f0f0f0;\">")
                      .append(productName).append(" (Size: ").append(size).append(", Màu: ").append(color).append(")</td>");
                    sb.append("<td style=\"padding: 8px; border: 1px solid #f0f0f0; text-align: center;\">").append(detail.getQuantity()).append("</td>");
                    sb.append("<td style=\"padding: 8px; border: 1px solid #f0f0f0; text-align: right;\">")
                      .append(String.format("%,.0fđ", detail.getPrice() != null ? detail.getPrice().doubleValue() : 0.0)).append("</td>");
                    sb.append("</tr>");
                }
                sb.append("</tbody></table>");
            }

            sb.append("<div style=\"margin-top: 12px; border-top: 1px solid #ffedd5; padding-top: 8px; font-size: 14px;\">");
            sb.append("<p style=\"margin: 4px 0;\"><strong>Phí vận chuyển:</strong> ").append(String.format("%,.0fđ", order.getShippingFee() != null ? order.getShippingFee().doubleValue() : 0.0)).append("</p>");
            if (order.getDiscountAmount() != null && order.getDiscountAmount().compareTo(java.math.BigDecimal.ZERO) > 0) {
                sb.append("<p style=\"margin: 4px 0;\"><strong>Giảm giá:</strong> -").append(String.format("%,.0fđ", order.getDiscountAmount().doubleValue())).append("</p>");
            }
            sb.append("<p style=\"margin: 8px 0 0 0; font-size: 16px; color: #ea580c;\"><strong>Tổng thanh toán:</strong> <strong>").append(String.format("%,.0fđ", order.getTotalAmount() != null ? order.getTotalAmount().doubleValue() : 0.0)).append("</strong></p>");
            sb.append("</div>");
            sb.append("</div>");

            sb.append("<p style=\"font-size: 11px; color: #9ca3af; text-align: center; margin-top: 30px;\">");
            sb.append("Hệ thống tự động bởi FoxStyle Fashion. Không trả lời email này.");
            sb.append("</p>");
            sb.append("</div>");

            sendEmail(recipientEmail, "[FoxStyle Fashion Store] Xác nhận đơn hàng thành công #" + order.getOrderId(), sb.toString());
            System.out.println("[MAIL/" + mailProvider + "] Gửi email xác nhận đơn hàng #" + order.getOrderId() + " thành công tới: " + recipientEmail);
        } catch (Exception e) {
            System.err.println("[MAIL/" + mailProvider + "] Gửi email xác nhận đơn hàng thất bại: " + e.getMessage());
        }
    }

    @Override
    @Async("taskExecutor")
    public void sendDiscountCouponEmail(String email, String couponCode) {
        try {
            if (email == null || email.trim().isEmpty()) return;

            String code = (couponCode != null && !couponCode.trim().isEmpty()) ? couponCode.trim() : "FOXSTYLE50";

            StringBuilder sb = new StringBuilder();
            sb.append("<div style=\"font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 550px; margin: 0 auto; padding: 24px; border: 1px solid #f0f0f0; border-radius: 16px;\">");
            sb.append("<h2 style=\"color: #ea580c; text-align: center; text-transform: uppercase; margin-bottom: 6px;\">Chào mừng bạn đến với FoxStyle!</h2>");
            sb.append("<p style=\"color: #4b5563; font-size: 14px; text-align: center; margin-bottom: 24px;\">Hệ thống thời trang FoxStyle Fashion Store</p>");
            sb.append("<p>Xin chào quý khách,</p>");
            sb.append("<p>Cảm ơn bạn đã đăng ký nhận bản tin thời trang và ưu đãi từ FoxStyle Store.</p>");

            sb.append("<div style=\"background-color: #fff7ed; border: 2px dashed #ea580c; padding: 20px; text-align: center; border-radius: 14px; margin: 24px 0;\">");
            sb.append("<p style=\"margin: 0 0 6px 0; font-size: 12px; text-transform: uppercase; color: #ea580c; font-weight: bold; letter-spacing: 1px;\">Mã Ưu Đãi Đã Kích Hoạt</p>");
            sb.append("<span style=\"font-size: 32px; font-weight: 900; letter-spacing: 4px; color: #ea580c;\">").append(code).append("</span>");
            sb.append("<p style=\"margin: 8px 0 0 0; font-size: 13px; color: #4b5563; font-weight: 600;\">Áp dụng ngay khi thanh toán đơn hàng tại website FoxStyle!</p>");
            sb.append("</div>");

            sb.append("<p style=\"color: #6b7280; font-size: 13px;\">Hãy chọn ngay những mẫu trang phục yêu thích nhất và sử dụng mã giảm giá này ở bước thanh toán để nhận ưu đãi đặc biệt nhé.</p>");

            sb.append("<p style=\"font-size: 11px; color: #9ca3af; text-align: center; margin-top: 32px; border-top: 1px solid #f3f4f6; padding-top: 16px;\">");
            sb.append("Hệ thống tự động bởi FoxStyle Store. Vui lòng không phản hồi email này.");
            sb.append("</p>");
            sb.append("</div>");

            sendEmail(email.trim(), "[FoxStyle Store] Tặng bạn mã giảm giá " + code + " khi đăng ký thành viên!", sb.toString());
            System.out.println("[MAIL/" + mailProvider + " SUCCESS] Đã gửi mã giảm giá " + code + " tới email: " + email);
        } catch (Exception e) {
            System.err.println("[MAIL/" + mailProvider + " ERROR] Gửi email mã giảm giá thất bại: " + e.getMessage());
        }
    }

    /** Dispatches to SMTP or the Brevo HTTP API depending on app.mail.provider (default: smtp). */
    private void sendEmail(String to, String subject, String htmlContent) throws Exception {
        if ("http".equalsIgnoreCase(mailProvider) || "brevo".equalsIgnoreCase(mailProvider)) {
            sendViaBrevo(to, subject, htmlContent);
        } else {
            sendViaSmtp(to, subject, htmlContent);
        }
    }

    private void sendViaSmtp(String to, String subject, String htmlContent) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());
        helper.setFrom(senderEmail, senderName);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        mailSender.send(message);
    }

    private void sendViaBrevo(String to, String subject, String htmlContent) {
        Map<String, Object> sender = new LinkedHashMap<>();
        sender.put("name", senderName);
        sender.put("email", senderEmail);

        Map<String, Object> recipient = new LinkedHashMap<>();
        recipient.put("email", to);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("sender", sender);
        body.put("to", List.of(recipient));
        body.put("subject", subject);
        body.put("htmlContent", htmlContent);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", brevoApiKey);
        headers.set("accept", "application/json");

        restTemplate.postForEntity(BREVO_SEND_URL, new HttpEntity<>(body, headers), String.class);
    }
}
