import { PortfolioItem } from "@/lib/types";

export const portfolio: PortfolioItem[] = [
  {
    id: "pf-1",
    name: "Château Montclair Grand Vin",
    region: "Bordeaux",
    vintage: 2012,
    bottles: 6,
    drink_window_start: 2020,
    drink_window_end: 2032,
    purchase_price_gbp: 420,
    indicative_value_gbp: 520
  },
  {
    id: "pf-2",
    name: "Domaine des Rives Côte de Nuits",
    region: "Burgundy",
    vintage: 2015,
    bottles: 3,
    drink_window_start: 2021,
    drink_window_end: 2034,
    purchase_price_gbp: 330,
    indicative_value_gbp: 410
  },
  {
    id: "pf-3",
    name: "Domaine Bellecombe Hermitage",
    region: "Rhône",
    vintage: 2016,
    bottles: 4,
    drink_window_start: 2022,
    drink_window_end: 2036,
    purchase_price_gbp: 360,
    indicative_value_gbp: 390
  },
  {
    id: "pf-4",
    name: "Quinta da Aurora Reserva",
    region: "Douro",
    vintage: 2018,
    bottles: 6,
    drink_window_start: 2021,
    drink_window_end: 2030,
    purchase_price_gbp: 210,
    indicative_value_gbp: 240
  }
];
