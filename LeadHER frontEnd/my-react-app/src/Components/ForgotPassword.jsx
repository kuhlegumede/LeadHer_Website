import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/ForgotPassword.css";

export default function ForgotPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(
                "https://localhost:7033/api/Auth/forgot-password",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Password reset failed.");
            }

            setMessage(data.message);

            setTimeout(() => {
                navigate("/login", {
                    state: {
                        message: "Password reset successfully. Please login."
                    }
                });
            }, 2000);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="forgot-page">
            <div className="forgot-auth-card">

                <h2>Reset Password</h2>

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Reset Password"}
                    </button>

                </form>

            </div>
        </section>
    );
}