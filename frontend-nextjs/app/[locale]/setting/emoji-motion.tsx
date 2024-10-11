import { getSvgFileNames } from "@/utils/readSvgFiles";

// Page Component (Server Component in App Router)
const EmojiMotionPage = () => {
  const svgFiles = getSvgFileNames(); // Server-side fetching

  return (
    <div>
      <h1>Emoji Motion SVGs</h1>
      <div className="grid grid-cols-3 gap-4">
        {svgFiles.map((fileName) => (
          <div key={fileName}>
            <img src={`/emoji-motion/${fileName}`} alt={fileName} />
            <p>{fileName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmojiMotionPage;
