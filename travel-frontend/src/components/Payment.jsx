import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import '../App.css';

function Payment() {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      setError("Please select a payment method");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`/payment/${packageId}/confirm`);
      setEmail(res.data?.split("to:")[1]?.trim() || "your email");
      setSuccess(true);
      setTimeout(() => {
        navigate("/packages");
      }, 3000);
    } catch (err) {
      setError(err.response?.data || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="payment-success">
        <h2>Booking Confirmed!</h2>
        <p>Your payment was successful.</p>
        <p>A confirmation email has been sent to <strong>{email}</strong>.</p>
        <p>Redirecting to packages page...</p>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <h2>Payment for Package #{packageId}</h2>
      
      <form onSubmit={handlePayment}>
        <div className="payment-methods">
          <label><input type="radio" name="paymentMethod" value="UPI" checked={paymentMethod === "UPI"} onChange={() => setPaymentMethod("UPI")} /> UPI Payment</label>
          <label><input type="radio" name="paymentMethod" value="Card" checked={paymentMethod === "Card"} onChange={() => setPaymentMethod("Card")} /> Credit/Debit Card</label>
          <label><input type="radio" name="paymentMethod" value="NetBanking" checked={paymentMethod === "NetBanking"} onChange={() => setPaymentMethod("NetBanking")} /> Net Banking</label>
          <label><input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} /> Cash on Arrival</label>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading || !paymentMethod}>
          {loading ? "Processing..." : "Confirm Payment"}
        </button>
      </form>

      <p className="note">
        Note: This is a demo payment system. No actual payment will be processed.
      </p>
    </div>
  );
}

export default Payment;
