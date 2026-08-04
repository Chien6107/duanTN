import { useState, useEffect } from "react";
import { Plus, Bell, X, AlertCircle, ArrowLeft, RotateCcw } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { DataTable } from "../../components/DataTable";
import { Button } from "../../components/Button";

export function AdminNotifications() {
  const { sendGlobalNotification } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "info"
  });

  const loadAnnouncements = () => {
    try {
      const saved = localStorage.getItem("foxstyle_global_announcements");
      const demoAnnouncements = [
        { id: "demo-ann-1", title: "Chào mừng đến với FoxStyle", content: "Khám phá bộ sưu tập mới và nhận ưu đãi dành riêng cho thành viên.", type: "success", time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), isRead: false },
        { id: "demo-ann-2", title: "Miễn phí vận chuyển", content: "Miễn phí vận chuyển toàn quốc cho đơn hàng đạt giá trị quy định.", type: "info", time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), isRead: false },
        { id: "demo-ann-3", title: "Khuyến mãi cuối tuần", content: "Sử dụng mã FOXSTYLE20 để nhận ưu đãi khi mua sắm cuối tuần.", type: "warning", time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), isRead: false },
        { id: "demo-ann-4", title: "Cập nhật chính sách đổi trả", content: "FoxStyle hỗ trợ đổi trả trong vòng 7 ngày khi sản phẩm còn nguyên tem nhãn.", type: "info", time: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), isRead: false },
        { id: "demo-ann-5", title: "Bảo trì thanh toán", content: "Kênh thanh toán trực tuyến sẽ được bảo trì từ 01:00 đến 02:00.", type: "error", time: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), isRead: false }
      ];
      const stored = saved ? JSON.parse(saved) : [];
      const parsed = Array.isArray(stored) && stored.length > 0 ? stored : demoAnnouncements;
      if (!Array.isArray(stored) || stored.length === 0) localStorage.setItem("foxstyle_global_announcements", JSON.stringify(demoAnnouncements));
      setAnnouncements(Array.isArray(parsed)
        ? [...parsed].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        : []);
    } catch (e) {
      setAnnouncements([]);
    }
  };

  useEffect(() => {
    loadAnnouncements();
    const refreshId = window.setInterval(loadAnnouncements, 5000);
    const handleStorage = (event) => {
      if (event.key === "foxstyle_global_announcements") loadAnnouncements();
    };
    window.addEventListener("storage", handleStorage);
    return () => {
      window.clearInterval(refreshId);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      title: "",
      content: "",
      type: "info"
    });
    setShowModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert("Vui lòng nhập đầy đủ tiêu đề và nội dung thông báo!");
      return;
    }

    sendGlobalNotification(formData.title, formData.content, formData.type);
    alert("Đã gửi thông báo hệ thống toàn cục thành công!");
    
    // Reload local list and close modal
    loadAnnouncements();
    setShowModal(false);
  };

  const handleResend = (announcement) => {
    if (!confirm(`Gửi lại thông báo "${announcement.title}" ngay bây giờ?`)) return;
    sendGlobalNotification(announcement.title, announcement.content, announcement.type);
    loadAnnouncements();
    alert("Đã gửi lại thông báo. Thời gian gửi đã được cập nhật!");
  };

  const columns = [
    {
      header: "Tiêu đề",
      accessor: "title",
      render: (title, ann) => (
        <div className="flex items-center space-x-2.5">
          <Bell className={`h-4.5 w-4.5 shrink-0 ${
            ann.type === "success" 
              ? "text-green-500" 
              : ann.type === "warning" 
              ? "text-yellow-500" 
              : ann.type === "error" 
              ? "text-red-500" 
              : "text-blue-500"
          }`} />
          <span className="font-extrabold text-gray-900">{title}</span>
        </div>
      )
    },
    {
      header: "Nội dung thông báo",
      accessor: "content",
      render: (content) => <p className="text-xs text-gray-500 font-semibold leading-relaxed max-w-sm truncate">{content}</p>
    },
    {
      header: "Phân loại",
      accessor: "type",
      render: (type) => (
        <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
          type === "success"
            ? "bg-green-50 text-green-700 border border-green-100"
            : type === "warning"
            ? "bg-yellow-50 text-yellow-700 border border-yellow-100"
            : type === "error"
            ? "bg-red-50 text-red-700 border border-red-100"
            : "bg-blue-50 text-blue-700 border border-blue-100"
        }`}>
          {type === "success" ? "Thành công" : type === "warning" ? "Cảnh báo" : type === "error" ? "Khẩn cấp" : "Thông tin"}
        </span>
      )
    },
    {
      header: "Thời gian gửi",
      accessor: "time",
      render: (time) => (
        <span className="text-[10px] text-gray-400 font-bold">
          {new Date(time).toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
          })}
        </span>
      )
    },
    {
      header: "Thao tác",
      accessor: "id",
      align: "right",
      render: (_, announcement) => (
        <button
          type="button"
          onClick={() => handleResend(announcement)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-black text-orange-700 transition hover:bg-orange-100"
          title="Gửi lại thông báo này"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Gửi lại
        </button>
      )
    }
  ];

  if (showModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="max-h-[92vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-3xl bg-gray-100 p-4 shadow-2xl">
        {/* Header Bar */}
        <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-150 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3.5 py-2.5 rounded-xl transition border border-gray-200 bg-white shadow-2xs cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Quay lại
            </button>
            <h3 className="text-lg font-extrabold text-gray-900">
              Tạo thông báo toàn hệ thống
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:bg-red-50 px-3.5 py-2.5 rounded-xl transition border border-red-200 cursor-pointer"
          >
            <X className="h-4 w-4" /> Thoát
          </button>
        </div>

        {/* Form Page */}
        <div className="bg-white rounded-3xl shadow-xs border border-gray-150 overflow-hidden max-w-lg mx-auto">
          <div className="bg-gradient-to-r from-orange-500 to-pink-600 p-5 text-white">
            <p className="text-xs opacity-90 font-bold uppercase tracking-wider">
              Thông báo này sẽ được gửi tới tất cả người dùng
            </p>
          </div>
          <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Tiêu đề thông báo *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ví dụ: Bảo trì hệ thống định kỳ"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Mức độ cảnh báo *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-900 bg-white"
              >
                <option value="info" className="text-gray-900 bg-white font-semibold">Thông tin (Xanh dương)</option>
                <option value="success" className="text-gray-900 bg-white font-semibold">Thông báo thành công (Xanh lá)</option>
                <option value="warning" className="text-gray-900 bg-white font-semibold">Cảnh báo (Vàng)</option>
                <option value="error" className="text-gray-900 bg-white font-semibold">Khẩn cấp (Đỏ)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Nội dung chi tiết *</label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Nhập thông điệp gửi tới khách hàng và nhân viên..."
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 font-medium"
              />
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex gap-3.5 mt-2">
              <AlertCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-orange-700 leading-relaxed font-semibold">
                Lưu ý: Thông báo này sẽ được phát hành ngay lập tức. Mọi tài khoản khách hàng và nhân viên đăng nhập trên hệ thống đều sẽ nhìn thấy thông báo này trong hộp thư thông báo của họ.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm shadow hover:bg-orange-700 transition cursor-pointer"
            >
              Phát hành thông báo
            </button>
          </form>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <DataTable
        columns={columns}
        data={announcements}
        searchPlaceholder="Tìm kiếm thông báo..."
        searchKeys={["title", "content"]}
        itemsPerPage={8}
        actions={
          <Button icon={Plus} onClick={handleOpenAdd}>
            Gửi thông báo
          </Button>
        }
      />
    </div>
  );
}
