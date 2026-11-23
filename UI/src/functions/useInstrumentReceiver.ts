import { useEffect, useState } from "react";
import { signalRService } from "../functions/signalrService";
import { GenshinInstruments } from "../types/GenshinInstruments";

export const useInstrumentReceiver = (initInstrument: GenshinInstruments | null) => {
  const [instrument, setInstrument] = useState<GenshinInstruments | null>(
    initInstrument,
  );

  useEffect(() => {
    setInstrument(initInstrument);
  }, [initInstrument]);

  useEffect(() => {
    const handleInstrumentChanged = (value: GenshinInstruments | null) => {
      setInstrument(value);
    };

    signalRService.on("InstrumentChanged", handleInstrumentChanged);

    return () => {
      signalRService.off("InstrumentChanged", handleInstrumentChanged);
    };
  }, []);

  return instrument;
};
