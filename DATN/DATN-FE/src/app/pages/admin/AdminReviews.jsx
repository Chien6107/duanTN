import { useCallback, useEffect, useState } from "react";
import { Filter, RefreshCw, Star, Trash2 } from "lucide-react";
import { DataTable } from "../../components/DataTable";
import { api } from "../../services/api";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";

export function AdminReviews() {
  const { products = [] } = useApp();
  const [reviews, setReviews] = useState([]);
  const [filterRating, setFilterRating] = useState("all");
  const [loading, setLoading] = useState(true);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      let content = [];
      try {
        const response = await api.reviews.getAll();
        content = response?.data?.content || [];
      } catch (adminEndpointError) {
        // Tương thích với backend cũ chưa có GET /reviews/admin:
        // tải đánh giá thật của từng sản phẩm rồi gộp thành một danh sách.
        const responses = await Promise.allSettled(
          products.map((product) => api.reviews.getByProduct(product.id))
        );
        const hasSuccessfulProductRequest = responses.some(
          (result) => result.status === "fulfilled"
        );
        content = responses.flatMap((result) =>
          result.status === "fulfilled"
            ? result.value?.data?.content || []
            : []
        );
        if (!hasSuccessfulProductRequest && products.length > 0) throw adminEndpointError;
      }

      const uniqueContent = Array.from(
        new Map(
          content.map((review) => [String(review.reviewId || review.id), review])
        ).values()
      );
      setReviews(
        uniqueContent.map((review) => ({
          id: review.reviewId,
          productId: review.productId,
          productName: review.productName || `Sản phẩm #${review.productId}`,
          customerName: review.userFullName || `Khách hàng #${review.userId}`,
          rating: Number(review.rating || 0),
          comment: review.comment || "",
          date: review.reviewDate
            ? new Date(review.reviewDate).toLocaleString("vi-VN")
            : "Chưa xác định"
        }))
      );
    } catch (error) {
      setReviews([]);
      toast.error(error.message || "Không thể tải danh sách đánh giá");
    } finally {
      setLoading(false);
    }
  }, [products]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleDeleteReview = async (id) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa đánh giá #${id}?`)) return;
    try {
      await api.reviews.delete(id);
      setReviews((current) => current.filter((review) => review.id !== id));
      toast.success(`Đã xóa đánh giá #${id}`);
    } catch (error) {
      toast.error(error.message || "Không thể xóa đánh giá");
    }
  };

  const filteredReviews = reviews.filter(
    (review) => filterRating === "all" || review.rating === Number(filterRating)
  );

  const columns = [
    {
      header: "Sản phẩm & khách hàng",
      accessor: "productName",
      render: (productName, review) => (
        <div>
          <span className="block text-xs font-extrabold text-gray-900">{productName}</span>
          <span className="text-[10px] font-semibold text-gray-400">
            ID sản phẩm: {review.productId} • {review.customerName} • {review.date}
          </span>
        </div>
      )
    },
    {
      header: "Số sao",
      accessor: "rating",
      render: (rating) => (
        <div className="flex items-center gap-1">
          <span className="text-xs font-black text-yellow-600">{rating}</span>
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
        </div>
      )
    },
    {
      header: "Nội dung đánh giá",
      accessor: "comment",
      render: (comment) => (
        <p className="max-w-xl text-xs font-medium leading-relaxed text-gray-800">
          “{comment}”
        </p>
      )
    },
    {
      header: "Thao tác",
      accessor: "id",
      align: "right",
      render: (id) => (
        <button
          onClick={() => handleDeleteReview(id)}
          className="cursor-pointer rounded-xl border border-rose-200 bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100"
          title="Xóa đánh giá"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-gray-100 bg-white p-5 shadow-xs">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-black text-gray-900">
            <Star className="h-6 w-6 fill-current text-yellow-500" />
            Quản lý toàn bộ đánh giá sản phẩm
          </h1>
          <p className="mt-1 text-xs font-medium text-gray-500">
            Hiển thị đánh giá thật của tất cả sản phẩm trong hệ thống ({reviews.length} đánh giá).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadReviews}
            disabled={loading}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Làm mới
          </button>
          <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-2">
            <Filter className="ml-1 h-4 w-4 text-gray-400" />
            <select
              value={filterRating}
              onChange={(event) => setFilterRating(event.target.value)}
              className="cursor-pointer bg-transparent text-xs font-extrabold text-gray-800 outline-none"
            >
              <option value="all">Tất cả số sao</option>
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>{rating} sao</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-4 shadow-xs">
        {loading ? (
          <div className="py-16 text-center text-sm font-semibold text-gray-500">
            Đang tải toàn bộ đánh giá...
          </div>
        ) : (
          <DataTable
            data={filteredReviews}
            columns={columns}
            searchPlaceholder="Tìm theo sản phẩm, khách hàng hoặc nội dung..."
            searchKeys={["productName", "customerName", "comment"]}
            itemsPerPage={10}
          />
        )}
      </div>
    </div>
  );
}
