import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import Tooltip from "@mui/material/Tooltip";

type FavoriteEntry = {
  slug: string;
  title: string;
  thumbnail?: string;
  objectID?: string;
};

type FavoritesButtonProps = {
  slug: string;
  title: string; // <-- lowercase title (matches usage everywhere)
  thumbnail?: string;
  /** Optional: Algolia objectID for analytics */
  objectID?: string;
  /** Optional: notify parent/UI/analytics */
  onToggle?: (nextIsFavorite: boolean, payload: FavoriteEntry) => void;
  /** Optional: pass through className or size tweaks */
  className?: string;
  size?: "small" | "medium" | "large";
};

const STORAGE_KEY = "favorites";

function readFavorites(): FavoriteEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FavoriteEntry[]) : [];
  } catch {
    // if something is corrupted, reset gracefully
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

function writeFavorites(list: FavoriteEntry[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  // Broadcast an event (use CustomEvent with detail for convenience)
  const evt = new CustomEvent("favoritesUpdated", {
    detail: { count: list.length },
  });
  window.dispatchEvent(evt);
}

const FavoritesButton: React.FC<FavoritesButtonProps> = ({
  slug,
  title,
  thumbnail,
  objectID,
  onToggle,
  className,
  size = "small",
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => {
      const favorites = readFavorites();
      setIsFavorite(favorites.some((f) => f.slug === slug));
    };

    update();
    window.addEventListener("favoritesUpdated", update as EventListener);
    return () =>
      window.removeEventListener("favoritesUpdated", update as EventListener);
  }, [slug]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let favorites = readFavorites();
    let next = false;

    if (favorites.some((f) => f.slug === slug)) {
      favorites = favorites.filter((f) => f.slug !== slug);
      next = false;
    } else {
      const entry: FavoriteEntry = { slug, title, thumbnail, objectID };
      // de-dupe just in case
      favorites = [...favorites.filter((f) => f.slug !== slug), entry];
      next = true;
    }

    writeFavorites(favorites);
    setIsFavorite(next);

    onToggle?.(next, { slug, title, thumbnail, objectID });

    // Optional: GTM push
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: next ? "favorite_add" : "favorite_remove",
        favorite: { slug, title, objectID },
      });
    }
  };

  return (
    <Tooltip title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}>
      <IconButton
        color="primary"
        onClick={toggleFavorite}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={isFavorite}
        size={size}
        className={className}
      >
        {isFavorite ? (
          <FavoriteRoundedIcon color="error" />
        ) : (
          <FavoriteBorderRoundedIcon />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default FavoritesButton;
