import { Router } from "express";
import {
  accepted_reservation,
  create_form_reserve,
  list_reservation_alls,
  list_reservation_false,
  list_reservation_true,
  remove_reservation,
} from "../controllers/FormReserveController.js";
import { Token } from "../middleware/tools/segurity.js";
import { Paginate } from "../middleware/lib/Paginate.js";
const router = Router();

router.post("/create", create_form_reserve);

router.post("/accept/:reserveId/reserve", Token, accepted_reservation);

router.get(
  "/list/reservation-true/:pag?/:perpage?",
  Token,
  Paginate,
  list_reservation_true,
);

router.get(
  "/list/reservation-false/:pag?/:perpage?",
  Token,
  Paginate,
  list_reservation_false,
);

router.get(
  "/list/reservation-all/:pag?/:perpage?",
  Token,
  Paginate,
  list_reservation_alls,
);

router.delete("/remove/reservation/:reservationId", Token, remove_reservation);

export default router;
