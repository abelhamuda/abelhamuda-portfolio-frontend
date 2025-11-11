import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

const RichTextEditor = ({ value, onChange, token }) => {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:8080/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      return `http://localhost:8080${data.url}`;
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed: ' + error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rich-text-editor" data-color-mode="dark">
      <MDEditor
        value={value}
        onChange={onChange}
        height={400}
        preview="edit"
        onPaste={async (event) => {
          // Handle image paste
          const items = event.clipboardData?.items;
          if (items) {
            for (let i = 0; i < items.length; i++) {
              if (items[i].type.startsWith('image/')) {
                event.preventDefault();
                const file = items[i].getAsFile();
                if (file) {
                  const imageUrl = await handleImageUpload(file);
                  if (imageUrl) {
                    const newValue = `${value}\n![pasted-image](${imageUrl})\n`;
                    onChange(newValue);
                  }
                }
              }
            }
          }
        }}
        onDrop={async (event) => {
          // Handle image drop
          event.preventDefault();
          const files = event.dataTransfer?.files;
          if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
              if (files[i].type.startsWith('image/')) {
                const imageUrl = await handleImageUpload(files[i]);
                if (imageUrl) {
                  const imageMarkdown = `![${files[i].name}](${imageUrl})`;
                  const newValue = value ? `${value}\n${imageMarkdown}\n` : `${imageMarkdown}\n`;
                  onChange(newValue);
                }
              }
            }
          }
        }}
      />
      
      {/* Manual Upload Section */}
      <div className="mt-4 p-4 border border-neon-green rounded-lg">
        <label className="font-mono text-neon-green text-sm mb-2 block">
          Manual Image Upload (Jika toolbar tidak work)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (file) {
              const imageUrl = await handleImageUpload(file);
              if (imageUrl) {
                const imageMarkdown = `![${file.name}](${imageUrl})`;
                const newValue = value ? `${value}\n${imageMarkdown}\n` : `${imageMarkdown}\n`;
                onChange(newValue);
              }
            }
            e.target.value = ''; // Reset input
          }}
          className="w-full text-gray-300 font-mono text-sm"
        />
        <div className="text-xs text-gray-400 mt-2">
          Max file size: 10MB | Formats: JPG, PNG, GIF, WebP
        </div>
      </div>

      {uploading && (
        <div className="mt-2 font-mono text-sm text-neon-green flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-neon-green mr-2"></div>
          Uploading image...
        </div>
      )}

      {/* COMPREHENSIVE MARKDOWN GUIDELINES */}
      <div className="mt-6 p-4 border border-gray-600 rounded-lg bg-gray-900/50">
        <h3 className="font-mono text-neon-green text-lg mb-3">📝 Markdown Guide</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {/* Text Formatting */}
          <div>
            <h4 className="font-mono text-neon-green mb-2">Text Formatting</h4>
            <div className="space-y-1 text-gray-300">
              <div><code>**Bold**</code> → <strong>Bold</strong></div>
              <div><code>*Italic*</code> → <em>Italic</em></div>
              <div><code>~~Strike~~</code> → <s>Strike</s></div>
              <div><code>`Code`</code> → <code className="bg-gray-800 px-1 rounded">Code</code></div>
            </div>
          </div>

          {/* Headers */}
          <div>
            <h4 className="font-mono text-neon-green mb-2">Headers</h4>
            <div className="space-y-1 text-gray-300">
              <div><code># H1</code> → Largest header</div>
              <div><code>## H2</code> → Medium header</div>
              <div><code>### H3</code> → Small header</div>
              <div><code>#### H4</code> → Smaller header</div>
            </div>
          </div>

          {/* Lists */}
          <div>
            <h4 className="font-mono text-neon-green mb-2">Lists</h4>
            <div className="space-y-1 text-gray-300">
              <div><code>- Item 1</code> → Bullet list</div>
              <div><code>* Item 2</code> → Bullet list</div>
              <div><code>1. First</code> → Numbered list</div>
              <div><code>2. Second</code> → Numbered list</div>
            </div>
          </div>

          {/* Code & Media */}
          <div>
            <h4 className="font-mono text-neon-green mb-2">Code & Media</h4>
            <div className="space-y-1 text-gray-300">
              <div><code>```code```</code> → Code block</div>
              <div><code>[Link](url)</code> → Hyperlink</div>
              <div><code>![Alt](url)</code> → Image</div>
              <div><code>&gt; Quote</code> → Blockquote</div>
            </div>
          </div>
        </div>

        {/* Advanced Tips */}
        <div className="mt-4 pt-3 border-t border-gray-600">
          <h4 className="font-mono text-neon-green mb-2">🚀 Advanced Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-300">
            <div className="space-y-1">
              <div><strong>Tables:</strong> Use | for columns</div>
              <div><strong>Syntax Highlighting:</strong> Add language after ```</div>
              <div><strong>Task Lists:</strong> Use - [ ] or - [x]</div>
            </div>
            <div className="space-y-1">
              <div><strong>Image Upload:</strong> Drag & drop or paste</div>
              <div><strong>Math Equations:</strong> Use $...$ for inline</div>
              <div><strong>Horizontal Rule:</strong> Use --- or ***</div>
            </div>
          </div>
        </div>

        {/* Quick Examples */}
        <div className="mt-3 p-3 bg-gray-800 rounded border border-gray-700">
          <h4 className="font-mono text-neon-green mb-2 text-sm">💡 Quick Example</h4>
          <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">
{`# My Article Title

This is a **bold statement** and this is *italic text*.

## Features List
- ✅ Easy to use
- ✅ Image support
- ✅ Code highlighting

\`\`\`javascript
// Code example
function hello() {
  console.log("Hello World!");
}
\`\`\`

> This is an important quote!`}
          </pre>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="mt-3 pt-3 border-t border-gray-600">
          <h4 className="font-mono text-neon-green mb-2 text-sm">⌨️ Keyboard Shortcuts</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
            <div><kbd className="bg-gray-700 px-1 rounded">Ctrl</kbd> + <kbd className="bg-gray-700 px-1 rounded">B</kbd> → Bold</div>
            <div><kbd className="bg-gray-700 px-1 rounded">Ctrl</kbd> + <kbd className="bg-gray-700 px-1 rounded">I</kbd> → Italic</div>
            <div><kbd className="bg-gray-700 px-1 rounded">Ctrl</kbd> + <kbd className="bg-gray-700 px-1 rounded">K</kbd> → Link</div>
            <div><kbd className="bg-gray-700 px-1 rounded">Ctrl</kbd> + <kbd className="bg-gray-700 px-1 rounded">Shift</kbd> + <kbd className="bg-gray-700 px-1 rounded">I</kbd> → Image</div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="mt-3 pt-3 border-t border-gray-600">
          <h4 className="font-mono text-neon-green mb-2 text-sm">🎯 Best Practices</h4>
          <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
            <li>Use headers to structure your content logically</li>
            <li>Add alt text to images for accessibility</li>
            <li>Use code blocks for technical content</li>
            <li>Keep paragraphs short and focused</li>
            <li>Preview your article before publishing</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;