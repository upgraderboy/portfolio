import React, { useState, useRef, useEffect } from "react";
import { usePortfolioData } from "../db/PortfolioContext";
import "./terminal.css";

interface HistoryItem {
  type: "input" | "output" | "error";
  text: string;
  isHtml?: boolean;
}

const Terminal: React.FC = () => {
  const { portfolioData } = usePortfolioData();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([
    { type: "output", text: "Welcome to Upgrader Shell v2.4.0 (Type 'help' for available commands)" },
    { type: "output", text: "System diagnostic: SECURE_ESTABLISHED // ACTIVE_FIREWALL: ON" }
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const newCmdHistory = [...cmdHistory, trimmed];
    setCmdHistory(newCmdHistory);
    setHistoryIdx(-1);

    const newHistory = [...history, { type: "input" as const, text: `guest@upgraderboy:~$ ${trimmed}` }];

    const parts = trimmed.split(" ");
    const primaryCmd = parts[0].toLowerCase();

    let outputText = "";
    let isError = false;
    let isHtml = false;

    switch (primaryCmd) {
      case "help":
        isHtml = true;
        outputText = `<div class="terminal__help-grid">
          <div class="terminal__help-cmd">whoami</div><div class="terminal__help-desc">Display hacker bio & summary</div>
          <div class="terminal__help-cmd">skills</div><div class="terminal__help-desc">List developer & auditor skills</div>
          <div class="terminal__help-cmd">projects</div><div class="terminal__help-desc">Show cases and repositories</div>
          <div class="terminal__help-cmd">neofetch</div><div class="terminal__help-desc">Display hacker system details</div>
          <div class="terminal__help-cmd">clear</div><div class="terminal__help-desc">Clear the screen console</div>
          <div class="terminal__help-cmd">secret</div><div class="terminal__help-desc">Decrypt hidden system node</div>
        </div>`;
        break;
      case "whoami":
        outputText = `Name: ${portfolioData.home.name || "Ankit Bhuria"}\nTitle: ${portfolioData.home.subtitle || "Software Developer"}\nBio: ${portfolioData.home.description || "Tech Enthusiast"}\nUptime Status: Online 24/7`;
        break;
      case "skills":
        isHtml = true;
        const frontendSkills = portfolioData.skills.frontend.map(s => s.name).join(", ");
        const backendSkills = portfolioData.skills.backend.map(s => s.name).join(", ");
        outputText = `<div><strong>[Frontend Technologies]</strong><br>${frontendSkills || "No frontend skills configured."}</div>
                      <div style="margin-top: 0.5rem"><strong>[Backend & DevOps]</strong><br>${backendSkills || "No backend skills configured."}</div>
                      <div style="margin-top: 0.5rem"><strong>[Security Toolkit]</strong><br>Metasploit, Nmap, Wireshark, Burp Suite, OWASP Zap, Ghidra</div>`;
        break;
      case "projects":
        isHtml = true;
        if (portfolioData.projects.length === 0) {
          outputText = "No active projects synced.";
        } else {
          const projList = portfolioData.projects.map(p => {
            return `• <span class="terminal__highlight">${p.title}</span> [${p.category}] ${p.demo ? `<a href="${p.demo}" target="_blank" class="terminal__link">Demo</a>` : ""}`;
          }).join("<br>");
          outputText = `<div><strong>[Active Target Projects]</strong><br>${projList}</div>`;
        }
        break;
      case "neofetch":
        isHtml = true;
        const resolution = `${window.screen.width}x${window.screen.height}`;
        const agent = navigator.userAgent.split(" ").slice(-2).join(" ");
        outputText = `<div class="terminal__neofetch">
          <pre class="terminal__ascii">
   ________   
  /  _____/   
 /   \\  ___   
 \\    \\_\\  \\  
  \\______  /  
         \\/   
          </pre>
          <div class="terminal__specs">
            <span class="terminal__highlight">guest@upgraderboy</span><br>
            ------------------<br>
            <strong>OS:</strong> Web Console v2.0<br>
            <strong>Host:</strong> Render Static Server<br>
            <strong>Uptime:</strong> ${(performance.now() / 60000).toFixed(1)} mins<br>
            <strong>Shell:</strong> upgrader-sh v2.4.0<br>
            <strong>Resolution:</strong> ${resolution}<br>
            <strong>Agent:</strong> ${agent}<br>
            <strong>Theme:</strong> Cyber Matrix Green
          </div>
        </div>`;
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      case "secret":
        isHtml = true;
        outputText = `<div class="terminal__secret-granted">
          <i class="uil uil-shield-check" style="font-size: 2.5rem; color: #00ff1e; display: block; margin-bottom: 0.25rem;"></i>
          <div>ACCESS GRANTED</div>
          <div class="terminal__fade" style="font-size: 0.8rem; margin-top: 0.25rem;">Decrypted: "Keep upgrading, stay secure."</div>
        </div>`;
        break;
      default:
        isError = true;
        outputText = `Command not found: '${primaryCmd}'. Type 'help' to view valid nodes.`;
    }

    setHistory([...newHistory, { type: isError ? "error" : "output", text: outputText, isHtml }]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIdx === -1 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInput(cmdHistory[nextIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cmdHistory.length === 0 || historyIdx === -1) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= cmdHistory.length) {
        setHistoryIdx(-1);
        setInput("");
      } else {
        setHistoryIdx(nextIdx);
        setInput(cmdHistory[nextIdx]);
      }
    }
  };

  return (
    <section className="terminal section" id="terminal" onClick={focusInput}>
      <h2 className="section__title">Security Console</h2>
      <span className="section__subtitle">Interact directly with my system node</span>

      <div className="terminal__window container">
        <div className="terminal__header">
          <div className="terminal__dots">
            <span className="terminal__dot terminal__dot--close"></span>
            <span className="terminal__dot terminal__dot--minimize"></span>
            <span className="terminal__dot terminal__dot--expand"></span>
          </div>
          <span className="terminal__title">guest@upgraderboy-shell:~</span>
          <i className="uil uil-terminal terminal__header-icon"></i>
        </div>

        <div className="terminal__body">
          {history.map((item, idx) => (
            <div key={idx} className={`terminal__line terminal__line--${item.type}`}>
              {item.isHtml ? (
                <div dangerouslySetInnerHTML={{ __html: item.text }} />
              ) : (
                <pre>{item.text}</pre>
              )}
            </div>
          ))}
          <div ref={terminalEndRef} />

          <div className="terminal__prompt-row">
            <span className="terminal__prompt">guest@upgraderboy:~$</span>
            <input
              ref={inputRef}
              type="text"
              className="terminal__input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              autoComplete="off"
              autoCapitalize="none"
              spellCheck="false"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Terminal;
