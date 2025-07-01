import { getUser } from "@/helpers";
import {
  useCreatePriceOffer,
  useMatchOffers,
  useRespondToPriceOffer,
} from "@/hooks/useMatchCommunication";
import { Check, Clock, DollarSign, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FiLoader } from "react-icons/fi";

interface PriceNegotiationProps {
  matchId: string;
  isEmployer: boolean;
  initialBudget?: { min: number; max: number };
}

export function PriceNegotiation({
  matchId,
  isEmployer,
  initialBudget,
}: PriceNegotiationProps) {
  // React Query hooks
  const { offers, isLoading: loading, error } = useMatchOffers(matchId);
  const createOfferMutation = useCreatePriceOffer(matchId);
  const respondToOfferMutation = useRespondToPriceOffer(matchId);

  const [proposalPrice, setProposalPrice] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Get the latest negotiation/offer
  const negotiation =
    offers && offers.length > 0 ? offers[offers.length - 1] : null;

  useEffect(() => {
    const user = getUser();
    setCurrentUser(user);
  }, []);

  const createProposal = async () => {
    if (proposalPrice <= 0) return;

    try {
      await createOfferMutation.mutateAsync({
        amount: proposalPrice,
        description: `Price proposal: $${proposalPrice}`,
        currency: "USD",
      });
      setProposalPrice(0);
    } catch (error) {
      console.error("Error creating proposal:", error);
    }
  };

  const handleResponse = async (response: "accept" | "reject") => {
    if (!negotiation) return;

    try {
      await respondToOfferMutation.mutateAsync({
        offerId: negotiation._id,
        response,
      });
    } catch (error) {
      console.error("Error responding to offer:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="flex items-center gap-2 text-muted-foreground">
          <FiLoader className="h-5 w-5 animate-spin" />
          Loading negotiation...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <X className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">
            Failed to load offers
          </h3>
          <p className="text-sm text-muted-foreground">
            There was an error loading the price negotiation. Please try again.
          </p>
        </div>
      </div>
    );
  }

  // No negotiation exists yet
  if (!negotiation) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <DollarSign className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">
            Price Negotiation
          </h3>
          <p className="text-sm text-muted-foreground">
            Start the price negotiation by making an offer.
          </p>
        </div>

        {/* Initial Budget Display */}
        {initialBudget && (
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2">Project Budget</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>
                ${initialBudget.min.toLocaleString()} - $
                {initialBudget.max.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Price Proposal Form */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h4 className="font-semibold text-foreground mb-4">Make an Offer</h4>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Proposed Price (USD)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  type="number"
                  id="price"
                  value={proposalPrice || ""}
                  onChange={(e) => setProposalPrice(Number(e.target.value))}
                  placeholder="Enter amount"
                  className="w-full pl-9 pr-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <button
              onClick={createProposal}
              disabled={proposalPrice <= 0 || createOfferMutation.isPending}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {createOfferMutation.isPending ? (
                <FiLoader className="h-4 w-4 animate-spin" />
              ) : (
                <DollarSign className="h-4 w-4" />
              )}
              Send Proposal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Negotiation exists - show current status
  const isCurrentUserOffer = negotiation.offeredBy === currentUser?._id;
  const isAccepted = negotiation.status === "accepted";
  const isPending = negotiation.status === "pending";
  const isRejected = negotiation.status === "rejected";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div
          className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isAccepted
              ? "bg-green-100"
              : isPending
              ? "bg-yellow-100"
              : "bg-red-100"
          }`}
        >
          {isAccepted ? (
            <Check className="h-8 w-8 text-green-600" />
          ) : isPending ? (
            <Clock className="h-8 w-8 text-yellow-600" />
          ) : (
            <X className="h-8 w-8 text-red-600" />
          )}
        </div>
        <h3 className="font-semibold text-foreground mb-2">
          Price Negotiation
        </h3>
        <p className="text-sm text-muted-foreground">
          {isAccepted
            ? "Price has been agreed upon"
            : isPending
            ? "Waiting for response"
            : "Offer was rejected"}
        </p>
      </div>

      {/* Current Offer Display */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-foreground">Current Offer</h4>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              isAccepted
                ? "bg-green-100 text-green-800"
                : isPending
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {negotiation.status.charAt(0).toUpperCase() +
              negotiation.status.slice(1)}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold text-foreground">
              ${negotiation.amount.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="text-sm text-muted-foreground mb-4">
          {isCurrentUserOffer ? "You" : "They"} proposed this amount on{" "}
          {new Date(negotiation.createdAt).toLocaleDateString()}
        </div>

        {/* Action Buttons */}
        {isPending && !isCurrentUserOffer && (
          <div className="flex gap-3">
            <button
              onClick={() => handleResponse("accept")}
              disabled={respondToOfferMutation.isPending}
              className="flex-1 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {respondToOfferMutation.isPending ? (
                <FiLoader className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Accept
            </button>
            <button
              onClick={() => handleResponse("reject")}
              disabled={respondToOfferMutation.isPending}
              className="flex-1 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {respondToOfferMutation.isPending ? (
                <FiLoader className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
              Reject
            </button>
          </div>
        )}
      </div>

      {/* Make Counter Offer */}
      {(isRejected || (isPending && !isCurrentUserOffer)) && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h4 className="font-semibold text-foreground mb-4">
            Make Counter Offer
          </h4>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="counter-price"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Counter Offer (USD)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  type="number"
                  id="counter-price"
                  value={proposalPrice || ""}
                  onChange={(e) => setProposalPrice(Number(e.target.value))}
                  placeholder="Enter counter offer"
                  className="w-full pl-9 pr-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <button
              onClick={createProposal}
              disabled={proposalPrice <= 0 || createOfferMutation.isPending}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {createOfferMutation.isPending ? (
                <FiLoader className="h-4 w-4 animate-spin" />
              ) : (
                <DollarSign className="h-4 w-4" />
              )}
              Send Counter Offer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PriceNegotiation;
