import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, ArrowLeft, Layers, Sparkles, FolderTree, BookOpen } from "lucide-react";
import { DataTable } from "../../components/DataTable";
import { Button } from "../../components/Button";
import { normalizeVietnameseData } from "../../utils/vietnameseText";
import { api } from "../../services/api";

const normalizeTopicName = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const isPublishedArticle = (article) => {
  const isPublished =
    article?.status === undefined ||
    article?.status === null ||
    article?.status === 1 ||
    article?.status === "1" ||
    article?.status === "published";
  if (!isPublished) return false;
  if (article?.pinned) return true;
  const publishedAt = new Date(article?.publishDate || article?.createdAt || 0).getTime();
  return Boolean(publishedAt) && Date.now() - publishedAt < 7 * 24 * 60 * 60 * 1000;
};

const CANONICAL_TOPICS = [
  { id: "topic-trends", name: "Xu hướng thời trang", slug: "xu-huong-thoi-trang", description: "Cập nhật màu sắc, kiểu dáng và xu hướng nổi bật theo mùa.", articleCount: 0, status: 1 },
  { id: "topic-styling", name: "Mẹo phối đồ & Mix Match", slug: "meo-phoi-do", description: "Hướng dẫn kết hợp trang phục và phụ kiện cho từng hoàn cảnh.", articleCount: 0, status: 1 },
  { id: "topic-care", name: "Bảo quản & Chăm sóc quần áo", slug: "cham-soc-san-pham", description: "Hướng dẫn giặt, phơi, cất giữ và kéo dài tuổi thọ sản phẩm.", articleCount: 0, status: 1 },
  { id: "topic-shopping", name: "Hướng dẫn mua sắm", slug: "huong-dan-mua-sam", description: "Tư vấn chọn size, chất liệu, kiểu dáng và đặt hàng trực tuyến.", articleCount: 0, status: 1 },
  { id: "topic-lookbook", name: "Bộ sưu tập & Lookbook", slug: "bo-suu-tap-lookbook", description: "Giới thiệu bộ sưu tập, câu chuyện thiết kế và gợi ý outfit hoàn chỉnh.", articleCount: 0, status: 1 },
  { id: "topic-news", name: "Tin tức & Khuyến mãi", slug: "tin-tuc-khuyen-mai", description: "Thông tin mới từ FoxStyle, chương trình ưu đãi và sự kiện nổi bật.", articleCount: 0, status: 1 }
];

export function AdminTopics() {
  const [topics, setTopics] = useState(() => {
    try {
      const saved = localStorage.getItem("foxstyle_admin_topics");
      return saved ? normalizeVietnameseData(JSON.parse(saved)) : [
        { id: 1, name: "Xu hướng thời trang", slug: "xu-huong-thoi-trang", description: "Cập nhật các mẫu mốt thời trang mới nhất mùa vụ.", articleCount: 12, status: 1 },
        { id: 2, name: "Mẹo phối đồ & Mix Match", slug: "meo-phoi-do", description: "Bí quyết kết hợp trang phục cực chuẩn cho nam và nữ.", articleCount: 8, status: 1 },
        { id: 3, name: "Bảo quản & Chăm sóc quần áo", slug: "bao-quan-quan-ao", description: "Hướng dẫn giặt ủi và bảo quản trang phục luôn mới.", articleCount: 5, status: 1 },
        { id: 4, name: "Bộ sưu tập mới (Lookbook)", slug: "bo-suu-tap-moi", description: "Hình ảnh và câu chuyện đằng sau các bộ sưu tập.", articleCount: 15, status: 1 }
      ];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    api.adminData.list("topics").then(async (response) => {
      if (response.data?.length) return setTopics(response.data);
      const seeded = [];
      for (const topic of topics) {
        const { id, ...payload } = topic;
        seeded.push((await api.adminData.create("topics", payload)).data);
      }
      setTopics(seeded);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    setTopics((current) => {
      const obsoleteSlugs = new Set(["bao-quan-quan-ao", "bo-suu-tap-moi", "tin-tuc-foxstyle"]);
      const extras = current.filter((topic) =>
        !obsoleteSlugs.has(topic.slug) && !CANONICAL_TOPICS.some((canonical) => canonical.slug === topic.slug)
      );
      return [...CANONICAL_TOPICS, ...extras];
    });
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [managedArticles, setManagedArticles] = useState(() => {
    try {
      const saved = localStorage.getItem("foxstyle_admin_articles");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? normalizeVietnameseData(parsed) : [];
    } catch (e) {
      return [];
    }
  });
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    status: 1
  });

  useEffect(() => {
    try {
      localStorage.setItem("foxstyle_admin_topics", JSON.stringify(topics));
      window.dispatchEvent(
        new CustomEvent("foxstyle-content-updated", { detail: { type: "topics" } })
      );
    } catch (e) {}
  }, [topics]);

  useEffect(() => {
    const syncManagedArticles = (event) => {
      if (event?.type === "storage" && event.key !== "foxstyle_admin_articles") return;
      if (
        event?.type === "foxstyle-content-updated" &&
        event.detail?.type !== "articles"
      ) {
        return;
      }

      try {
        const saved = localStorage.getItem("foxstyle_admin_articles");
        const parsed = saved ? JSON.parse(saved) : [];
        if (Array.isArray(parsed)) setManagedArticles(parsed);
      } catch (e) {}
    };

    window.addEventListener("storage", syncManagedArticles);
    window.addEventListener("foxstyle-content-updated", syncManagedArticles);
    return () => {
      window.removeEventListener("storage", syncManagedArticles);
      window.removeEventListener("foxstyle-content-updated", syncManagedArticles);
    };
  }, []);

  useEffect(() => {
    const usedTopicNames = Array.from(
      new Map(
        managedArticles
          .map((article) => String(article.topicName || "").trim())
          .filter(Boolean)
          .map((name) => [normalizeTopicName(name), name])
      ).values()
    );
    setTopics((currentTopics) => {
      const existingNames = new Set(
        currentTopics.map((topic) => normalizeTopicName(topic.name))
      );
      const missingNames = usedTopicNames.filter(
        (name) => !existingNames.has(normalizeTopicName(name))
      );
      if (!missingNames.length) return currentTopics;
      return [
        ...currentTopics,
        ...missingNames.map((name, index) => ({
          id: `auto-${Date.now()}-${index}`,
          name,
          slug: normalizeTopicName(name)
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/^-+|-+$/g, ""),
          description: `Chủ đề được đồng bộ tự động từ các bài viết thuộc nhóm ${name}.`,
          articleCount: 0,
          status: 1
        }))
      ];
    });
  }, [managedArticles]);

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/([^0-9a-z-\s])/g, "")
      .replace(/(\s+)/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (name) => {
    setFormData({
      ...formData,
      name,
      slug: slugify(name)
    });
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      status: 1
    });
    setShowModal(true);
  };

  const handleOpenEdit = (t) => {
    setEditingId(t.id);
    setFormData({
      name: t.name || "",
      slug: t.slug || slugify(t.name || ""),
      description: t.description || "",
      status: t.status !== undefined ? t.status : 1
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Vui lòng nhập tên chủ đề!");
      return;
    }

    if (editingId) {
      const previousTopic = topics.find((topic) => topic.id === editingId);
      const response = await api.adminData.update("topics", editingId, { ...previousTopic, ...formData });
      setTopics((prev) => prev.map((t) => (t.id === editingId ? response.data : t)));
      if (
        previousTopic &&
        normalizeTopicName(previousTopic.name) !== normalizeTopicName(formData.name)
      ) {
        const updatedArticles = managedArticles.map((article) =>
          normalizeTopicName(article.topicName) === normalizeTopicName(previousTopic.name)
            ? { ...article, topicName: formData.name }
            : article
        );
        setManagedArticles(updatedArticles);
        try {
          localStorage.setItem("foxstyle_admin_articles", JSON.stringify(updatedArticles));
          window.dispatchEvent(
            new CustomEvent("foxstyle-content-updated", { detail: { type: "articles" } })
          );
        } catch (e) {}
      }
      alert("Cập nhật chủ đề bài viết thành công!");
    } else {
      const response = await api.adminData.create("topics", { articleCount: 0, ...formData });
      setTopics((prev) => [response.data, ...prev]);
      alert("Thêm chủ đề bài viết mới thành công!");
    }
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    const topic = topics.find((item) => item.id === id);
    const articleCount = managedArticles.filter(
      (article) =>
        isPublishedArticle(article) &&
        normalizeTopicName(article.topicName) === normalizeTopicName(topic?.name)
    ).length;
    if (articleCount > 0) {
      alert(`Không thể xóa chủ đề đang có ${articleCount} bài viết. Hãy chuyển hoặc xóa các bài viết trước.`);
      return;
    }
    if (confirm("Bạn có chắc chắn muốn xóa chủ đề bài viết này?")) {
      await api.adminData.remove("topics", id);
      setTopics((prev) => prev.filter((t) => t.id !== id));
      alert("Đã xóa chủ đề bài viết thành công!");
    }
  };

  const handleToggleStatus = async (id) => {
    const topic = topics.find((item) => item.id === id);
    const response = await api.adminData.update("topics", id, { ...topic, status: topic.status === 1 ? 0 : 1 });
    setTopics((prev) => prev.map((t) => (t.id === id ? response.data : t)));
  };

  const topicsWithCounts = topics.map((topic) => ({
    ...topic,
    articleCount: managedArticles.filter(
      (article) =>
        isPublishedArticle(article) &&
        normalizeTopicName(article.topicName) === normalizeTopicName(topic.name)
    ).length
  }));

  const columns = [
    {
      header: "Mã ID",
      accessor: "id",
      render: (id) => (
        <span className="inline-flex items-center text-[11px] font-black text-purple-700 bg-purple-50 border border-purple-200/80 px-2.5 py-1 rounded-xl font-mono">
          #TOPIC-{id}
        </span>
      )
    },
    {
      header: "Tên chủ đề",
      accessor: "name",
      render: (name, topic) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-md shadow-purple-500/20 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-zinc-900 text-sm block">{topic.name}</span>
            <span className="text-[11px] font-mono text-zinc-400">Slug: /{topic.slug}</span>
          </div>
        </div>
      )
    },
    {
      header: "Mô tả ngắn",
      accessor: "description",
      render: (desc) => (
        <span className="text-xs text-zinc-600 font-medium line-clamp-2 max-w-sm">
          {desc || "Chưa có mô tả."}
        </span>
      )
    },
    {
      header: "Số bài viết",
      accessor: "articleCount",
      render: (count) => (
        <span className="inline-flex items-center gap-1 text-xs font-black text-zinc-700 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
          📝 {count || 0} bài viết
        </span>
      )
    },
    {
      header: "Trạng thái",
      accessor: "status",
      render: (status, topic) => (
        <button
          onClick={() => handleToggleStatus(topic.id)}
          className={`text-xs font-bold px-3 py-1 rounded-full border transition cursor-pointer ${
            status === 1
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              : "bg-zinc-100 text-zinc-500 border-zinc-200 hover:bg-zinc-200"
          }`}
        >
          {status === 1 ? "Hiển thị" : "Tạm ẩn"}
        </button>
      )
    },
    {
      header: "Thao tác",
      accessor: "id",
      align: "right",
      render: (id, topic) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenEdit(topic)}
            className="p-2 text-zinc-600 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-xl transition cursor-pointer"
            title="Sửa chủ đề"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(topic.id)}
            className="p-2 text-zinc-600 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-xl transition cursor-pointer"
            title="Xóa chủ đề"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  if (showModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="max-h-[92vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-3xl bg-zinc-100 p-4 shadow-2xl">
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="hidden"
            >
              <ArrowLeft className="h-4 w-4" /> Quay lại
            </button>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 block">
                {editingId ? "Cập nhật" : "Thêm mới"}
              </span>
              <h3 className="text-xl font-black text-zinc-900">
                {editingId ? "Chỉnh Sửa Chủ Đề Bài Viết" : "Tạo Chủ Đề Bài Viết Mới"}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-2xl transition border border-red-200 cursor-pointer"
          >
            <X className="h-4 w-4" /> Đóng
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-zinc-200/80 overflow-hidden max-w-xl mx-auto">
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30">
                <Layers className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-black text-lg text-white">
                  {editingId ? "Thông tin chủ đề" : "Nhập tên chủ đề bài viết mới"}
                </h4>
                <p className="text-xs text-purple-300 font-medium">Chủ đề giúp phân loại các bài viết tin tức thời trang.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">Tên chủ đề bài viết *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ví dụ: Xu hướng thời trang, Mẹo phối đồ..."
                className="w-full h-12 px-4 bg-zinc-50 border border-zinc-300 rounded-2xl text-xs font-bold text-zinc-900 focus:bg-white focus:outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">Đường dẫn Slug (Tự động)</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="xu-huong-thoi-trang"
                className="w-full h-12 px-4 bg-zinc-50 border border-zinc-300 rounded-2xl text-xs font-mono font-bold text-purple-700 focus:bg-white focus:outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">Mô tả tóm tắt</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập thông tin gợi ý vắn tắt về nội dung của chủ đề này..."
                rows={3}
                className="w-full p-4 bg-zinc-50 border border-zinc-300 rounded-2xl text-xs font-medium text-zinc-900 focus:bg-white focus:outline-none focus:border-purple-600 resize-none"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-800">
                <input
                  type="checkbox"
                  checked={formData.status === 1}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 1 : 0 })}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span>Cho phép hiển thị trên Blog / Trợ lý AI</span>
              </label>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 h-12 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs uppercase tracking-wider rounded-2xl transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="flex-1 h-12 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-lg shadow-purple-600/25 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>{editingId ? "Cập nhật chủ đề" : "Tạo chủ đề mới"}</span>
              </button>
            </div>
          </form>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 shrink-0">
            <Layers className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full">
                QUẢN LÝ NỘI DUNG
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-zinc-100 text-zinc-600 px-2.5 py-0.5 rounded-full">
                {topics.length} chủ đề
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-zinc-950 mt-1">
              Chủ Đề Bài Viết
            </h2>
            <p className="text-xs font-semibold text-zinc-500 mt-0.5">
              Phân loại danh mục các bài viết tin tức, bí quyết thời trang và Lookbook.
            </p>
          </div>
        </div>

        <Button icon={Plus} onClick={handleOpenAdd} className="shadow-lg shadow-purple-600/20 bg-purple-600 hover:bg-purple-700 text-white border-transparent">
          Thêm chủ đề
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm overflow-hidden p-1">
        <DataTable
          columns={columns}
          data={topicsWithCounts}
          searchPlaceholder="Tìm chủ đề bài viết theo tên, slug, mô tả..."
          searchKeys={["name", "slug", "description"]}
          itemsPerPage={8}
        />
      </div>
    </div>
  );
}
