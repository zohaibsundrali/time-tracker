"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifyCode() {
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState("");
  const router = useRouter();

  // 🕒 Countdown timer
  useEffect(() => {
    if (timer === 0) return;
    const countdown = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  // ✅ Submit OTP
 const handleVerify = async () => {
  console.log("Sending OTP:", code);  // check if value exists
  try {
    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    console.log("Response status:", res.status);
    const data = await res.json();
    console.log("Response data:", data);

    if (data.success) {
      router.push("/signup/membership");
    } else {
      setError(data.message);
    }
  } catch (err) {
    console.error("Fetch error:", err);
    setError("Something went wrong");
  }
};


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-semibold mb-4">Verify Your Email</h1>
      <p className="text-gray-400 mb-2">Enter the 6-digit code sent to your email.</p>

      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        maxLength={6}
        className="text-center text-lg p-2 rounded bg-gray-800 border border-gray-600 w-40 mb-3"
      />

      <button
        onClick={handleVerify}
        disabled={timer === 0}
        className={`px-6 py-2 rounded ${
          timer === 0 ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        Verify
      </button>

      <p className="mt-3 text-sm text-gray-400">
        Code expires in: <span className="text-white">{timer}s</span>
      </p>

      {error && <p className="text-red-400 mt-2">{error}</p>}
    </div>
  );
}
