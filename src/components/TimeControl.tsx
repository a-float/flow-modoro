import React from "react";
import { AppOptions, Stretch } from "../App";
import useTimer from "../hooks/useTimer";
import useStopwatch from "../hooks/useStopwatch";
import { Button } from "semantic-ui-react";
import TimeDisplay from "./TimeDisplay";

type TimeControlProps = {
  mode: "focus" | "break";
  canStart: boolean;
  options: AppOptions;
  setMode: (mode: "focus" | "break") => void;
  onFocusEnd: (
    item: Pick<Stretch, "focusBeginTime" | "focusDuration">
  ) => void;
  onBreakEnd: (item: Pick<Stretch, "breakDelay" | "breakEndTime">) => void;
};

const TimeControl: React.FC<TimeControlProps> = (props: TimeControlProps) => {
  const startTime = React.useRef<Date>(new Date());
  const stopwatch = useStopwatch();
  const timer = useTimer();
  const time =
    props.mode === "break"
      ? timer.timeLeft - timer.overdue
      : stopwatch.elapsedTime;

  const handleBreakOver = () => {
    timer.stop();
    props.setMode("focus");
    props.onBreakEnd({ breakEndTime: Date.now(), breakDelay: timer.overdue });
  };

  return (
    <>
      <TimeDisplay time={time} />
      {props.mode === "break" ? (
        <Button onClick={handleBreakOver}>
          {timer.overdue ? "End break" : "Skip"}
        </Button>
      ) : !props.canStart ? null : stopwatch.isRunning ? (
        <Button
          onClick={() => {
            const endTime = new Date();
            const focusDuration =
              endTime.getTime() - startTime.current.getTime();
            console.log(focusDuration);
            stopwatch.reset();
            props.setMode("break");
            timer.reset(Math.round(focusDuration / props.options.breakDivisor));
            props.onFocusEnd({
              focusBeginTime: startTime.current.getTime(),
              focusDuration,
            });
          }}
        >
          Stop
        </Button>
      ) : (
        <Button
          onClick={() => {
            stopwatch.start();
            startTime.current = new Date();
          }}
        >
          Start
        </Button>
      )}
    </>
  );
};

export default TimeControl;
