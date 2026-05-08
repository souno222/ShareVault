import { useState, useEffect } from "react";

/**
 * WIRED-system TextViewer
 * - Paper white (#fff) surface, 1px black border
 * - Square corners
 * - Black ribbon section header (file name kicker)
 * - Body rendered in WiredMono — literal code/text content IS mono
 * - Hairline rule between header and body
 * - Line numbers in Caption Gray for readability
 */
const TextViewer = ({ blob, fileName }) => {
    const [textContent, setTextContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (blob) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setTextContent(e.target.result);
                setIsLoading(false);
            };
            reader.onerror = () => {
                setTextContent("Error reading file content.");
                setIsLoading(false);
            };
            reader.readAsText(blob);
        }
    }, [blob]);

    const lines = textContent.split("\n");

    return (
        /* DESIGN.md: 1px black border, paper white, 0 radius */
        <div
            style={{
                border: "1px solid #000000",
                borderRadius: 0,
                backgroundColor: "#ffffff",
                minHeight: "400px",
                overflow: "hidden",
            }}
        >
            {/* ── Black ribbon header ── */}
            {/* DESIGN.md: level-4 elevation = black ribbon */}
            <div
                style={{
                    backgroundColor: "#000000",
                    padding: "10px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                }}
            >
                <span
                    className="font-mono uppercase"
                    style={{
                        fontSize: "0.69rem",
                        fontWeight: 700,
                        letterSpacing: "1.2px",
                        color: "#757575",
                        lineHeight: 1,
                    }}
                >
                    Text
                </span>
                <span
                    className="font-ui"
                    style={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "#ffffff",
                        letterSpacing: "0.108px",
                        lineHeight: 1.23,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {fileName}
                </span>
                {!isLoading && (
                    <span
                        className="font-mono uppercase"
                        style={{
                            fontSize: "0.63rem",
                            fontWeight: 700,
                            letterSpacing: "1.2px",
                            color: "#757575",
                            lineHeight: 1,
                            marginLeft: "auto",
                            flexShrink: 0,
                        }}
                    >
                        {lines.length} lines
                    </span>
                )}
            </div>

            {/* ── Content body ── */}
            {isLoading ? (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "200px",
                    }}
                >
                    <p
                        className="font-mono uppercase"
                        style={{
                            fontSize: "0.69rem",
                            fontWeight: 700,
                            letterSpacing: "1.2px",
                            color: "#757575",
                            lineHeight: 1,
                        }}
                    >
                        Loading content…
                    </p>
                </div>
            ) : (
                /* DESIGN.md: WiredMono for text/code content — this IS mono territory */
                <div
                    style={{
                        overflowX: "auto",
                        overflowY: "auto",
                        maxHeight: "560px",
                    }}
                >
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            tableLayout: "fixed",
                        }}
                    >
                        <tbody>
                            {lines.map((line, i) => (
                                <tr
                                    key={i}
                                    style={{ borderBottom: "1px solid #f5f5f5" }}
                                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#f9f9f9"; }}
                                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; }}
                                >
                                    {/* Line number — Caption Gray */}
                                    <td
                                        className="font-mono"
                                        style={{
                                            width: "48px",
                                            padding: "3px 12px 3px 16px",
                                            fontSize: "0.69rem",
                                            letterSpacing: "0.4px",
                                            color: "#757575",
                                            textAlign: "right",
                                            userSelect: "none",
                                            borderRight: "1px solid #e2e8f0",
                                            verticalAlign: "top",
                                            lineHeight: 1.6,
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {i + 1}
                                    </td>
                                    {/* Line content */}
                                    <td
                                        className="font-mono"
                                        style={{
                                            padding: "3px 16px",
                                            fontSize: "0.8125rem",
                                            letterSpacing: "0.4px",
                                            color: "#1a1a1a",
                                            lineHeight: 1.6,
                                            whiteSpace: "pre",
                                            verticalAlign: "top",
                                        }}
                                    >
                                        {line || "\u00A0"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TextViewer;