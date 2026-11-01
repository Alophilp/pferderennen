import type { Ace, AceDisplay, Deck, JoinRequestStatus, OnOff } from "./types";

// All text shown to the user lives here.
// Texts that depend on a value (count, code, ...) are functions; everything else is a plain constant.

/* General */

export const APP_TITLE = "Pferderennen";
export const OWN_PLAYER_SUFFIX = " (du)";
export const CANCEL_BUTTON = "Abbrechen";
export const CLOSE_BUTTON = "Schließen";
export const ROUND_LABEL = (round: number, code: string) =>
  `Runde ${round} · Raum ${code}`;
export const SIPS_UNIT = (sips: number) =>
  sips === 1 ? "Schluck" : "Schlücke";
export const SIPS_LABEL = (sips: number) => `${sips} ${SIPS_UNIT(sips)}`;

// Display names of the aces per deck; the inner keys are the values stored in the database
export const ACE_NAMES: Record<Deck, Record<Ace, string>> = {
  bavarian: {
    Herz: "Herz",
    Blatt: "Blatt",
    Eichel: "Eichel",
    Schelle: "Schelle",
  },
  french: {
    Herz: "Herz",
    Blatt: "Pik",
    Eichel: "Kreuz",
    Schelle: "Karo",
  },
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
export const ERROR_ROOM_NOT_FOUND = (code: string) =>
  `Raum ${code} nicht gefunden.`;
export const ERROR_NAME_TAKEN = (name: string) =>
  `Der Name „${name}“ ist in diesem Raum schon vergeben.`;

/* Room view (loading and fallback states) */

export const ROOM_CONNECTING = "Verbinde…";
export const ROOM_NOT_A_MEMBER = "Du bist nicht in diesem Raum.";
export const ROOM_BACK_TO_HOME_BUTTON = "Zur Startseite";
export const ROOM_CLOSED_MESSAGE = (code: string) =>
  `Raum ${code} wurde geschlossen.`;

/* Join requests (joining a locked room; the host answers them while wagering) */

export const JOIN_REQUEST_WAITING = "Warte, bis der Host dich reinlässt…";
export const JOIN_REQUEST_DENIED = "Der Host hat dich nicht reingelassen.";
export const JOIN_REQUEST_ROOM_LABEL = (code: string) => `Raum ${code}`;
export const JOIN_REQUEST_PROMPT_TITLE = (name: string) =>
  `${name} möchte beitreten`;
export const JOIN_REQUEST_PROMPT_MORE = (count: number) =>
  count === 1 ? "1 weitere Anfrage" : `${count} weitere Anfragen`;
export const JOIN_REQUEST_DENY_BUTTON = "Ablehnen";
export const JOIN_REQUEST_ACCEPT_BUTTON = "Reinlassen";

/* Join request list (host, opened from the room menu) */

export const JOIN_REQUEST_LIST_TITLE = "Beitrittsanfragen";
export const JOIN_REQUEST_LIST_EMPTY = "Noch keine Anfragen.";
export const JOIN_REQUEST_LIST_BLOCK_BUTTON = "Blockieren";
export const JOIN_REQUEST_LIST_UNBLOCK_BUTTON = "Entsperren";
// Status shown next to each guest; the keys are the values stored in the database
export const JOIN_REQUEST_STATUS_NAMES: Record<JoinRequestStatus, string> = {
  pending: "wartet",
  denied: "abgelehnt",
  cancelled: "abgebrochen",
  blocked: "blockiert",
};

/* Player management (host, opened from the room menu) */

export const PLAYER_MANAGEMENT_TITLE = "Spieler";
export const PLAYER_MANAGEMENT_EMPTY = "Noch keine Gäste im Raum.";
export const PLAYER_MANAGEMENT_KICK_BUTTON = "Entfernen";
export const PLAYER_MANAGEMENT_BLOCK_BUTTON = "Blockieren";
export const KICK_PLAYER_DIALOG_TITLE = (name: string) => `${name} entfernen?`;
export const KICK_PLAYER_DIALOG_MESSAGE =
  "Der Einsatz wird gelöscht. Danach kann erneut angefragt werden, um beizutreten.";
export const KICK_PLAYER_DIALOG_CONFIRM = "Entfernen";
export const BLOCK_PLAYER_DIALOG_TITLE = (name: string) =>
  `${name} entfernen und blockieren?`;
export const BLOCK_PLAYER_DIALOG_MESSAGE =
  "Der Einsatz wird gelöscht und weitere Beitrittsanfragen werden ignoriert. Entsperren geht unter Beitrittsanfragen.";
export const BLOCK_PLAYER_DIALOG_CONFIRM = "Blockieren";

/* Room menu */

export const MENU_LABEL = "Menü";
export const MENU_CLOSE_ROOM = "Raum schließen";
export const MENU_LEAVE_ROOM = "Raum verlassen";
export const MENU_JOIN_REQUESTS = "Beitrittsanfragen";
export const MENU_MANAGE_PLAYERS = "Spieler verwalten";
export const CLOSE_ROOM_DIALOG_TITLE = "Raum schließen?";
export const CLOSE_ROOM_DIALOG_MESSAGE = "Der Raum wird für alle beendet.";
export const CLOSE_ROOM_DIALOG_CONFIRM = "Schließen";
export const LEAVE_ROOM_DIALOG_TITLE = "Raum verlassen?";
export const LEAVE_ROOM_DIALOG_LOCKED_MESSAGE =
  "Der Raum ist geschlossen. Um wieder beizutreten, muss dich der Host reinlassen.";
export const LEAVE_ROOM_DIALOG_CONFIRM = "Verlassen";

/* Settings (host, in the lobby) */

export const SETTINGS_BUTTON_LABEL = "Einstellungen";
export const SETTINGS_TITLE = "Einstellungen";
export const SETTINGS_RESET_BUTTON = "Zurücksetzen";
export const SETTINGS_DECK_LABEL = "Kartenblatt";
export const DECK_NAMES: Record<Deck, string> = {
  bavarian: "Bayerisch",
  french: "Französisch",
};
export const SETTINGS_ACE_DISPLAY_LABEL = "Asse anzeigen als";
export const ACE_DISPLAY_NAMES: Record<AceDisplay, string> = {
  icon: "Symbol",
  iconAndName: "Symbol & Name",
};
export const SETTINGS_DISTRIBUTE_SIPS_LABEL = "Schlücke in der App verteilen";
export const ON_OFF_NAMES: Record<OnOff, string> = {
  off: "Aus",
  on: "An",
};

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
export const WAGERING_SIPS_INPUT_LABEL = "Anzahl Schlücke";
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
export const RESULT_NO_WINNERS = (aceName: string) =>
  `Niemand hat auf ${aceName} gesetzt.`;

// Only used when sips are handed out in the app (setting "Schlücke in der App verteilen")
export const RESULT_TAP_TO_DISTRIBUTE = "Tippe hier, um zu verteilen";
export const RESULT_DISTRIBUTED = "Verteilt ✓";
export const RESULT_PLAYER_MUST_DISTRIBUTE = (sips: number) =>
  `darf ${SIPS_LABEL(sips)} verteilen`;
export const RESULT_PLAYER_HAS_DISTRIBUTED = (sips: number) =>
  `hat ${SIPS_LABEL(sips)} verteilt ✓`;
export const RESULT_RECEIVED_HEADING = "Du bekommst:";
export const RESULT_RECEIVED_FROM = (sips: number, name: string) =>
  `${SIPS_LABEL(sips)} von ${name}`;
export const RESULT_RECEIVED_FROM_YOURSELF = "dir selbst"; // as in "2 Schlücke von dir selbst"
export const RESULT_RECEIVED_FROM_UNKNOWN = "jemandem"; // giver has left the room
export const RESULT_RECEIVED_TOTAL = (sips: number) =>
  `Insgesamt ${SIPS_LABEL(sips)}`;
export const RESULT_NEW_ROUND_DIALOG_TITLE = "Noch nicht alle haben verteilt";
export const RESULT_NEW_ROUND_DIALOG_MESSAGE = (names: string) =>
  `Noch offen: ${names}. Trotzdem eine neue Runde starten?`;
export const RESULT_NEW_ROUND_DIALOG_CONFIRM = "Neue Runde";

/* Losing streaks */

// Badge next to a player's name on the wagering and racing screens, shown from the first loss in a row
export const STREAK_BADGE = (streak: number) => `💀${streak}`;
export const STREAK_BADGE_LABEL = (streak: number) =>
  streak === 1 ? "1 Runde verloren" : `${streak} Runden in Folge verloren`;

// Messages on the result screen after EXACTLY this many rounds lost in a row (the key).
// Add, remove or change entries freely; both lists are independent of each other.

// Only shown on the losing player's own phone
export const STREAK_PRIVATE_MESSAGES: Partial<Record<number, string>> = {
  3: "Das war jetzt das 3. mal in Folge verloren...",
  5: "5 Niederlagen am Stück. Hast du mal versucht besser zu spielen?",
  8: "8 in Folge. Ab dem Punkt ist es nur noch traurig...",
  12: "Bro? Alles gut?",
};

// Shown on every phone; gets the losing player's name
export const STREAK_GLOBAL_MESSAGES: Partial<
  Record<number, (name: string) => string>
> = {
  5: (name) => `${name} hat 5 Runden in Folge verloren!`,
  7: (name) => `${name} hat 7 Runden in Folge verloren!`,
  10: (name) => `${name} hat 10 Runden in Folge verloren!`,
};

/* Distributing sips (winner, opened from the win card) */

export const DISTRIBUTE_TITLE = "Schlücke verteilen";
export const DISTRIBUTE_REMAINING = (sips: number) =>
  sips === 0 ? "Alle verteilt ✓" : `Noch ${SIPS_LABEL(sips)} zu verteilen`;
export const DISTRIBUTE_RANDOM_BUTTON = "Zufall";
export const DISTRIBUTE_RESET_BUTTON = "Zurücksetzen";
export const DISTRIBUTE_CONFIRM_BUTTON = "Bestätigen";
export const DISTRIBUTE_DECREASE_LABEL = (name: string) =>
  `Weniger für ${name}`;
export const DISTRIBUTE_INCREASE_LABEL = (name: string) => `Mehr für ${name}`;
export const DISTRIBUTE_ALL_LABEL = (name: string) => `Alle übrigen an ${name}`; // the "++" button
export const DISTRIBUTE_AMOUNT_LABEL = (name: string) => `Schlücke für ${name}`;
