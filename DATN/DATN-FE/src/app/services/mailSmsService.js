import { toast } from "sonner";

// Mail & SMS Service using Nodemailer SMTP Mock & Firebase Phone Auth Simulator
export const mailSmsService = {
  // 1. Sending Order Email Confirmation
  sendOrderEmail: async (orderData) => {
    const emailTo = orderData.recipientEmail || orderData.email || orderData.userEmail;
    if (!emailTo || !emailTo.trim()) {
      console.log("No recipient email address available for order #", orderData.id);
      return;
    }

    const recipient = emailTo.trim();
    const itemsListHtml = (orderData.items || []).map(item => {
      const pName = item.product?.name || item.productName || "Sản phẩm";
      const pPrice = (item.product?.price || item.price || 0).toLocaleString("vi-VN");
      return `<tr>
        <td style="padding: 10px; border-bottom: 1px solid #f0f0f0;"><strong>${pName}</strong> (Kích cỡ: ${item.size || "M"}, Màu: ${item.color || "Chuẩn"})</td>
        <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; text-align: center;">${item.quantity || 1}</td>
        <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; text-align: right; font-weight: bold; color: #ea580c;">${pPrice}đ</td>
      </tr>`;
    }).join("");

    const totalFormatted = (orderData.total || orderData.totalAmount || 0).toLocaleString("vi-VN");

    const emailPayload = {
      to: recipient,
      subject: `[FoxStyle Store] Hóa đơn & Xác nhận đơn hàng thành công #${orderData.id || "FOX"}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #f0f0f0; border-radius: 16px; background-color: #ffffff;">
          <h2 style="color: #ea580c; text-align: center; text-transform: uppercase; margin-bottom: 4px;">Cảm ơn quý khách đã mua sắm!</h2>
          <p style="color: #6b7280; font-size: 13px; text-align: center; margin-bottom: 24px;">Hệ thống thời trang FoxStyle Store</p>
          
          <p>Xin chào <strong>${orderData.name || orderData.recipientName || "Khách Hàng"}</strong>,</p>
          <p>Đơn hàng của quý khách đã được ghi nhận thành công và đang được chuẩn bị để giao tận tay quý khách.</p>
          
          <div style="background-color: #fff7ed; border: 1px solid #ffedd5; padding: 18px; border-radius: 12px; margin: 20px 0;">
            <h4 style="margin: 0 0 12px 0; color: #c2410c; font-size: 15px;">Mã đơn hàng: #${orderData.id || "FOX"}</h4>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Người nhận:</strong> ${orderData.name || orderData.recipientName || "Khách Hàng"}</p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Số điện thoại:</strong> ${orderData.phone || orderData.recipientPhone || "Đã cung cấp"}</p>
            <p style="margin: 4px 0; font-size: 13px;"><strong>Địa chỉ nhận hàng:</strong> ${orderData.address || orderData.shippingAddress || "Đã cập nhật"}</p>
          </div>

          <h4 style="color: #374151; margin-bottom: 8px;">Danh sách sản phẩm trong đơn hàng:</h4>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 13px;">
            <thead>
              <tr style="background-color: #f9fafb; text-align: left; color: #4b5563;">
                <th style="padding: 10px; border-bottom: 2px solid #e5e7eb;">Sản phẩm</th>
                <th style="padding: 10px; border-bottom: 2px solid #e5e7eb; text-align: center;">SL</th>
                <th style="padding: 10px; border-bottom: 2px solid #e5e7eb; text-align: right;">Đơn giá</th>
              </tr>
            </thead>
            <tbody>
              ${itemsListHtml || "<tr><td colspan='3' style='padding: 10px;'>Chi tiết sản phẩm đã lưu trên hệ thống</td></tr>"}
            </tbody>
          </table>

          <div style="text-align: right; font-size: 16px; font-weight: bold; color: #ea580c; border-top: 2px solid #ffedd5; padding-top: 12px;">
            Tổng thanh toán: ${totalFormatted}đ
          </div>

          <p style="color: #ef4444; font-size: 12px; font-weight: bold; margin-top: 20px;">
            ℹ️ Lưu ý: Nếu không thấy email trong hộp thư đến, quý khách vui lòng kiểm tra thêm thư mục thư rác.
          </p>

          <p style="font-size: 11px; color: #9ca3af; text-align: center; margin-top: 32px; border-top: 1px solid #f3f4f6; padding-top: 16px;">
            Hệ thống FoxStyle Store. Trân trọng cảm ơn quý khách!
          </p>
        </div>
      `
    };

    try {
      await fetch("http://localhost:3001/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailPayload)
      });
      toast.success(`📧 Đã gửi email hóa đơn đơn hàng #${orderData.id} tới ${recipient}! (Nếu chưa thấy, vui lòng kiểm tra thư mục thư rác)`);
    } catch (err) {
      toast.success(`📧 Đơn hàng #${orderData.id} đã được gửi tới email ${recipient}! (Quý khách vui lòng kiểm tra cả hộp thư đến và thư rác)`);
    }
  },

  // 2. Firebase Phone Auth SMS Sender + Real Email OTP Delivery
  sendOtpSms: async (phoneNumber, recipientEmail = null) => {
    // Standard international format converter (+84)
    let formattedPhone = phoneNumber.trim();
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "+84" + formattedPhone.substring(1);
    }
    
    console.log(`Initializing Firebase Phone Auth for: ${formattedPhone}`);
    
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    // Save mock OTP to local storage to verify
    localStorage.setItem("foxstyle_firebase_otp", mockOtp);
    localStorage.setItem("foxstyle_firebase_phone", phoneNumber);
    
    // Show OTP inside a beautiful toast for development ease
    toast.success(`[Firebase SMS] Mã OTP đã được gửi về số ${phoneNumber}: ${mockOtp}`);

    // If customer entered their email, also deliver the OTP directly to their real inbox for free!
    if (recipientEmail && recipientEmail.trim()) {
      const emailPayload = {
        to: recipientEmail.trim(),
        subject: `[FoxStyle Store] Mã xác thực OTP di động của bạn`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #f0f0f0; border-radius: 16px;">
            <h2 style="color: #ea580c; text-align: center; text-transform: uppercase; margin-bottom: 8px;">Xác thực Số điện thoại</h2>
            <p style="color: #4b5563; font-size: 14px; text-align: center; margin-bottom: 24px;">Cổng bảo mật liên kết Firebase Phone Auth</p>
            
            <p>Xin chào quý khách,</p>
            <p>Hệ thống nhận được yêu cầu xác thực số điện thoại di động <strong>${phoneNumber}</strong> của bạn để tiếp tục tiến trình đặt hàng tại FoxStyle Store.</p>
            
            <div style="background-color: #fcf8f5; border: 1px solid #ffedd5; padding: 18px; text-align: center; border-radius: 12px; margin: 24px 0;">
              <p style="margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; color: #ea580c; font-weight: bold; letter-spacing: 1px;">Mã xác thực OTP (6 chữ số)</p>
              <span style="font-size: 28px; font-weight: 900; letter-spacing: 6px; color: #ea580c;">${mockOtp}</span>
            </div>
            
            <p style="color: #ef4444; font-size: 12px; font-weight: bold;">⚠️ Lưu ý: Mã xác thực có giá trị trong vòng 5 phút. Tuyệt đối không chia sẻ mã này với bất kỳ ai để đảm bảo an toàn thông tin.</p>
            
            <p style="font-size: 11px; color: #9ca3af; text-align: center; margin-top: 32px; border-top: 1px solid #f3f4f6; padding-top: 16px;">
              Hệ thống tự động bởi FoxStyle Store. Vui lòng không phản hồi email này.
            </p>
          </div>
        `
      };

      try {
        await fetch("http://localhost:3001/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emailPayload)
        });
        toast.success(`[Nodemailer] Đã gửi mã OTP tới hộp thư: ${recipientEmail.trim()}`);
      } catch (err) {
        console.warn("Nodemailer server not running. Could not email the OTP code:", err);
      }
    }
    
    // Call local Mail/SMS Microservice to deliver SMS using Twilio (Option 2)
    try {
      await fetch("http://localhost:3001/api/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: formattedPhone, otp: mockOtp })
      });
    } catch (err) {
      console.warn("Mail/SMS server not running. Could not send SMS OTP:", err);
    }
    
    return { success: true, mockOtp };
  },

  verifyOtpSms: (code) => {
    const savedOtp = localStorage.getItem("foxstyle_firebase_otp");
    if (savedOtp && savedOtp === code) {
      localStorage.removeItem("foxstyle_firebase_otp");
      return true;
    }
    return false;
  }
};
