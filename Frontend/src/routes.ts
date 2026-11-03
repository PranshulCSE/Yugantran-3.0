export const ALL_NAV_ROUTES = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Timeline", path: "/timeline" },
  { name: "Events", path: "/events" },
  { name: "Awards", path: "/awards" },
  { name: "Team", path: "/team" },
];

export const POSTPONED_NAV_ROUTES = [
  { name: "Home", path: "/" },
  { name: "Team", path: "/team" },
];

// While postponed, default active routes are Home and Team
export const NAV_ROUTES = POSTPONED_NAV_ROUTES;
