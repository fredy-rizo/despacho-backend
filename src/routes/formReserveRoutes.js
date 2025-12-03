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

router.post("/list/reservation-true", Token, Paginate, list_reservation_true);

router.post("/list/reservation-false", Token, Paginate, list_reservation_false);

router.post("/list/reservation-all", Token, Paginate, list_reservation_alls);

router.post("/remove/reservation/:reservationId", Token, remove_reservation);

export default router;
