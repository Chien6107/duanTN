# FoxStyle database

Chỉ chạy một file duy nhất:

`../../foxstyle_db.sql`

File chính bao gồm:

- tạo database và toàn bộ schema;
- khóa ngoại, unique constraint và index;
- dữ liệu mặc định;
- migration combo cũ;
- các bảng phục vụ toàn bộ module hiện có trên website.

File có thể chạy lại: phần tạo bảng, bổ sung cột, constraint, index và dữ liệu seed đều kiểm tra tồn tại trước khi thực hiện. Dữ liệu nghiệp vụ đang có không bị xóa.

Không dùng `db.sql` hoặc `docs/foxstyle_db.sql` để khởi tạo database mới vì đó là các bản tách cũ.
