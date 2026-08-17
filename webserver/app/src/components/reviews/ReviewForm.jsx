import { useState } from "react";
import { useReviewStore } from "../../stores/reviewStore";
import { useUserStore } from "../../stores/userStore";
import { Button } from "../UI/Button";

export function ReviewForm(id) {
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);

  const { createReview } = useReviewStore();
  const { user } = useUserStore();

  const handleSubmitReview = async () => {
    if (!user?.id) {
      console.log("Connectez vous pour laisser un avis");
      return;
    }
    if (!reviewText.trim()) {
      setError("Veuillez écrire un avis");
      return;
    }

    setLoading(true);
    
	try {
      await createReview(id, { reviews: reviewText, reviewRating: 3 });
      setReviewText("");
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="max-w-3xl">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-[var(--color-text)] mb-1">
            Laisser un avis
          </h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            Partage ton expérience avec ce vendeur
          </p>
        </div>

        <div className="space-y-3">
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={4}
            placeholder="Décris ton expérience avec ce vendeur..."
            className="w-full text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] leading-relaxed bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none transition-all"
          />

          <div className="flex justify-end pb-5">
            <Button
              variant="primary"
              onClick={handleSubmitReview}
              disabled={loading}
            >
              {loading ? "Envoi en cours..." : "Publier mon avis"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
