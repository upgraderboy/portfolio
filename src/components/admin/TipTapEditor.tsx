import React, { useRef, useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";

// Global image compression utility to prevent Firestore 1MB document size limit issues
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        const max_size = 800;
        if (width > height) {
          if (width > max_size) {
            height *= max_size / width;
            width = max_size;
          }
        } else {
          if (height > max_size) {
            width *= max_size / height;
            height = max_size;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export const TipTapEditor: React.FC<TipTapEditorProps> = ({ content, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashCoords, setSlashCoords] = useState({ top: 0, left: 0 });
  const [selectIndex, setSelectIndex] = useState(0);

  const [showBubble, setShowBubble] = useState(false);
  const [bubbleCoords, setBubbleCoords] = useState({ top: 0, left: 0 });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          style: "max-width: 100%; border-radius: 8px; margin: 12px 0; display: block;",
        },
      }),
      Placeholder.configure({
        placeholder: "Type '/' for blocks suggestion...",
      }),
    ],
    content: content,
    onUpdate: ({ editor: editorInstance }) => {
      onChange(editorInstance.getHTML());
      checkSlashCommand(editorInstance);
      checkSelection(editorInstance);
    },
    onSelectionUpdate: ({ editor: editorInstance }) => {
      checkSlashCommand(editorInstance);
      checkSelection(editorInstance);
    },
    editorProps: {
      handleDrop: (view, event, _slice, moved) => {
        if (!moved && event.dataTransfer?.files?.length) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            compressImage(file)
              .then((src) => {
                const node = view.state.schema.nodes.image.create({ src });
                const transaction = view.state.tr.replaceSelectionWith(node);
                view.dispatch(transaction);
              })
              .catch((err) => console.error("Drop image compression failed:", err));
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event, _slice) => {
        if (event.clipboardData?.files?.length) {
          const file = event.clipboardData.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            compressImage(file)
              .then((src) => {
                const node = view.state.schema.nodes.image.create({ src });
                const transaction = view.state.tr.replaceSelectionWith(node);
                view.dispatch(transaction);
              })
              .catch((err) => console.error("Paste image compression failed:", err));
            return true;
          }
        }
        return false;
      },
    },
  });

  // Sync initial content or changes from outside
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const checkSlashCommand = (editorInstance: any) => {
    if (!editorInstance) return;
    const { selection } = editorInstance.state;
    const { $from } = selection;
    const textBefore = $from.parent.textContent.substring(0, $from.parentOffset);

    if (textBefore === "/") {
      const coords = editorInstance.view.coordsAtPos(selection.from);
      const contentElement = document.querySelector(".tiptap__content");
      if (contentElement) {
        const rect = contentElement.getBoundingClientRect();
        setSlashCoords({
          top: coords.bottom - rect.top,
          left: coords.left - rect.left,
        });
      } else {
        setSlashCoords({
          top: coords.bottom,
          left: coords.left,
        });
      }
      setShowSlashMenu(true);
    } else {
      setShowSlashMenu(false);
    }
  };

  const checkSelection = (editorInstance: any) => {
    if (!editorInstance) return;
    const { selection } = editorInstance.state;
    const { from, to } = selection;

    if (from !== to) {
      const coords = editorInstance.view.coordsAtPos(from);
      const contentElement = document.querySelector(".tiptap__content");
      if (contentElement) {
        const rect = contentElement.getBoundingClientRect();
        setBubbleCoords({
          top: coords.top - rect.top - 45, 
          left: coords.left - rect.left,
        });
      } else {
        setBubbleCoords({
          top: coords.top - 45,
          left: coords.left,
        });
      }
      setShowBubble(true);
    } else {
      setShowBubble(false);
    }
  };

  const addImageLocal = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedSrc = await compressImage(file);
      editor?.chain().focus().setImage({ src: compressedSrc }).run();
    } catch (err) {
      console.error("Image compression failed, falling back to raw upload:", err);
      const reader = new FileReader();
      reader.onloadend = () => {
        const src = reader.result as string;
        editor?.chain().focus().setImage({ src }).run();
      };
      reader.readAsDataURL(file);
    }
    e.target.value = ""; 
  };

  const addImageExternal = () => {
    const url = prompt("Enter the image URL:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addVideoLocal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 150 * 1024) {
      alert("Local video file size is too large (maximum 150KB for single-document Firestore nesting). Please upload your video to YouTube/Google Drive and insert the link instead!");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const src = reader.result as string;
      const html = `<video src="${src}" controls style="max-width: 100%; border-radius: 8px; margin: 12px 0; display: block;"></video>`;
      editor?.chain().focus().insertContent(html).run();
    };
    reader.readAsDataURL(file);
    e.target.value = ""; 
  };

  const addVideoExternal = () => {
    const url = prompt("Enter video link (YouTube, MP4 URL, etc.):");
    if (!url || !editor) return;

    let html = "";
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("v=")) {
        videoId = url.split("v=")[1]?.split("&")[0];
      } else {
        videoId = url.split("/").pop() || "";
      }
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      html = `<iframe src="${embedUrl}" width="560" height="315" frameborder="0" allowfullscreen style="max-width: 100%; border-radius: 8px; margin: 12px 0; display: block;"></iframe>`;
    } else {
      html = `<video src="${url}" controls style="max-width: 100%; border-radius: 8px; margin: 12px 0; display: block;"></video>`;
    }
    editor.chain().focus().insertContent(html).run();
  };

  const addPdfLocal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 150 * 1024) {
      alert("Local PDF file size is too large (maximum 150KB for single-document Firestore nesting). Please upload your PDF file to Google Drive and insert the share link instead!");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const src = reader.result as string;
      const html = `<a href="${src}" target="_blank" rel="noopener noreferrer" download="${file.name}" style="display: inline-flex; align-items: center; column-gap: 8px; padding: 12px 18px; background-color: var(--body-color); border: 1px solid var(--border-color); border-radius: 8px; color: var(--green-color); font-weight: 500; text-decoration: none; margin: 12px 0; font-family: sans-serif;"><i class="uil uil-file-download-alt" style="font-size: 1.2rem; color: var(--green-color); margin-right: 4px;"></i> Download PDF: ${file.name}</a>`;
      editor?.chain().focus().insertContent(html).run();
    };
    reader.readAsDataURL(file);
    e.target.value = ""; 
  };

  const addPdfExternal = () => {
    const url = prompt("Enter PDF link:");
    if (url && editor) {
      const name = url.split("/").pop() || "Document.pdf";
      const html = `<a href="${url}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; column-gap: 8px; padding: 12px 18px; background-color: var(--body-color); border: 1px solid var(--border-color); border-radius: 8px; color: var(--green-color); font-weight: 500; text-decoration: none; margin: 12px 0; font-family: sans-serif;"><i class="uil uil-file-download-alt" style="font-size: 1.2rem; color: var(--green-color); margin-right: 4px;"></i> Download PDF: ${name}</a>`;
      editor.chain().focus().insertContent(html).run();
    }
  };

  const slashOptions = [
    { label: "Heading 1", icon: "uil-heading", action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run() },
    { label: "Heading 2", icon: "uil-heading", action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "Heading 3", icon: "uil-heading", action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run() },
    { label: "Bullet List", icon: "uil-list-ui-alt", action: () => editor?.chain().focus().toggleBulletList().run() },
    { label: "Numbered List", icon: "uil-list-ol", action: () => editor?.chain().focus().toggleOrderedList().run() },
    { label: "Image Block", icon: "uil-image", action: () => fileInputRef.current?.click() },
    { label: "Video Block", icon: "uil-video", action: () => videoInputRef.current?.click() },
    { label: "PDF Attachment", icon: "uil-file-alt", action: () => pdfInputRef.current?.click() },
    { label: "Code Block", icon: "uil-code-branch", action: () => editor?.chain().focus().toggleCodeBlock().run() },
  ];

  const executeCommand = (option: typeof slashOptions[0]) => {
    if (!editor) return;
    const { selection } = editor.state;
    editor.chain().focus().deleteRange({ from: selection.from - 1, to: selection.from }).run();
    option.action();
    setShowSlashMenu(false);
  };

  // Keyboard navigation inside Slash suggestions menu
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (_view: any, event: KeyboardEvent) => {
      if (showSlashMenu) {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          setSelectIndex((prev) => (prev + 1) % slashOptions.length);
          return true;
        }
        if (event.key === "ArrowUp") {
          event.preventDefault();
          setSelectIndex((prev) => (prev - 1 + slashOptions.length) % slashOptions.length);
          return true;
        }
        if (event.key === "Enter") {
          event.preventDefault();
          executeCommand(slashOptions[selectIndex]);
          return true;
        }
        if (event.key === "Escape") {
          event.preventDefault();
          setShowSlashMenu(false);
          return true;
        }
      }
      return false;
    };

    editor.setOptions({
      editorProps: {
        handleKeyDown,
      },
    });
  }, [editor, showSlashMenu, selectIndex]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setShowSlashMenu(false);
      setShowBubble(false);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  if (!editor) {
    return <div style={{ color: "var(--text-color-light)", padding: "1rem" }}>Loading rich blog editor...</div>;
  }

  return (
    <div className="tiptap__editor" style={{ border: "1px solid var(--border-color)", borderRadius: "0.75rem", overflow: "visible", display: "flex", flexDirection: "column", minHeight: "450px" }}>
      <input type="file" ref={fileInputRef} accept="image/*" style={{ display: "none" }} onChange={addImageLocal} />
      <input type="file" ref={videoInputRef} accept="video/*" style={{ display: "none" }} onChange={addVideoLocal} />
      <input type="file" ref={pdfInputRef} accept="application/pdf" style={{ display: "none" }} onChange={addPdfLocal} />

      {/* Toolbar */}
      <div className="tiptap__toolbar" style={{ padding: "0.5rem 1rem", borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", columnGap: "0.35rem", flexWrap: "wrap", rowGap: "0.35rem", backgroundColor: "rgba(11, 18, 36, 0.1)" }}>
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`tiptap__tool-btn ${editor.isActive("paragraph") ? "active" : ""}`}
        >
          Paragraph
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`tiptap__tool-btn ${editor.isActive("heading", { level: 1 }) ? "active" : ""}`}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`tiptap__tool-btn ${editor.isActive("heading", { level: 2 }) ? "active" : ""}`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`tiptap__tool-btn ${editor.isActive("heading", { level: 3 }) ? "active" : ""}`}
        >
          H3
        </button>

        <div className="tiptap__separator" style={{ width: "1px", height: "16px", backgroundColor: "var(--border-color)", margin: "0 0.25rem" }} />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`tiptap__tool-btn ${editor.isActive("bold") ? "active" : ""}`}
          style={{ fontWeight: "bold" }}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`tiptap__tool-btn ${editor.isActive("italic") ? "active" : ""}`}
          style={{ fontStyle: "italic" }}
        >
          I
        </button>

        <div className="tiptap__separator" style={{ width: "1px", height: "16px", backgroundColor: "var(--border-color)", margin: "0 0.25rem" }} />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`tiptap__tool-btn ${editor.isActive("bulletList") ? "active" : ""}`}
        >
          List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`tiptap__tool-btn ${editor.isActive("orderedList") ? "active" : ""}`}
        >
          Numbers
        </button>

        <div className="tiptap__separator" style={{ width: "1px", height: "16px", backgroundColor: "var(--border-color)", margin: "0 0.25rem" }} />

        <div className="tiptap__dropdown" style={{ position: "relative" }}>
          <button type="button" className="tiptap__tool-btn">
            <i className="uil uil-image"></i> +Image
          </button>
          <div className="tiptap__dropdown-content">
            <button type="button" onClick={() => fileInputRef.current?.click()}>Upload File</button>
            <button type="button" onClick={addImageExternal}>Web URL</button>
          </div>
        </div>

        <div className="tiptap__dropdown" style={{ position: "relative" }}>
          <button type="button" className="tiptap__tool-btn">
            <i className="uil uil-video"></i> +Video
          </button>
          <div className="tiptap__dropdown-content">
            <button type="button" onClick={() => videoInputRef.current?.click()}>Upload File</button>
            <button type="button" onClick={addVideoExternal}>Web URL / YouTube</button>
          </div>
        </div>

        <div className="tiptap__dropdown" style={{ position: "relative" }}>
          <button type="button" className="tiptap__tool-btn">
            <i className="uil uil-file-alt"></i> +PDF Document
          </button>
          <div className="tiptap__dropdown-content">
            <button type="button" onClick={() => pdfInputRef.current?.click()}>Upload PDF File</button>
            <button type="button" onClick={addPdfExternal}>Web PDF URL</button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="tiptap__content" style={{ flexGrow: 1, padding: "1.5rem", minHeight: "380px", backgroundColor: "var(--card-color)", outline: "none", color: "var(--title-color)", position: "relative", overflow: "visible" }}>
        <EditorContent editor={editor} />

        {/* Bubble Menu for text selection formatting */}
        {showBubble && (
          <div
            className="tiptap__bubble-menu"
            style={{
              position: "absolute",
              top: `${bubbleCoords.top}px`,
              left: `${bubbleCoords.left}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`tiptap__bubble-btn ${editor.isActive("bold") ? "active" : ""}`}
              title="Bold"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`tiptap__bubble-btn ${editor.isActive("italic") ? "active" : ""}`}
              title="Italic"
            >
              I
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`tiptap__bubble-btn ${editor.isActive("codeBlock") ? "active" : ""}`}
              title="Code Block"
            >
              Code
            </button>
          </div>
        )}

        {/* Slash Suggestions Menu */}
        {showSlashMenu && (
          <div
            className="tiptap__slash-menu"
            style={{
              position: "absolute",
              top: `${slashCoords.top + 10}px`, 
              left: `${slashCoords.left}px`,
            }}
            onClick={(e) => e.stopPropagation()} 
          >
            {slashOptions.map((opt, idx) => (
              <button
                key={opt.label}
                type="button"
                className={`tiptap__slash-item ${selectIndex === idx ? "selected" : ""}`}
                onClick={() => executeCommand(opt)}
              >
                <i className={`uil ${opt.icon}`}></i>
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
