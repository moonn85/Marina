export const marinaRoomImages = [
  "/pictures/marina/deluxe-twin-room.jpg",
  "/pictures/marina/sea-view-executive-twin.jpg",
  "/pictures/marina/studio-with-balcony.jpg",
  "/pictures/marina/sea-view-executive-king.jpg",
  "/pictures/marina/deluxe-twin-city-view.jpg",
  "/pictures/marina/two-bedroom-suite.jpg",
  "/pictures/marina/studio-partial-ocean-view.jpg",
  "/pictures/marina/two-bedroom-apartment-sea-view.jpg",
] as const;

export const marinaHeroImages = [
  marinaRoomImages[3],
  marinaRoomImages[1],
  marinaRoomImages[5],
] as const;

export const marinaAboutRoomImages = [
  marinaRoomImages[2],
  marinaRoomImages[3],
  marinaRoomImages[1],
  marinaRoomImages[5],
  marinaRoomImages[7],
] as const;

export const marinaShowcaseImages = {
  hero: marinaRoomImages[3],
  intro: marinaRoomImages[6],
  banner: marinaRoomImages[5],
  location: marinaRoomImages[7],
} as const;
