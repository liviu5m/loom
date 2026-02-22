const TextFormatter = ({ rawText }: { rawText: string }) => {
  const cleanLine = (text: string) => {
    return text.replace(/[#*+\-_>]+/g, "").trim();
  };

  const lines = rawText.split("\n");

  return (
    <div>
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} className="h-4" />;

        if (line.startsWith("##")) {
          return (
            <h2
              key={index}
              className="text-2xl font-bold text-loom-gold mt-8 mb-4 tracking-tight"
            >
              {cleanLine(line)}
            </h2>
          );
        }

        if (
          trimmed.startsWith("* **") ||
          (trimmed.startsWith("**") && trimmed.endsWith("**"))
        ) {
          return (
            <h3
              key={index}
              className="text-lg font-semibold text-loom-text mt-6 mb-2 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-sm bg-loom-gold rotate-45" />
              {cleanLine(line)}
            </h3>
          );
        }

        if (
          trimmed.startsWith("*") ||
          trimmed.startsWith("+") ||
          trimmed.startsWith("-")
        ) {
          return (
            <div
              key={index}
              className="ml-10 mb-2 flex items-start gap-3 group"
            >
              <span className="text-loom-gold/40 group-hover:text-loom-gold transition-colors">
                •
              </span>
              <span className="text-loom-text/80 leading-relaxed font-light">
                {cleanLine(line)}
              </span>
            </div>
          );
        }

        return (
          <p key={index} className="ml-4 text-loom-muted leading-7 mb-4">
            {cleanLine(line)}
          </p>
        );
      })}
    </div>
  );
};

export default TextFormatter;
