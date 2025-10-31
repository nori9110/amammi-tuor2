import { ExternalLink } from 'lucide-react';

interface WebsiteLinkProps {
  url?: string;
  name: string;
}

export function WebsiteLink({ url, name }: WebsiteLinkProps) {
  // URLがない場合はGoogle検索へのリンクを生成
  const href = url || `https://www.google.com/search?q=${encodeURIComponent(name)}`;
  const isExternal = !url;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-primary hover:text-primary-dark underline text-sm"
    >
      {name}
      <ExternalLink className="h-3 w-3" />
      {isExternal && <span className="text-xs text-pastel-800 dark:text-pastel-700">(Google検索)</span>}
    </a>
  );
}

