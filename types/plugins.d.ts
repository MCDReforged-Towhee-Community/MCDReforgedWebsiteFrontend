export interface PluginMeta {
    schema_version: 1;
    id: string;
    name: string;
    version: string;
    repository: string;
    branch: string;
    related_path: string;
    labels: string[];
    authors: string[];
    dependencies: { [key: string]: string };
    requirements: string[];
    description: PluginMetaDescription;
}

export interface PluginMetaDescription {
    en_us?: string;
    zh_cn?: string;
}
