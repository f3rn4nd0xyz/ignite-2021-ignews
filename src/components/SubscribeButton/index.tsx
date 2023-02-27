import { api } from "@/services/api";
import { getStripeJs } from "@/services/stripe-js";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data, status } = useSession();
  const router = useRouter();

  async function handleSubscribe() {
    if (status === "authenticated") {
      if (data.activeSubscription) {
        router.push("/");
        return;
      }

      try {
        const response = await api.post("subscribe");

        const { sessionId } = response.data;

        const stripe = await getStripeJs();

        await stripe?.redirectToCheckout({ sessionId });
      } catch (error: any) {
        alert(error.message);
      }
    } else {
      signIn("github");
      return;
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
