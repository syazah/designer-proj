import mongoose from "mongoose";

const CostSheetSchema = new mongoose.Schema({
  ms1: {
    type: mongoose.Schema.Types.Mixed,
  },
  pc1: {
    type: mongoose.Schema.Types.Mixed,
  },
  tsb: {
    type: mongoose.Schema.Types.Mixed,
  },
  pcb: {
    type: mongoose.Schema.Types.Mixed,
  },
  cse: {
    type: mongoose.Schema.Types.Mixed,
  },
  ps: {
    type: mongoose.Schema.Types.Mixed,
  },
  esp: {
    type: mongoose.Schema.Types.Mixed,
  },
  scr: {
    type: mongoose.Schema.Types.Mixed,
  },
});

export const Costsheet = mongoose.model("Costsheet", CostSheetSchema);
