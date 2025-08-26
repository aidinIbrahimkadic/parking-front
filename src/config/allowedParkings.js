// Dozvoljeni parkingi koje želiš javno prikazati.
// Ako znaš njihove ID-eve iz backenda, koristi ih (preporučeno).
export const allowedParkingIds = ["67", "66", "70"]; // Haustor, Dom, Musala

// Fallback po imenu (ako bi ID-evi ikad bili nepoznati).
export const allowedParkingNames = [
  "Parking_Haustor",
  "Parking_Dom",
  "Parking_Musala",
];

// Lijepi prikazni nazivi (opciono)
export const displayNameMap = {
  Parking_Haustor: "Haustor",
  Parking_Dom: "Dom",
  Parking_Musala: "Musala",
};
