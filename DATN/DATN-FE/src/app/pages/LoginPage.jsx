import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { Lock, User, Mail, Phone, ArrowLeft, CheckCircle2, ShieldCheck, Sparkles, Eye, EyeOff } from "lucide-react";
import { isStrongPassword, PASSWORD_MESSAGE } from "../utils/passwordPolicy";
import { isValidVietnamesePhone, PHONE_MESSAGE } from "../utils/phone";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, register, sendOtp, findAccount, sendForgotPasswordOtp, resetPassword, currentUser } = useApp();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);

  // Login / Register state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSentEmail, setOtpSentEmail] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const redirectAfterAuth = React.useRef("");

  // Messages
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect home
  React.useEffect(() => {
    if (currentUser) {
      if (redirectAfterAuth.current) {
        navigate(redirectAfterAuth.current);
        return;
      }
      if (currentUser.role === "admin" || currentUser.role === "staff") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [currentUser, navigate]);

  React.useEffect(() => {
    if (otpTimer <= 0) return undefined;
    const timer = window.setInterval(() => {
      setOtpTimer((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [otpTimer]);

  const handleSendOtp = async () => {
    const normalizedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setErrorMsg("Email không đúng định dạng.");
      return;
    }
    if (!isValidVietnamesePhone(phone)) {
      setErrorMsg(PHONE_MESSAGE);
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");
    setIsSendingOtp(true);
    try {
      const res = await sendOtp("email", normalizedEmail, phone.trim());
      if (res.status === "success" || res.success) {
        setOtp("");
        setOtpSentEmail(normalizedEmail);
        setOtpTimer(60);
        setSuccessMsg(`Mã OTP đã được gửi đến ${normalizedEmail}. Vui lòng kiểm tra cả thư rác.`);
      } else {
        setErrorMsg(res.message || "Không thể gửi mã OTP. Vui lòng thử lại.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Không thể gửi mã OTP. Vui lòng thử lại.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      if (isRegisterMode) {
        if (!username || !password || !fullName || !email || !phone || !otp) {
          setErrorMsg("Vui lòng điền đầy đủ thông tin bắt buộc.");
          setIsLoading(false);
          return;
        }
        if (!isValidVietnamesePhone(phone)) {
          setErrorMsg(PHONE_MESSAGE);
          setIsLoading(false);
          return;
        }
        if (!isStrongPassword(password)) {
          setErrorMsg(PASSWORD_MESSAGE);
          setIsLoading(false);
          return;
        }
        if (email.trim() !== otpSentEmail) {
          setErrorMsg("Email đã thay đổi hoặc chưa được gửi OTP. Vui lòng gửi lại mã.");
          setIsLoading(false);
          return;
        }
        if (!/^\d{6}$/.test(otp)) {
          setErrorMsg("Mã OTP phải gồm đúng 6 chữ số.");
          setIsLoading(false);
          return;
        }
        const res = await register(username, password, fullName, email.trim(), phone.trim(), otp);
        if (res.success) {
          setSuccessMsg("Đăng ký thành công! Đang mở trang cá nhân...");
          redirectAfterAuth.current = "/account";
          const loginRes = await login(username, password);
          if (loginRes.success) {
            navigate("/account");
          } else {
            redirectAfterAuth.current = "";
            setIsRegisterMode(false);
            setErrorMsg("Đăng ký thành công. Vui lòng đăng nhập để cập nhật trang cá nhân.");
          }
        } else {
          setErrorMsg(res.message || "Đăng ký thất bại!");
        }
      } else {
        if (!username || !password) {
          setErrorMsg("Vui lòng nhập tên đăng nhập và mật khẩu.");
          setIsLoading(false);
          return;
        }
        const res = await login(username, password);
        if (res.success) {
          setSuccessMsg("Đăng nhập thành công!");
          if (res.user?.role === "admin" || res.user?.role === "staff") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        } else {
          setErrorMsg(res.message || "Tên đăng nhập hoặc mật khẩu không đúng.");
        }
      }
    } catch (err) {
      setErrorMsg("Đã xảy ra lỗi. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-zinc-50">
      <div className="w-full max-w-md bg-white rounded-3xl border border-zinc-200 p-8 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-orange-600" />
            <span>FoxStyle Account</span>
          </div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
            {isRegisterMode ? "Tạo Tài Khoản Mới" : "Đăng Nhập"}
          </h1>
          <p className="text-xs text-zinc-500 font-medium">
            {isRegisterMode ? "Đăng ký thành viên để nhận ưu đãi mua sắm" : "Vui lòng đăng nhập để trải nghiệm đầy đủ tính năng"}
          </p>
        </div>

        {/* Error / Success Messages */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-700 text-center">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-700 text-center">
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <>
              <div>
                <label className="block text-xs font-extrabold text-zinc-700 mb-1">Họ và tên *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    required
                    className="w-full h-11 pl-10 pr-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold outline-none focus:border-orange-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-zinc-700 mb-1">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    required
                    className="w-full h-11 pl-10 pr-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold outline-none focus:border-orange-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-zinc-700 mb-1">Số điện thoại</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912345678"
                    className="w-full h-11 pl-10 pr-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold outline-none focus:border-orange-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp || otpTimer > 0}
                  className="w-full h-11 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-black rounded-xl transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingOtp
                    ? "Đang gửi mã..."
                    : otpTimer > 0
                      ? `Gửi lại OTP sau ${otpTimer}s`
                      : otpSentEmail
                        ? "Gửi lại mã OTP qua email"
                        : "Gửi mã OTP qua email"}
                </button>

                {otpSentEmail && (
                  <div>
                    <label className="block text-xs font-extrabold text-zinc-700 mb-1">
                      Mã OTP gửi về email *
                    </label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="Nhập mã OTP 6 chữ số"
                        required
                        maxLength={6}
                        className="w-full h-11 pl-10 pr-4 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-black tracking-[0.25em] outline-none focus:border-orange-500 focus:bg-white transition"
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-zinc-500">
                      Mã đã gửi đến <strong>{otpSentEmail}</strong>.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-extrabold text-zinc-700 mb-1">Tên đăng nhập *</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập..."
                required
                className="w-full h-11 pl-10 pr-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold outline-none focus:border-orange-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-zinc-700 mb-1">Mật khẩu *</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-11 pl-10 pr-11 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold outline-none focus:border-orange-500 focus:bg-white transition"
              />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-400 hover:text-zinc-800">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-zinc-950 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider rounded-xl transition shadow-md cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Đang xử lý..." : isRegisterMode ? "Đăng Ký Tài Khoản" : "Đăng Nhập"}
          </button>
        </form>

        {/* Toggle Login / Register */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className="text-xs font-bold text-zinc-600 hover:text-orange-600 underline cursor-pointer"
          >
            {isRegisterMode ? "Đã có tài khoản? Đăng nhập ngay" : "Chưa có tài khoản? Đăng ký ngay"}
          </button>
        </div>

        <div className="text-center pt-2">
          <Link to="/" className="inline-flex items-center gap-1 text-xs font-bold text-zinc-400 hover:text-zinc-700">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Quay về trang chủ</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
