import React, { useEffect, useRef, useState } from "react";
import Styles from "./Scrollspy.module.scss";

interface ScrollSpyProps {
  targetIds: string[];
  titles: string[]; // New prop for titles
  position?: "horizontal" | "verticalDrawer" | "vertical";
  icons?: React.ReactNode[]; // New prop for icons
}

export const ScrollSpy: React.FC<ScrollSpyProps> = (props: any) => {
  const [activeId, setActiveId] = useState<string>(props.targetIds[0]);

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { threshold: 0.5 } // Adjust the threshold value as needed
    );

    props.targetIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [props.targetIds]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: "smooth",
      });
      setActiveId(id);
    }
  };

  const getScrollSpyItemClass = (id: string) => {
    let scrollSpyItemClass = "";
    if (props.position === "verticalDrawer") {
      scrollSpyItemClass =
        activeId === id
          ? `${Styles.ScrollSpyItemVerticalDrawer} ${Styles.active_verticalDrawer}`
          : `${Styles.ScrollSpyItemVerticalDrawer}`;
    } else if (props.position === "vertical") {
      scrollSpyItemClass =
        activeId === id
          ? `${Styles.ScrollSpyItemVertical} ${Styles.active_vertical}`
          : `${Styles.ScrollSpyItemVertical}`;
    } else {
      scrollSpyItemClass =
        activeId === id
          ? `${Styles.ScrollSpyItemHorizontal} ${Styles.active_horizontal}`
          : `${Styles.ScrollSpyItemHorizontal}`;
    }
    return scrollSpyItemClass;
  };

  let positionClass = "";

  switch (props.position) {
    case "verticalDrawer":
      positionClass = Styles.verticalDrawer;
      break;
    case "vertical":
      positionClass = Styles.vertical;
      break;
    case "horizontal":
      positionClass = Styles.horizontal;
      break;
    default:
      positionClass = "";
  }
  return (

    <div className={`${Styles.ScrollSpyContainer} ${positionClass}`}>
      {props.targetIds.map((id, index) => (
        <div
          key={id}
          className={getScrollSpyItemClass(id)}
          onClick={() => handleClick(id)}
        >
          {props.icons && props.icons[index]}{" "}
          {/* Render the icon based on the index */}
          <span>{props.titles[index]}</span>{" "}
          {/* Display the title based on the index */}
        </div>
      ))}
    </div>
  );
};