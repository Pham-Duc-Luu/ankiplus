import { ReviewCard } from "@/store/collectionSlice";
export function getSpaceBetweenStudyDate(quality: number, card: ReviewCard) {
  try {
    let interval = card.SRS.interval;
    let efactor = card.SRS.efactor;

    quality = Math.round(quality);
    // Ensure the quality is in the range of 1 to 5

    // 5 - Hoàn hảo
    // 4 - Trả lời chính xác nhưng còn phải đắn đo
    // 3 - Trả lời chính xác nhưng gặp nhiều khó khăn
    // 2 - Trả lời không chính xác, đáp án đúng dễ dàng nhớ ra
    // 1 - Trả lời sai, nhớ được đáp án
    // 0 - Hoàn toàn không nhớ

    if (quality < 1 || quality > 5) {
      throw new Error("Quality rating must be between 1 and 5.");
    }

    // Find the flashcard by ID

    // If flashcard not found, throw error
    if (!card) {
      throw new Error("Flashcard not found");
    }

    // Update the ease factor (SuperMemo SM2 formula)
    efactor = Number(
      (efactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))).toFixed(
        2
      )
    );

    // // Ensure the ease factor does not fall below the minimum
    // if (efactor < MIN_EFACTOR) {
    //   efactor = MIN_EFACTOR;
    // }

    // Update the interval based on the quality
    if (quality === 1) {
      interval = 0;
    } else {
      // If the quality is 3 or above, increase the interval based on the ease factor
      // if (card.SRS.interval === 1) {
      //     card.SRS.interval = 6; // First review after 1 day should be in 6 days
      // } else {

      if (interval === 0) {
        interval = 1;
      }
      interval = Number((interval * efactor).toFixed(2));
    }

    // Update the next review date by adding the interval to the current date

    // Save the updated flashcard with the new SRS values

    console.log(interval);

    return interval;
  } catch (error) {
    console.log(error);
  }
}
