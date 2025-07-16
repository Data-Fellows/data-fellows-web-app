import apiClient from "@/api";
import React, { useEffect, useState } from "react";

interface Payment {
  status: string;
  _id: string;
  price: number;
  stripeSession: {
    payment_status: "paid" | "unpaid";
    url?: string;
  };
  match: {
    _id: string;
    employer: {
      companyName: string;
      companyCity: string;
      companyCountry: string;
    };
    applicant: {
      firstName: string;
      lastName: string;
      email: string;
    };
    problem: {
      fellowField: string;
      description: string;
      payRange: {
        min: number;
        max: number;
      };
    };
  };
  createdAt: string;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StripeConnectButton() {
  const [loading, setLoading] = useState(false);

  const handleStripeOnboarding = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/profile/stripe-connect");
      const accountLink = response.data.accountLink as { url: string };
      window.open(accountLink.url, "_blank");
    } catch (err) {
      alert("Could not connect to Stripe.");
    }
    setLoading(false);
  };

  return (
    <button
      className="rounded-md border border-primary px-4 py-2 text-primary transition-colors hover:bg-primary hover:text-white"
      onClick={handleStripeOnboarding}
      disabled={loading}
    >
      {loading ? "Connecting..." : "Stripe connect"}
    </button>
  );
}

const UserPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/payment/get-payments")
      .then((response) => {
        setPayments(response.data.payments || []);
      })
      .catch(() => {
        setPayments([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalPayment = payments.reduce(
    (acc, payment) => acc + (payment?.price || 0),
    0
  );
  const pendingPayment = payments.reduce(
    (acc, payment) =>
      payment?.stripeSession?.payment_status === "unpaid"
        ? acc + (payment?.price || 0)
        : acc,
    0
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Payments Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            View and manage your payments
          </p>
        </div>
        <StripeConnectButton />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <div className="rounded-xl border border-border bg-card p-5 shadow-lg">
          <h3 className="mb-2 text-base sm:text-lg font-semibold text-foreground">
            Total Payment
          </h3>
          <p className="text-3xl sm:text-4xl font-bold text-primary">
            ${totalPayment?.toLocaleString() || 0}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-lg">
          <h3 className="mb-2 text-base sm:text-lg font-semibold text-foreground">
            Payment In Progress
          </h3>
          <p className="text-3xl sm:text-4xl font-bold text-primary">
            ${pendingPayment?.toLocaleString() || 0}
          </p>
        </div>
      </div>

      {/* Payments List - Mobile Cards */}
      <div className="block sm:hidden space-y-4">
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">
            Loading payments...
          </div>
        ) : payments.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No payments found.
          </div>
        ) : (
          payments.map((payment) => (
            <div
              key={payment._id}
              className="rounded-xl border border-border bg-card p-4 shadow-lg flex flex-col gap-2"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-primary text-lg">
                  ${payment.price?.toLocaleString() || "0"}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    payment.stripeSession.payment_status === "paid"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}
                >
                  {payment.status.charAt(0).toUpperCase() +
                    payment.status.slice(1)}
                </span>
              </div>
              <div className="text-sm text-foreground font-medium">
                {payment.match.employer.companyName || "N/A"}
              </div>
              <div className="text-xs text-muted-foreground">
                {payment.match.problem.fellowField || "N/A"}
              </div>
              <div className="text-xs text-muted-foreground">
                {payment.createdAt ? formatDate(payment.createdAt) : "N/A"}
              </div>
              <a
                href={`/user/payments/${payment._id}`}
                className="mt-2 rounded-md border border-primary px-4 py-2 text-primary transition-colors hover:bg-primary hover:text-white text-center block"
              >
                View Details
              </a>
            </div>
          ))
        )}
      </div>

      {/* Payments Table - Desktop */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-border shadow-lg bg-card">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-6 bg-muted/70 text-foreground font-semibold text-sm">
            <div className="py-3 px-2">Company</div>
            <div className="py-3 px-2">Project</div>
            <div className="py-3 px-2">Amount</div>
            <div className="py-3 px-2">Status</div>
            <div className="py-3 px-2">Date</div>
            <div className="py-3 px-2">Actions</div>
          </div>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground col-span-6">
              Loading payments...
            </div>
          ) : payments.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground col-span-6">
              No payments found.
            </div>
          ) : (
            payments.map((payment, index) => (
              <div
                key={payment._id}
                className={`grid grid-cols-6 items-center transition-colors text-sm ${
                  index % 2 === 0 ? "bg-card" : "bg-muted/20"
                } hover:bg-muted/50`}
              >
                <div className="py-3 px-2 text-foreground">
                  {payment.match.employer.companyName || "N/A"}
                </div>
                <div className="py-3 px-2 text-foreground">
                  {payment.match.problem.fellowField || "N/A"}
                </div>
                <div className="py-3 px-2 text-foreground">
                  ${payment.price?.toLocaleString() || "0"}
                </div>
                <div className="py-3 px-2">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      payment.stripeSession.payment_status === "paid"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
                  >
                    {payment.status.charAt(0).toUpperCase() +
                      payment.status.slice(1)}
                  </span>
                </div>
                <div className="py-3 px-2 text-foreground">
                  {payment.createdAt ? formatDate(payment.createdAt) : "N/A"}
                </div>
                <div className="py-3 px-2">
                  <a
                    href={`/user/payments/${payment._id}`}
                    className="rounded-md border border-primary px-4 py-2 text-primary transition-colors hover:bg-primary hover:text-white min-w-[100px] text-center block"
                  >
                    View Details
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPaymentsPage;
