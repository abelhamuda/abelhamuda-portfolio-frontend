import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const MarkdownRenderer = ({ content }) => {
  const components = {
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      if (!inline && language) {
        return (
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={language}
            PreTag="div"
            className="rounded-lg my-4"
            showLineNumbers
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        );
      } else if (inline) {
        return (
          <code className="px-2 py-1 bg-gray-800 text-neon-green rounded text-sm font-mono" {...props}>
            {children}
          </code>
        );
      } else {
        return (
          <code className="block p-4 bg-gray-800 text-gray-300 rounded-lg my-4 font-mono text-sm overflow-x-auto" {...props}>
            {children}
          </code>
        );
      }
    },
    pre: ({ children }) => <>{children}</>,
    h1: ({ children }) => <h1 className="font-mono text-3xl text-neon-green mt-8 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="font-mono text-2xl text-neon-green mt-6 mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="font-mono text-xl text-neon-green mt-4 mb-2">{children}</h3>,
    h4: ({ children }) => <h4 className="font-mono text-lg text-neon-green mt-3 mb-2">{children}</h4>,
    p: ({ children }) => <p className="text-gray-300 leading-relaxed mb-4">{children}</p>,
    ul: ({ children }) => <ul className="text-gray-300 mb-4 list-disc list-inside space-y-1">{children}</ul>,
    ol: ({ children }) => <ol className="text-gray-300 mb-4 list-decimal list-inside space-y-1">{children}</ol>,
    li: ({ children }) => <li className="text-gray-300">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-neon-green pl-4 py-2 my-4 bg-gray-800/50 italic text-gray-300">
        {children}
      </blockquote>
    ),
    a: ({ href, children }) => (
      <a 
        href={href} 
        className="text-neon-green hover:underline"
        target="_blank" 
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    img: ({ src, alt }) => (
      <div className="my-6">
        <img 
          src={src} 
          alt={alt} 
          className="max-w-full h-auto rounded-lg mx-auto border border-gray-700"
          loading="lazy"
        />
        {alt && <div className="text-center text-gray-400 text-sm mt-2">{alt}</div>}
      </div>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full border border-gray-700">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border border-gray-600 px-4 py-2 bg-gray-800 text-neon-green font-mono text-sm">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-gray-600 px-4 py-2 text-gray-300 text-sm">
        {children}
      </td>
    ),
  };

  return (
    <div className="markdown-content prose prose-invert max-w-none">
      <ReactMarkdown
        components={components}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;