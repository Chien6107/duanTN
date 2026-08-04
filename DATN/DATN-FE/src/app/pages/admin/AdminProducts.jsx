import { Fragment, useState, useEffect } from "react";
import { Plus, Edit, Trash2, ArrowLeft, X, AlertTriangle, PackagePlus, Warehouse, Boxes, RefreshCw, ChevronDown, ChevronUp, ChevronRight, Layers, Minus } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { DataTable } from "../../components/DataTable";
import { Button } from "../../components/Button";
import { Link, useLocation, useNavigate } from "react-router";
import { getProductPricing } from "../../utils/pricing";
import { api } from "../../services/api";

const colorToHex = (color) => {
  const normalized = String(color || "").trim().toLowerCase();
  const colors = {
    "đen": "#111827", "den": "#111827", "trắng": "#ffffff", "trang": "#ffffff",
    "đỏ": "#dc2626", "do": "#dc2626", "xanh": "#2563eb", "xanh dương": "#2563eb",
    "xanh lá": "#16a34a", "vàng": "#eab308", "vang": "#eab308", "cam": "#f97316",
    "hồng": "#ec4899", "hong": "#ec4899", "tím": "#9333ea", "tim": "#9333ea",
    "xám": "#6b7280", "xam": "#6b7280", "nâu": "#92400e", "nau": "#92400e",
    "be": "#d6c6a5", "navy": "#1e3a8a"
  };
  return colors[normalized] || "#cbd5e1";
};

export function AdminProducts() {
  const { products = [], categories = [], addProduct, updateProduct, deleteProduct, loadUserData } = useApp();
  const [managedBrands] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("foxstyle_admin_brands") || "[]");
      if (Array.isArray(saved) && saved.length > 0) {
        return saved.filter((brand) => Number(brand.status ?? 1) !== 0);
      }
    } catch (e) {}
    return [
      { id: 1, name: "FoxStyle Premium" },
      { id: 2, name: "Zara" },
      { id: 3, name: "Uniqlo" },
      { id: 4, name: "Nike Wear" }
    ];
  });
  
  const location = useLocation();
  const navigate = useNavigate();

  // Tab & Modal states
  const [activeTab, setActiveTab] = useState("catalog"); // "catalog" | "inventory"
  const [adminStatusFilter, setAdminStatusFilter] = useState("all"); // "all" | "active" | "stopped" | "combo"
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [variantsList, setVariantsList] = useState([]);
  const [additionalImages, setAdditionalImages] = useState([]);

  // Inventory Custom Quantity & Variant States
  const [customQtyMap, setCustomQtyMap] = useState({});
  const [customVariantQtyMap, setCustomVariantQtyMap] = useState({});
  const [expandedVariantProdId, setExpandedVariantProdId] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptForm, setReceiptForm] = useState({
    supplierName: "", supplierPhone: "", note: "",
    discountAmount: "", taxRate: "", shippingFee: "", otherFee: "",
    items: [{ variantId: "", quantity: 1, unitCost: "" }]
  });

  const allVariants = products.flatMap((product) =>
    (product.variants || []).map((variant) => ({
      ...variant,
      productName: product.name,
      variantId: variant.variantId || variant.id
    }))
  );

  const exportStockReceipt = (receipt) => {
    const escape = (value) => String(value ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const rows = (receipt.items || []).map((item, index) => `
      <tr><td>${index + 1}</td><td>${escape(item.productName)}</td><td>${escape(item.sku)}</td>
      <td>${escape(item.color)}</td><td>${escape(item.size)}</td><td>${item.quantity}</td>
      <td>${Number(item.unitCost || 0)}</td><td>${Number(item.totalCost || 0)}</td>
      <td>${Number(item.stockAfter || 0)}</td></tr>`).join("");
    const html = `<!doctype html><html><head><meta charset="UTF-8"><style>
      body{font-family:Arial;color:#172033}h1{text-align:center;color:#047857}p{text-align:center}
      table{width:100%;border-collapse:collapse;margin-top:20px}th{background:#059669;color:#fff}
      th,td{border:1px solid #9ca3af;padding:8px;text-align:center}tr:nth-child(even){background:#ecfdf5}
      .info td{text-align:left}.total{font-weight:bold;background:#d1fae5}
    </style></head><body><h1>PHIẾU NHẬP KHO FOXSTYLE</h1>
      <p>Mã phiếu: <b>${escape(receipt.receiptCode)}</b> — Ngày: ${escape(new Date(receipt.createdAt).toLocaleString("vi-VN"))}</p>
      <table class="info"><tr><td><b>Nhà cung cấp:</b> ${escape(receipt.supplierName)}</td><td><b>Điện thoại:</b> ${escape(receipt.supplierPhone)}</td></tr>
      <tr><td colspan="2"><b>Ghi chú:</b> ${escape(receipt.note)}</td></tr></table>
      <table><tr><th>STT</th><th>Sản phẩm</th><th>SKU</th><th>Màu</th><th>Kích thước</th><th>SL nhập</th><th>Giá vốn sau phân bổ</th><th>Giá trị phân bổ</th><th>Tồn sau nhập</th></tr>
      ${rows}</table>
      <table class="info">
        <tr><th colspan="2">TỔNG HỢP CHI PHÍ NHẬP KHO</th></tr>
        <tr><td>Tiền hàng trước chi phí</td><td>${Number(receipt.subtotalAmount || 0)}</td></tr>
        <tr><td>Chiết khấu nhà cung cấp</td><td>-${Number(receipt.discountAmount || 0)}</td></tr>
        <tr><td>VAT đầu vào (${Number(receipt.taxRate || 0)}%)</td><td>${Number(receipt.taxAmount || 0)}</td></tr>
        <tr><td>Phí vận chuyển</td><td>${Number(receipt.shippingFee || 0)}</td></tr>
        <tr><td>Chi phí khác</td><td>${Number(receipt.otherFee || 0)}</td></tr>
        <tr class="total"><td>TỔNG THANH TOÁN</td><td>${Number(receipt.totalAmount || 0)}</td></tr>
      </table>
      <br/><table><tr><td style="height:80px"><b>Người lập phiếu</b><br/>${escape(receipt.createdBy)}</td><td style="height:80px"><b>Người giao hàng</b><br/>(Ký và ghi rõ họ tên)</td><td style="height:80px"><b>Thủ kho</b><br/>(Ký và ghi rõ họ tên)</td></tr></table>
    </body></html>`;
    const blob = new Blob(["\ufeff", html], { type: "application/vnd.ms-excel;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${receipt.receiptCode || "Phieu-nhap-kho"}.xls`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const submitStockReceipt = async (event) => {
    event.preventDefault();
    const items = receiptForm.items.map((item) => ({
      variantId: Number(item.variantId),
      quantity: Number(item.quantity),
      unitCost: Number(item.unitCost)
    }));
    if (!receiptForm.supplierName.trim() || items.some((item) =>
      !item.variantId || !Number.isInteger(item.quantity) || item.quantity <= 0 || item.unitCost <= 0)) {
      alert("Vui lòng nhập nhà cung cấp và đầy đủ sản phẩm, số lượng, đơn giá.");
      return;
    }
    if (new Set(items.map((item) => item.variantId)).size !== items.length) {
      alert("Mỗi biến thể màu và kích cỡ chỉ được nhập trên một dòng. Hãy gộp các dòng bị trùng.");
      return;
    }
    try {
      const response = await api.finance.createStockReceipt({ ...receiptForm, items,
        discountAmount:Number(receiptForm.discountAmount||0), taxRate:Number(receiptForm.taxRate||0),
        shippingFee:Number(receiptForm.shippingFee||0), otherFee:Number(receiptForm.otherFee||0) });
      exportStockReceipt(response.data);
      const stockSummary = response.data.items.map((item) =>
        `${item.productName} ${item.color}/${item.size}: +${item.quantity}, tồn mới ${item.stockAfter}`
      ).join("\n");
      alert(`Đã tạo phiếu ${response.data.receiptCode}\nTổng tiền: ${Number(response.data.totalAmount).toLocaleString("vi-VN")}đ\n\n${stockSummary}\n\nFile phiếu nhập đã được xuất.`);
      setShowReceiptModal(false);
      setReceiptForm({ supplierName: "", supplierPhone: "", note: "", discountAmount:"", taxRate:"", shippingFee:"", otherFee:"", items: [{ variantId: "", quantity: 1, unitCost: "" }] });
      await loadUserData();
    } catch (error) {
      alert(error.message || "Không thể tạo phiếu nhập kho.");
    }
  };

  // Combo Modal States
  const [showComboModal, setShowComboModal] = useState(false);
  const [comboName, setComboName] = useState("");
  const [comboPrice, setComboPrice] = useState("");
  const [comboImage, setComboImage] = useState("");
  const [comboDesc, setComboDesc] = useState("");
  const [selectedComboItemIds, setSelectedComboItemIds] = useState([]);
  const [comboVariants, setComboVariants] = useState([]);
  const [comboSelectionMode, setComboSelectionMode] = useState("CUSTOM");
  const [fixedComboVariantIds, setFixedComboVariantIds] = useState({});
  const [comboGiftProductIds, setComboGiftProductIds] = useState([]);

  const isStoppedSelling = (p) => {
    if (!p) return false;
    return p.status === 0 || p.status === "0" || p.status === false || p.status === "Ngừng bán" || p.status === "INACTIVE" || p.status === "STOPPED" || p.status === "DISCONTINUED";
  };

  const isComboItem = (p) => {
    if (!p) return false;
    return (
      p.isCombo || 
      p.category === "combo" || 
      (p.name && (p.name.includes("[SET COMBO]") || p.name.toLowerCase().includes("combo") || p.name.toLowerCase().includes("set đồ"))) || 
      (p.description && (p.description.includes("[COMBO:") || p.description.toLowerCase().includes("combo")))
    );
  };

  const regularProducts = products.filter((p) => !isComboItem(p));
  const comboProducts = products.filter((p) => isComboItem(p));
  const activeComboProducts = comboProducts.filter((p) => !isStoppedSelling(p));
  const stoppedProducts = products.filter((p) => isStoppedSelling(p));

  const totalStockCount = products.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
  const lowStockProducts = products.filter((p) => (p.quantity || 0) < 10);
  const outOfStockProducts = products.filter((p) => (p.quantity || 0) === 0);

  const displayedProducts = products.filter((p) => {
    const stopped = isStoppedSelling(p);
    const combo = isComboItem(p);
    if (adminStatusFilter === "active") {
      return !combo && !stopped;
    }
    if (adminStatusFilter === "stopped") {
      return stopped;
    }
    if (adminStatusFilter === "combo") {
      return combo && !stopped;
    }
    return !combo;
  });

  const handleOpenComboAdd = () => {
    setComboName("");
    setComboPrice("");
    setComboImage("");
    setComboDesc("");
    setSelectedComboItemIds([]);
    setComboSelectionMode("CUSTOM");
    setFixedComboVariantIds({});
    setComboGiftProductIds([]);
    setComboVariants([
      { color: "Đen", size: "S", quantity: 20, price: 399000 },
      { color: "Đen", size: "M", quantity: 20, price: 419000 },
      { color: "Trắng", size: "S", quantity: 20, price: 409000 },
      { color: "Trắng", size: "M", quantity: 20, price: 429000 }
    ]);
    setShowComboModal(true);
  };

  const toggleComboProductSelection = (productId) => {
    if (selectedComboItemIds.includes(productId)) {
      setComboGiftProductIds((current) => current.filter((id) => id !== productId));
      setFixedComboVariantIds((current) => {
        const next = { ...current }; delete next[String(productId)]; return next;
      });
    }
    setSelectedComboItemIds(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const selectedComboProducts = products.filter(p => selectedComboItemIds.includes(p.id));
  const comboTotalOriginalPrice = selectedComboProducts.reduce((sum, p) => sum + Number(p.price || 0), 0);
  const comboSavingsAmount = comboPrice && comboTotalOriginalPrice > Number(comboPrice) ? comboTotalOriginalPrice - Number(comboPrice) : 0;
  const comboSavingsPercent = comboTotalOriginalPrice > 0 && comboSavingsAmount > 0 ? Math.round((comboSavingsAmount / comboTotalOriginalPrice) * 100) : 0;

  const handleCreateComboSubmit = async (e) => {
    e.preventDefault();
    if (selectedComboItemIds.length < 2) {
      alert("Vui lòng chọn ít nhất hai sản phẩm để tạo combo!");
      return;
    }
    if (comboSelectionMode === "FIXED" && selectedComboProducts.some(
      (product) => !fixedComboVariantIds[String(product.id)]
    )) {
      alert("Vui lòng chọn màu và size cố định cho từng sản phẩm trong combo!");
      return;
    }
    if (!comboVariants.length) {
      alert("Vui lòng tạo ít nhất một biến thể màu sắc và size cho Combo!");
      return;
    }
    const invalidComboVariant = comboVariants.some(
      (variant) =>
        !variant.color?.trim() ||
        !variant.size?.trim() ||
        Number(variant.price) <= 0 ||
        Number(variant.quantity) < 0
    );
    const comboVariantKeys = comboVariants.map(
      (variant) => `${variant.color.trim().toLowerCase()}__${variant.size.trim().toLowerCase()}`
    );
    if (invalidComboVariant || new Set(comboVariantKeys).size !== comboVariantKeys.length) {
      alert("Biến thể Combo không hợp lệ hoặc bị trùng tổ hợp màu sắc và size!");
      return;
    }

    const autoName = comboName.trim() || `Set ${selectedComboProducts.map(p => p.name).join(" + ")}`;
    const autoPrice = comboPrice
      ? Number(comboPrice)
      : Math.min(...comboVariants.map((variant) => Number(variant.price)));

    const firstImg = comboImage.trim() || selectedComboProducts[0]?.image || "/image_san_pham/photo-1490481651871-ab68de25d43d.jpg";
    const comboPayload = {
      categoryId: Number(categories[0]?.id || 1),
      productName: `[SET COMBO] ${autoName}`,
      price: autoPrice,
      originalPrice: comboTotalOriginalPrice > 0 ? comboTotalOriginalPrice : autoPrice,
      description: `[COMBO:${selectedComboItemIds.join(",")}][COMBO_MODE:${comboSelectionMode}]${comboSelectionMode === "FIXED" ? `[COMBO_VARIANTS:${selectedComboProducts.map((product)=>`${product.id}=${fixedComboVariantIds[String(product.id)]}`).join(",")}]` : ""} ${comboDesc.trim() || "Set đồ phối hợp thời trang ưu đãi từ FoxStyle."}`,
      imageUrl: firstImg,
      material: "Set Đồ Phối Sẵn Premium",
      origin: "Việt Nam",
      careInstructions: "Giặt nhẹ sản phẩm theo khuyến cáo từng trang phục trong set.",
      fitGuide: "Phom dáng tiêu chuẩn tôn vóc dáng.",
      quantity: comboVariants.reduce((total, variant) => total + Number(variant.quantity || 0), 0),
      status: 1,
      isCombo: true,
      comboProductIds: selectedComboItemIds,
      comboGiftProductIds,
      comboProducts: selectedComboProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      })),
      variants: comboVariants.map((variant) => ({
        color: variant.color.trim(),
        size: variant.size.trim(),
        quantity: Number(variant.quantity),
        price: Number(variant.price),
        imageUrl: variant.imageUrl || firstImg
      })),
      images: selectedComboProducts
        .map((product, index) => ({
          imageUrl: product.image,
          isPrimary: index === 0,
          displayOrder: index + 1,
          productId: product.id,
          productName: product.name
        }))
        .filter((image) => image.imageUrl)
    };

    try {
      const res = await addProduct(comboPayload);
      if (res && res.success) {
        alert("🎉 Tạo combo sản phẩm thành công!");
        setShowComboModal(false);
      } else {
        alert(res?.message || "Tạo Combo thất bại!");
      }
    } catch (err) {
      alert("Tạo combo sản phẩm thành công!");
      setShowComboModal(false);
    }
  };

  // Auto-open edit modal if redirected from detail page
  useEffect(() => {
    if (location.state?.editId && products.length > 0) {
      const p = products.find((prod) => String(prod.id) === String(location.state.editId));
      if (p) handleOpenEdit(p);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.editId, products.length]);
  
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    originalPrice: "",
    category: 1,
    image: "/image_san_pham/photo-1521572163474-6864f9cf17ab.jpg",
    description: "",
    material: "Cotton 100%",
    origin: "Việt Nam",
    quantity: 100,
    videoUrl: "",
    status: 1
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: "",
      price: 199000,
      originalPrice: "",
      category: categories[0]?.id || 1,
      brand: managedBrands[0]?.name || "FoxStyle Premium",
      image: "/image_san_pham/photo-1521572163474-6864f9cf17ab.jpg",
      description: "Mô tả chất liệu, thiết kế và thông số sản phẩm...",
      material: "Cotton 100%",
      origin: "Việt Nam",
      careInstructions: "Giặt máy nhẹ ở nhiệt độ thường (dưới 30°C). Phơi lộn trái mặt trong bóng râm, tránh ánh nắng trực tiếp. Ủi ở nhiệt độ trung bình.",
      fitGuide: "Phom Regular Fit vừa vặn tôn dáng, phù hợp mọi vóc dáng.",
      quantity: 100,
      videoUrl: "",
      status: 1
    });
    setVariantsList([
      { color: "Trắng", size: "M", quantity: 50, price: 199000, imageUrl: "" },
      { color: "Đen", size: "L", quantity: 50, price: 199000, imageUrl: "" }
    ]);
    setAdditionalImages([]);
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditingId(p.id);
    setFormData({
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice || "",
      category: p.categoryId || 1,
      brand: p.brand || p.brandName || "FoxStyle Studio",
      image: p.image,
      description: p.description,
      material: p.material || "Cotton 100%",
      origin: p.origin || "Việt Nam",
      careInstructions: p.careInstructions || "Giặt máy nhẹ ở nhiệt độ thường (dưới 30°C). Phơi lộn trái mặt trong bóng râm. Ủi ở nhiệt độ trung bình.",
      fitGuide: p.fitGuide || "Phom Regular Fit ôm vừa tôn dáng, phù hợp mọi vóc dáng.",
      quantity: p.quantity || 50,
      videoUrl: p.videoUrl || "",
      status: p.status !== undefined ? p.status : 1
    });
    setVariantsList(
      p.variants
        ? p.variants.map((variant) => ({ ...variant, price: variant.price || p.price || "" }))
        : []
    );
    const secondaryImages = p.images ? p.images.filter(img => !img.isPrimary).map(img => img.imageUrl) : [];
    setAdditionalImages(secondaryImages);
    setShowModal(true);
  };

  const handleAddImageRow = () => {
    setAdditionalImages([...additionalImages, ""]);
  };

  const handleMultipleImagesFileChange = async (event) => {
    const files = Array.from(event.target.files || []).filter((file) =>
      file.type.startsWith("image/")
    );
    if (files.length === 0) return;

    Promise.all(files.map((file) => api.media.upload(file, "image_san_pham").then((result) => result.url)))
      .then((newImages) => {
        setAdditionalImages((currentImages) => [
          ...currentImages.filter(Boolean),
          ...newImages.filter((image) => !currentImages.includes(image))
        ]);
      })
      .catch((error) => alert(error.message || "Không thể lưu một hoặc nhiều ảnh đã chọn."));

    event.target.value = "";
  };

  const handlePrimaryImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await api.media.upload(file, "image_san_pham");
      setFormData(prev => ({ ...prev, image: result.url }));
    } catch (error) {
      alert(error.message || "Không thể lưu ảnh sản phẩm.");
    }
  };

  const handleVideoFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await api.media.upload(file, "video");
      setFormData(prev => ({ ...prev, videoUrl: result.url }));
    } catch (error) {
      alert(error.message || "Không thể lưu video sản phẩm.");
    }
  };

  const handleImageRowChange = (index, val) => {
    const updated = [...additionalImages];
    updated[index] = val;
    setAdditionalImages(updated);
  };

  const handleRemoveImageRow = (index) => {
    const updated = [...additionalImages];
    updated.splice(index, 1);
    setAdditionalImages(updated);
  };

  const handleAddVariantRow = () => {
    setVariantsList([
      ...variantsList,
      { color: "", size: "", quantity: 10, price: Number(formData.price) || "", imageUrl: "" }
    ]);
  };

  const handleVariantRowChange = (index, field, val) => {
    const updated = [...variantsList];
    updated[index] = { ...updated[index], [field]: val };
    setVariantsList(updated);
  };

  const handleRemoveVariantRow = (index) => {
    const updated = [...variantsList];
    updated.splice(index, 1);
    setVariantsList(updated);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name?.trim() || formData.price <= 0) {
      alert("Vui lòng điền tên sản phẩm và giá hợp lệ!");
      return;
    }
    const normalizedProductName = formData.name.trim().replace(/\s+/g, " ").toLowerCase();
    const duplicatedProductName = products.some((product) =>
      product.id !== editingId && String(product.name || product.productName || "")
        .trim().replace(/\s+/g, " ").toLowerCase() === normalizedProductName
    );
    if (duplicatedProductName) {
      alert("Tên sản phẩm đã tồn tại. Vui lòng chọn tên khác!");
      return;
    }
    const invalidVariant = variantsList.find(
      (variant) =>
        !variant.color.trim() ||
        !variant.size.trim() ||
        Number(variant.quantity) < 0 ||
        Number(variant.price) <= 0
    );
    if (invalidVariant) {
      alert("Mỗi biến thể màu và size phải có giá bán lớn hơn 0 và số lượng kho hợp lệ!");
      return;
    }
    const variantKeys = variantsList.map(
      (variant) => `${variant.color.trim().toLowerCase()}::${variant.size.trim().toLowerCase()}`
    );
    if (new Set(variantKeys).size !== variantKeys.length) {
      alert("Không được tạo trùng tổ hợp màu và size!");
      return;
    }

    const imagesPayload = [
      { imageUrl: formData.image, isPrimary: true, displayOrder: 1 },
      ...additionalImages.filter(url => url.trim() !== "").map((url, idx) => ({
        imageUrl: url.trim(),
        isPrimary: false,
        displayOrder: idx + 2
      }))
    ];

    const variantsPayload = variantsList.map(v => ({
      variantId: v.id || v.variantId || undefined,
      color: v.color.trim(),
      size: v.size.trim(),
      quantity: Number(v.quantity),
      price: Number(v.price),
      imageUrl: v.imageUrl || null
    }));

    const productPayload = {
      categoryId: Number(formData.category) || Number(categories[0]?.id || categories[0]?.categoryId) || 1,
      productName: formData.name.trim().replace(/\s+/g, " "),
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice) > Number(formData.price)
        ? Number(formData.originalPrice)
        : undefined,
      description: formData.description,
      imageUrl: formData.image,
      material: formData.material,
      brand: (formData.brand || "").trim(),
      origin: formData.origin,
      careInstructions: formData.careInstructions,
      fitGuide: formData.fitGuide,
      videoUrl: formData.videoUrl || "",
      status: Number(formData.status),
      variants: variantsPayload,
      images: imagesPayload
    };

    try {
      if (editingId) {
        const res = await updateProduct(editingId, productPayload);
        if (res && res.success) {
          alert("Cập nhật thông tin sản phẩm thành công!");
          setShowModal(false);
        } else {
          alert(res?.message || "Cập nhật sản phẩm thất bại!");
        }
      } else {
        const res = await addProduct(productPayload);
        if (res && res.success) {
          alert("Thêm sản phẩm mới thành công!");
          setShowModal(false);
        } else {
          alert(res?.message || "Thêm sản phẩm mới thất bại!");
        }
      }
    } catch (err) {
      alert(err.message || "Đã xảy ra lỗi!");
    }
  };

  const handleToggleProductStatus = async (product) => {
    if (!product) return;
    const isStopped = product.status === 0 || product.status === "0" || product.status === false || product.status === "Ngừng bán" || product.status === "INACTIVE" || product.status === "STOPPED" || product.status === "DISCONTINUED";
    const nextStatus = isStopped ? 1 : 0;

    try {
      await updateProduct(product.id, {
        ...product,
        status: nextStatus
      });
    } catch (err) {
      console.error("Lỗi chuyển đổi trạng thái sản phẩm:", err);
    }
  };

  const handleQuickAddStock = async (product, addQty) => {
    const amount = Number(addQty);
    if (!Number.isInteger(amount) || amount <= 0) return;
    if (!product.variants?.length) {
      alert("Sản phẩm chưa có biến thể để nhập kho.");
      return;
    }
    const unitCost = Number(window.prompt("Nhập giá vốn cho mỗi sản phẩm (VNĐ):", product.variants[0]?.costPrice || ""));
    if (!Number.isFinite(unitCost) || unitCost <= 0) {
      alert("Giá nhập phải lớn hơn 0.");
      return;
    }
    const updatedVariants = product.variants.map((variant, index) => (
      index === 0
        ? { ...variant, quantity: Number(variant.quantity || 0) + amount }
        : variant
    ));
    const newQty = updatedVariants.reduce(
      (sum, variant) => sum + Number(variant.quantity || 0),
      0
    );
    try {
      const res = await updateProduct(product.id, {
        ...product,
        productName: product.name,
        variants: updatedVariants
      });
      if (res && res.success) {
        await api.finance.recordStockImport({
          variantId: product.variants[0].variantId || product.variants[0].id,
          quantity: amount,
          unitCost
        });
        alert(`Đã nhập bổ sung +${addQty} sản phẩm cho "${product.name}"! Tồn kho mới: ${newQty}`);
      }
    } catch (err) {
      alert("Lỗi nhập kho!");
    }
  };

  const handleCustomAddStock = async (product) => {
    const amount = Number(customQtyMap[product.id]);
    if (!Number.isInteger(amount) || amount <= 0) {
      alert("Số lượng nhập kho phải là số nguyên lớn hơn 0.");
      return;
    }
    await handleQuickAddStock(product, amount);
    setCustomQtyMap((current) => ({ ...current, [product.id]: "" }));
  };

  const handleQuickAddVariantStock = async (product, variantIndex, delta) => {
    const amount = Number(delta);
    if (!Number.isInteger(amount)) return;
    const targetVariant = product.variants[variantIndex];
    const unitCost = amount > 0
      ? Number(window.prompt("Nhập giá vốn cho mỗi sản phẩm (VNĐ):", targetVariant?.costPrice || ""))
      : 0;
    if (amount > 0 && (!Number.isFinite(unitCost) || unitCost <= 0)) {
      alert("Giá nhập phải lớn hơn 0.");
      return;
    }
    const updatedVariants = product.variants.map((variant, index) => (
      index === variantIndex
        ? {
            ...variant,
            quantity: Math.max(0, Number(variant.quantity || 0) + amount)
          }
        : variant
    ));
    try {
      await updateProduct(product.id, {
        ...product,
        productName: product.name,
        variants: updatedVariants
      });
      if (amount > 0) {
        await api.finance.recordStockImport({
          variantId: targetVariant.variantId || targetVariant.id,
          quantity: amount,
          unitCost
        });
      }
    } catch (err) {
      alert(err.message || "Không thể cập nhật tồn kho biến thể.");
    }
  };

  const handleCustomAddVariantStock = async (product, variantIndex) => {
    const key = `${product.id}_${variantIndex}`;
    const amount = Number(customVariantQtyMap[key]);
    if (!Number.isInteger(amount) || amount === 0) {
      alert("Số lượng điều chỉnh phải là số nguyên khác 0.");
      return;
    }
    await handleQuickAddVariantStock(product, variantIndex, amount);
    setCustomVariantQtyMap((current) => ({ ...current, [key]: "" }));
  };

  const handleDelete = async (id) => {
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm ID: ${id}?`)) {
      try {
        const res = await deleteProduct(id);
        if (res && res.success) {
          alert("Xóa sản phẩm thành công!");
        } else {
          alert(res?.message || "Xóa sản phẩm thất bại!");
        }
      } catch (err) {
        alert(err.message || "Đã xảy ra lỗi khi xóa sản phẩm!");
      }
    }
  };

  const columns = [
    {
      header: "Sản phẩm",
      accessor: "name",
      render: (name, product) => {
        const comboIds = product.comboProductIds?.length
          ? product.comboProductIds
          : (product.description?.match(/\[COMBO:\s*([\d,]+)\]/)?.[1] || "")
              .split(",")
              .map((value) => value.trim())
              .filter(Boolean);
        const componentImages = isComboItem(product)
          ? [
              ...(product.comboProducts || []).map((item) => item.image),
              ...comboIds.map(
                (productId) =>
                  products.find((item) => String(item.id) === String(productId))?.image
              ),
              ...(product.images || []).map((image) => image.imageUrl),
              product.image
            ].filter(
              (image, index, images) => image && images.indexOf(image) === index
            )
          : [product.image];

        return (
        <div className="flex items-center space-x-3 py-0.5">
          <Link to={`/admin/products/${product.id}`}>
            {componentImages.length > 1 ? (
              <div className="grid h-14 w-14 shrink-0 grid-cols-2 gap-0.5 overflow-hidden rounded-xl border bg-gray-100 p-0.5">
                {componentImages.slice(0, 4).map((image, index) => (
                  <div key={image} className="relative overflow-hidden rounded-[5px]">
                    <img src={image} alt={`${name} - ${index + 1}`} className="h-full w-full object-cover" />
                    {index === 3 && componentImages.length > 4 && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-[10px] font-black text-white">
                        +{componentImages.length - 3}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <img
                src={componentImages[0] || product.image}
                alt={name}
                className="w-12 h-12 object-cover rounded-xl border flex-shrink-0 group-hover:scale-105 transition duration-200"
              />
            )}
          </Link>
          <div className="min-w-0">
            <Link
              to={`/admin/products/${product.id}`}
              className="font-bold text-gray-900 hover:text-orange-600 group-hover:text-orange-700 transition truncate max-w-xs block"
            >
              {name}
            </Link>
            <p className="text-xs text-gray-400 mt-0.5 font-bold">ID: #{product.id}</p>
          </div>
        </div>
      );
      }
    },
    {
      header: "Danh mục",
      accessor: "category",
      render: (cat) => (
        <span className="px-2.5 py-1 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold border border-orange-100 uppercase">
          {cat}
        </span>
      )
    },
    {
      header: "Thương hiệu",
      accessor: "brand",
      render: (brand, product) => {
        const b = brand || product.brandName || "FoxStyle Premium";
        return (
          <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-black border border-purple-100 uppercase tracking-wider">
            {b}
          </span>
        );
      }
    },
    {
      header: "Giá bán",
      accessor: "price",
      headerClassName: "min-w-[180px]",
      cellClassName: "min-w-[180px]",
      render: (price, product) => {
        const pricing = getProductPricing(product, price);
        const discount = pricing.discountPercent;
        return (
          <div className="min-w-0 whitespace-nowrap">
            <p className="font-bold text-gray-900 whitespace-nowrap">{price.toLocaleString('vi-VN')}đ</p>
            {pricing.hasDiscount && (
              <div className="flex flex-nowrap items-center gap-1.5 mt-0.5 whitespace-nowrap">
                <span className="shrink-0 text-xs text-gray-400 line-through whitespace-nowrap">
                  {pricing.originalPrice.toLocaleString('vi-VN')}đ
                </span>
                {discount > 0 && (
                  <span className="inline-flex shrink-0 whitespace-nowrap text-[10px] leading-none font-black bg-red-100 text-red-600 px-1.5 py-1 rounded">
                    -{discount}%
                  </span>
                )}
              </div>
            )}
          </div>
        );
      }
    },
    {
      header: "Hàng tồn",
      accessor: "quantity",
      headerClassName: "min-w-[120px]",
      cellClassName: "min-w-[120px] whitespace-nowrap",
      render: (qty) => (
        <span className={`inline-flex items-center whitespace-nowrap text-xs font-bold px-2.5 py-0.5 rounded-full ${
          (qty || 0) <= 0 
            ? "bg-red-50 text-red-600"
            : (qty || 0) <= 5
            ? "bg-yellow-50 text-yellow-700 animate-pulse"
            : "bg-green-50 text-green-700"
        }`}>
          {qty || 0} cái
        </span>
      )
    },
    {
      header: "Trạng thái",
      accessor: "status",
      render: (status, product) => {
        const stopped = isStoppedSelling(product);
        return (
          <button
            type="button"
            onClick={() => handleToggleProductStatus(product)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black transition cursor-pointer border shadow-xs ${
              stopped
                ? "bg-red-100 text-red-800 border-red-300 hover:bg-emerald-600 hover:text-white"
                : "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-red-600 hover:text-white"
            }`}
            title={stopped ? "Click để chuyển sang Mở bán lại" : "Click để ẩn (ngừng bán)"}
          >
            {stopped ? "🔴 Ngừng bán (Mở bán lại)" : "🟢 Tạm ẩn (Ngừng bán)"}
          </button>
        );
      }
    },
    {
      header: "Thao tác",
      accessor: "id",
      align: "right",
      render: (id, product) => (
        <div className="flex items-center justify-end space-x-1.5">
          <button
            onClick={() => handleOpenEdit(product)}
            className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition"
            title="Sửa"
          >
            <Edit className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={() => handleDelete(id)}
            className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition"
            title="Xóa"
          >
            <Trash2 className="h-4.5 w-4.5" />
          </button>
          <ChevronRight className="h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-orange-500" aria-hidden="true" />
        </div>
      )
    }
  ];

  if (showModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="h-full max-h-screen w-full space-y-4 overflow-y-auto bg-gray-100 p-4 shadow-2xl">
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
              {editingId ? "Cập nhật thông tin sản phẩm" : "Thêm sản phẩm mới"}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:bg-red-50 px-3.5 py-2.5 rounded-xl transition border border-red-200 cursor-pointer"
          >
            <X className="h-4 w-4" /> Hủy bỏ
          </button>
        </div>

        {/* Form Body */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
          <form onSubmit={handleFormSubmit} className="w-full space-y-6">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Tên sản phẩm thời trang *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4.5 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-extrabold text-gray-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Giá bán hiện tại (đ) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.price}
                  onChange={(e) => {
                    const nextPrice = e.target.value === "" ? "" : Math.max(0, Number(e.target.value));
                    setFormData({ ...formData, price: nextPrice });
                    setVariantsList((current) => current.map((variant) => ({
                      ...variant,
                      price: nextPrice
                    })));
                  }}
                  className="w-full px-4.5 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-extrabold text-orange-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Mức giảm (%)</label>
                <input
                  type="number"
                  min="0"
                  max="99"
                  placeholder="Ví dụ: 20%"
                  onChange={(e) => {
                    const percent = Math.min(99, Math.max(0, Number(e.target.value)));
                    if (percent > 0 && formData.price > 0) {
                      const orig = Math.round(Number(formData.price) / (1 - percent / 100));
                      setFormData({ ...formData, originalPrice: orig });
                    } else if (percent === 0) {
                      setFormData({ ...formData, originalPrice: "" });
                    }
                  }}
                  className="w-full px-4.5 py-3 border border-orange-200 bg-orange-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-black text-orange-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Giá gốc (Trước giảm)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({
                    ...formData,
                    originalPrice: e.target.value === "" ? "" : Math.max(0, Number(e.target.value))
                  })}
                  placeholder="Không Sale"
                  className="w-full px-4.5 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-855"
                />
              </div>
            </div>

            {/* Brand, Material & Origin Input Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                  🏷️ Thương hiệu (Brand) *
                </label>
                <select
                  required
                  value={formData.brand || ""}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-gray-900 bg-white focus:ring-2 focus:ring-orange-500"
                >
                  <option value="" disabled>Chọn thương hiệu</option>
                  {managedBrands.map((brand) => (
                    <option key={brand.id ?? brand.name} value={brand.name}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                  🧵 Thành phần chất liệu *
                </label>
                <input
                  type="text"
                  required
                  value={formData.material || "Cotton 100%"}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  placeholder="Ví dụ: Cotton 100%, Kate Mỹ, Nỉ..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-gray-900 bg-white focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                  🇻🇳 Nguồn gốc xuất xứ *
                </label>
                <input
                  type="text"
                  required
                  value={formData.origin || "Việt Nam"}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  placeholder="Ví dụ: Việt Nam, Hàn Quốc..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-gray-900 bg-white focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Phân loại danh mục</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4.5 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-extrabold text-gray-900 bg-white"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id} className="text-gray-900 bg-white capitalize font-bold">{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Trạng thái kinh doanh *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
                  className="w-full px-4.5 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-extrabold text-gray-900 bg-white"
                >
                  <option value={1}>🟢 Tiếp tục bán (Đang kinh doanh)</option>
                  <option value={0}>🔴 Ngừng bán (Tạm ẩn)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Số lượng kho nhập *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-4.5 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-800"
                />
              </div>
            </div>

            {/* Color / Size variants with their own image */}
            <div className="bg-blue-50/40 p-4 rounded-2xl border border-blue-200 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-blue-900">🎨 Biến thể màu – size – giá – hình ảnh</h4>
                  <p className="text-[11px] text-gray-500 mt-1">Mỗi tổ hợp màu và size có giá bán, tồn kho và hình ảnh riêng.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddVariantRow}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl cursor-pointer"
                >
                  + Thêm biến thể
                </button>
              </div>

              <div className="space-y-3">
                {variantsList.map((variant, index) => (
                  <div key={variant.variantId || index} className="bg-white border border-blue-100 rounded-2xl p-3 grid grid-cols-2 md:grid-cols-12 gap-2 items-center">
                    <input
                      required
                      value={variant.color}
                      onChange={(event) => handleVariantRowChange(index, "color", event.target.value)}
                      placeholder="Màu sắc"
                      className="md:col-span-2 px-3 py-2 border rounded-lg text-xs font-bold"
                    />
                    <input
                      required
                      value={variant.size}
                      onChange={(event) => handleVariantRowChange(index, "size", event.target.value)}
                      placeholder="Size"
                      className="md:col-span-1 px-3 py-2 border rounded-lg text-xs font-bold"
                    />
                    <input
                      required
                      type="number"
                      min={0}
                      value={variant.quantity}
                      onChange={(event) => handleVariantRowChange(index, "quantity", event.target.value)}
                      placeholder="Kho"
                      className="md:col-span-1 px-3 py-2 border rounded-lg text-xs font-bold"
                    />
                    <input
                      required
                      type="number"
                      min={1}
                      value={variant.price || ""}
                      onChange={(event) => handleVariantRowChange(
                        index,
                        "price",
                        event.target.value === "" ? "" : Math.max(0, Number(event.target.value))
                      )}
                      placeholder="Giá theo màu/size *"
                      title="Giá bán riêng của tổ hợp màu và size này"
                      className="md:col-span-2 px-3 py-2 border border-orange-300 bg-orange-50/50 rounded-lg text-xs font-black text-orange-800"
                    />
                    <input
                      value={variant.imageUrl || ""}
                      onChange={(event) => handleVariantRowChange(index, "imageUrl", event.target.value)}
                      placeholder="URL ảnh màu/size này"
                      className="md:col-span-3 px-3 py-2 border rounded-lg text-xs min-w-0"
                    />
                    <label className="md:col-span-2 bg-gray-100 hover:bg-gray-200 border text-gray-700 text-[11px] font-bold px-2 py-2 rounded-lg cursor-pointer text-center">
                      📁 Chọn ảnh
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          try {
                            const result = await api.media.upload(file, "image_san_pham");
                            handleVariantRowChange(index, "imageUrl", result.url);
                          } catch (error) { alert(error.message || "Không thể lưu ảnh biến thể."); }
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariantRow(index)}
                      className="md:col-span-1 p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4 mx-auto" />
                    </button>
                    {variant.imageUrl && (
                      <div className="col-span-2 md:col-span-12 flex items-center gap-2 text-[10px] font-bold text-gray-500">
                        <img src={variant.imageUrl} alt={`${variant.color} ${variant.size}`} className="w-14 h-14 rounded-lg object-cover border" />
                        Ảnh áp dụng cho {variant.color || "màu"} / {variant.size || "size"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Image Upload Field */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700">
                🖼️ Ảnh chính sản phẩm *
              </label>

              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Dán link ảnh HOẶC chọn file từ máy bên cạnh..."
                  className="flex-1 px-4.5 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium bg-white"
                />

                <label className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-extrabold text-xs px-4 py-3 rounded-xl shadow-xs transition cursor-pointer shrink-0 flex items-center gap-1.5">
                  <span>📁 Chọn ảnh từ máy</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePrimaryImageFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {formData.image && (
                <div className="w-20 h-20 rounded-xl border overflow-hidden bg-white shadow-2xs">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Secondary Gallery Images Builder */}
            <div className="bg-orange-50/40 p-4 rounded-2xl border border-orange-200/70 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-orange-900">
                    📸 Bộ sưu tập ảnh góc chụp phụ ({additionalImages.length} ảnh)
                  </label>
                  <p className="text-[11px] text-gray-500 font-medium">Thêm nhiều ảnh phụ (mặt sau, chi tiết vải, màu sắc khác...) để khách hàng xem chi tiết.</p>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <label className="px-3.5 py-2 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-black text-xs rounded-xl transition cursor-pointer flex items-center gap-1 shadow-xs">
                    📁 Chọn nhiều ảnh
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMultipleImagesFileChange}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleAddImageRow}
                    className="px-3.5 py-2 bg-white hover:bg-orange-50 text-orange-700 border border-orange-300 font-black text-xs rounded-xl transition cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="h-3.5 w-3.5" /> Dán URL ảnh
                  </button>
                </div>
              </div>

              {additionalImages.length === 0 ? (
                <p className="text-xs text-gray-400 font-medium italic bg-white p-3 rounded-xl border border-dashed text-center">
                  Chưa có ảnh phụ. Bấm &quot;Thêm ảnh phụ&quot; ở trên để dán link hoặc chọn file từ máy.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {additionalImages.map((imgUrl, idx) => (
                    <div key={idx} className="relative bg-white p-2 rounded-xl border border-gray-200 space-y-2">
                      {imgUrl ? (
                        <img src={imgUrl} alt={`Ảnh phụ ${idx + 1}`} className="w-full h-28 rounded-lg object-cover border bg-gray-50" />
                      ) : (
                        <div className="w-full h-28 rounded-lg border border-dashed bg-gray-50 flex items-center justify-center text-xs text-gray-400">
                          Chưa chọn ảnh
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400">#{idx + 1}</span>
                        <input
                          type="text"
                          value={imgUrl}
                          onChange={(e) => handleImageRowChange(idx, e.target.value)}
                          placeholder="Dán URL ảnh..."
                          className="min-w-0 flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium"
                        />
                        <label className="shrink-0 cursor-pointer rounded-lg border border-orange-300 px-2 py-2 text-[10px] font-black text-orange-700 hover:bg-orange-50">
                          Chọn ảnh
                          <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const result = await api.media.upload(file, "image_san_pham");
                              handleImageRowChange(idx, result.url);
                            } catch (error) { alert(error.message || "Không thể lưu ảnh phụ."); }
                          }} />
                        </label>
                        <button
                          type="button"
                          onClick={() => handleRemoveImageRow(idx)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                          title="Xóa ảnh"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

        {/* Video Upload Field */}
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
          <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700">
            🎬 Video Sản Phẩm 4K (Để trống nếu sản phẩm này KHÔNG CÓ video)
          </label>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <input
              type="text"
              value={formData.videoUrl || ""}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              placeholder="Dán link video HOẶC chọn file video từ máy..."
              className="flex-1 px-4.5 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium bg-white"
            />

            <label className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs px-4 py-3 rounded-xl shadow-xs transition cursor-pointer shrink-0 flex items-center gap-1.5">
              <span>🎥 Chọn video từ máy</span>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoFileChange}
                className="hidden"
              />
            </label>
          </div>

          {formData.videoUrl && (
            <div className="w-36 aspect-video rounded-xl border overflow-hidden bg-black shadow-2xs">
              <video src={formData.videoUrl} controls className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Mô tả sản phẩm *</label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4.5 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 font-medium"
          />
        </div>

        {/* Additional Detailed Care & Fit Guide Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
              🧺 Hướng dẫn giặt ủi & bảo quản
            </label>
            <textarea
              rows={3}
              value={formData.careInstructions || ""}
              onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
              placeholder="Ví dụ: Giặt máy nhẹ dưới 30°C. Phơi lộn trái mặt trong bóng râm. Không sử dụng thuốc tẩy..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
              📐 Hướng dẫn phom dáng & chọn Size
            </label>
            <textarea
              rows={3}
              value={formData.fitGuide || ""}
              onChange={(e) => setFormData({ ...formData, fitGuide: e.target.value })}
              placeholder="Ví dụ: Phom Regular Fit ôm vừa tôn dáng. Chiều cao 1m65-1m75 khuyên dùng Size M..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-600 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md hover:bg-orange-700 transition cursor-pointer"
        >
          {editingId ? "Cập nhật sản phẩm" : "Nhập hàng sản phẩm mới"}
        </button>
      </form>
    </div>
    </div>
  </div>
    );
  }

  return (
<div className="space-y-6 animate-in fade-in duration-200">

  {/* Header Bar with Tab Navigation */}
  <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
    <div>
      <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
        <Warehouse className="h-5 w-5 text-orange-600" />
        <span>Quản Lý Sản Phẩm & Kho Hàng FoxStyle</span>
      </h2>
      <p className="text-xs text-gray-500 font-medium">Theo dõi hàng tồn kho, cập nhật số lượng nhập kho và quản lý trạng thái Tiếp tục/Ngừng bán.</p>
    </div>

    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-2xl">
      <button
        type="button"
        onClick={() => setActiveTab("catalog")}
        className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
          activeTab === "catalog" ? "bg-orange-600 text-white shadow-2xs" : "text-gray-600 hover:text-gray-900"
        }`}
      >
        📦 Danh Sách Sản Phẩm
      </button>
      <button
        type="button"
        onClick={() => { window.location.href = "/admin/inventory"; }}
        className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
          activeTab === "inventory" ? "bg-orange-600 text-white shadow-2xs" : "text-gray-600 hover:text-gray-900"
        }`}
      >
        🏭 Quản Lý Kho Hàng ({lowStockProducts.length > 0 ? `⚠️ ${lowStockProducts.length}` : "OK"})
      </button>
      <button
        type="button"
        onClick={() => setShowReceiptModal(true)}
        className="hidden"
      >
        + Lập phiếu nhập kho
      </button>
    </div>
  </div>

  {activeTab === "inventory" ? (
    <div className="space-y-6">
      {/* Inventory Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Tổng số lượng kho</span>
            <span className="text-2xl font-black text-gray-900">{totalStockCount.toLocaleString('vi-VN')} cái</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Boxes className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-800 font-bold uppercase tracking-wider block">Sắp hết hàng (&lt;10 cái)</span>
            <span className="text-2xl font-black text-amber-900">{lowStockProducts.length} sản phẩm</span>
          </div>
          <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl">
            <AlertTriangle className="h-6 w-6 animate-pulse" />
          </div>
        </div>

        <div className="bg-red-50 p-5 rounded-2xl border border-red-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-red-800 font-bold uppercase tracking-wider block">Hết hàng trong kho (0 cái)</span>
            <span className="text-2xl font-black text-red-900">{outOfStockProducts.length} sản phẩm</span>
          </div>
          <div className="p-3 bg-red-100 text-red-700 rounded-2xl">
            <X className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Inventory Action Table */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs">
        <h3 className="text-base font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <PackagePlus className="h-5 w-5 text-orange-600" />
          <span>Nhập Kho Nhanh & Điều Chỉnh Tồn Kho</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold text-gray-600">
            <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] tracking-wider border-b">
              <tr>
                <th className="p-3">Sản phẩm</th>
                <th className="p-3">Danh mục</th>
                <th className="p-3">Tồn kho hiện tại</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3 text-right">Nhập kho bổ sung nhanh (+1, +5, +10, +50, +100 & Custom)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(product => {
                const hasVariants = product.variants && product.variants.length > 0;
                const isExpanded = expandedVariantProdId === product.id;

                return (
                  <Fragment key={product.id}>
                    <tr className="hover:bg-gray-50/50 transition">
                      <td className="p-3 font-bold text-gray-900 flex items-center gap-3">
                        <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover border" />
                        <div>
                          <p className="flex items-center gap-1.5">
                            <span>{product.name}</span>
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-gray-400 font-mono">SKU: FS-{product.id}-V2</span>
                            {hasVariants && (
                              <button
                                type="button"
                                onClick={() => setExpandedVariantProdId(isExpanded ? null : product.id)}
                                className="text-[10px] font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md flex items-center gap-1 transition cursor-pointer"
                              >
                                <Layers className="w-3 h-3" />
                                <span>{product.variants.length} biến thể</span>
                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 uppercase text-gray-500">{product.category}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full font-black text-xs ${
                          (product.quantity || 0) <= 0
                            ? "bg-red-100 text-red-700"
                            : (product.quantity || 0) < 10
                            ? "bg-amber-100 text-amber-800 animate-pulse"
                            : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {product.quantity || 0} cái
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => handleToggleProductStatus(product)}
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-black transition border cursor-pointer ${
                            product.status === 0 ? "bg-red-50 text-red-700 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {product.status === 0 ? "🔴 Ngừng bán" : "🟢 Tiếp tục bán"}
                        </button>
                      </td>
                      <td className="p-3 text-right">
                        {hasVariants ? (
                          <button
                            type="button"
                            onClick={() => setExpandedVariantProdId(isExpanded ? null : product.id)}
                            className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-black text-white hover:bg-orange-700"
                          >
                            {isExpanded ? "Đóng biến thể" : "Quản lý theo màu & size"}
                          </button>
                        ) : (
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {[1, 5, 10, 50, 100].map(qty => (
                            <button
                              key={qty}
                              type="button"
                              onClick={() => handleQuickAddStock(product, qty)}
                              className="px-2 py-1 bg-orange-50 hover:bg-orange-600 hover:text-white text-orange-700 border border-orange-200 rounded-lg font-bold text-[11px] transition cursor-pointer"
                            >
                              +{qty}
                            </button>
                          ))}
                          <div className="flex items-center gap-1 border-l border-gray-200 pl-1.5 ml-1">
                            <input
                              type="number"
                              min="1"
                              placeholder="+X"
                              value={customQtyMap[product.id] || ""}
                              onChange={(e) => setCustomQtyMap({ ...customQtyMap, [product.id]: e.target.value })}
                              onKeyDown={(e) => { if (e.key === "Enter") handleCustomAddStock(product); }}
                              className="w-14 h-7 text-xs text-center border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 bg-white font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => handleCustomAddStock(product)}
                              className="h-7 px-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                              title="Nhập số lượng tuỳ chỉnh"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        )}
                      </td>
                    </tr>

                    {/* Expanded Variant Drawer */}
                    {isExpanded && hasVariants && (
                      <tr className="bg-orange-50/30">
                        <td colSpan={5} className="p-4">
                          <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-2xs">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider flex items-center gap-2">
                                <Layers className="w-4 h-4 text-orange-600" />
                                <span>Tồn kho theo từng biến thể (màu sắc và kích cỡ) - {product.name}</span>
                              </h4>
                              <span className="text-[11px] text-gray-500 font-semibold">Tự động cập nhật tổng tồn kho sản phẩm khi chỉnh biến thể</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {product.variants.map((v, vIdx) => (
                                <div key={v.variantId || `${v.color}-${v.size}-${vIdx}`} className="p-3 bg-gray-50/80 rounded-xl border border-gray-200 flex flex-col justify-between gap-2.5">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-2xs"
                                        style={{ backgroundColor: colorToHex(v.color) }}
                                      />
                                      <span className="font-bold text-xs text-gray-800">{v.color}</span>
                                      <span className="px-2 py-0.5 bg-white border border-gray-200 text-gray-700 rounded-md text-[10px] font-extrabold">
                                        {v.size}
                                      </span>
                                    </div>
                                    <span className={`font-black text-xs px-2.5 py-0.5 rounded-full ${(v.quantity || 0) <= 0 ? "bg-red-100 text-red-700" : (v.quantity || 0) <= 5 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                                      {v.quantity || 0} cái
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between gap-1 pt-2 border-t border-gray-200/60">
                                    <div className="flex items-center gap-1">
                                      <button
                                        type="button"
                                        title="Giảm 1"
                                        onClick={() => handleQuickAddVariantStock(product, vIdx, -1)}
                                        className="w-7 h-6 flex items-center justify-center bg-white hover:bg-red-50 text-gray-700 hover:text-red-600 border border-gray-200 rounded-md text-xs font-bold transition cursor-pointer"
                                      >
                                        -1
                                      </button>
                                      <button
                                        type="button"
                                        title="Tăng 1"
                                        onClick={() => handleQuickAddVariantStock(product, vIdx, 1)}
                                        className="w-7 h-6 flex items-center justify-center bg-white hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 border border-gray-200 rounded-md text-xs font-bold transition cursor-pointer"
                                      >
                                        +1
                                      </button>
                                      <button
                                        type="button"
                                        title="Tăng 5"
                                        onClick={() => handleQuickAddVariantStock(product, vIdx, 5)}
                                        className="w-7 h-6 flex items-center justify-center bg-white hover:bg-orange-50 text-orange-600 border border-orange-200 rounded-md text-xs font-bold transition cursor-pointer"
                                      >
                                        +5
                                      </button>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="number"
                                        placeholder="+X"
                                        value={customVariantQtyMap[`${product.id}_${vIdx}`] || ""}
                                        onChange={(e) => setCustomVariantQtyMap({ ...customVariantQtyMap, [`${product.id}_${vIdx}`]: e.target.value })}
                                        onKeyDown={(e) => { if (e.key === "Enter") handleCustomAddVariantStock(product, vIdx); }}
                                        className="w-12 h-6 text-xs text-center border border-gray-200 rounded-md bg-white font-mono"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleCustomAddVariantStock(product, vIdx)}
                                        className="h-6 px-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-[11px] font-bold transition cursor-pointer"
                                      >
                                        Lưu
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <div className="space-y-6">
      {/* Dynamic Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-zinc-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-wider text-zinc-400">Sản phẩm</p>
                <h3 className="text-2xl font-black text-zinc-900 mt-1">{regularProducts.length}</h3>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Boxes className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-zinc-200 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-zinc-400">Đang kinh doanh</p>
                <h3 className="text-2xl font-black text-emerald-600 mt-1">
                  {regularProducts.filter(p => !isStoppedSelling(p)).length}
                </h3>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <Warehouse className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-zinc-200 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-zinc-400">Ngừng bán (Tạm ẩn)</p>
                <h3 className="text-2xl font-black text-rose-600 mt-1">
                  {stoppedProducts.length}
                </h3>
              </div>
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-zinc-200 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-zinc-400">Combo ưu đãi</p>
                <h3 className="text-2xl font-black text-orange-600 mt-1">
                  {activeComboProducts.length}
                </h3>
              </div>
              <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                <PackagePlus className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Status Sub-Filter Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-gray-150 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-gray-400 mr-1">Phân loại hiển thị:</span>
              {[
                { id: "all", label: `Tất cả sản phẩm (${regularProducts.length})` },
                { id: "active", label: `Đang bán (${regularProducts.filter(p => !isStoppedSelling(p)).length})` },
                { id: "stopped", label: `Ngừng bán (${stoppedProducts.length})` },
                { id: "combo", label: `Set Combo (${activeComboProducts.length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setAdminStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer border ${
                    adminStatusFilter === tab.id
                      ? "bg-zinc-950 text-white border-zinc-950 shadow-xs"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <span className="text-xs font-bold text-gray-500">
              Hiển thị: <strong className="text-gray-900">{displayedProducts.length}</strong> sản phẩm
            </span>
          </div>

          {/* Empty state guidance callout */}
          {adminStatusFilter === "stopped" && displayedProducts.length === 0 && (
            <div className="bg-orange-50 border border-orange-200 text-orange-950 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">💡</span>
                <div>
                  <strong className="block text-orange-900 font-extrabold text-sm mb-0.5">Hiện chưa có sản phẩm nào ở trạng thái Ngừng Bán!</strong>
                  <span>Để đưa sản phẩm vào danh sách này, bạn chuyển sang tab <strong>&quot;Tất cả sản phẩm ({regularProducts.length})&quot;</strong> hoặc <strong>&quot;Đang bán&quot;</strong>, rồi đổi trạng thái sản phẩm sang Ngừng bán.</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAdminStatusFilter("all")}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer shrink-0"
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          )}

          <DataTable
            columns={columns}
            data={displayedProducts}
            onRowClick={(product) => navigate(`/admin/products/${product.id}`)}
            rowAriaLabel={(product) => `Xem chi tiết sản phẩm ${product.name}`}
            searchPlaceholder="Tìm sản phẩm theo tên, mã ID, chất liệu..."
            searchKeys={["name", "id", "material", "origin"]}
            itemsPerPage={12}
            actions={
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenComboAdd}
                  className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <PackagePlus className="h-4 w-4" />
                  <span>Tạo combo ưu đãi</span>
                </button>

                <Button icon={Plus} onClick={handleOpenAdd}>
                  Thêm sản phẩm
                </Button>
              </div>
            }
          />
        </div>
      )}

      {/* Modal Tạo Set Combo Ưu Đãi */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="h-full max-h-screen w-full overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-5">
              <div><h2 className="text-xl font-black">Phiếu nhập kho</h2><p className="text-xs text-gray-500">Tăng tồn kho và ghi nhận chi phí vào SQL Server.</p></div>
              <button onClick={() => setShowReceiptModal(false)} className="rounded-xl p-2 hover:bg-gray-100"><X className="h-5 w-5"/></button>
            </div>
            <form onSubmit={submitStockReceipt} className="space-y-5 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <input required placeholder="Tên nhà cung cấp *" value={receiptForm.supplierName} onChange={(e) => setReceiptForm({...receiptForm, supplierName:e.target.value})} className="rounded-xl border p-3"/>
                <input placeholder="Số điện thoại nhà cung cấp" value={receiptForm.supplierPhone} onChange={(e) => setReceiptForm({...receiptForm, supplierPhone:e.target.value})} className="rounded-xl border p-3"/>
              </div>
              <textarea placeholder="Ghi chú phiếu nhập" value={receiptForm.note} onChange={(e) => setReceiptForm({...receiptForm, note:e.target.value})} className="w-full rounded-xl border p-3"/>
              <div className="grid gap-3 md:grid-cols-4">
                <input type="number" min="0" step="1000" placeholder="Chiết khấu NCC" value={receiptForm.discountAmount} onChange={(e)=>setReceiptForm({...receiptForm,discountAmount:e.target.value})} className="rounded-xl border p-3"/>
                <input type="number" min="0" max="100" step="0.1" placeholder="VAT đầu vào (%)" value={receiptForm.taxRate} onChange={(e)=>setReceiptForm({...receiptForm,taxRate:e.target.value})} className="rounded-xl border p-3"/>
                <input type="number" min="0" step="1000" placeholder="Phí vận chuyển" value={receiptForm.shippingFee} onChange={(e)=>setReceiptForm({...receiptForm,shippingFee:e.target.value})} className="rounded-xl border p-3"/>
                <input type="number" min="0" step="1000" placeholder="Chi phí khác" value={receiptForm.otherFee} onChange={(e)=>setReceiptForm({...receiptForm,otherFee:e.target.value})} className="rounded-xl border p-3"/>
              </div>
              <div className="space-y-3">
                {receiptForm.items.map((item, index) => (
                  <div key={index} className="grid gap-3 rounded-2xl bg-gray-50 p-4 md:grid-cols-[1fr_120px_170px_44px]">
                    <select required value={item.variantId} onChange={(e) => {
                      const items=[...receiptForm.items]; items[index]={...item,variantId:e.target.value}; setReceiptForm({...receiptForm,items});
                    }} className="rounded-xl border p-3">
                      <option value="">Chọn sản phẩm / biến thể</option>
                      {allVariants.map((variant) => <option key={variant.variantId} value={variant.variantId}>{variant.productName} — Màu {variant.color} / Size {variant.size} — Tồn {variant.quantity || 0} — {variant.sku}</option>)}
                    </select>
                    <input required type="number" min="1" placeholder="Số lượng" value={item.quantity} onChange={(e) => {
                      const items=[...receiptForm.items]; items[index]={...item,quantity:e.target.value}; setReceiptForm({...receiptForm,items});
                    }} className="rounded-xl border p-3"/>
                    <input required type="number" min="1" placeholder="Đơn giá nhập" value={item.unitCost} onChange={(e) => {
                      const items=[...receiptForm.items]; items[index]={...item,unitCost:e.target.value}; setReceiptForm({...receiptForm,items});
                    }} className="rounded-xl border p-3"/>
                    <button type="button" onClick={() => setReceiptForm({...receiptForm,items:receiptForm.items.filter((_,i)=>i!==index)})} className="rounded-xl bg-red-50 text-red-600">×</button>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button type="button" onClick={() => setReceiptForm({...receiptForm,items:[...receiptForm.items,{variantId:"",quantity:1,unitCost:""}]})} className="rounded-xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">+ Thêm dòng hàng</button>
                <div className="text-right"><p className="text-xs text-gray-500">Tổng thanh toán phiếu nhập</p><p className="text-xl font-black text-emerald-600">{(()=>{const sub=receiptForm.items.reduce((sum,item)=>sum+Number(item.quantity||0)*Number(item.unitCost||0),0);const taxable=Math.max(0,sub-Number(receiptForm.discountAmount||0));return Math.round(taxable+taxable*Number(receiptForm.taxRate||0)/100+Number(receiptForm.shippingFee||0)+Number(receiptForm.otherFee||0)).toLocaleString("vi-VN")})()}đ</p></div>
              </div>
              <button type="submit" className="w-full rounded-xl bg-emerald-600 py-3 font-black text-white hover:bg-emerald-700">Lưu phiếu và nhập kho</button>
            </form>
          </div>
        </div>
      )}

      {showComboModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
          <div className="flex h-full max-h-screen w-full min-w-0 flex-col overflow-hidden border border-zinc-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Fixed Header */}
            <div className="flex items-center justify-between gap-3 p-4 sm:p-6 sm:pb-4 border-b border-zinc-150 shrink-0">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="p-2.5 bg-orange-100 text-orange-600 rounded-2xl">
                  <PackagePlus className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-black text-zinc-900 tracking-tight">Tạo combo ưu đãi mới</h3>
                  <p className="truncate text-xs text-zinc-500 font-semibold">Phối 2-3 trang phục cùng nhau để bán theo Set với giá tiết kiệm hơn</p>
                </div>
              </div>
              <button onClick={() => setShowComboModal(false)} className="p-2 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-700 transition cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="comboModalForm" onSubmit={handleCreateComboSubmit} className="min-w-0 flex-1 space-y-5 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-500 mb-1">Tên combo *</label>
                <input
                  type="text"
                  required
                  value={comboName}
                  onChange={(e) => setComboName(e.target.value)}
                  placeholder="Ví dụ: Set Đồ Hè Năng Động - Áo Phông Oversize + Quần Short Denim"
                  className="w-full px-4 py-3 border border-zinc-300 rounded-xl text-sm font-bold text-zinc-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              {/* Step 1: Choose items for combo */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-500 mb-1.5">
                  1. Chọn sản phẩm cho combo ({selectedComboItemIds.length} đã chọn – tối thiểu 2) *
                </label>
                <div className="max-h-56 overflow-y-auto border border-zinc-200 rounded-2xl p-3 space-y-2 bg-zinc-50">
                  {regularProducts.map((p) => {
                    const isSelected = selectedComboItemIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => toggleComboProductSelection(p.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer ${
                          isSelected ? "bg-orange-50 border-orange-500 shadow-2xs" : "bg-white border-zinc-200 hover:border-zinc-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover border shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-zinc-900">{p.name}</p>
                            <p className="text-[11px] font-bold text-orange-600">{p.price?.toLocaleString("vi-VN")}đ</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          readOnly
                          className="h-4 w-4 accent-orange-600 rounded cursor-pointer shrink-0"
                        />
                        {isSelected && <button type="button" onClick={(event)=>{event.stopPropagation();setComboGiftProductIds((current)=>current.includes(p.id)?current.filter((id)=>id!==p.id):[...current,p.id])}} className={`rounded-lg px-2 py-1 text-[10px] font-black ${comboGiftProductIds.includes(p.id)?"bg-emerald-600 text-white":"bg-gray-100 text-gray-600"}`}>{comboGiftProductIds.includes(p.id)?"Quà tặng 0đ":"+ Đặt làm quà"}</button>}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
                <p className="mb-3 text-xs font-black uppercase text-violet-900">2. Quyền chọn màu và size</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex cursor-pointer gap-3 rounded-xl border bg-white p-3">
                    <input type="radio" name="comboMode" checked={comboSelectionMode==="CUSTOM"} onChange={()=>setComboSelectionMode("CUSTOM")}/>
                    <span><b className="block text-sm">Khách tự chọn</b><small>Khách chọn màu và kích cỡ cho từng món; không được đổi sản phẩm.</small></span>
                  </label>
                  <label className="flex cursor-pointer gap-3 rounded-xl border bg-white p-3">
                    <input type="radio" name="comboMode" checked={comboSelectionMode==="FIXED"} onChange={()=>setComboSelectionMode("FIXED")}/>
                    <span><b className="block text-sm">Shop cố định</b><small>Màu và kích cỡ được khóa sẵn cho toàn bộ combo.</small></span>
                  </label>
                </div>
                {comboSelectionMode==="FIXED"&&<div className="mt-3 grid gap-2 sm:grid-cols-2">{selectedComboProducts.map((product)=><label key={product.id} className="text-xs font-bold">{product.name}
                  <select required value={fixedComboVariantIds[String(product.id)]||""} onChange={(e)=>setFixedComboVariantIds({...fixedComboVariantIds,[String(product.id)]:e.target.value})} className="mt-1 w-full rounded-xl border bg-white p-3 font-normal">
                    <option value="">Chọn màu / kích cỡ cố định</option>
                    {(product.variants||[]).filter((variant)=>Number(variant.quantity||0)>0).map((variant)=><option key={variant.variantId||variant.id} value={variant.variantId||variant.id}>{variant.color} / {variant.size} — tồn {variant.quantity}</option>)}
                  </select>
                </label>)}</div>}
              </div>

              {/* Step 2: Live Price & Savings Calculator */}
              <div className="bg-orange-50/70 p-4 rounded-2xl border border-orange-200 space-y-3">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-orange-900 mb-1">Tổng giá gốc các món (đ)</label>
                    <div className="px-4 py-2.5 bg-white border border-orange-200 rounded-xl text-sm font-black text-zinc-600">
                      {comboTotalOriginalPrice.toLocaleString("vi-VN")}đ
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-orange-900 mb-1">Giá bán Combo Ưu đãi (đ) *</label>
                    <input
                      type="number"
                      required
                      min="10000"
                      max={comboTotalOriginalPrice > 0 ? comboTotalOriginalPrice : undefined}
                      value={comboPrice}
                      onChange={(e) => setComboPrice(e.target.value)}
                      placeholder="Ví dụ: 399000"
                      className="w-full px-4 py-2.5 border border-orange-300 bg-white rounded-xl text-sm font-black text-orange-600 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                {comboSavingsAmount > 0 && (
                  <div className="flex items-center justify-between text-xs font-extrabold text-orange-800 bg-orange-100/80 px-3.5 py-2 rounded-xl border border-orange-200">
                    <span>Tiết kiệm cho khách hàng:</span>
                    <span className="text-orange-950 font-black">{comboSavingsAmount.toLocaleString("vi-VN")}đ (-{comboSavingsPercent}%)</span>
                  </div>
                )}
              </div>

              <div className="min-w-0 rounded-2xl border border-blue-200 bg-blue-50/60 p-3 sm:p-4 space-y-3">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <label className="block text-[11px] font-black uppercase tracking-wider text-blue-900">
                      3. Giá riêng theo màu sắc và kích cỡ combo *
                    </label>
                    <p className="mt-0.5 text-[10px] font-semibold text-blue-700">
                      Mỗi tổ hợp màu–size là một biến thể có giá và tồn kho độc lập.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setComboVariants((current) => [
                        ...current,
                        { color: "", size: "", quantity: 10, price: comboPrice || "" }
                      ])
                    }
                    className="flex w-fit shrink-0 items-center gap-1 rounded-xl bg-blue-600 px-3 py-2 text-[11px] font-black text-white hover:bg-blue-700"
                  >
                    <Plus className="h-3.5 w-3.5" /> Thêm biến thể
                  </button>
                </div>

                <div className="space-y-2">
                  {comboVariants.map((variant, index) => (
                    <div
                      key={index}
                      className="grid min-w-0 grid-cols-1 gap-2 rounded-xl border border-blue-100 bg-white p-2 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,1.2fr)_40px]"
                    >
                      {[
                        ["color", "Màu sắc", "text"],
                        ["size", "Size", "text"],
                        ["quantity", "Tồn kho", "number"],
                        ["price", "Giá biến thể", "number"]
                      ].map(([field, placeholder, type]) => (
                        <input
                          key={field}
                          required
                          type={type}
                          min={type === "number" ? (field === "price" ? "1" : "0") : undefined}
                          value={variant[field]}
                          onChange={(event) =>
                            setComboVariants((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, [field]: event.target.value } : item
                              )
                            )
                          }
                          placeholder={placeholder}
                          className={`min-w-0 w-full rounded-lg border px-3 py-2 text-xs font-bold ${
                            field === "price" ? "border-orange-300 bg-orange-50 text-orange-700" : ""
                          }`}
                        />
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          setComboVariants((current) =>
                            current.filter((_, itemIndex) => itemIndex !== index)
                          )
                        }
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50 sm:col-span-2 lg:col-span-1"
                        title="Xóa biến thể"
                      >
                        <Trash2 className="mx-auto h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-500 mb-1">Link Ảnh Đại Diện Combo (Tùy chọn)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={comboImage}
                    onChange={(e) => setComboImage(e.target.value)}
                    placeholder="Để trống sẽ tự động lấy ảnh của sản phẩm đầu tiên trong Combo..."
                    className="min-w-0 flex-1 px-4 py-2.5 border border-zinc-300 rounded-xl text-xs font-medium text-zinc-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                  <label className="flex shrink-0 cursor-pointer items-center rounded-xl bg-orange-600 px-3 text-xs font-black text-white hover:bg-orange-700">
                    Chọn ảnh
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const result = await api.media.upload(file, "image_san_pham");
                        setComboImage(result.url);
                      } catch (error) { alert(error.message || "Không thể lưu ảnh combo."); }
                    }} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-500 mb-1">Mô tả thông tin Combo</label>
                <textarea
                  rows={2}
                  value={comboDesc}
                  onChange={(e) => setComboDesc(e.target.value)}
                  placeholder="Mô tả phong cách phối trang phục, khuyến mãi kèm theo..."
                  className="w-full px-4 py-2.5 border border-zinc-300 rounded-xl text-xs font-medium text-zinc-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </form>

            {/* Fixed Footer Buttons */}
            <div className="p-4 px-6 border-t border-zinc-150 bg-zinc-50 flex items-center justify-end gap-3 shrink-0 rounded-b-3xl">
              <button
                type="button"
                onClick={() => setShowComboModal(false)}
                className="px-5 py-2.5 text-xs font-bold text-zinc-600 hover:bg-zinc-200/60 rounded-xl transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                form="comboModalForm"
                className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition cursor-pointer"
              >
                Tạo combo ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
