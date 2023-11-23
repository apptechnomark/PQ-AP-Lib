import React, { useEffect, useState, ChangeEvent } from "react";
import styles from "./Rating.module.scss";
import { Heart, Star } from "./icons/icons";

interface RatingItem {
  value: string;
  isHalf: boolean;
}

interface Props {
  icon?: string;
  selected?: string;
  editable?: boolean;
  rateId: string;
  disabled?: boolean;
}

const ratings: RatingItem[] = [
  { value: "5", isHalf: false },
  { value: "4.5", isHalf: true },
  { value: "4", isHalf: false },
  { value: "3.5", isHalf: true },
  { value: "3", isHalf: false },
  { value: "2.5", isHalf: true },
  { value: "2", isHalf: false },
  { value: "1.5", isHalf: true },
  { value: "1", isHalf: false },
  { value: "0.5", isHalf: true },
  
];

const Rating: React.FC<Props> = ({
  icon,
  selected,
  editable = true,
  rateId,
  disabled,
}) => {
  const [rating, setRating] = useState("0");

  useEffect(() => {
    if (selected) {
      setRating(selected);
    }
  }, [selected]);

  const handleRatingChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (editable !== false) {
      setRating(event.target.value);
    }
  };

  return (
    <div className="flex">
      <div className="flex flex-row-reverse">
        {ratings.map((item, index) => (
          <React.Fragment key={index}>
            <input
              className={`${styles.comment_stars_input} ${
                item.isHalf ? styles.is_half : ""
              } ${
                icon === "heart" ? styles.comment_stars_input_heart : ""
              } hidden`}
              type="radio"
              name={`rating-${item.value}-${rateId}`}
              value={item.value}
              id={`rating-${item.value}-${rateId}`}
              checked={rating === item.value}
              onChange={handleRatingChange}
              disabled={!editable || disabled}
            />
            <label
              className={`${styles.comment_stars_view} ${
                item.isHalf ? styles.is_half : ""
              } ${icon === "heart" ? styles.comment_stars_view_heart : ""}`}
              htmlFor={`rating-${item.value}-${rateId}`}
            >
              <svg className="icon icon-star">
                {icon === "heart" ? <Heart /> : <Star />}
              </svg>
            </label>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export { Rating };