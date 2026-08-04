import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Eye, X, Check, Truck, AlertTriangle, Printer, ArrowLeft, RefreshCw } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { DataTable } from "../../components/DataTable";
import { Button } from "../../components/Button";
import { useSearchParams } from "react-router";
import { request } from "../../services/apiClient";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const normalizeLegacyReason = (value) => {
  const text = String(value || "").trim();
  const knownReasons = {
    "Khách hàng yêu c?u h?y don": "Khách hàng yêu cầu hủy đơn",
    "Không liên h? du?c ngu?i nh?n": "Không liên hệ được người nhận",
    "Khách hàng d?i ý": "Khách hàng đổi ý",
    "S?n ph?m không v?a kích thu?c": "Sản phẩm không vừa kích thước",
    "S?n ph?m b? l?i khi nh?n": "Sản phẩm bị lỗi khi nhận",
    "Kh?ch kh?ng nghe m?y": "Khách không nghe máy",
    "Kh?ch h?n l?i ng?y kh?c": "Khách hẹn lại ngày khác",
    "Sai ??a ch? ho?c s? ?i?n tho?i": "Sai địa chỉ hoặc số điện thoại",
    "Kh?ch t? ch?i nh?n h?ng": "Khách từ chối nhận hàng",
    "Kh?ng li?n l?c ???c v?i kh?ch": "Không liên lạc được với khách"
  };
  return knownReasons[text] || text;
};

export function AdminOrders() {
  const { orders = [], updateOrderStatus, loadUserData } = useApp();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchParams] = useSearchParams();
  const searchVal = searchParams.get("search") || "";

  // Selected order details modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingShippingFee, setEditingShippingFee] = useState(0);
  const detailMapInstanceRef = useRef(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const canPushToCarrier = (order) =>
    order?.status === "pending" || order?.status === "processing";
  const canPrintCarrierLabel = (order) =>
    order?.status !== "cancelled" && order?.status !== "returned";

  // Remove stale selections as soon as an order is cancelled, returned or removed.
  useEffect(() => {
    setSelectedOrderIds((currentIds) => currentIds.filter((id) => {
      const order = orders.find((item) => String(item.id) === String(id));
      return canPushToCarrier(order);
    }));
  }, [orders]);

  const refreshOrders = useCallback(async (showLoading = false) => {
    if (showLoading) setIsRefreshing(true);
    try {
      await loadUserData();
      setLastUpdatedAt(new Date());
    } finally {
      if (showLoading) setIsRefreshing(false);
    }
  }, [loadUserData]);

  useEffect(() => {
    refreshOrders();
    const refreshTimer = window.setInterval(() => refreshOrders(), 30000);
    return () => window.clearInterval(refreshTimer);
  }, [refreshOrders]);

  // Bulk ViettelPost Dispatch Push
  const handleBulkPushToViettelPost = async () => {
    if (selectedOrderIds.length === 0) {
      alert("Vui lòng tích chọn ít nhất 1 đơn hàng để đẩy sang ViettelPost!");
      return;
    }

    const selectedOrders = selectedOrderIds
      .map(id => orders.find(o => String(o.id) === String(id)))
      .filter(Boolean);
    const invalidOrders = selectedOrders.filter(order => !canPushToCarrier(order));
    if (invalidOrders.length > 0) {
      alert(
        `Chỉ đơn hàng Chờ xử lý hoặc Đang xử lý mới được đẩy sang hãng vận chuyển.\n` +
        `Đơn không hợp lệ: ${invalidOrders.map(order => order.id).join(", ")}`
      );
      return;
    }

    try {
      for (const orderObj of selectedOrders) {
        const id = orderObj.id;
        const idDb = orderObj?.orderIdDb || (typeof id === 'string' ? id.replace("DH", "") : id);
        await request(`/orders/${idDb}/dispatch?carrier=VIETTELPOST`, {
          method: "POST"
        });
      }
      await loadUserData();
      alert(`Đã đẩy ${selectedOrderIds.length} đơn hàng sang ViettelPost thành công.`);
      setSelectedOrderIds([]);
    } catch (err) {
      alert("Lỗi đẩy hàng loạt sang ViettelPost!");
    }
  };

  // Export Excel UTF-8 with clean characters
  const handleExportExcelViettelPost = (targetOrders) => {
    const list = targetOrders && targetOrders.length > 0 ? targetOrders : orders;
    let csvContent = "\uFEFFMã Đơn Hàng,Khách Hàng,Số Điện Thoại,Địa Chỉ Giao Hàng,Phương Thức,Tổng Tiền,Tiền COD Viettel,Trạng Thái,Mã Vận Đơn ViettelPost,Lý Do Sự Cố\n";

    list.forEach(o => {
      const pmUpper = (o.paymentMethod || "").toUpperCase();
      const isPayOS = pmUpper === "TRANSFER" || pmUpper === "PAYOS";
      const cod = isPayOS ? 0 : (o.total || 0);
      const vtpCode = `VTP${String(o.id).replace("DH", "")}-2026EX`;
      const reason = o.failureReason || "Không có";
      
      csvContent += `"${o.id}","${o.customerName || ""}","${o.phone || ""}","${(o.address || "").replace(/"/g, '""')}","${isPayOS ? "PayOS Transfer" : "COD Viettel"}",${o.total || 0},${cod},"${o.status}","${vtpCode}","${reason}"\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Bao_Cao_ViettelPost_FoxStyle_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Printable A5 ViettelPost Label Template
  const handlePrintA5ViettelLabel = (order) => {
    const printWindow = window.open("", "_blank");
    const vtpCode = `VTP${(order.id || "").replace("DH", "")}-2026EX`;
    const pmUpper = (order.paymentMethod || "").toUpperCase();
    const isPayOS = pmUpper === "TRANSFER" || pmUpper === "PAYOS";
    const codAmount = isPayOS ? 0 : order.total;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>MÃ VẬN ĐƠN VIETTELPOST A5 - ${order.id}</title>
          <meta charset="utf-8" />
          <style>
            @page { size: A5 landscape; margin: 0; }
            body { font-family: 'Arial', sans-serif; margin: 0; padding: 16px; background: #fff; color: #000; box-sizing: border-box; }
            .label-card { border: 3px solid #000; padding: 14px; height: 100%; border-radius: 12px; box-sizing: border-box; }
            .header-bar { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 8px; }
            .brand { font-size: 22px; font-weight: 900; text-transform: uppercase; color: #d97706; }
            .vtp-tag { background: #ee0000; color: #fff; padding: 4px 12px; font-weight: 800; font-size: 13px; border-radius: 6px; }
            .body-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 10px; border-bottom: 2px solid #000; padding-bottom: 10px; }
            .box h4 { margin: 0 0 4px 0; font-size: 11px; text-transform: uppercase; color: #555; border-bottom: 1px solid #ccc; padding-bottom: 2px; }
            .box p { margin: 3px 0; font-size: 13px; font-weight: bold; }
            .barcode-section { text-align: center; margin: 12px 0; padding: 8px; border-bottom: 2px dashed #000; background: #f9fafb; border-radius: 8px; }
            .barcode-box { font-family: 'Courier New', monospace; font-size: 24px; font-weight: 900; letter-spacing: 5px; color: #111; }
            .cod-banner { background: ${codAmount > 0 ? '#fff7ed' : '#f3f4f6'}; border: 2px solid ${codAmount > 0 ? '#ea580c' : '#4b5563'}; padding: 10px 14px; text-align: center; margin-top: 10px; border-radius: 8px; }
            .cod-amount { font-size: 26px; font-weight: 900; color: ${codAmount > 0 ? '#c2410c' : '#1f2937'}; }
            .items-list { font-size: 11px; margin-top: 10px; border-bottom: 1px solid #ddd; padding-bottom: 6px; }
          </style>
        </head>
        <body onload="window.print();">
          <div class="label-card">
            <div class="header-bar">
              <div class="brand">FOXSTYLE FASHION x VIETTELPOST</div>
              <div class="vtp-tag">CHUYỂN PHÁT NHANH A5 (BILL DÁN THÙNG)</div>
            </div>

            <div class="barcode-section">
              <div style="font-size: 11px; font-weight: bold; margin-bottom: 2px; text-transform: uppercase;">MÃ VẬN ĐƠN VIETTELPOST CHÍNH THỨC:</div>
              <div class="barcode-box">* ${vtpCode} *</div>
              <div style="font-size: 12px; font-weight: bold; margin-top: 3px;">MÃ ĐƠN HÀNG HỆ THỐNG: ${order.id}</div>
            </div>

            <div class="body-grid">
              <div class="box">
                <h4>TỪ (GỬI TỪ): FOXSTYLE KHO HÀ NỘI</h4>
                <p>Địa chỉ: Số 185 Cầu Giấy, Phường Dịch Vọng, Cầu Giấy, Hà Nội</p>
                <p>SĐT Kho: 0362.804.559</p>
              </div>

              <div class="box">
                <h4>ĐẾN (NGƯỜI NHẬN):</h4>
                <p>${order.customerName} - ${order.phone}</p>
                <p>${order.address}</p>
              </div>
            </div>

            <div class="items-list">
              <b>NỘI DUNG SẢN PHẨM HÀNG (CHO XEM HÀNG):</b> ${(order.items || []).map(i => `${i.product.name} (${i.color}/${i.size}) x${i.quantity}`).join(", ")}
            </div>

            <div class="cod-banner">
              <div style="font-size: 12px; font-weight: bold; text-transform: uppercase;">TIỀN THU HỘ COD TẠI ĐIỂM GIAO THỰC TẾ:</div>
              <div class="cod-amount">${codAmount > 0 ? `${codAmount.toLocaleString('vi-VN')} VNĐ` : '0 VNĐ (ĐÃ THANH TOÁN QUA PAYOS)'}</div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  useEffect(() => {
    if (selectedOrder) {
      setEditingShippingFee(selectedOrder.shipping || 0);
    }
  }, [selectedOrder]);

  const handleSaveShippingFee = async () => {
    if (!selectedOrder) return;
    const newFee = Number(editingShippingFee);
    if (isNaN(newFee) || newFee < 0) {
      alert("⚠️ Vui lòng nhập phí vận chuyển hợp lệ!");
      return;
    }
    try {
      const orderId = selectedOrder.orderIdDb || String(selectedOrder.id).replace("DH", "");
      await request(`/orders/${orderId}/shipping-fee?amount=${newFee}`, {
        method: "PATCH"
      });
      await refreshOrders();
      setSelectedOrder(prev => prev ? { ...prev, shipping: newFee } : null);
      alert(`Đã cập nhật phí vận chuyển ${newFee.toLocaleString("vi-VN")}đ.`);
    } catch (error) {
      alert(error.message || "Không thể cập nhật phí vận chuyển.");
    }
  };

  const handleUpdateStatus = async (orderId, newStatusStr, suppliedDetails = {}) => {
    const statusMap = {
      pending: 0,
      processing: 1,
      shipping: 2,
      completed: 3,
      cancelled: 4,
      returned: 5
    };
    const statusByte = statusMap[newStatusStr] !== undefined ? statusMap[newStatusStr] : 0;
    const orderIdDb = selectedOrder?.orderIdDb || (typeof orderId === 'string' ? orderId.replace("DH", "") : orderId);
    const statusDetails = { ...suppliedDetails };

    if ((newStatusStr === "cancelled" || newStatusStr === "returned") && !statusDetails.reason) {
      const reasonLabel = newStatusStr === "cancelled" ? "hủy đơn" : "hoàn hàng";
      const reason = prompt(`Vui lòng nhập lý do ${reasonLabel}:`, "");
      if (!reason?.trim()) {
        alert(`Lý do ${reasonLabel} là bắt buộc.`);
        return;
      }
      statusDetails.reason = reason.trim();
    }
    if (newStatusStr === "returned" && statusDetails.warrantyRedelivery === undefined) {
      statusDetails.warrantyRedelivery = confirm(
        "Khách có muốn bảo hành/đổi sản phẩm để giao lại không?\n\nOK: Có giao lại\nCancel: Không giao lại"
      );
    }

    try {
      if (updateOrderStatus) {
        await updateOrderStatus(orderIdDb, statusByte, statusDetails);
      }
      setSelectedOrder(prev => prev ? ({
        ...prev,
        status: newStatusStr,
        ...(newStatusStr === "cancelled"
          ? { cancellationReason: statusDetails.reason }
          : {}),
        ...(newStatusStr === "returned"
          ? {
              returnReason: statusDetails.reason,
              warrantyRedelivery: Boolean(statusDetails.warrantyRedelivery)
            }
          : {})
      }) : null);
      await loadUserData();
      alert(`✅ Cập nhật đơn hàng ${orderId} sang trạng thái "${newStatusStr.toUpperCase()}" thành công!`);
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái đơn hàng:", err);
      alert("❌ Đã có lỗi xảy ra khi cập nhật đơn hàng!");
    }
  };

  const parseCoords = (address) => {
    if (!address) return null;
    const match = address.match(/\[Định vị:\s*(-?\d+\.\d+),\s*(-?\d+\.\d+)\]/);
    if (match) {
      return {
        lat: parseFloat(match[1]),
        lng: parseFloat(match[2])
      };
    }
    return null;
  };

  const initDetailMap = (element, shipment) => {
    if (!element) {
      if (detailMapInstanceRef.current) {
        detailMapInstanceRef.current.remove();
        detailMapInstanceRef.current = null;
      }
      return;
    }
    if (detailMapInstanceRef.current) return;

    const shopCoords = [16.0544, 108.2022];
    const customerCoords = parseCoords(shipment.shippingAddress);

    const map = L.map(element);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    detailMapInstanceRef.current = map;

    // Add Shop Marker
    const shopIcon = L.divIcon({
      className: "shop-marker",
      html: `<div class="w-6 h-6 rounded-full bg-orange-600 border-2 border-white flex items-center justify-center shadow-lg text-white text-[10px]">🏪</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
    L.marker(shopCoords, { icon: shopIcon })
      .addTo(map)
      .bindPopup("<b class='text-[10px]'>Cửa hàng FoxStyle</b>");

    if (customerCoords) {
      // Add Customer Marker
      const customerIcon = L.divIcon({
        className: "customer-marker",
        html: `<div class="w-6 h-6 rounded-full bg-rose-600 border-2 border-white flex items-center justify-center shadow-lg text-white text-[10px]">📍</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24]
      });
      L.marker([customerCoords.lat, customerCoords.lng], { icon: customerIcon })
        .addTo(map)
        .bindPopup(`<div class="text-[10px]"><b>\${shipment.recipientName}</b><br/>\${shipment.recipientPhone}</div>`);

      // Draw dashed routing polyline
      const line = L.polyline([shopCoords, [customerCoords.lat, customerCoords.lng]], {
        color: "#f97316",
        dashArray: "4, 4",
        weight: 2
      }).addTo(map);

      // Fit bounds
      map.fitBounds(line.getBounds(), { padding: [20, 20] });
    } else {
      map.setView(shopCoords, 14);
    }
  };

  const handlePrintInvoice = (order) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Hóa đơn ${order.id}</title>
          <style>
            body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; line-height: 1.5; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; }
            .header p { margin: 5px 0 0 0; color: #666; font-size: 14px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .info-block h3 { margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; color: #888; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            .info-block p { margin: 4px 0; font-size: 14px; font-weight: 600; }
            .table { border-collapse: collapse; margin-bottom: 30px; width: 100%; }
            .table th { border-bottom: 2px solid #333; text-align: left; padding: 10px 0; font-size: 12px; text-transform: uppercase; color: #666; }
            .table td { border-bottom: 1px solid #eee; padding: 12px 0; font-size: 14px; }
            .totals { margin-left: auto; width: 300px; margin-top: 20px; }
            .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
            .totals-row.grand { border-top: 2px solid #333; padding-top: 10px; font-size: 18px; font-weight: 800; color: #e65100; }
            .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>FoxStyle Fashion Store</h1>
            <p>HÓA ĐƠN BÁN LẺ VÀ GIAO NHẬN</p>
          </div>
          <div class="info-grid">
            <div class="info-block">
              <h3>Thông tin đơn hàng</h3>
              <p>Mã đơn hàng: ${order.id}</p>
              <p>Ngày đặt hàng: ${order.date}</p>
              <p>Phương thức: ${order.paymentMethod === "transfer" ? "Chuyển khoản VietQR" : "Thanh toán COD"}</p>
              <p>Trạng thái: ${order.status.toUpperCase()}</p>
            </div>
            <div class="info-block">
              <h3>Thông tin người nhận</h3>
              <p>Họ và tên: ${order.customerName}</p>
              <p>Số điện thoại: ${order.phone}</p>
              <p>Địa chỉ nhận: ${order.address}</p>
            </div>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Màu/Kích cỡ</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th style="text-align: right;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.product.name}</td>
                  <td>${item.color} / ${item.size}</td>
                  <td>${item.product.price.toLocaleString('vi-VN')}đ</td>
                  <td>${item.quantity}</td>
                  <td style="text-align: right;">${(item.product.price * item.quantity).toLocaleString('vi-VN')}đ</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <div class="totals">
            <div class="totals-row">
              <span>Tạm tính:</span>
              <span>${order.subtotal.toLocaleString('vi-VN')}đ</span>
            </div>
            ${order.discount > 0 ? `
              <div class="totals-row" style="color: red;">
                <span>Giảm giá (${order.couponCode || "Mã giảm giá"}):</span>
                <span>-${order.discount.toLocaleString('vi-VN')}đ</span>
              </div>
            ` : ""}
            <div class="totals-row">
              <span>Phí vận chuyển:</span>
              <span>${order.shipping.toLocaleString('vi-VN')}đ</span>
            </div>
            <div class="totals-row grand">
              <span>Tổng cộng:</span>
              <span>${order.total.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>
          <div class="footer">
            <p>Cảm ơn quý khách đã mua sắm tại FoxStyle!</p>
            <p>Mọi thắc mắc xin vui lòng liên hệ hotline: 1900 xxxx</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Filter orders by status BEFORE passing to table (so pagination fits status count)
  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs font-bold px-2.5 py-1 rounded-full uppercase">Chờ xử lý</span>;
      case "processing":
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold px-2.5 py-1 rounded-full uppercase">Đang xử lý</span>;
      case "shipping":
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-2.5 py-1 rounded-full uppercase">Đang giao</span>;
      case "completed":
        return <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-bold px-2.5 py-1 rounded-full uppercase">Đã giao</span>;
      case "cancelled":
        return <span className="bg-red-50 text-red-700 border border-red-200 text-xs font-bold px-2.5 py-1 rounded-full uppercase">Đã hủy</span>;
      case "returned":
        return <span className="bg-pink-50 text-pink-700 border border-pink-200 text-xs font-bold px-2.5 py-1 rounded-full uppercase">Hoàn hàng</span>;
      default:
        return null;
    }
  };

  const getPaymentAdminState = (order) => {
    if (order.status === "cancelled" || order.status === "returned" || order.paymentStatus === 2) {
      return {
        label: order.status === "returned" ? "Đã hoàn hàng/hoàn tiền" : "Đã hủy",
        className: "bg-red-50 text-red-700 border-red-200"
      };
    }
    if (order.paymentStatus === 0) {
      return {
        label: "Chưa thanh toán",
        className: "bg-gray-50 text-gray-700 border-gray-200"
      };
    }
    if (order.isReconciled) {
      return {
        label: "Đã đối soát",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200"
      };
    }
    return {
      label: "Chờ đối soát",
      className: "bg-amber-50 text-amber-700 border-amber-200"
    };
  };



  // Define columns for DataTable
  const columns = [
    {
      header: (
        <input
          type="checkbox"
          checked={
            filteredOrders.some(canPushToCarrier) &&
            filteredOrders.filter(canPushToCarrier).every((order) => selectedOrderIds.includes(order.id))
          }
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedOrderIds(filteredOrders.filter(canPushToCarrier).map((order) => order.id));
            } else {
              setSelectedOrderIds([]);
            }
          }}
          disabled={!filteredOrders.some(canPushToCarrier)}
          title="Chỉ chọn đơn Chờ xử lý hoặc Đang xử lý"
          className="h-4 w-4 accent-orange-600 rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
        />
      ),
      accessor: "id",
      render: (id, order) => (
        <input
          type="checkbox"
          checked={selectedOrderIds.includes(id)}
          disabled={!canPushToCarrier(order)}
          onChange={(e) => {
            e.stopPropagation();
            if (!canPushToCarrier(order)) return;
            if (e.target.checked) {
              setSelectedOrderIds(prev => [...prev, id]);
            } else {
              setSelectedOrderIds(prev => prev.filter(item => item !== id));
            }
          }}
          title={canPushToCarrier(order) ? "Chọn để đẩy hãng vận chuyển" : "Đơn hoàn/hủy không thể chuyển hãng vận chuyển"}
          className="h-4 w-4 accent-orange-600 rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
        />
      )
    },
    {
      header: "Mã Đơn hàng",
      accessor: "id",
      render: (id) => <span className="font-extrabold text-gray-900">{id}</span>
    },
    {
      header: "Khách hàng",
      accessor: "customerName",
      render: (customerName, order) => (
        <div>
          <p className="font-bold text-gray-900">{customerName}</p>
          <p className="text-xs text-gray-400 mt-0.5 font-bold">{order.phone}</p>
        </div>
      )
    },
    {
      header: "Ngày đặt",
      accessor: "date",
      render: (date) => <span className="text-gray-500 font-semibold">{date}</span>
    },
    {
      header: "Giá trị đơn",
      accessor: "total",
      render: (total) => <span className="font-bold text-orange-600 text-sm">{total.toLocaleString('vi-VN')}đ</span>
    },
    {
      header: "Trạng thái đơn",
      accessor: "status",
      render: (status) => getStatusBadge(status)
    },
    {
      header: "Đối soát thanh toán",
      accessor: "id",
      render: (id, order) => {
        const paymentState = getPaymentAdminState(order);
        return (
          <div className="space-y-1">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-black ${paymentState.className}`}>
              {paymentState.label}
            </span>
            <p className="block font-mono text-[10px] font-bold text-gray-400">
              {order.reconciliationCode || (order.paymentId ? `PAY-${order.paymentId}` : "Chưa có giao dịch")}
            </p>
          </div>
        );
      }
    },
    {
      header: "Hành động",
      accessor: "id",
      align: "right",
      render: (id, order) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => handlePrintA5ViettelLabel(order)}
            disabled={!canPrintCarrierLabel(order)}
            className="p-1.5 bg-zinc-100 hover:bg-orange-600 hover:text-white text-zinc-700 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 border border-zinc-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-zinc-100 disabled:hover:text-zinc-700"
            title={canPrintCarrierLabel(order) ? "In nhãn dán ViettelPost A5" : "Đơn hoàn/hủy không thể in nhãn chuyển hàng"}
          >
            <Printer className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Nhãn A5</span>
          </button>

          <Button
            variant="ghost"
            size="sm"
            icon={Eye}
            onClick={() => setSelectedOrder(order)}
            className="text-orange-600 font-bold hover:bg-orange-50 border border-transparent hover:border-orange-200"
          >
            Chi tiết
          </Button>
        </div>
      )
    }
  ];

  if (selectedOrder) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-150 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3.5 py-2.5 rounded-xl transition border border-gray-200 bg-white shadow-2xs cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Quay lại
            </button>
            <h3 className="text-lg font-extrabold text-gray-900">
              Chi tiết đơn hàng {selectedOrder.id}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setSelectedOrder(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:bg-red-50 px-3.5 py-2.5 rounded-xl transition border border-red-200 cursor-pointer"
          >
            <X className="h-4 w-4" /> Thoát
          </button>
        </div>

        {/* Content Body Page */}
        <div className="bg-white rounded-3xl shadow-xs border border-gray-150 overflow-hidden max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-orange-500 to-pink-600 p-5 text-white">
            <p className="text-xs opacity-90 font-bold uppercase tracking-wider">
              Đặt ngày {selectedOrder.date}
            </p>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-3 text-xs font-semibold text-gray-600">
              <h4 className="font-extrabold text-sm text-gray-800 uppercase tracking-wider mb-2">Thông tin người nhận & Giao hàng</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>Khách hàng: <span className="text-gray-900 font-bold">{selectedOrder.customerName}</span></div>
                <div>Số điện thoại: <span className="text-gray-900 font-bold">{selectedOrder.phone}</span></div>
                <div className="col-span-2">Địa chỉ giao: <span className="text-gray-900 font-bold">{selectedOrder.address}</span></div>
                <div className="col-span-2">Hình thức thanh toán: <span className="text-gray-900 font-bold uppercase">{selectedOrder.paymentMethod === "transfer" ? "Chuyển khoản VietQR" : "Nhận hàng COD"}</span></div>
                {selectedOrder.note && <div className="col-span-2">Ghi chú: <span className="text-gray-900 italic">"{selectedOrder.note}"</span></div>}
              </div>
            </div>

            {/* Reconciliation & Payment Gateway Audit Block */}
            <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-xs text-orange-900 uppercase tracking-wider">Quản lý thanh toán và đối soát</h4>
                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black ${getPaymentAdminState(selectedOrder).className}`}>
                  {getPaymentAdminState(selectedOrder).label}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-orange-150">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Mã đối soát giao dịch:</span>
                  <span className="font-mono font-black text-orange-600 text-sm">{selectedOrder.reconciliationCode || "Chưa đối soát"}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-orange-150">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Mã định danh bản ghi thanh toán:</span>
                  <span className="font-mono font-black text-gray-900 text-sm">{selectedOrder.paymentId ? `PAY-${selectedOrder.paymentId}` : "Chưa có giao dịch"}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-orange-150">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Ngày giờ xử lý giao dịch tiền:</span>
                  <span className="font-bold text-gray-800">{selectedOrder.reconciledAt || selectedOrder.date}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-orange-150">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Số tiền thực tế qua cổng thanh toán:</span>
                  <span className="font-extrabold text-emerald-600 text-sm">{selectedOrder.total.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <button
                type="button"
                disabled={!selectedOrder.paymentId || selectedOrder.paymentStatus !== 1 || selectedOrder.isReconciled}
                onClick={async () => {
                  try {
                    await request(`/payments/${selectedOrder.paymentId}/reconciliation?reconciled=true`, {
                      method: "PATCH"
                    });
                    await refreshOrders(true);
                    setSelectedOrder(null);
                  } catch (error) {
                    alert(error.message || "Không thể đối soát giao dịch.");
                  }
                }}
                className="w-full rounded-xl bg-orange-600 py-2.5 text-xs font-extrabold text-white shadow-xs transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {selectedOrder.isReconciled ? "Đã đối soát" : "Thực hiện đối soát giao dịch"}
              </button>
            </div>

            {/* ViettelPost Journey & Failure Retry Handler */}
            <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-orange-600" />
                  <h4 className="font-extrabold text-sm text-gray-900">Hành trình vận chuyển Viettel Post</h4>
                </div>
                <span className="text-[10px] font-mono font-bold bg-orange-50 text-orange-700 px-2.5 py-1 rounded-lg border border-orange-200">
                  Mã Vận Đơn: VTP{(selectedOrder.id || "").replace("DH", "")}-2026EX
                </span>
              </div>

              {/* Journey Steps */}
              <div className="space-y-3 relative pl-4 border-l-2 border-orange-200 text-xs">
                <div className="relative">
                  <span className="absolute -left-[21px] top-0 w-3.5 h-3.5 bg-orange-600 rounded-full border-2 border-white shadow-xs"></span>
                  <p className="font-bold text-gray-900">Đã tiếp nhận và đẩy đơn sang Viettel Post thành công</p>
                  <p className="text-[10px] text-gray-400 font-semibold">{selectedOrder.date} 08:30:15 - Kho FoxStyle Cầu Giấy, Hà Nội</p>
                </div>

                <div className="relative">
                  <span className="absolute -left-[21px] top-0 w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-white shadow-xs"></span>
                  <p className="font-bold text-gray-900">Bưu cục ViettelPost Express đã lấy hàng thành công</p>
                  <p className="text-[10px] text-gray-400 font-semibold">{selectedOrder.date} 10:15:00 - Bưu cục VTP Cầu Giấy 01</p>
                </div>

                <div className="relative">
                  <span className={`absolute -left-[21px] top-0 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                    selectedOrder.status === "completed" ? "bg-emerald-600" : selectedOrder.status === "returned" ? "bg-rose-600" : "bg-amber-500 animate-pulse"
                  }`}></span>
                  <p className="font-bold text-gray-900">
                    {selectedOrder.status === "completed" 
                      ? "Giao hàng thành công - Chờ ViettelPost đối soát COD" 
                      : selectedOrder.status === "returned"
                      ? "Giao không thành công - Đang chuyển hoàn"
                      : "Nhân viên ViettelPost đang phát hàng tại khu vực địa chỉ khách"}
                  </p>
                  <p className="text-[10px] text-gray-400 font-semibold">Cập nhật lúc: {selectedOrder.date} 16:45:00</p>
                </div>
              </div>

              {/* Delivery Failure Handling Bar */}
              {selectedOrder.status === "returned" || selectedOrder.failureReason ? (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs text-rose-900 font-bold">
                    <span>⚠️ Sự cố giao hàng ViettelPost:</span>
                    <span className="font-black bg-white px-2.5 py-1 rounded-lg border border-rose-200">
                      Lý do: {normalizeLegacyReason(selectedOrder.returnReason || selectedOrder.failureReason) || "Chưa cập nhật"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => alert(`📞 Đang kết nối cuộc gọi lại tới khách hàng ${selectedOrder.customerName} (SĐT: ${selectedOrder.phone})...`)}
                      className="flex-1 bg-white hover:bg-rose-100 text-rose-700 font-bold text-xs py-2 rounded-xl border border-rose-300 transition cursor-pointer"
                    >
                      📞 Gọi lại cho khách
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await handleUpdateStatus(selectedOrder.id, "shipping");
                        alert(`🔁 Đã gửi yêu cầu ViettelPost phát lại (Lần 2) cho đơn hàng ${selectedOrder.id}!`);
                      }}
                      className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-2 rounded-xl shadow-xs transition cursor-pointer"
                    >
                      🔁 Đề nghị ViettelPost Giao Lại
                    </button>
                  </div>
                </div>
              ) : null}
              {selectedOrder.status === "returned" && (
                <div className={`rounded-xl border p-3 text-xs font-bold ${
                  selectedOrder.warrantyRedelivery
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-gray-200 bg-gray-50 text-gray-700"
                }`}>
                  {selectedOrder.warrantyRedelivery
                    ? "Khách chọn bảo hành/đổi sản phẩm và giao lại."
                    : "Khách không yêu cầu giao lại sau khi hoàn hàng."}
                </div>
              )}
            </div>



            {/* Items List */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-xs text-gray-400 uppercase tracking-wider">Danh sách mặt hàng</h4>
              <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl p-4 bg-white shadow-sm">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex justify-between items-center gap-4 text-xs font-semibold first:pt-0 last:pb-0">
                    <div className="flex items-center space-x-3">
                      <img src={item.product.image} alt={item.product.name} className="w-10 h-10 object-cover rounded-lg border" />
                      <div>
                        <p className="font-bold text-gray-900">{item.product.name}</p>
                        <p className="text-gray-400 mt-0.5">Màu: {item.color} | Kích cỡ: {item.size} | Số lượng: {item.quantity}</p>
                        {item.product?.description && item.product.description.includes("[COMBO:") && (
                          <div className="mt-1.5 text-xs bg-orange-50 p-2 rounded-xl border border-orange-200">
                            <span className="font-extrabold text-orange-900 block text-[10px] uppercase tracking-wider mb-0.5">📦 Các sản phẩm gộp trong Set:</span>
                            <p className="text-gray-800 text-[11px] font-medium leading-relaxed">
                              {(item.product?.description || "").replace(/\[COMBO:[\d,]+\]/, "").trim()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-gray-700">{(item.product.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Billing totals */}
            <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 text-xs font-semibold text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>Tiền hàng:</span>
                <span className="text-gray-900 font-bold">{selectedOrder.subtotal.toLocaleString('vi-VN')}đ</span>
              </div>
              {/* Editable Shipping Fee Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 py-1.5 bg-orange-50/60 p-3 rounded-xl border border-orange-100">
                <div className="flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-orange-600" />
                  <span className="text-gray-800 font-extrabold">Phí vận chuyển:</span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={editingShippingFee}
                    onChange={(e) => setEditingShippingFee(e.target.value)}
                    className="w-28 px-3 py-1.5 border border-gray-300 rounded-xl text-xs font-black text-orange-600 text-right focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleSaveShippingFee}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition cursor-pointer shrink-0"
                  >
                    Cập nhật phí vận chuyển
                  </button>
                </div>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Mã giảm giá ({selectedOrder.couponCode}):</span>
                  <span>-{selectedOrder.discount.toLocaleString('vi-VN')}đ</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-100 pt-2 text-sm font-bold items-center">
                <span className="text-gray-800">Tổng thanh toán:</span>
                <span className="text-orange-600 font-extrabold text-base">{selectedOrder.total.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => handlePrintInvoice(selectedOrder)}
                className="flex items-center text-xs font-bold text-gray-700 hover:text-zinc-950 border border-gray-200 hover:bg-gray-50 px-4 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
              >
                <Printer className="h-4 w-4 mr-1.5 text-gray-500" />
                <span>In hóa đơn bán hàng</span>
              </button>
            </div>

            {/* Action Progress Flow buttons */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 text-center">Duyệt & Quản lý trạng thái đơn hàng</p>
              {selectedOrder.status === "cancelled" && (
                <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-800">
                  Lý do hủy: {normalizeLegacyReason(selectedOrder.cancellationReason) || "Chưa cập nhật"}
                </div>
              )}
              {selectedOrder.tax > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Thuế VAT</span>
                  <span>+{selectedOrder.tax.toLocaleString('vi-VN')}đ</span>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, "pending")}
                  className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    selectedOrder.status === "pending"
                      ? "bg-yellow-500 border-yellow-500 text-white shadow-sm"
                      : "border-gray-200 hover:bg-gray-50/40 text-gray-600"
                  }`}
                >
                  Chờ xử lý
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, "processing")}
                  className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    selectedOrder.status === "processing"
                      ? "bg-purple-500 border-purple-500 text-white shadow-sm"
                      : "border-gray-200 hover:bg-gray-50/40 text-gray-600"
                  }`}
                >
                  Đang xử lý
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, "shipping")}
                  className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    selectedOrder.status === "shipping"
                      ? "bg-blue-500 border-blue-500 text-white shadow-sm"
                      : "border-gray-200 hover:bg-gray-50/40 text-gray-600"
                  }`}
                >
                  Đang giao
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, "completed")}
                  className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    selectedOrder.status === "completed"
                      ? "bg-green-500 border-green-500 text-white shadow-sm"
                      : "border-gray-200 hover:bg-gray-50/40 text-gray-600"
                  }`}
                >
                  Đã giao
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, "cancelled")}
                  className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    selectedOrder.status === "cancelled"
                      ? "bg-red-500 border-red-500 text-white shadow-sm"
                      : "border-gray-200 hover:bg-gray-50/40 text-gray-600"
                  }`}
                >
                  Đã hủy
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, "returned")}
                  className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    selectedOrder.status === "returned"
                      ? "bg-pink-500 border-pink-500 text-white shadow-sm"
                      : "border-gray-200 hover:bg-gray-50/40 text-gray-600"
                  }`}
                >
                  Hoàn hàng
                </button>
              </div>

              {/* Shipping Partner Integration & Refund Actions */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    if (!canPushToCarrier(selectedOrder)) {
                      alert("Chỉ đơn hàng Chờ xử lý hoặc Đang xử lý mới được đẩy sang hãng vận chuyển.");
                      return;
                    }
                    const partner = prompt("Nhập hãng vận chuyển (GHTK/GHN/VIETTELPOST/AHAMOVE):", "GHTK");
                    if (partner) {
                      const orderId = selectedOrder.orderIdDb || String(selectedOrder.id).replace("DH", "");
                      request(`/orders/${orderId}/dispatch?carrier=${encodeURIComponent(partner)}`, {
                        method: "POST"
                      }).then(async response => {
                        await refreshOrders();
                        setSelectedOrder(prev => prev ? {
                          ...prev,
                          status: "shipping",
                          shippingCarrier: response.data.shippingCarrier,
                          trackingCode: response.data.trackingCode
                        } : null);
                        alert(`Đã tạo vận đơn ${response.data.trackingCode}.`);
                      }).catch(error => alert(error.message || "Không thể đẩy hãng vận chuyển."));
                    }
                  }}
                  disabled={!canPushToCarrier(selectedOrder)}
                  title={!canPushToCarrier(selectedOrder) ? "Chỉ áp dụng cho đơn Chờ xử lý hoặc Đang xử lý" : ""}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs hover:from-emerald-700 hover:to-teal-700 transition cursor-pointer flex items-center justify-center gap-1.5 disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none"
                >
                  <Truck className="h-4 w-4" />
                  <span>Đẩy Hãng Vận Chuyển (GHTK/GHN)</span>
                </button>

                {selectedOrder.status === "returned" && (
                  <button
                    onClick={() => {
                      if (confirm(`Xác nhận duyệt Đổi / Trả và Hoàn tiền số tiền ${selectedOrder.total.toLocaleString("vi-VN")}đ cho khách hàng?`)) {
                        alert("✅ Đã hoàn tiền thành công về ví/tài khoản ngân hàng khách hàng!");
                        handleUpdateStatus(selectedOrder.id, "cancelled");
                      }
                    }}
                    className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1"
                  >
                    <Check className="h-4 w-4" />
                    <span>Duyệt Hoàn Tiền</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col gap-3 rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">Theo dõi đơn hàng</h1>
          <p className="mt-1 text-xs font-medium text-gray-500">
            Dữ liệu tự động cập nhật mỗi 30 giây
            {lastUpdatedAt && ` · Cập nhật lúc ${lastUpdatedAt.toLocaleTimeString("vi-VN")}`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => refreshOrders(true)}
          disabled={isRefreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Đang cập nhật..." : "Cập nhật ngay"}
        </button>
      </div>
      
      {/* Top Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-gray-200">
        {/* Top Status Tabs */}
        <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-1 text-xs font-bold text-gray-500 w-full md:w-auto overflow-x-auto whitespace-nowrap">
          {[
            { id: "all", label: "Tất cả" },
            { id: "pending", label: "Chờ xử lý" },
            { id: "processing", label: "Đang xử lý" },
            { id: "shipping", label: "Đang giao" },
            { id: "completed", label: "Đã giao" },
            { id: "cancelled", label: "Đã hủy" },
            { id: "returned", label: "Hoàn hàng" }
          ].map(sOpt => (
            <button
              key={sOpt.id}
              onClick={() => setStatusFilter(sOpt.id)}
              className={`px-4 py-2 rounded-lg transition ${
                statusFilter === sOpt.id ? "bg-white text-gray-900 shadow-sm" : "hover:text-gray-900"
              }`}
            >
              {sOpt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleExportExcelViettelPost(filteredOrders)}
            className="bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Printer className="h-3.5 w-3.5 text-amber-400" />
            <span>Xuất Excel ViettelPost</span>
          </button>

        </div>
      </div>

      {/* ViettelPost Bulk Actions Toolbar */}
      {selectedOrderIds.length > 0 && (
        <div className="bg-orange-600 text-white p-3.5 px-5 rounded-2xl shadow-lg flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="font-black text-sm">Đã chọn ({selectedOrderIds.length} đơn hàng)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBulkPushToViettelPost}
              disabled={selectedOrderIds.some(id => {
                const order = orders.find(item => String(item.id) === String(id));
                return !canPushToCarrier(order);
              })}
              title="Chỉ đẩy các đơn Chờ xử lý hoặc Đang xử lý"
              className="px-4 py-2 bg-white text-orange-600 hover:bg-orange-50 rounded-xl text-xs font-black uppercase tracking-wider shadow-xs transition cursor-pointer flex items-center gap-1.5 disabled:cursor-not-allowed disabled:bg-orange-200 disabled:text-orange-500"
            >
              <Truck className="h-4 w-4" />
              <span>Đẩy ViettelPost Hàng Loạt</span>
            </button>

            <button
              type="button"
              onClick={() => handleExportExcelViettelPost(
                orders.filter((order) => selectedOrderIds.includes(order.id) && canPushToCarrier(order))
              )}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider shadow-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="h-4 w-4" />
              <span>Xuất Excel Đẩy Hàng</span>
            </button>
          </div>
        </div>
      )}

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filteredOrders}
        searchPlaceholder="Tìm kiếm theo mã đơn hoặc tên khách..."
        searchKeys={["id", "customerName", "phone", "address"]}
        itemsPerPage={8}
        defaultSearchTerm={searchVal}
      />

    </div>
  );
}
