/* =====================================================================
   HARDWARE LAYER (printer + cash drawer)
   ---------------------------------------------------------------------
   For now this uses the browser's built-in print dialog.
   When the thermal printer + electric cash drawer arrive, ONLY THIS FILE
   needs to change - for example, to send the receipt + cash-drawer "kick"
   command to the RawBT print bridge on the Android tablet.
   The rest of the system already calls Hardware.printReceipt() and
   Hardware.openDrawer(), so wiring real hardware is a one-file change.
   ===================================================================== */
const Hardware = {
  // Print the receipt/report that is currently shown on screen.
  printReceipt: function () {
    window.print();
  },
  // Open the electric cash drawer. No-op until the printer + RawBT are wired.
  openDrawer: function () {
    // TODO (hardware phase): trigger the drawer via RawBT / ESC-POS kick.
    console.log("Hardware.openDrawer() called - will open the cash drawer once hardware is connected.");
  }
};
window.Hardware = Hardware;
