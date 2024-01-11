export type MCDRLocale = "en_us" | "zh_cn";

// ----------------------------------------------------------------------------
// Raw types from plugin catalogue
// ----------------------------------------------------------------------------

export interface Everything extends Readonly<object> {
  authors: AuthorSummary;
  plugins: Record<string, AllOfAPlugin>;
}

export interface AllOfAPlugin extends Readonly<object> {
  meta: MetaInfo;
  plugin: PluginInfo;
  release: ReleaseSummary;
  repository: RepositoryInfo;
}

export interface PluginMetaSummary extends Readonly<object> {
  plugin_amount: number;
  plugins: Record<string, MetaInfo>;
  plugin_info: Record<string, PluginInfo>;
}

export interface AuthorSummary extends Readonly<object> {
  amount: number;
  authors: Record<string, Author>;
}

export interface Author extends Readonly<object> {
  name: string;
  link: string;
}

export interface MetaInfo extends Readonly<object> {
  schema_version: 4;
  id: string;
  name: string;
  version: string;
  link?: string;
  authors: string[];
  dependencies: Record<string, string>;
  requirements: string[];
  description: MetaInfoDescription;
}

export interface MetaInfoDescription extends Readonly<Partial<Record<MCDRLocale, string>>> {
  en_us: string;
  zh_cn?: string;
}

export interface PluginInfo extends Readonly<object> {
  schema_version: 1;
  id: string;
  authors: string[];
  repository: string;
  branch: string;
  related_path: string;
  labels: Label[];
  introduction: PluginInfoIntroduction;
}

export const LABELS = [
  "information",
  "tool",
  "management",
  "api",
] as const;

export type Label = typeof LABELS[number];

export interface PluginInfoIntroduction extends Readonly<Partial<Record<MCDRLocale, string>>> {
  en_us: string;
  zh_cn?: string;
}

export interface ReleaseSummary extends Readonly<object> {
  schema_version: 8;
  id: string;
  latest_version: string;
  releases: ReleaseInfo[];
}

export interface ReleaseInfo extends Readonly<object> {
  url: string;
  name: string;
  tag_name: string;
  created_at: string;
  description: string;
  prerelease: boolean;
  asset: AssetInfo;
  meta: MetaInfo;
}

export interface AssetInfo extends Readonly<object> {
  id: number;
  name: string;
  size: number;
  download_count: number;
  created_at: string;
  browser_download_url: string;
}

export interface RepositoryInfo extends Readonly<object> {
  url: string;
  name: string;
  full_name: string;
  description: string;
  archived: boolean;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
}

// ----------------------------------------------------------------------------
// Plugin Catalogue Summary, provided by nuxt server api
// ----------------------------------------------------------------------------

export type PluginDataSummary = Record<string, PluginData>;

export interface PluginData {
  meta: MetaInfo;
  release: ReleaseSummary;
  info: PluginInfo;
  authors: Author[];
}

export type PluginDataBriefSummary = Record<string, PluginDataBrief>;

export interface PluginDataBrief {
  id: string;
  name: string;
  version: string;
  authors: Author[];
  description: MetaInfoDescription;
  labels: Label[];
  updated_at: string | null;
  downloads: number;
  votes: number;
}

export type PluginVotesSummary = Record<string, number>;

// ----------------------------------------------------------------------------
// View types
// ----------------------------------------------------------------------------
export const SEARCH_SORTS = ["name", "author", "votes", "updated_at", "downloads"] as const;
export type SearchSorting = typeof SEARCH_SORTS[number];

export interface SearchSetting {
  name: string;
  author: string;
  labels: Label[];
  sorting: SearchSorting;
  reverse: boolean;
  selected: boolean;
}

export interface AdvancedReleaseInfo {
  version: string;
  downloads: number;
  createdAt: string;
  mainAsset: AssetInfo;
  release: ReleaseInfo;
}
