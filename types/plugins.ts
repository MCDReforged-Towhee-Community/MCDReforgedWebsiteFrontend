export type MCDRLocale = "en_us" | "zh_cn";

// ----------------------------------------------------------------------------
// Raw types from plugin catalogue
// ----------------------------------------------------------------------------

export interface PluginMetaSummary extends Readonly<object> {
    plugin_amount: number;
    plugins: Record<string, MetaInfo>;
}

export interface AuthorSummary extends Readonly<object> {
    amount: number;
    authors: Record<string, Author>;
}

export interface MetaInfo extends Readonly<object> {
    schema_version: 2;
    id: string;
    name: string;
    version: string;
    repository: string;
    authors: string[];
    dependencies: Record<string, string>;
    requirements: string[];
    description: MetaInfoDescription;
}

export interface MetaInfoDescription extends Readonly<Partial<Record<MCDRLocale, string>>> {
    en_us: string;
    zh_cn?: string;
}

export interface Author extends Readonly<object> {
    name: string;
    link: string;
}

export interface ReleaseSummary extends Readonly<object> {
    schema_version: 6;
    id: string;
    latest_version: string;
    releases: ReleaseInfo[];
}

export interface ReleaseInfo extends Readonly<object> {
    url: string;
    name: string;
    tag_name: string;
    created_at: string;
    assets: AssetInfo[];
    description: string;
    prerelease: boolean;
    parsed_version: string;
    meta: MetaInfo;
}

export interface AssetInfo extends Readonly<object> {
    name: string;
    size: number;
    download_count: number;
    created_at: string;
    browser_download_url: string;
}

export interface FormattedPluginInfo extends Readonly<object> {
    schema_version: 1;
    id: string;
    repository: string;
    branch: string;
    related_path: string;
    labels: Label[];
    introduction: FormattedPluginInfoIntroduction;
}

export const LABELS = [
    "information",
    "tool",
    "management",
    "api",
] as const;

export type Label = typeof LABELS[number];

export interface FormattedPluginInfoIntroduction extends Readonly<Partial<Record<MCDRLocale, string>>> {
    en_us: string;
    zh_cn?: string;
}

// ----------------------------------------------------------------------------
// Plugin Catalogue Summary, provided by nuxt server api
// ----------------------------------------------------------------------------

export type PluginDataSummary = Record<string, PluginData>;

export interface PluginData {
    meta: MetaInfo;
    release: ReleaseSummary;
    info: FormattedPluginInfo;
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

export type PluginVotesSummary = Record<string, PluginVotes>;

/**
 * LeanCloud plugin votes.
 * @interface PluginVotes
 * @property {string} objectId Object id.
 * @property {string} id Plugin id.
 * @property {number} vote Vote number.
 */
export interface PluginVotes {
    objectId: string;
    id: string;
    vote: number;
}

// ----------------------------------------------------------------------------
// View types
// ----------------------------------------------------------------------------
export interface AdvancedReleaseInfo {
    version: string;
    downloads: number;
    createdAt: string;
    mainAsset: AssetInfo;
    release: ReleaseInfo;
}
