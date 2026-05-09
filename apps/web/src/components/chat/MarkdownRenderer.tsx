'use client';

import { useMemo } from 'react';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const html = useMemo(() => renderMarkdown(content), [content]);

  return (
    <div
      className="prose prose-invert prose-sm max-w-none
        prose-headings:text-jarbas-primary prose-headings:font-mono prose-headings:text-sm
        prose-strong:text-white prose-strong:font-semibold
        prose-code:text-jarbas-accent prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono
        prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/5 prose-pre:rounded-lg
        prose-a:text-jarbas-primary prose-a:no-underline hover:prose-a:underline
        prose-blockquote:border-jarbas-primary/30 prose-blockquote:bg-jarbas-primary/5 prose-blockquote:rounded-r-lg prose-blockquote:py-1
        prose-li:text-white/80 prose-li:marker:text-jarbas-primary/50
        prose-hr:border-white/10"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function renderMarkdown(text: string): string {
  let html = text;

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre><code class="language-${lang}">${escapeHtml(code.trim())}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>');

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr />');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

  // Line breaks (paragraphs)
  html = html.replace(/\n\n/g, '</p><p>');
  html = `<p>${html}</p>`;
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>(<h[1-3]>)/g, '$1');
  html = html.replace(/(<\/h[1-3]>)<\/p>/g, '$1');
  html = html.replace(/<p>(<pre>)/g, '$1');
  html = html.replace(/(<\/pre>)<\/p>/g, '$1');
  html = html.replace(/<p>(<ul>)/g, '$1');
  html = html.replace(/(<\/ul>)<\/p>/g, '$1');
  html = html.replace(/<p>(<blockquote>)/g, '$1');
  html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
  html = html.replace(/<p>(<hr \/>)/g, '$1');
  html = html.replace(/(<hr \/>)<\/p>/g, '$1');

  // Single line breaks within paragraphs
  html = html.replace(/\n/g, '<br />');

  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
