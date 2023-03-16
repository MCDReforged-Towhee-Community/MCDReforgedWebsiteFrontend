// ----------------------------------------------------------------------------
// Raw types from plugin catalogue
// ----------------------------------------------------------------------------

export interface PluginMetaSummary {
    plugin_amount: number;
    plugins: { [key: string]: MetaInfo };
}

export interface AuthorSummary {
    amount: number;
    authors: { [key: string]: Author };
}

export interface MetaInfo {
    schema_version: 2;
    id: string;
    name: string;
    version: string;
    repository: string;
    authors: string[];
    dependencies: { [key: string]: string };
    requirements: string[];
    description: MetaInfoDescription;
}

export interface MetaInfoDescription {
    en_us: string;
    zh_cn?: string;
}

export interface Author {
    name: string;
    link: string;
}

export interface ReleaseSummary {
    schema_version: 6;
    id: string;
    latest_version: string;
    releases: ReleaseInfo[];
}

export interface ReleaseInfo {
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

export interface AssetInfo {
    name: string;
    size: number;
    download_count: number;
    created_at: string;
    browser_download_url: string;
}

export interface FormattedPluginInfo {
    schema_version: 1;
    id: string;
    repository: string;
    branch: string;
    related_path: string;
    labels: string[];
    introduction: FormattedPluginInfoIntroduction;
}

export interface FormattedPluginInfoIntroduction {
    en_us: string;
    zh_cn?: string;
}

// ----------------------------------------------------------------------------
// Plugin Catalogue Summary, provided by nuxt server api
// ----------------------------------------------------------------------------

interface PluginDataSummary {
    [key: string]: PluginData;
}

interface PluginData {
    meta: MetaInfo;
    release: ReleaseSummary;
    info: FormattedPluginInfo;
    authors: Author[];
}

interface PluginDataBriefSummary {
    [key: string]: PluginDataBrief;
}

interface PluginDataBrief {
    id: string;
    name: string;
    version: string;
    authors: Author[];
    description: MetaInfoDescription;
    labels: string[];
    updated_at: string;
    downloads: number;
}
