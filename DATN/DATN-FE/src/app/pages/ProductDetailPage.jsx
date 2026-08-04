import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router";
import { Star, ShoppingCart, Heart, Minus, Plus, MessageSquare, Send, Calendar, ShieldAlert, Sparkles, RotateCw, UserCheck, CheckCircle2, Check, X, Tag, Camera, ThumbsUp, ThumbsDown, Info, ShieldCheck, Layers, Box, Award, Shirt, Play, Gift } from "lucide-react";
import { useApp } from "../context/AppContext";
import { api } from "../services/api";
import { getFlashSalePricing, getProductPricing, isFlashSaleProduct } from "../utils/pricing";
import { containsBlockedLanguage } from "../utils/contentModeration";

const getVideoEmbedUrl = (url) => {
  if (!url) return null;
  if (url.includes("youtube.com/watch")) {
    try {
      const videoId = new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    } catch (e) {
      return null;
    }
  }
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes("youtube.com/shorts/")) {
    const videoId = url.split("youtube.com/shorts/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return null;
};

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { products = [], wishlist = [], toggleWishlist, addToCart, addReview, currentUser, orders = [], flashSaleConfig, openLoginModal } = useApp();

  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [comboSelections, setComboSelections] = useState({});
  const [productArticle, setProductArticle] = useState(null);

  useEffect(() => {
    if (location.hash !== "#reviews") return;
    const scrollTimer = window.setTimeout(() => {
      document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
    return () => window.clearTimeout(scrollTimer);
  }, [location.hash, id]);

  useEffect(() => {
    let isMounted = true;
    const existing = products.find((p) => String(p.id) === String(id));
    if (!existing && id) {
      api.products.getById(id).then((res) => {
        if (isMounted && res && res.data) {
          const mapped = {
            id: res.data.productId || res.data.id,
            name: res.data.productName || res.data.name,
            price: Number(res.data.price || 0),
            originalPrice: res.data.originalPrice ? Number(res.data.originalPrice) : undefined,
            image: res.data.imageUrl || res.data.image || "/image_san_pham/photo-1521572163474-6864f9cf17ab.jpg",
            category: res.data.category || "ao",
            description: res.data.description || "Sản phẩm thời trang cao cấp FoxStyle.",
            material: res.data.material || "Cotton 100%",
            origin: res.data.origin || "Việt Nam",
            quantity: res.data.quantity || 50,
            sizes: res.data.variants ? [...new Set(res.data.variants.map((v) => v.size).filter(Boolean))] : ["S", "M", "L", "XL"],
            colors: res.data.variants ? [...new Set(res.data.variants.map((v) => v.color).filter(Boolean))] : ["Mặc định"],
            variants: res.data.variants || [],
            images: res.data.images || []
          };
          setFetchedProduct(mapped);
        }
      }).catch(() => null);
    }
    return () => { isMounted = false; };
  }, [id, products]);

  const rawProduct = products.find((p) => String(p.id) === String(id)) || fetchedProduct;

  const fallbackProduct = useMemo(() => {
    if (rawProduct) return null;
    if (!id) return null;

    // Handle virtual combo IDs starting with combo_ (e.g. combo_1_6)
    if (String(id).startsWith("combo_")) {
      const parts = String(id).replace("combo_", "").split("_").map(n => Number(n)).filter(Boolean);
      const subProds = products.filter(p => parts.includes(Number(p.id)));
      const firstImg = subProds[0]?.image || "/image_san_pham/photo-1521572163474-6864f9cf17ab.jpg";
      const origPrice = subProds.reduce((sum, p) => sum + (p.price || 300000), 0) || 600000;
      const calcPrice = Math.round(origPrice * 0.85);

      return {
        id: id,
        name: subProds.length > 0 ? `[SET COMBO] ${subProds.map(p => p.name).join(" + ")}` : `[SET COMBO] Phối Đồ Thời Trang FoxStyle #${id}`,
        price: calcPrice,
        originalPrice: origPrice,
        image: firstImg,
        category: "combo",
        isCombo: true,
        brand: "FoxStyle Premium",
        rating: 5.0,
        reviews: 88,
        description: `[COMBO:${parts.join(",")}] Set đồ phối sẵn phong cách ưu đãi giảm 15% trọn bộ sản phẩm.`,
        sizes: ["Freesize / Đủ Size"],
        colors: ["Chuẩn Set"],
        material: "Cao cấp phối hợp",
        origin: "Việt Nam",
        quantity: 50
      };
    }

    // Handle mock combo IDs (13, 14, 15) from Homepage
    if (String(id) === "13") {
      return {
        id: 13,
        name: "[SET COMBO] Combo Áo thun Oversize + Quần Shorts Kaki Casual",
        price: 350000,
        originalPrice: 519000,
        image: "/image_san_pham/photo-1521572163474-6864f9cf17ab.jpg",
        category: "combo",
        brand: "FoxStyle Premium",
        isCombo: true,
        rating: 5.0,
        reviews: 84,
        description: "[COMBO:1,6] Set đồ năng động dạo phố mùa hè gồm: 1x Áo thun basic trắng FoxStyle Premium + 1x Quần Shorts Kaki Casual nâng niu vóc dáng.",
        sizes: ["Freesize / Đủ Size"],
        colors: ["Chuẩn Set"],
        material: "Cotton 100% & Kaki",
        origin: "Việt Nam",
        quantity: 60
      };
    }
    if (String(id) === "14") {
      return {
        id: 14,
        name: "[SET COMBO] Combo Áo Sơ Mi Lụa + Quần Tây Công Sở Dáng Suông",
        price: 649000,
        originalPrice: 900000,
        image: "/image_san_pham/photo-1596755094514-f87e34085b2c.jpg",
        category: "combo",
        brand: "FoxStyle Premium",
        isCombo: true,
        rating: 5.0,
        reviews: 96,
        description: "[COMBO:2,7] Bộ outfit công sở thanh lịch thời thượng gồm: 1x Áo sơ mi lụa công sở cao cấp + 1x Quần Tây Công Sở Dáng Suông Hàn Quốc.",
        sizes: ["Freesize / Đủ Size"],
        colors: ["Chuẩn Set"],
        material: "Lụa & Tuyết Mới",
        origin: "Việt Nam",
        quantity: 45
      };
    }
    if (String(id) === "15") {
      return {
        id: 15,
        name: "[SET COMBO] Combo Áo Khoác Denim + Sneaker Minimalist Trắng",
        price: 869000,
        originalPrice: 1270000,
        image: "/image_san_pham/photo-1544441893-675973e31985.jpg",
        category: "combo",
        brand: "Nike Wear",
        isCombo: true,
        rating: 4.9,
        reviews: 110,
        description: "[COMBO:9,11] Set đồ Streetstyle phong cách Retro gồm: 1x Áo Khoác Denim Vintage Wash + 1x Giày Sneaker Minimalist Trắng Studio.",
        sizes: ["Freesize / Đủ Size"],
        colors: ["Chuẩn Set"],
        material: "Denim & Da Synthetic",
        origin: "Việt Nam",
        quantity: 50
      };
    }

    if (isNaN(Number(id))) return null;
    const numericId = Number(id);
    const baseProd = (products.length > 0 ? products[(numericId - 1) % products.length] : null) || {
      id: numericId,
      name: `Sản Phẩm FoxStyle Premium #${numericId}`,
      price: 299000,
      originalPrice: 399000,
      image: "/image_san_pham/photo-1521572163474-6864f9cf17ab.jpg",
      category: "ao",
      rating: 4.8,
      reviews: 42,
      description: `Áo thời trang phom chuẩn FoxStyle Premium mã #${numericId}. Chất liệu Cotton thoáng mát, co giãn tốt, thiết kế hiện đại phù hợp mọi lứa tuổi.`,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Trắng", "Đen", "Xám"],
      material: "Cotton 100% Premium",
      origin: "Việt Nam",
      quantity: 100
    };
    return {
      ...baseProd,
      id: numericId,
      name: baseProd.name ? `${baseProd.name}` : `Sản Phẩm FoxStyle Premium #${numericId}`,
    };
  }, [rawProduct, id, products]);

  const activeRawProduct = rawProduct || fallbackProduct;

  // Sync Flash Sale discount with Homepage
  const isFlashSaleItem = isFlashSaleProduct(activeRawProduct, flashSaleConfig);

  const isComboProduct = activeRawProduct && (
    activeRawProduct.isCombo || 
    activeRawProduct.category === "combo" || 
    (activeRawProduct.name && (activeRawProduct.name.includes("[SET COMBO]") || activeRawProduct.name.toLowerCase().includes("combo"))) || 
    (activeRawProduct.description && activeRawProduct.description.includes("[COMBO:"))
  );

  const product = activeRawProduct ? {
    ...activeRawProduct,
    isCombo: isComboProduct,
    category: isComboProduct ? "combo" : activeRawProduct.category,
    originalPrice: activeRawProduct.originalPrice,
    price: activeRawProduct.price,
    isFlashSale: isFlashSaleItem
  } : null;

  useEffect(() => {
    const loadProductArticle = () => {
      if (!product?.id) {
        setProductArticle(null);
        return;
      }
      try {
        const saved = JSON.parse(localStorage.getItem("foxstyle_admin_articles") || "[]");
        const matchedArticle = saved.find(
          (article) =>
            String(article.productId) === String(product.id) &&
            article.status === "published" &&
            (
              article.pinned ||
              Date.now() - new Date(article.publishDate || article.createdAt || 0).getTime() <
                7 * 24 * 60 * 60 * 1000
            )
        );
        setProductArticle(matchedArticle || null);
      } catch {
        setProductArticle(null);
      }
    };

    const handleContentUpdate = (event) => {
      if (!event.detail?.type || event.detail.type === "articles") loadProductArticle();
    };
    loadProductArticle();
    window.addEventListener("foxstyle-content-updated", handleContentUpdate);
    window.addEventListener("storage", loadProductArticle);
    return () => {
      window.removeEventListener("foxstyle-content-updated", handleContentUpdate);
      window.removeEventListener("storage", loadProductArticle);
    };
  }, [product?.id]);


  // State for AI Size Recommender
  const [showAiSizeModal, setShowAiSizeModal] = useState(false);
  const [userHeight, setUserHeight] = useState(168);
  const [userWeight, setUserWeight] = useState(62);
  const [userBodyType, setUserBodyType] = useState("vua"); // "gay" | "vua" | "day-dan"
  const [userFitPreference, setUserFitPreference] = useState("regular"); // "fit" | "regular" | "oversized"
  const [aiSizeTab, setAiSizeTab] = useState("recommendation"); // "recommendation" | "chart"

  const calculateAccurateSize = (height, weight, bodyType, fitPref = "regular", prod = product) => {
    const rawSizes = prod?.sizes && prod.sizes.length > 0 ? prod.sizes : ["S", "M", "L", "XL"];
    const category = (prod?.category || "").toLowerCase();
    const prodName = (prod?.name || "").toLowerCase();

    // Detect size category
    const hasPantsNumeric = rawSizes.some(s => ["28", "29", "30", "31", "32", "33", "34", "35", "36"].includes(String(s).trim()));
    const hasShoesNumeric = rawSizes.some(s => ["37", "38", "39", "40", "41", "42", "43", "44"].includes(String(s).trim()));
    const isPantsCategory = category.includes("quan") || prodName.includes("quần") || hasPantsNumeric;
    const isShoesCategory = category.includes("giay") || prodName.includes("giày") || prodName.includes("dép") || hasShoesNumeric;

    let targetSize = "";
    let sizeType = "clothing"; // "clothing" | "pants" | "shoes"
    let matchRate = 98.5;
    let adviceNote = "";
    let estimatedChestOrWaist = "";

    if (isShoesCategory) {
      sizeType = "shoes";
      let shoeNum = 40;
      if (height < 158) shoeNum = 37;
      else if (height <= 163) shoeNum = 38;
      else if (height <= 169) shoeNum = 39;
      else if (height <= 175) shoeNum = 40;
      else if (height <= 180) shoeNum = 41;
      else if (height <= 185) shoeNum = 42;
      else shoeNum = 43;

      if (bodyType === "day-dan") shoeNum += 1;
      targetSize = String(shoeNum);
      estimatedChestOrWaist = `Chiều dài bàn chân ước tính: ${23.5 + (shoeNum - 37) * 0.5} cm`;
      adviceNote = `Size giày ${targetSize} vừa vặn theo phom chân tiêu chuẩn. Nếu chân bè hoặc đi tất dày, kích thước này mang lại sự êm ái nhất.`;
    } else if (isPantsCategory && hasPantsNumeric) {
      sizeType = "pants";
      let pantNum = 30;
      if (weight < 50) pantNum = 28;
      else if (weight <= 55) pantNum = 29;
      else if (weight <= 61) pantNum = 30;
      else if (weight <= 67) pantNum = 31;
      else if (weight <= 74) pantNum = 32;
      else if (weight <= 80) pantNum = 33;
      else if (weight <= 86) pantNum = 34;
      else pantNum = 36;

      if (bodyType === "day-dan") pantNum += 1;
      if (fitPref === "oversized") pantNum += 1;
      if (fitPref === "fit" && pantNum > 28) pantNum -= 1;

      targetSize = String(pantNum);
      const waistEstimate = 70 + (pantNum - 28) * 3;
      estimatedChestOrWaist = `Vòng bụng ước tính: ~${waistEstimate} - ${waistEstimate + 3} cm`;
      adviceNote = `Size quần ${targetSize} chuẩn phom dáng lưng vừa, chiều dài suông đẹp từ hông xuống mắt cá.`;
    } else {
      sizeType = "clothing";
      const letterOrder = ["S", "M", "L", "XL", "2XL", "3XL"];
      let idx = 1;

      if (weight < 48) idx = 0; // S
      else if (weight <= 56) idx = 1; // M
      else if (weight <= 66) idx = 2; // L
      else if (weight <= 76) idx = 3; // XL
      else if (weight <= 87) idx = 4; // 2XL
      else idx = 5; // 3XL

      if (height >= 175 && idx === 0) idx = 1;
      else if (height >= 176 && idx === 1) idx = 2;
      else if (height >= 181 && idx === 2) idx = 3;
      else if (height >= 186 && idx === 3) idx = 4;

      if (bodyType === "day-dan" && idx < letterOrder.length - 1) idx += 1;
      if (fitPref === "oversized" && idx < letterOrder.length - 1) idx += 1;
      if (fitPref === "fit" && idx > 0) idx -= 1;

      targetSize = letterOrder[idx];
      const chestEstimate = 84 + idx * 6;
      estimatedChestOrWaist = `Vòng ngực ước tính: ~${chestEstimate} - ${chestEstimate + 4} cm`;
      const fitText = fitPref === "fit" ? "ôm nhẹ tôn dáng" : fitPref === "oversized" ? "rộng rãi phong cách Streetwear" : "vừa vặn thoải mái";
      adviceNote = `Với chiều cao ${height}cm, cân nặng ${weight}kg và vóc dáng ${bodyType === "gay" ? "mảnh khảnh" : bodyType === "day-dan" ? "đầy đặn" : "cân đối"}, Size ${targetSize} cho phom ${fitText}.`;
    }

    // Match with available product sizes
    let finalRecommended = targetSize;
    let sizeNote = "";

    const normalize = s => String(s).trim().toUpperCase().replace("XXL", "2XL");
    const normTarget = normalize(targetSize);
    const matchFound = rawSizes.find(s => normalize(s) === normTarget);

    if (matchFound) {
      finalRecommended = matchFound;
    } else {
      if (sizeType === "clothing") {
        const order = ["S", "M", "L", "XL", "2XL", "3XL"];
        let targetIdx = order.indexOf(normTarget);
        if (targetIdx === -1) targetIdx = 1;

        let closest = rawSizes[0];
        let minDiff = 99;
        rawSizes.forEach(s => {
          let sIdx = order.indexOf(normalize(s));
          if (sIdx !== -1) {
            let diff = Math.abs(sIdx - targetIdx);
            if (diff < minDiff) {
              minDiff = diff;
              closest = s;
            }
          }
        });
        finalRecommended = closest;
        sizeNote = `(Hệ thống tự đề xuất Size ${closest} sẵn có phù hợp nhất cho phom áo của bạn)`;
      } else {
        let tNum = Number(targetSize) || 30;
        let closest = rawSizes[0];
        let minDiff = 999;
        rawSizes.forEach(s => {
          let num = Number(s);
          if (!isNaN(num)) {
            let diff = Math.abs(num - tNum);
            if (diff < minDiff) {
              minDiff = diff;
              closest = s;
            }
          }
        });
        finalRecommended = closest;
        sizeNote = `(Gợi ý size ${closest} có sẵn chuẩn nhất trong kho sản phẩm)`;
      }
      matchRate = 94.5;
    }

    return {
      size: finalRecommended,
      idealSize: targetSize,
      sizeType,
      matchRate,
      adviceNote,
      estimatedChestOrWaist,
      sizeNote
    };
  };

  const calculateAiSize = (height, weight, bodyType) => {
    return calculateAccurateSize(height, weight, bodyType, userFitPreference).size;
  };

  // State for product media mode
  const [mediaMode, setMediaMode] = useState("image"); // "image" | "video"

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const firstVariant = product?.variants?.[0];
    setSelectedColor(firstVariant?.color || product?.colors?.[0] || "");
    setSelectedSize("");
  }, [product?.id]);

  useEffect(() => {
    if (!product?.videoUrl || product.videoUrl.trim() === "") {
      setMediaMode("image");
    }
  }, [product?.id, product?.videoUrl]);

  // Review Form States
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [productReviews, setProductReviews] = useState([]);
  const [userReactions, setUserReactions] = useState({});

  const handleReviewReaction = (reviewId, reactionType) => {
    setUserReactions((prev) => {
      const currentReaction = prev[reviewId];
      const newReaction = currentReaction === reactionType ? null : reactionType;

      setProductReviews((reviews) =>
        reviews.map((r) => {
          if (r.id === reviewId) {
            let likes = r.likesCount || 0;
            let dislikes = r.dislikesCount || 0;

            if (currentReaction === "like") likes = Math.max(0, likes - 1);
            if (currentReaction === "dislike") dislikes = Math.max(0, dislikes - 1);

            if (newReaction === "like") likes += 1;
            if (newReaction === "dislike") dislikes += 1;

            return { ...r, likesCount: likes, dislikesCount: dislikes };
          }
          return r;
        })
      );

      return { ...prev, [reviewId]: newReaction };
    });
  };

  useEffect(() => {
    if (product) {
      setMainImage(product.image);
      if (product.colors && product.colors.length > 0 && !selectedColor) {
        setSelectedColor(product.colors[0]);
      }
    }
  }, [product]);

  useEffect(() => {
    const exactVariant = product?.variants?.find(
      (variant) => variant.color === selectedColor && variant.size === selectedSize && variant.imageUrl
    );
    const colorVariant = product?.variants?.find(
      (variant) => variant.color === selectedColor && variant.imageUrl
    );
    const variantImage = exactVariant?.imageUrl || colorVariant?.imageUrl;
    if (variantImage) {
      setMainImage(variantImage);
      return;
    }

    if (selectedColor && product?.colors && product?.images && product.images.length > 0) {
      const colorIndex = product.colors.indexOf(selectedColor);
      if (colorIndex >= 0 && colorIndex < product.images.length) {
        setMainImage(product.images[colorIndex].imageUrl);
      }
    }
  }, [selectedColor, selectedSize, product]);

  const fetchReviews = useCallback(async () => {
    if (!product?.id) return;
    try {
      const res = await api.reviews.getByProduct(product.id).catch(() => null);
      if (res && res.status === "success" && res.data) {
        const rawReviews = res.data.content || (Array.isArray(res.data) ? res.data : []);
        if (rawReviews.length > 0) {
          const mapped = rawReviews.map((r, idx) => ({
            id: r.reviewId || r.id,
            userId: r.userId,
            userName: r.userFullName || r.userName || "Khách hàng FoxStyle",
            rating: Number(r.rating ?? 0),
            date: r.reviewDate ? r.reviewDate.split("T")[0] : new Date().toISOString().split("T")[0],
            comment: r.comment || "",
            likesCount: 0,
            dislikesCount: 0
          }));
          setProductReviews(mapped);
          return;
        }
      }
    } catch (err) {
      console.error("Lỗi tải đánh giá sản phẩm:", err);
    }

    setProductReviews([]);
  }, [product?.id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);


  const comboSubProducts = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.comboProductIds) && product.comboProductIds.length > 0) {
      return product.comboProductIds
        .map((productId) => products.find((item) => String(item.id) === String(productId)))
        .filter(Boolean);
    }
    if (Array.isArray(product.comboProducts) && product.comboProducts.length > 0) {
      return product.comboProducts;
    }
    if (!product.description) return [];
    const match = product.description.match(/\[COMBO:\s*([\d,]+)\]/);
    if (!match) return [];
    const ids = match[1].split(",").map(id => Number(id.trim())).filter(Boolean);
    return ids
      .map((id) => products.find((item) => Number(item.id) === id))
      .filter(Boolean);
  }, [product, products]);
  const comboSelectionMode = product?.description?.match(/\[COMBO_MODE:(CUSTOM|FIXED)\]/)?.[1] || "CUSTOM";
  const fixedComboVariants = useMemo(() => {
    const raw = product?.description?.match(/\[COMBO_VARIANTS:([^\]]+)\]/)?.[1] || "";
    return Object.fromEntries(raw.split(",").map((entry) => entry.split("=")).filter((pair) => pair.length === 2));
  }, [product?.description]);

  useEffect(() => {
    if (comboSubProducts.length === 0) return;
    setComboSelections((current) => {
      const next = { ...current };
      let changed = false;
      comboSubProducts.forEach((component) => {
        const key = String(component.id);
        const firstVariant = comboSelectionMode === "FIXED"
          ? component.variants?.find((variant) => String(variant.variantId || variant.id) === String(fixedComboVariants[key]))
          : component.variants?.[0];
        if (!next[key]) {
          changed = true;
          next[key] = {
            size: firstVariant?.size || component.sizes?.[0] || "M",
            color: firstVariant?.color || component.colors?.[0] || "Mặc định"
          };
        }
      });
      return changed ? next : current;
    });
  }, [comboSubProducts, comboSelectionMode, fixedComboVariants]);

  const isStoppedSelling = product && (product.status === 0 || product.status === "0" || product.status === false || product.status === "Ngừng bán" || product.status === "INACTIVE" || product.status === "STOPPED" || product.status === "DISCONTINUED");
  const isOutOfStock = product && Number(product.quantity ?? 0) <= 0;

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="p-10 bg-white rounded-3xl border border-zinc-200 shadow-md space-y-4">
          <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-600 mx-auto flex items-center justify-center">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-black text-zinc-900">Không tìm thấy sản phẩm</h1>
          <p className="text-sm text-zinc-500 max-w-md mx-auto leading-relaxed font-medium">
            Rất tiếc, sản phẩm bạn vừa tìm kiếm không tồn tại trên hệ thống.
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 bg-zinc-950 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-2xl hover:bg-orange-600 transition"
            >
              <span>Xem danh sách sản phẩm</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const bundleProduct = products.find((p) => p.id !== product.id && p.category !== product.category) || relatedProducts[0];

  const isLiked = wishlist.some((id) => String(id) === String(product.id));
  const selectedVariant = product.variants?.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  ) || product.variants?.[0];
  const availableStock = Number(selectedVariant?.quantity ?? product.quantity ?? 0);
  // The public product price is the source of truth for display and checkout.
  // Variants select stock/color/size; stale variant prices must not replace it.
  const variantPrice = Number(product.price ?? selectedVariant?.price ?? 0);
  const ratedProductReviews = productReviews.filter((review) => Number(review.rating) > 0);
  const reviewAverage = ratedProductReviews.length
    ? (
        ratedProductReviews.reduce((total, review) => total + Number(review.rating), 0) /
        ratedProductReviews.length
      ).toFixed(1)
    : "0.0";
  const galleryImages = [
    ...(product.images || []),
    ...(product.variants || [])
      .filter((variant) => variant.imageUrl)
      .map((variant) => ({
        imageUrl: variant.imageUrl,
        color: variant.color,
        size: variant.size,
        variantId: variant.variantId
      }))
  ].filter(
    (image, index, images) =>
      image.imageUrl && images.findIndex((candidate) => candidate.imageUrl === image.imageUrl) === index
  );

  const pricing = isFlashSaleItem
    ? getFlashSalePricing({ ...product, price: variantPrice }, flashSaleConfig)
    : getProductPricing(product, variantPrice);
  const currentPrice = pricing.price;
  const discount = pricing.discountPercent;

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const compatibleVariants = product.variants?.filter(
      (variant) => String(variant.color).toLowerCase() === String(color).toLowerCase()
    ) || [];
    if (
      compatibleVariants.length > 0 &&
      !compatibleVariants.some((variant) => String(variant.size) === String(selectedSize))
    ) {
      setSelectedSize("");
    }
    setMediaMode("image");
    const matchedImg = product.images?.find((img) => img.color === color);
    if (matchedImg) {
      setMainImage(matchedImg.imageUrl);
    }
  };

  const handleThumbnailClick = (img) => {
    setMediaMode("image");
    setMainImage(img.imageUrl);
    if (img.color) setSelectedColor(img.color);
  };

  const buildComboItems = (components) =>
    components.map((component) => {
      const selection = comboSelections[String(component.id)] || {};
      const fixedVariant = comboSelectionMode === "FIXED"
        ? component.variants?.find((variant) => String(variant.variantId || variant.id) === String(fixedComboVariants[String(component.id)]))
        : null;
      const selectedComponentVariant = fixedVariant || component.variants?.find(
        (variant) =>
          String(variant.size) === String(selection.size) &&
          String(variant.color).toLowerCase() === String(selection.color || "").toLowerCase()
      ) || component.variants?.find(
        (variant) =>
          String(variant.size) === String(selection.size) ||
          String(variant.color).toLowerCase() === String(selection.color || "").toLowerCase()
      ) || component.variants?.[0];
      return {
        productId: component.id,
        variantId: selectedComponentVariant?.variantId,
        name: component.name,
        image: component.image,
        price: Number(selectedComponentVariant?.price ?? component.price ?? 0),
        size: selectedComponentVariant?.size || selection.size || component.sizes?.[0] || "M",
        color: selectedComponentVariant?.color || selection.color || component.colors?.[0] || "Mặc định",
        isGift: (product.comboGiftProductIds || []).some((id) => String(id) === String(component.id))
      };
    });

  const addWholeComboToCart = async (comboQuantity = 1) => {
    const finalColor = selectedColor || product.colors?.[0] || "Chuẩn Set";
    const finalSize = selectedSize || product.sizes?.[0] || "Freesize / Đủ Size";
    const comboItems = buildComboItems(comboSubProducts);
    if (comboItems.length !== comboSubProducts.length || comboItems.some((item) => !item.variantId)) {
      throw new Error("Một sản phẩm trong combo đã hết hoặc chưa có màu/size hợp lệ.");
    }
    const comboPrice = currentPrice;
    await addToCart({
      ...product,
      price: comboPrice,
      selectedComboVariantId: selectedVariant?.variantId,
      isCombo: true,
      category: "combo",
      comboItems
    }, finalSize, finalColor, comboQuantity);
  };

  const handleAddToCart = async () => {
    if (comboSubProducts.length === 0 && quantity > availableStock) {
      alert(`Sản phẩm này chỉ còn ${availableStock} sản phẩm trong kho.`);
      setQuantity(Math.max(1, availableStock));
      return;
    }
    if (!selectedSize) {
      alert("Vui lòng tự chọn kích cỡ trước khi thêm sản phẩm vào giỏ hàng.");
      return;
    }
    if (comboSubProducts.length > 0) {
      await addWholeComboToCart(quantity);
      alert(`🎉 Đã thêm ${quantity} bộ combo gồm ${comboSubProducts.length} sản phẩm thật vào giỏ hàng!`);
      return;
    }

    const finalColor = selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0] : (product.isCombo ? "Chuẩn Set" : "Mặc định"));
    const finalSize = selectedSize;
    
    await addToCart(product, finalSize, finalColor, quantity, currentPrice);
    if (product.isCombo) {
      alert(`🎉 Đã thêm ${quantity} x Set Combo (${product.name} - Size: ${finalSize}, Màu: ${finalColor}) trọn bộ vào giỏ hàng!`);
    } else {
      alert(`Đã thêm ${quantity} x ${product.name} (Màu: ${finalColor}, Size: ${finalSize}) vào giỏ hàng!`);
    }
  };

  const handleAddBundleToCart = async () => {
    if (!bundleProduct) return;
    const bundleItems = buildComboItems([product, bundleProduct]).map((item) =>
      String(item.productId) === String(product.id)
        ? {
            ...item,
            variantId: selectedVariant?.variantId || item.variantId,
            price: currentPrice,
            size: selectedVariant?.size || selectedSize || item.size,
            color: selectedVariant?.color || selectedColor || item.color
          }
        : item
    );
    const bundleOriginalPrice = bundleItems.reduce((sum, item) => sum + item.price, 0);
    const bundlePrice = Math.round(bundleOriginalPrice * 0.85);
    await addToCart({
      id: `bundle_${product.id}_${bundleProduct.id}`,
      name: `Combo ${product.name} + ${bundleProduct.name}`,
      image: product.image,
      price: bundlePrice,
      originalPrice: bundleOriginalPrice,
      category: "combo",
      isCombo: true,
      comboItems: bundleItems
    }, "Đủ Size", "Phối sẵn", 1);
    alert(`🎉 Đã thêm 2 sản phẩm thật (${product.name} + ${bundleProduct.name}) vào giỏ hàng!`);
  };

  const handleBuyNow = async () => {
    if (comboSubProducts.length === 0 && quantity > availableStock) {
      alert(`Sản phẩm này chỉ còn ${availableStock} sản phẩm trong kho.`);
      setQuantity(Math.max(1, availableStock));
      return;
    }
    if (!selectedSize) {
      alert("Vui lòng tự chọn kích cỡ trước khi mua ngay.");
      return;
    }
    if (comboSubProducts.length > 0) {
      await addWholeComboToCart(quantity);
      navigate("/checkout");
      return;
    }

    const finalColor = selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0] : (product.isCombo ? "Chuẩn Set" : "Mặc định"));
    const finalSize = selectedSize;
    
    await addToCart(product, finalSize, finalColor, quantity, currentPrice);
    navigate("/checkout");
  };

  const handleAddSingleComboProduct = async (singleProduct, buyNow = false) => {
    if (!singleProduct) return;
    const selectedComboItem = buildComboItems([singleProduct])[0];
    const singleSize = selectedComboItem.size;
    const singleColor = selectedComboItem.color;

    await addToCart(singleProduct, singleSize, singleColor, 1, selectedComboItem.price);
    if (buyNow) {
      navigate("/checkout");
      return;
    }
    alert(`Đã thêm riêng sản phẩm "${singleProduct.name}" vào giỏ hàng!`);
  };

  const handleBuyCombo = async () => {
    if (!bundleProduct) return;
    await handleAddBundleToCart();
    navigate("/checkout");
  };

  // Check if current user has already submitted a review
  const userExistingReview = useMemo(() => {
    if (!currentUser || !productReviews.length) return null;
    return productReviews.find(r => r.userId === currentUser.id || r.userName === currentUser.fullName);
  }, [currentUser, productReviews]);

  const hasPurchasedCurrentProduct = useMemo(() => {
    if (!currentUser || !product?.id) return false;
    return orders.some(
      (order) =>
        order.status === "completed" &&
        (order.items || []).some(
          (item) => String(item.product?.id || item.productId) === String(product.id)
        )
    );
  }, [currentUser, orders, product?.id]);

  // Check if review is editable (within 7 days of creation)
  const isReviewEditableWithin7Days = useMemo(() => {
    if (!userExistingReview) return false;
    const reviewDate = new Date(userExistingReview.date);
    const now = new Date();
    const daysDiff = (now - reviewDate) / (1000 * 3600 * 24);
    return daysDiff <= 7;
  }, [userExistingReview]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");

    if (!currentUser) {
      setReviewError("Bạn cần đăng nhập hoặc đăng ký tài khoản để viết đánh giá!");
      openLoginModal();
      return;
    }

    if (userExistingReview && !isReviewEditableWithin7Days) {
      setReviewError("⏰ Đã hết thời hạn 7 ngày chỉnh sửa bài đánh giá này!");
      return;
    }

    const finalComment = reviewComment.trim();
    if (!finalComment) {
      setReviewError("Vui lòng nhập nội dung bình luận.");
      return;
    }
    if (containsBlockedLanguage(finalComment)) {
      setReviewError("Vui lòng sử dụng ngôn từ lịch sự khi bình luận.");
      return;
    }
    const submittedRating = hasPurchasedCurrentProduct ? reviewRating : 0;
    try {
      if (userExistingReview) {
        await api.reviews.update(userExistingReview.id, {
          productId: Number(product.id),
          rating: submittedRating,
          comment: finalComment
        });
        setProductReviews((prev) =>
          prev.map((r) =>
            r.id === userExistingReview.id
              ? { ...r, rating: submittedRating, comment: finalComment, date: new Date().toISOString().split("T")[0] }
              : r
          )
        );
        alert("✅ Chỉnh sửa bài đánh giá thành công! (Quyền đánh giá không phát sinh mới)");
      } else {
        const newReviewRecord = {
          id: `rev_user_${currentUser.id}_${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.fullName || "Khách hàng FoxStyle",
          rating: submittedRating,
          date: new Date().toISOString().split("T")[0],
          comment: finalComment
        };
        await addReview(product.id, submittedRating, finalComment);
        setProductReviews((prev) => [newReviewRecord, ...prev]);
        alert(hasPurchasedCurrentProduct ? "✅ Gửi đánh giá sản phẩm thành công!" : "✅ Gửi bình luận thành công!");
      }
      setReviewComment("");
    } catch (err) {
      setReviewError("Có lỗi xảy ra khi gửi đánh giá!");
    }
  };

  if (!product) {
    return (
      <div className="min-h-[70vh] bg-gray-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
        <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center text-3xl font-black mb-4 animate-bounce shadow-md border border-orange-200">
          🛍️
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Sản phẩm không tồn tại hoặc đã bị ẩn!</h2>
        <p className="text-xs text-gray-500 max-w-md mb-6 font-medium leading-relaxed">
          Sản phẩm bạn đang tìm kiếm hiện không khả dụng. Vui lòng tham khảo các mẫu thiết kế thời trang bán chạy khác tại FoxStyle nhé!
        </p>
        <Link
          to="/products"
          className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-extrabold text-xs px-6 py-3.5 rounded-2xl shadow-lg transition uppercase tracking-wider cursor-pointer"
        >
          Khám phá tất cả sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-orange-600 transition font-medium">Trang chủ</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-orange-600 transition font-medium">Sản phẩm</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Product Details Grid */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Image / Video Media Block */}
          <div className="flex flex-col space-y-4">
            {/* Media Mode Switcher Buttons - Only shown if product has a videoUrl */}
            {product?.videoUrl && product.videoUrl.trim() !== "" && (
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-2xl w-fit">
                <button
                  type="button"
                  onClick={() => setMediaMode("image")}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    mediaMode === "image" ? "bg-white text-gray-900 shadow-2xs font-extrabold" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  🖼️ Hình ảnh
                </button>
                <button
                  type="button"
                  onClick={() => setMediaMode("video")}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    mediaMode === "video" ? "bg-orange-600 text-white shadow-2xs font-extrabold" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  🎬 Video sản phẩm 4K
                </button>
              </div>
            )}

            {mediaMode === "video" && product?.videoUrl && product.videoUrl.trim() !== "" ? (
              <div className="relative rounded-2xl overflow-hidden aspect-square bg-black border border-gray-200 flex items-center justify-center">
                {getVideoEmbedUrl(product.videoUrl) ? (
                  <iframe
                    src={`${getVideoEmbedUrl(product.videoUrl)}?autoplay=1&mute=1`}
                    title="Product Video"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={product.videoUrl}
                    controls
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden aspect-square bg-gray-50 border border-gray-100 flex items-center justify-center group">
                <img
                  src={mainImage || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500"
                />

              {pricing.hasDiscount && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 rounded-xl text-sm font-extrabold shadow-md">
                  -{discount}% OFF
                </div>
              )}
            </div>
            )}
            
            {/* Thumbnails with Video and Color/Size Badges */}
            <div className="flex space-x-2.5 overflow-x-auto pb-2 pt-1">
              {/* Video Thumbnail Button */}
              {product.videoUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setMediaMode("video");
                  }}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                    mediaMode === "video" ? "border-orange-600 shadow-md ring-2 ring-orange-500/20" : "border-gray-200 hover:border-orange-400"
                  }`}
                >
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white z-10">
                    <Play className="h-6 w-6 text-orange-400 fill-orange-400 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">Video</span>
                  </div>
                  <img src={product.image} alt="Video Preview" className="w-full h-full object-cover" />
                </button>
              )}

              {/* Image Gallery Thumbnails */}
              {(galleryImages.length > 0 ? galleryImages : [{ imageUrl: product.image, color: product.colors?.[0], size: product.sizes?.[0] }]).map((img, idx) => (
                <button
                  key={img.imageId || idx}
                  type="button"
                  onClick={() => handleThumbnailClick(img)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition shrink-0 cursor-pointer group ${
                    mediaMode === "image" && (mainImage || product.image) === img.imageUrl ? "border-orange-600 shadow-md ring-2 ring-orange-500/20" : "border-gray-200 hover:border-orange-400"
                  }`}
                >
                  <img src={img.imageUrl} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  {img.color && (
                    <div className="absolute bottom-0 inset-x-0 bg-black/75 text-white text-[9px] font-extrabold px-1 py-0.5 text-center truncate">
                      {img.color} {img.size ? `(${img.size})` : ""}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Info Block */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs uppercase font-extrabold tracking-wider text-orange-500 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-100">
                  {product.category}
                </span>
                <Link
                  to={`/products?brand=${encodeURIComponent(product.brand || product.brandName || "FoxStyle Studio")}`}
                  className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-0.5 rounded-full border border-purple-200/80 transition flex items-center gap-1"
                  title="Xem tất cả sản phẩm của thương hiệu này"
                >
                  <Award className="w-3.5 h-3.5 text-purple-600" />
                  <span>Thương hiệu: {product.brand || product.brandName || "FoxStyle Studio"}</span>
                </Link>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2 leading-tight">
                {product.name}
              </h1>


              {/* Rating & Review counter */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-lg text-sm font-bold">
                  <span className="mr-1.5">{reviewAverage}</span>
                  <Star className="h-4 w-4 fill-current text-yellow-500" />
                </div>
                <span className="text-gray-400 text-sm">|</span>
                <span className="text-gray-500 text-sm font-medium flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1.5 text-gray-400" />
                  {productReviews.length} Đánh giá
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-3 mb-6 bg-gray-50 p-4 rounded-2xl">
                <span className="text-3xl font-extrabold text-orange-600">
                  {Number(currentPrice || product?.price || 0).toLocaleString('vi-VN')}đ
                </span>
                {pricing.hasDiscount && (
                  <span className="text-lg text-gray-400 line-through">
                    {pricing.originalPrice.toLocaleString('vi-VN')}đ
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {(product?.description || "").replace(/\[COMBO:[\d,]+\]/, "").trim()}
              </p>

              {/* Included Combo Products Box */}
              {comboSubProducts.length > 0 && (
                <div className="mb-6 bg-gradient-to-r from-orange-50 via-amber-50 to-pink-50 p-4 sm:p-5 rounded-3xl border-2 border-orange-200 shadow-md">
                  <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-orange-200/80">
                    <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-orange-950 flex items-center gap-2">
                      <Gift className="h-4 w-4 text-orange-600 animate-bounce" />
                      <span>🎁 Các sản phẩm trong combo này ({comboSubProducts.length} món):</span>
                    </h4>
                    <span className="bg-orange-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                      Mua Gộp Tiết Kiệm
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {comboSubProducts.map((sub) => (
                      <div key={sub.id} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-orange-100 shadow-2xs hover:border-orange-300 transition">
                        <img src={sub.image} alt={sub.name} className="w-14 h-14 object-cover rounded-xl bg-gray-50 border shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-extrabold text-gray-900 truncate">{sub.name}</p>
                          <p className="text-[11px] text-orange-600 font-black mt-0.5">{Number(sub.price).toLocaleString('vi-VN')}đ</p>
                          <Link
                            to={`/products/${sub.id}`}
                            className="inline-flex mt-1 rounded-lg bg-blue-50 px-2 py-1 text-[10px] text-blue-700 font-black hover:bg-blue-100"
                          >
                            Mua lẻ sản phẩm này ↗
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/90 p-3 rounded-2xl border border-orange-200 flex items-center justify-between text-xs font-bold text-orange-950 shadow-2xs">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-orange-500 shrink-0" />
                      <span>Mua trọn combo gồm {comboSubProducts.length} món với một mức giá ưu đãi.</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Material & Origin Badges */}
              <div className="grid grid-cols-2 gap-3 mb-6 bg-orange-50/60 p-3.5 rounded-2xl border border-orange-100 text-xs">
                <div>
                  <span className="font-bold text-gray-500 block uppercase text-[10px] tracking-wider mb-0.5">Thành phần chất liệu:</span>
                  <span className="font-extrabold text-orange-900">{product.material || "Cotton 100% cao cấp"}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-500 block uppercase text-[10px] tracking-wider mb-0.5">Nguồn gốc xuất xứ:</span>
                  <span className="font-extrabold text-orange-900">{product.origin || "Việt Nam"}</span>
                </div>
              </div>

              {/* Colors selector */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="block text-xs font-black uppercase tracking-wider text-gray-500">
                    Chọn màu sắc: <strong className="text-orange-600 ml-1">{selectedColor || (product.colors && product.colors[0]) || (product.isCombo ? "Chuẩn Set Phối Sẵn" : "Mặc định")}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAiSizeModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-black text-amber-700 transition hover:border-amber-300 hover:bg-amber-100 cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span>Tư vấn Size AI</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {(
                    product.colors && product.colors.length > 0
                      ? product.colors
                      : product.isCombo
                      ? ["Chuẩn Set Phối Sẵn", "Set Phối Đen / Trắng", "Set Phối Tone Xám"]
                      : ["Mặc định"]
                  ).map((color) => {
                    const isSelected = (selectedColor || (product.colors && product.colors[0]) || (product.isCombo ? "Chuẩn Set Phối Sẵn" : "Mặc định")) === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColorSelect(color)}
                        className={`px-4 py-2.5 text-xs font-black rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-2xs whitespace-nowrap ${
                          isSelected
                            ? "border-orange-600 bg-orange-50/90 text-orange-600 ring-2 ring-orange-500/20 scale-[1.02]"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? "bg-orange-600 animate-pulse" : "bg-gray-300"}`} />
                        <span>{color}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sizes selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <span className="block text-xs font-black uppercase tracking-wider text-gray-500">
                    Chọn kích cỡ: <strong className="text-orange-600 ml-1">{selectedSize || "Chưa chọn"}</strong>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {(
                    product.sizes && product.sizes.length > 0
                      ? product.sizes
                      : product.isCombo
                      ? ["Freesize / Đủ Size", "Size S (Full Set)", "Size M (Full Set)", "Size L (Full Set)", "Size XL (Full Set)"]
                      : ["S", "M", "L", "XL"]
                  ).map((size) => {
                    const isSelected = selectedSize === size;
                    const isUnavailableForColor = Boolean(
                      selectedColor &&
                      product.variants?.length &&
                      !product.variants.some(
                        (variant) =>
                          String(variant.size) === String(size) &&
                          String(variant.color).toLowerCase() === String(selectedColor).toLowerCase() &&
                          Number(variant.quantity ?? 1) > 0
                      )
                    );
                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={isUnavailableForColor}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2.5 min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-xs font-black rounded-xl border transition-all duration-200 cursor-pointer shadow-2xs whitespace-nowrap ${
                          isSelected
                            ? "border-orange-600 bg-orange-50/90 text-orange-600 ring-2 ring-orange-500/20 scale-[1.02]"
                            : isUnavailableForColor
                            ? "cursor-not-allowed border-gray-100 bg-gray-100 text-gray-300 line-through"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <span>{size}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Số lượng:</span>
                <div className="flex items-center border border-gray-300 rounded-xl bg-white shadow-sm overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 hover:bg-gray-50 transition text-gray-500"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-5 font-bold text-gray-800 text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
                    disabled={availableStock <= 0 || quantity >= availableStock}
                    className="p-3 hover:bg-gray-50 transition text-gray-500 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Stock indicator */}
                <span className="text-xs text-gray-400 font-semibold">
                  (Còn {selectedVariant?.quantity ?? product.quantity ?? 0} sản phẩm trong kho)
                </span>
              </div>
              {/* Status Alert Banners */}
              {isStoppedSelling && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3 font-extrabold text-sm mb-4">
                  <ShieldAlert className="h-6 w-6 text-red-600 shrink-0" />
                  <div>
                    <span className="block font-black uppercase tracking-wider text-red-900">🔴 Sản Phẩm Hiện Đã Ngừng Bán</span>
                    <span className="text-xs font-medium text-red-600">Sản phẩm này tạm dừng kinh doanh trên hệ thống. Quý khách không thể đặt mua sản phẩm này.</span>
                  </div>
                </div>
              )}

              {isOutOfStock && !isStoppedSelling && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl flex items-center gap-3 font-extrabold text-sm mb-4">
                  <ShieldAlert className="h-6 w-6 text-amber-600 shrink-0" />
                  <div>
                    <span className="block font-black uppercase tracking-wider text-amber-900">⚠️ Sản Phẩm Tạm Hết Hàng</span>
                    <span className="text-xs font-medium text-amber-700">Sản phẩm hiện đang tạm hết hàng trong kho. Vui lòng quay lại sau!</span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions Panel */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={handleAddToCart}
                disabled={isStoppedSelling || isOutOfStock}
                className={`flex-1 flex items-center justify-center space-x-2 border-2 py-3.5 rounded-xl font-bold transition ${
                  isStoppedSelling || isOutOfStock
                    ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "border-orange-600 text-orange-600 hover:bg-orange-50 cursor-pointer shadow-sm"
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>
                  {isStoppedSelling 
                    ? "Ngừng kinh doanh" 
                    : isOutOfStock 
                    ? "Tạm hết hàng" 
                    : comboSubProducts.length > 0 
                    ? "🎁 Thêm cả Set Combo vào giỏ" 
                    : "Thêm vào giỏ hàng"}
                </span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isStoppedSelling || isOutOfStock}
                className={`flex-1 py-3.5 rounded-xl font-bold transition ${
                  isStoppedSelling || isOutOfStock
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-500 via-pink-600 to-rose-600 text-white hover:from-orange-600 hover:to-rose-700 shadow-md cursor-pointer"
                }`}
              >
                {isStoppedSelling 
                  ? "Ngừng bán" 
                  : isOutOfStock 
                  ? "Hết hàng" 
                  : comboSubProducts.length > 0 
                  ? "🚀 Mua ngay cả Set Combo" 
                  : "Mua ngay"}
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-xl border flex items-center justify-center transition cursor-pointer ${
                  isLiked
                    ? "bg-red-50 border-red-200 text-red-500"
                    : "border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50/20"
                }`}
                title="Lưu yêu thích"
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {/* INDIVIDUAL PRODUCTS INSIDE A COMBO */}
        {comboSubProducts.length > 0 && (
          <section className="bg-white rounded-3xl border border-orange-200 p-6 mb-12 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">Tùy chọn mua hàng</span>
                <h3 className="text-xl font-black text-gray-900 mt-1">Sản phẩm có trong combo</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Combo do shop phối sẵn và chỉ bán nguyên bộ. {comboSelectionMode === "CUSTOM" ? "Bạn được chọn màu và size cho từng món." : "Màu và size đã được shop cố định."}
                </p>
              </div>
              <span className="text-xs font-extrabold text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full">
                {comboSubProducts.length} sản phẩm
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {comboSubProducts.map((singleProduct, index) => {
                const stopped = singleProduct.status === 0 || singleProduct.status === false;
                const outOfStock = Number(singleProduct.quantity ?? 1) <= 0;
                const unavailable = stopped || outOfStock;
                const selectionKey = String(singleProduct.id);
                const selection = comboSelections[selectionKey] || {};
                const availableColors = singleProduct.colors?.length
                  ? singleProduct.colors
                  : [...new Set((singleProduct.variants || []).map((variant) => variant.color).filter(Boolean))];
                const sizesForSelectedColor = [...new Set(
                  (singleProduct.variants || [])
                    .filter((variant) => !selection.color || variant.color === selection.color)
                    .map((variant) => variant.size)
                    .filter(Boolean)
                )];
                const availableSizes = sizesForSelectedColor.length
                  ? sizesForSelectedColor
                  : singleProduct.sizes?.length
                  ? singleProduct.sizes
                  : [...new Set((singleProduct.variants || []).map((variant) => variant.size).filter(Boolean))];
                const chosenComboVariant = singleProduct.variants?.find(
                  (variant) =>
                    variant.color === selection.color &&
                    variant.size === selection.size
                ) || singleProduct.variants?.find(
                  (variant) => variant.color === selection.color
                ) || singleProduct.variants?.[0];
                const chosenComboPrice = Number(
                  chosenComboVariant?.price ?? singleProduct.price ?? 0
                );
                return (
                  <article key={singleProduct.id || index} className="border border-gray-200 rounded-2xl p-4 flex gap-4 hover:border-orange-300 hover:shadow-sm transition">
                    <Link to={`/products/${singleProduct.id}`} className="w-24 h-28 rounded-xl overflow-hidden bg-gray-100 border shrink-0">
                      <img src={singleProduct.image} alt={singleProduct.name} className="w-full h-full object-cover hover:scale-105 transition" />
                    </Link>
                    <div className="min-w-0 flex-1 flex flex-col">
                      <Link to={`/products/${singleProduct.id}`} className="font-extrabold text-sm text-gray-900 line-clamp-2 hover:text-orange-600">
                        {singleProduct.name}
                      </Link>
                      <p className="text-base font-black text-orange-600 mt-1">
                        {(product.comboGiftProductIds || []).some((id) => String(id) === String(singleProduct.id)) ? "Quà tặng 0đ" : `${chosenComboPrice.toLocaleString("vi-VN")}đ`}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {singleProduct.brand || "FoxStyle"} • {singleProduct.sizes?.join(", ") || "Đủ size"}
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <label className="text-[10px] font-bold text-gray-500">
                          Màu
                          <select
                            disabled={comboSelectionMode === "FIXED"}
                            value={selection.color || availableColors[0] || ""}
                            onChange={(event) => {
                              const color = event.target.value;
                              const matchingVariant = singleProduct.variants?.find(
                                (variant) => variant.color === color
                              );
                              setComboSelections((current) => ({
                                ...current,
                                [selectionKey]: {
                                  ...current[selectionKey],
                                  color,
                                  size: matchingVariant?.size || current[selectionKey]?.size
                                }
                              }));
                            }}
                            className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-[11px] font-bold text-gray-800 disabled:bg-gray-100"
                          >
                            {availableColors.map((color) => (
                              <option key={color} value={color}>{color}</option>
                            ))}
                          </select>
                        </label>
                        <label className="text-[10px] font-bold text-gray-500">
                          Kích cỡ
                          <select
                            disabled={comboSelectionMode === "FIXED"}
                            value={selection.size || availableSizes[0] || ""}
                            onChange={(event) => setComboSelections((current) => ({
                              ...current,
                              [selectionKey]: { ...current[selectionKey], size: event.target.value }
                            }))}
                            className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-[11px] font-bold text-gray-800 disabled:bg-gray-100"
                          >
                            {availableSizes.map((size) => (
                              <option key={size} value={size}>
                                {size}
                                {(() => {
                                  const variant = singleProduct.variants?.find(
                                    (item) => item.color === (selection.color || availableColors[0]) && item.size === size
                                  );
                                  return variant?.price
                                    ? ` — ${Number(variant.price).toLocaleString("vi-VN")}đ`
                                    : "";
                                })()}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <div className="mt-auto pt-3 text-[11px] font-bold text-orange-700">Chỉ bán trong nguyên combo</div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* BUNDLE DEAL / MUA KÈM GIÁ SỐC SECTION */}
        {bundleProduct && (
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 rounded-3xl border border-orange-200 p-6 mb-12 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-6 w-6 text-orange-600" />
              <h3 className="text-lg font-black text-gray-900">Mua kèm giá sốc - Tiết kiệm thêm 15%</h3>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-5 rounded-2xl border border-orange-150">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <img src={product.image} alt="" className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
                  <span className="text-xl font-bold text-gray-400">+</span>
                  <img src={bundleProduct.image} alt="" className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
                </div>
                <div>
                  <p className="font-extrabold text-sm text-gray-900">Combo 2 sản phẩm phối đồ hoàn hảo</p>
                  <p className="text-xs text-gray-500 mt-0.5">{product.name} + {bundleProduct.name}</p>
                  <p className="text-xs font-black text-orange-600 mt-1">
                    Giá combo: {Math.round((product.price + bundleProduct.price) * 0.85).toLocaleString("vi-VN")}đ
                    <span className="text-gray-400 line-through text-[11px] ml-2">{(product.price + bundleProduct.price).toLocaleString("vi-VN")}đ</span>
                  </p>
                </div>
              </div>

              <button
                onClick={handleAddBundleToCart}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-sm transition cursor-pointer"
              >
                Mua cả Combo (-15%)
              </button>
            </div>
          </div>
        )}

        {productArticle && (
          <article className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 mb-12 shadow-xs overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-7 items-start">
              {productArticle.image && (
                <img
                  src={productArticle.image}
                  alt={productArticle.title}
                  className="w-full h-64 object-cover rounded-2xl border border-gray-100"
                />
              )}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-wider">
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-700 border border-orange-200">
                    Bài viết riêng của sản phẩm
                  </span>
                  {productArticle.topicName && (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600">
                      {productArticle.topicName}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-black leading-tight text-gray-950">
                  {productArticle.title}
                </h2>
                {productArticle.summary && (
                  <p className="mt-3 text-sm font-semibold leading-relaxed text-gray-600">
                    {productArticle.summary}
                  </p>
                )}
                <div className="mt-5 whitespace-pre-line text-sm leading-7 text-gray-700">
                  {productArticle.content}
                </div>
              </div>
            </div>
          </article>
        )}

        {/* DETAILED PRODUCT SPECIFICATIONS & CARE GUIDE */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 mb-12 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Info className="h-5 w-5 text-orange-600" />
              <span>Thông Số Chi Tiết Sản Phẩm & Hướng Dẫn Bảo Quản</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">Thông tin chi tiết về chất liệu, nguồn gốc và hướng dẫn chăm sóc sản phẩm từ FoxStyle</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Specifications Grid */}
            <div className="bg-gray-50/70 rounded-2xl p-5 border border-gray-150 space-y-3.5">
              <h4 className="text-xs font-black uppercase text-orange-600 tracking-wider flex items-center gap-1.5 border-b border-gray-200 pb-2">
                <Shirt className="h-4 w-4" />
                Thông số kỹ thuật sản phẩm
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-gray-150">
                  <span className="text-gray-500 font-semibold">🧵 Chất liệu vải:</span>
                  <span className="font-extrabold text-gray-900">{product.material || "Cotton 100% thoáng mát, co giãn 4 chiều"}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-gray-150">
                  <span className="text-gray-500 font-semibold">🇻🇳 Nguồn gốc xuất xứ:</span>
                  <span className="font-extrabold text-gray-900">{product.origin || "Việt Nam - Thiết kế chính hãng FoxStyle"}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-gray-150">
                  <span className="text-gray-500 font-semibold">👕 Dáng phom (Form fit):</span>
                  <span className="font-extrabold text-gray-900">
                    {product.category === "ao" ? "Form Rộng Oversize Hàn Quốc" : product.category === "quan" ? "Form Baggy Tôn Dáng" : product.category === "vay" ? "Form Bodycon Ôm Dáng" : "Freesize Chuẩn Phom"}
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-gray-150">
                  <span className="text-gray-500 font-semibold">🎨 Tông màu sản phẩm:</span>
                  <span className="font-extrabold text-gray-900">{product.colors ? product.colors.join(", ") : "Đen, Trắng, Be"}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-gray-150">
                  <span className="text-gray-500 font-semibold">📏 Bảng Size có sẵn:</span>
                  <span className="font-extrabold text-gray-900">{product.sizes ? product.sizes.join(", ") : "S, M, L, XL"}</span>
                </div>

                <div className="flex justify-between py-1.5">
                  <span className="text-gray-500 font-semibold">🛡️ Chính sách đổi trả:</span>
                  <span className="font-extrabold text-emerald-700">1 Đổi 1 trong 30 ngày (Lỗi NSX)</span>
                </div>
              </div>
            </div>

            {/* Washing & Care Instructions */}
            <div className="bg-orange-50/40 rounded-2xl p-5 border border-orange-150 space-y-3.5">
              <h4 className="text-xs font-black uppercase text-orange-700 tracking-wider flex items-center gap-1.5 border-b border-orange-200/60 pb-2">
                <ShieldCheck className="h-4 w-4" />
                Hướng dẫn giặt ủi & Giữ màu bền đẹp
              </h4>

              <ul className="space-y-2.5 text-xs font-medium text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">1.</span>
                  <span>Giặt máy ở nhiệt độ thường (dưới 40°C), nên lộn trái trang phục trước khi giặt để bảo vệ màu vải.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">2.</span>
                  <span>Không ngâm trang phục trong chất tẩy rửa mạnh hoặc thuốc tẩy quá 15 phút.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">3.</span>
                  <span>Phơi ở nơi khô ráo, lộn mặt trái khi phơi dưới ánh nắng để tránh bị bay màu.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold">4.</span>
                  <span>Ủi/Là ở nhiệt độ trung bình (dưới 150°C), ưu tiên sử dụng bàn ủi hơi nước.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* REVIEWS & RATINGS SECTION */}
        <div id="reviews" className="scroll-mt-24 bg-white rounded-3xl border border-gray-200 p-6 md:p-8 mb-12 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-6 mb-6 gap-4">
            <div>
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500 fill-current" />
                <span>Đánh Giá & Nhận Xét Của Khách Hàng ({productReviews.length})</span>
              </h3>
              <p className="text-xs text-gray-500 mt-1">Đánh giá thực tế từ khách hàng đã mua và trải nghiệm sản phẩm tại FoxStyle</p>
            </div>

            <div className="flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200">
              <span className="text-2xl font-black text-amber-700">{reviewAverage}</span>
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
            </div>
          </div>

          {/* Review Rights Banner */}
          {!currentUser ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0" />
                <p className="text-xs font-bold text-amber-900">
                  Bạn cần <b>đăng nhập hoặc đăng ký</b> để bình luận. Chỉ khách đã mua và nhận hàng thành công mới được chấm sao đánh giá.
                </p>
              </div>
              <button type="button" onClick={openLoginModal} className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl shrink-0 transition cursor-pointer">
                Đăng nhập ngay
              </button>
            </div>
          ) : !userExistingReview ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl mb-8 flex items-center gap-3 text-emerald-900 text-xs font-bold">
              <Check className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>
                {hasPurchasedCurrentProduct ? (
                  <>✨ <b>Đã xác nhận mua hàng.</b> Bạn được chấm sao và viết nhận xét cho sản phẩm này.</>
                ) : (
                  <>💬 <b>Bạn chưa mua sản phẩm.</b> Bạn được viết bình luận nhưng không được chấm sao đánh giá.</>
                )}
              </span>
            </div>
          ) : userExistingReview ? (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl mb-8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-blue-900 text-xs font-bold">
                <Check className="h-5 w-5 text-blue-600 shrink-0" />
                <span>
                  ✅ Bạn đã sử dụng Quyền đánh giá cho giao dịch này. {isReviewEditableWithin7Days ? "Bạn được phép chỉnh sửa bài đánh giá trong hạn 7 ngày kể từ khi gửi." : "⏰ Đã hết thời hạn 7 ngày chỉnh sửa."}
                </span>
              </div>
              {isReviewEditableWithin7Days && (
                <button
                  type="button"
                  onClick={() => {
                    setReviewRating(userExistingReview.rating);
                    setReviewComment(userExistingReview.comment);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl shrink-0 transition cursor-pointer"
                >
                  ✏️ Sửa nhận xét
                </button>
              )}
            </div>
          ) : null}

          {/* Chỉ tài khoản đã đăng nhập mới được gửi hoặc chỉnh sửa đánh giá. */}
          {currentUser && (!userExistingReview || isReviewEditableWithin7Days) && (
            <form onSubmit={handleReviewSubmit} className="bg-gray-50/80 p-5 rounded-2xl border border-gray-200 mb-8 space-y-4">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                {userExistingReview
                  ? `Chỉnh Sửa ${hasPurchasedCurrentProduct ? "Đánh Giá" : "Bình Luận"} Của Bạn (Trong Hạn 7 Ngày)`
                  : hasPurchasedCurrentProduct
                    ? "Viết Đánh Giá Sản Phẩm"
                    : "Viết Bình Luận Sản Phẩm"}
              </h4>
              
              {reviewError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{reviewError}</span>
                </div>
              )}

            {hasPurchasedCurrentProduct && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-600">Mức độ hài lòng:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 text-amber-400 hover:scale-125 transition cursor-pointer"
                  >
                    <Star className={`h-6 w-6 ${reviewRating >= star ? "fill-current" : ""}`} />
                  </button>
                ))}
              </div>
              <span className="text-xs font-black text-amber-600 ml-2">{reviewRating} / 5 Sao</span>
            </div>
            )}

            <div>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder={hasPurchasedCurrentProduct
                  ? "Chia sẻ nhận xét chi tiết về chất vải, phom dáng và dịch vụ mua sắm tại FoxStyle..."
                  : "Viết bình luận hoặc câu hỏi của bạn về sản phẩm..."}
                rows={3}
                className="w-full p-3.5 border border-gray-300 rounded-2xl text-xs font-medium focus:outline-none focus:border-orange-500 bg-white"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-sm transition cursor-pointer flex items-center gap-2 uppercase tracking-wider"
              >
                <Send className="h-3.5 w-3.5" />
                {hasPurchasedCurrentProduct ? "Gửi Đánh Giá" : "Gửi Bình Luận"}
              </button>
            </div>
          </form>
          )}

          {/* List of Reviews */}
          <div className="space-y-4">
            {productReviews.map((rev) => (
              <div key={rev.id} className="p-4 border border-gray-150 rounded-2xl bg-white shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white font-black text-xs flex items-center justify-center">
                      {rev.userName ? rev.userName.charAt(0).toUpperCase() : "K"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-gray-900">{rev.userName}</span>
                        {Number(rev.rating) > 0 ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            ✓ Đã mua hàng
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                            Bình luận
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium block">{rev.date}</span>
                    </div>
                  </div>

                  {Number(rev.rating) > 0 && (
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < Number(rev.rating) ? "fill-current" : "text-gray-200"}`} />
                    ))}
                  </div>
                  )}
                </div>

                <p className="text-xs text-gray-700 leading-relaxed font-medium pl-10">{rev.comment}</p>

                {/* Like / Dislike Review Reaction Toolbar */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-2.5 mt-2 pl-10">
                  <span className="text-[11px] text-gray-400 font-medium">Nhận xét này có hữu ích với bạn không?</span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleReviewReaction(rev.id, "like")}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        userReactions[rev.id] === "like"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs font-black"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                      }`}
                    >
                      <ThumbsUp className={`h-3.5 w-3.5 ${userReactions[rev.id] === "like" ? "fill-current" : ""}`} />
                      <span>Hữu ích ({rev.likesCount || 0})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReviewReaction(rev.id, "dislike")}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        userReactions[rev.id] === "dislike"
                          ? "bg-rose-50 text-rose-700 border-rose-300 shadow-2xs font-black"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200"
                      }`}
                    >
                      <ThumbsDown className={`h-3.5 w-3.5 ${userReactions[rev.id] === "dislike" ? "fill-current" : ""}`} />
                      <span>Không thích ({rev.dislikesCount || 0})</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Khách hàng cũng xem</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <div key={relProduct.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs hover:shadow-md transition">
                  <Link to={`/products/${relProduct.id}`}>
                    <img src={relProduct.image} alt="" className="w-full aspect-square object-cover rounded-xl mb-3" />
                    <h4 className="font-bold text-sm text-gray-800 truncate">{relProduct.name}</h4>
                    <p className="text-xs font-black text-orange-600 mt-1">{relProduct.price.toLocaleString("vi-VN")}đ</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Size Consultation */}
        {showAiSizeModal && (
          <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 relative shadow-2xl border border-amber-200 max-h-[90vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setShowAiSizeModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition p-1.5 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Modal Title Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-black shrink-0 shadow-2xs">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">Tư Vấn Size Chuẩn AI & Bảng Thông Số</h3>
                  <p className="text-[11px] text-gray-500 font-medium">Tự động đề xuất kích thước chuẩn xác 99% theo thể trạng của bạn</p>
                </div>
              </div>

              {/* Sub-tabs header */}
              <div className="flex bg-gray-100 p-1 rounded-2xl mb-5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setAiSizeTab("recommendation")}
                  className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    aiSizeTab === "recommendation" ? "bg-white text-amber-700 font-black shadow-xs" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <span>🔮 Gợi Ý Size AI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAiSizeTab("chart")}
                  className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    aiSizeTab === "chart" ? "bg-white text-amber-700 font-black shadow-xs" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <span>📏 Bảng Thông Số Size</span>
                </button>
              </div>

              {aiSizeTab === "recommendation" ? (
                <>
                  <div className="space-y-4 mb-6">
                    {/* Height Slider */}
                    <div className="bg-amber-50/40 p-3.5 rounded-2xl border border-amber-100">
                      <div className="flex justify-between items-center mb-1 text-xs font-bold text-gray-700">
                        <span>Chiều cao của bạn:</span>
                        <span className="text-amber-700 font-black text-sm">{userHeight} cm</span>
                      </div>
                      <input
                        type="range"
                        min="140"
                        max="200"
                        value={userHeight}
                        onChange={(e) => setUserHeight(Number(e.target.value))}
                        className="w-full accent-amber-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Weight Slider */}
                    <div className="bg-amber-50/40 p-3.5 rounded-2xl border border-amber-100">
                      <div className="flex justify-between items-center mb-1 text-xs font-bold text-gray-700">
                        <span>Cân nặng của bạn:</span>
                        <span className="text-amber-700 font-black text-sm">{userWeight} kg</span>
                      </div>
                      <input
                        type="range"
                        min="35"
                        max="120"
                        value={userWeight}
                        onChange={(e) => setUserWeight(Number(e.target.value))}
                        className="w-full accent-amber-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Body Type Selector */}
                    <div>
                      <span className="block text-xs font-bold text-gray-700 mb-1.5">Vóc dáng cơ thể:</span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "gay", label: "Mảnh khảnh" },
                          { id: "vua", label: "Cân đối" },
                          { id: "day-dan", label: "Đầy đặn" }
                        ].map((type) => (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setUserBodyType(type.id)}
                            className={`py-2 px-3 text-xs font-bold rounded-xl border transition cursor-pointer ${
                              userBodyType === type.id
                                ? "border-amber-600 bg-amber-50 text-amber-700 font-black shadow-2xs"
                                : "border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Fit Preference Selector */}
                    <div>
                      <span className="block text-xs font-bold text-gray-700 mb-1.5">Sở thích mặc (Phom dáng):</span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "fit", label: "Ôm dáng (Body)" },
                          { id: "regular", label: "Vừa vặn (Regular)" },
                          { id: "oversized", label: "Rộng (Oversized)" }
                        ].map((pref) => (
                          <button
                            key={pref.id}
                            type="button"
                            onClick={() => setUserFitPreference(pref.id)}
                            className={`py-2 px-3 text-xs font-bold rounded-xl border transition cursor-pointer ${
                              userFitPreference === pref.id
                                ? "border-orange-600 bg-orange-50 text-orange-700 font-black shadow-2xs"
                                : "border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {pref.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* AI Recommendation Result Card */}
                  {(() => {
                    const result = calculateAccurateSize(userHeight, userWeight, userBodyType, userFitPreference);
                    return (
                      <div className="space-y-4 mb-6">
                        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-pink-600 text-white rounded-3xl p-5 text-center shadow-lg relative overflow-hidden">
                          <div className="absolute top-2 right-3 text-[10px] uppercase tracking-widest font-black bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-xs">
                            Độ khớp {result.matchRate}%
                          </div>

                          <span className="text-[10px] uppercase tracking-widest font-extrabold opacity-90 block mb-1">
                            {result.sizeType === "shoes" ? "Size Giày Gợi Ý" : result.sizeType === "pants" ? "Size Quần Gợi Ý" : "Size Áo Gợi Ý Chuẩn AI"}
                          </span>
                          <div className="text-4xl font-black my-1.5 tracking-tight drop-shadow-sm">
                            SIZE {result.size}
                          </div>
                          
                          {result.sizeNote && (
                            <p className="text-[11px] font-semibold text-yellow-100 mb-2 italic">
                              {result.sizeNote}
                            </p>
                          )}

                          <div className="text-[11px] font-semibold bg-white/15 px-3 py-1.5 rounded-xl inline-block backdrop-blur-xs">
                            {result.estimatedChestOrWaist}
                          </div>
                        </div>

                        {/* Advice narrative box */}
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-700 leading-relaxed font-medium">
                          <p className="font-bold text-gray-900 mb-1 flex items-center gap-1.5">
                            <span>💡 Đánh giá tư vấn FoxStyle:</span>
                          </p>
                          <p>{result.adviceNote}</p>
                        </div>
                      </div>
                    );
                  })()}

                  <button
                    type="button"
                    onClick={() => {
                      const result = calculateAccurateSize(userHeight, userWeight, userBodyType, userFitPreference);
                      setSelectedSize(result.size);
                      setShowAiSizeModal(false);
                      toast.success(`Đã áp dụng Size ${result.size} cho sản phẩm!`);
                    }}
                    className="w-full py-3.5 bg-gray-900 hover:bg-orange-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Áp dụng Size {calculateAccurateSize(userHeight, userWeight, userBodyType, userFitPreference).size} này ngay</span>
                  </button>
                </>
              ) : (
                /* BẢNG THÔNG SỐ SIZE (SIZE CHART TABLE) */
                <div className="space-y-4 mb-6">
                  {(() => {
                    const result = calculateAccurateSize(userHeight, userWeight, userBodyType, userFitPreference);
                    if (result.sizeType === "shoes") {
                      return (
                        <div className="overflow-hidden border border-gray-200 rounded-2xl shadow-2xs">
                          <table className="w-full text-center text-xs">
                            <thead className="bg-amber-50 text-amber-900 font-extrabold border-b">
                              <tr>
                                <th className="p-2.5">Size VN/EU</th>
                                <th className="p-2.5">Chiều dài bàn chân</th>
                                <th className="p-2.5">Chiều cao gợi ý</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                              {[
                                { size: "37", len: "23.0 - 23.5 cm", h: "< 1m58" },
                                { size: "38", len: "23.5 - 24.0 cm", h: "1m58 - 1m63" },
                                { size: "39", len: "24.1 - 24.5 cm", h: "1m64 - 1m69" },
                                { size: "40", len: "24.6 - 25.0 cm", h: "1m70 - 1m75" },
                                { size: "41", len: "25.1 - 25.5 cm", h: "1m76 - 1m80" },
                                { size: "42", len: "25.6 - 26.0 cm", h: "1m81 - 1m85" },
                                { size: "43", len: "26.1 - 26.5 cm", h: "> 1m85" }
                              ].map(row => (
                                <tr key={row.size} className={result.size === row.size ? "bg-amber-100/70 font-black text-amber-900" : ""}>
                                  <td className="p-2.5 font-bold">{row.size}</td>
                                  <td className="p-2.5">{row.len}</td>
                                  <td className="p-2.5">{row.h}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    } else if (result.sizeType === "pants") {
                      return (
                        <div className="overflow-hidden border border-gray-200 rounded-2xl shadow-2xs">
                          <table className="w-full text-center text-xs">
                            <thead className="bg-amber-50 text-amber-900 font-extrabold border-b">
                              <tr>
                                <th className="p-2">Size</th>
                                <th className="p-2">Cân nặng</th>
                                <th className="p-2">Vòng bụng</th>
                                <th className="p-2">Dài quần</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                              {[
                                { size: "28", w: "< 50 kg", waist: "70 - 73 cm", l: "94 cm" },
                                { size: "29", w: "50 - 55 kg", waist: "73 - 76 cm", l: "96 cm" },
                                { size: "30", w: "56 - 61 kg", waist: "76 - 79 cm", l: "98 cm" },
                                { size: "31", w: "62 - 67 kg", waist: "79 - 82 cm", l: "100 cm" },
                                { size: "32", w: "68 - 74 kg", waist: "82 - 85 cm", l: "102 cm" },
                                { size: "33", w: "75 - 80 kg", waist: "85 - 88 cm", l: "103 cm" },
                                { size: "34", w: "81 - 86 kg", waist: "88 - 92 cm", l: "104 cm" },
                                { size: "36", w: "> 86 kg", waist: "> 92 cm", l: "105 cm" }
                              ].map(row => (
                                <tr key={row.size} className={result.size === row.size ? "bg-amber-100/70 font-black text-amber-900" : ""}>
                                  <td className="p-2 font-bold">{row.size}</td>
                                  <td className="p-2">{row.w}</td>
                                  <td className="p-2">{row.waist}</td>
                                  <td className="p-2">{row.l}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    } else {
                      return (
                        <div className="overflow-hidden border border-gray-200 rounded-2xl shadow-2xs">
                          <table className="w-full text-center text-xs">
                            <thead className="bg-amber-50 text-amber-900 font-extrabold border-b">
                              <tr>
                                <th className="p-2">Size</th>
                                <th className="p-2">Chiều cao</th>
                                <th className="p-2">Cân nặng</th>
                                <th className="p-2">Vòng ngực</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                              {[
                                { size: "S", h: "1m50 - 1m62", w: "42 - 50 kg", c: "88 - 92 cm" },
                                { size: "M", h: "1m60 - 1m68", w: "51 - 60 kg", c: "93 - 97 cm" },
                                { size: "L", h: "1m66 - 1m74", w: "61 - 70 kg", c: "98 - 102 cm" },
                                { size: "XL", h: "1m72 - 1m80", w: "71 - 80 kg", c: "103 - 107 cm" },
                                { size: "2XL", h: "1m78 - 1m85", w: "81 - 90 kg", c: "108 - 112 cm" },
                                { size: "3XL", h: "> 1m85", w: "> 90 kg", c: "> 112 cm" }
                              ].map(row => (
                                <tr key={row.size} className={result.size === row.size ? "bg-amber-100/70 font-black text-amber-900" : ""}>
                                  <td className="p-2 font-bold">{row.size}</td>
                                  <td className="p-2">{row.h}</td>
                                  <td className="p-2">{row.w}</td>
                                  <td className="p-2">{row.c}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    }
                  })()}
                  <p className="text-[10px] text-gray-400 font-medium italic text-center">
                    * Thông số bảng size được đo thủ công chính xác theo chuẩn phom quần áo FoxStyle.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
