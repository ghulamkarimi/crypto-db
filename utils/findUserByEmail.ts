import Users from "../models/userModel";

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Sucht ohne Beachtung der Groß-/Kleinschreibung (ältere Konten können gemischte Schreibweise haben)
export const findUserByEmail = (email: string) =>
  Users.findOne({ email: new RegExp(`^${escapeRegex(email)}$`, "i") });
