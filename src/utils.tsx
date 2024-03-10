export const pad = (x: number, to = 2) => x.toString().padStart(to, "0");

export const parseTime = (time: number) => {
  const hours = Math.floor(time / 60 / 60);
  const minutes = Math.floor((time / 60) % 60);
  const seconds = Math.floor(time % 60);
  return (
    <>
      {hours > 0 && (
        <>
          <span>{pad(hours)}</span>:
        </>
      )}
      <span>{pad(minutes)}</span>:<span>{pad(seconds)}</span>
    </>
  );
};
