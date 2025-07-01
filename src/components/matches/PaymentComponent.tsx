import {
  createPaymentIntent,
  getMatchPayments,
  Payment,
} from "@/api/match-communication";
import { CheckCircle, Clock, CreditCard, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { FiLoader } from "react-icons/fi";

interface PaymentComponentProps {
  matchId: string;
  isEmployer: boolean;
}

export function PaymentComponent({
  matchId,
  isEmployer,
}: PaymentComponentProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [newPayment, setNewPayment] = useState({
    amount: "",
    description: "",
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadPayments();
  }, [matchId]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const fetchedPayments = await getMatchPayments(matchId);
      setPayments(fetchedPayments);
    } catch (error) {
      console.error("Error loading payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayment.amount) return;

    try {
      setProcessing(true);

      // Create payment intent
      const { sessionUrl } = await createPaymentIntent(matchId);

      // Redirect to Stripe Checkout
      window.location.href = sessionUrl;
    } catch (error) {
      console.error("Error creating payment:", error);
      setProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: Payment["status"]) => {
    switch (status) {
      case "paid":
        return "text-green-600 bg-green-50 border-green-200";
      case "pending":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "failed":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
    }
  };

  const getStatusIcon = (status: Payment["status"]) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, payment) => sum + payment.price, 0);

  const pendingPayments = payments.filter((p) => p.status === "pending");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-2 text-muted-foreground">
          <FiLoader className="h-5 w-5 animate-spin" />
          Loading payments...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Payment Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalPaid)}
            </div>
            <div className="text-sm text-muted-foreground">Total Paid</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {pendingPayments.length}
            </div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {payments.filter((p) => p.status === "paid").length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
        </div>

        {isEmployer && (
          <div className="mt-6">
            <button
              onClick={() => setShowPaymentForm(true)}
              className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <CreditCard className="h-5 w-5 inline mr-2" />
              Make Payment
            </button>
          </div>
        )}
      </div>

      {/* Payment Form */}
      {showPaymentForm && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Make Payment
            </h3>
            <button
              onClick={() => setShowPaymentForm(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleCreatePayment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Amount ($) *
              </label>
              <input
                type="number"
                value={newPayment.amount}
                onChange={(e) =>
                  setNewPayment((prev) => ({ ...prev, amount: e.target.value }))
                }
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
                disabled={processing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <input
                type="text"
                value={newPayment.description}
                onChange={(e) =>
                  setNewPayment((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                placeholder="Payment for..."
                disabled={processing}
              />
            </div>

            {/* Mock Payment Method Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Payment Method
              </label>
              <div className="border border-border rounded-lg p-3 bg-muted/50">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-foreground">
                      •••• •••• •••• 4242
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Expires 12/25
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                This is a demo payment form. No actual payment will be
                processed.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPaymentForm(false)}
                className="px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-muted/10 transition-colors"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={processing}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {processing ? (
                  <div className="flex items-center gap-2">
                    <FiLoader className="h-4 w-4 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  "Pay Now"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payment History */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Payment History
        </h3>

        {payments.length === 0 ? (
          <div className="text-center py-8">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">
              No payments yet
            </h4>
            <p className="text-sm text-muted-foreground">
              {isEmployer
                ? "Payments you make will appear here."
                : "Payments from the employer will appear here."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment._id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {getStatusIcon(payment.status)}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {formatCurrency(payment.price)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(payment.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      payment.status
                    )}`}
                  >
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentComponent;
