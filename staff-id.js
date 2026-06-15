/* =====================================================================
   Turns a staff first name into a stable internal login id + email.
   Staff only ever type their first name; the email is used internally
   by Firebase Auth and never shown. Keep login names simple (letters
   and numbers). Duplicate names are blocked when adding staff.
   ===================================================================== */
var StaffId = {
  norm: function (name) {
    return String(name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  },
  email: function (name) {
    return StaffId.norm(name) + "@seared.staff";
  }
};
window.StaffId = StaffId;
