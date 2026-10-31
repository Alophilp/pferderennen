import type { Ace } from "./types";

// All text shown to the user lives here.
// Texts that depend on a value (count, code, ...) are functions; everything else is a plain constant.

/* General */

export const APP_TITLE = "Pferderennen";
export const OWN_PLAYER_SUFFIX = " (du)";
export const CANCEL_BUTTON = "Abbrechen";
export const ROUND_LABEL = (round: number) => `Runde ${round}`;
export const SIPS_UNIT = (sips: number) =>
  sips === 1 ? "Schluck" : "Schlücke";
export const SIPS_LABEL = (sips: number) => `${sips} ${SIPS_UNIT(sips)}`;

// Display names of the aces; the keys are the values stored in the database
export const ACE_NAMES: Record<Ace, string> = {
  Herz: "Herz",
  Blatt: "Blatt",
  Eichel: "Eichel",
  Schelle: "Schelle",
};

/* Home */

export const HOME_SUBTITLE = "Sauf amoi Oarschloch!";
export const HOME_NAME_LABEL = "Dein Name";
export const HOME_NAME_PLACEHOLDER = "Name";
export const HOME_CREATE_ROOM_BUTTON = "Raum erstellen";
export const HOME_DIVIDER = "oder";
export const HOME_ROOM_CODE_LABEL = "Raumcode";
export const HOME_ROOM_CODE_PLACEHOLDER = "ABCD";
export const HOME_JOIN_ROOM_BUTTON = "Beitreten";

/* Errors shown when creating or joining a room */

export const ERROR_NO_FREE_ROOM_CODE =
  "Konnte keinen freien Raumcode finden. Bitte nochmal versuchen.";
export const ERROR_ROOM_LOCKED = "Der Raum ist bereits geschlossen.";
export const ERROR_ROOM_NOT_FOUND = (code: string) =>
  `Raum ${code} nicht gefunden.`;

/* Room view (loading and fallback states) */

export const ROOM_CONNECTING = "Verbinde…";
export const ROOM_NOT_A_MEMBER = "Du bist nicht in diesem Raum.";
export const ROOM_BACK_TO_HOME_BUTTON = "Zur Startseite";
export const ROOM_CLOSED_MESSAGE = (code: string) =>
  `Raum ${code} wurde geschlossen.`;

/* Room menu */

export const MENU_LABEL = "Menü";
export const MENU_CLOSE_ROOM = "Raum schließen";
export const MENU_LEAVE_ROOM = "Raum verlassen";
export const CLOSE_ROOM_DIALOG_TITLE = "Raum schließen?";
export const CLOSE_ROOM_DIALOG_MESSAGE = "Der Raum wird für alle beendet.";
export const CLOSE_ROOM_DIALOG_CONFIRM = "Schließen";
export const LEAVE_ROOM_DIALOG_TITLE = "Raum verlassen?";
export const LEAVE_ROOM_DIALOG_LOCKED_MESSAGE =
  "Der Raum ist geschlossen, du kannst danach nicht wieder beitreten.";
export const LEAVE_ROOM_DIALOG_CONFIRM = "Verlassen";

/* Lobby */

export const LOBBY_ROOM_CODE_LABEL = "Raumcode";
export const LOBBY_SHARE_BUTTON = "Link teilen";
export const LOBBY_LINK_COPIED = "Link kopiert ✓";
export const LOBBY_HOST_TAG = "Host";
export const LOBBY_START_WAGERING_BUTTON = "Spiel starten";
export const LOBBY_WAITING_FOR_HOST = "Warte, bis der Host das Spiel startet…";
export const LOBBY_SHARE_TEXT = (code: string) => `Raum ${code}`;
export const LOBBY_PLAYERS_HEADING = (count: number) => `Spieler (${count})`;

/* Wagering */

export const WAGERING_TITLE = "Einsatz";
export const WAGERING_MY_WAGER_LABEL = "Dein Einsatz";
export const WAGERING_ON = "auf"; // as in "3 Schlucke auf Herz"
export const WAGERING_EDIT_BUTTON = "Ändern";
export const WAGERING_SUBMIT_BUTTON = "Einsatz abgeben";
export const WAGERING_DECREASE_LABEL = "Weniger";
export const WAGERING_INCREASE_LABEL = "Mehr";
export const WAGERING_ALL_WAGERS_HEADING = "Alle Einsätze";
export const WAGERING_STATUS_WAITING = "wartet";
export const WAGERING_STATUS_EDITING = "ändert…";
export const WAGERING_STATUS_READY = "✓";
export const WAGERING_START_RACE_BUTTON = "Rennen starten";
export const WAGERING_HOST_WAITING_HINT =
  "Warte, bis alle ihren Einsatz abgegeben haben.";
export const WAGERING_GUEST_WAITING_HINT =
  "Der Host startet das Rennen, sobald alle Einsätze fertig sind.";

/* Racing */

export const RACING_NO_WAGER = "Kein Einsatz";
export const RACING_ALL_WAGERS_SUMMARY = "Alle Einsätze";
export const RACING_PICK_WINNER_HEADING = "Wer hat gewonnen?";
export const RACING_IN_PROGRESS = "Das Rennen läuft…";
export const RACING_CONFIRM_WINNER_SUFFIX = "hat gewonnen?"; // follows the ace, e.g. "Herz hat gewonnen?"
export const RACING_CONFIRM_WINNER_BUTTON = "Bestätigen";

/* Result */

export const RESULT_TITLE_FALLBACK = "Ergebnis";
export const RESULT_WINS_SUFFIX = "gewinnt!"; // follows the ace, e.g. "Herz gewinnt!"
export const RESULT_YOU_WON = "Du hast gewonnen!";
export const RESULT_DISTRIBUTE_LABEL = "Verteile";
export const RESULT_YOU_LOST = "Du hast verloren. Heul leise.";
export const RESULT_WINNERS_HEADING = "Gewinner";
export const RESULT_NEW_ROUND_BUTTON = "Neue Runde";
export const RESULT_WAITING_FOR_NEXT_ROUND = "Warte auf die nächste Runde…";
export const RESULT_PLAYER_DISTRIBUTES = (sips: number) =>
  `verteilt ${SIPS_LABEL(sips)}`;
export const RESULT_NO_WINNERS = (ace: Ace) =>
  `Niemand hat auf ${ACE_NAMES[ace]} gesetzt.`;
