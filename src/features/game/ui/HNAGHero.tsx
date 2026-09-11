/** UI-002: Premise headline - bold gaming title while preserving test text contract. */
export function HNAGHero() {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-sm">
        Không biết ăn/uống gì?
      </h1>
      <p className="max-w-md text-sm text-ink-500">
        Chọn nhanh vài tiêu chí, mở hộp hương vị, để #HNAG giải cứu bữa trưa của bạn!
      </p>
    </div>
  );
}
