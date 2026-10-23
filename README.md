# Hexo Highlight Shiki

Use [shiki](https://github.com/shikijs/shiki) as code block highlighter instead of builtin highlight.js or prism.js.

## Installation

Install this package with your favorite package manager.

```sh
# pnpm
pnpm add hexo-highlight-shiki

# npm
npm add hexo-highlight-shiki

# yarn
yarn add hexo-highlight-shiki

# bun
bun add hexo-highlight-shiki
```

## Hexo Configuration

In hexo configuraion file `_config.yml`, you should find a `syntax_highlighter` field, set it to `shiki`.

```yaml
syntax_highlighter: "shiki"
```

Also, set `highlight` and `prismjs` to `false` to disable them.

```yaml
highlight: false
prismjs: false
```

## Shiki Configuration

### Simple Configuration

Add a `shiki` field in hexo configuration file `_config.yml`, and set the `theme` field to the theme you want to use.

```yaml
shiki:
  theme: "github-light"
```

### Dark Mode

Shiki supports dark mode now.

```yaml
shiki:
  themes:
    dark: "github-dark"
    light: "github-light"
```

For more configuration options, see [Custom Dark Mode](#custom-dark-mode) and [Custom Theme](#custom-theme).

## Advanced Configuration

### Custom Language

Shiki supports [custom languages](https://shiki.style/guide/load-lang). You can add a `languages` field in shiki configs, and set the `name` and `path` fields.

```yaml
shiki:
  languages:
    - name: "custom"
      path: "path/to/custom.tmLanguage.json"
```

If your site only needs to highlight your custom language, you can set `loadAllLanguages` to `false` to disable loading all languages. See [Load languages on demand](#load-languages-on-demand) for more details.

```yaml
shiki:
  loadAllLanguages: false
```

### Load languages on demand

Due to the restriction of hexo, this plugin uses [shiki highlighter instance](https://shiki.style/guide/install#highlighter-usage) to highlight code synchronously.

Shiki highlighter instance only loads the languages you need, so you can add a `loadLanguages` field in shiki configs, and set the languages you want to load.

By default, this plugin will load all languages, which is pretty slow. You can list languages you need in `language` field and set `loadLanguages` to `false` to disable it.

```yaml
shiki:
  languages:
    - javascript
    - html
    - css
  loadLanguages: false
```

### Custom Dark Mode

By default, this plugin will use query selector to change the theme based on the system dark mode. You can set `autoInjectCSS` to `class` (default is `query`) to use class selector instead.

The default selector is `html.dark`. You can change it by `darkSelector` field.

```yaml
shiki:
  autoInjectCSS: "class"
  darkSelector: "html.dark"
```

### Custom Theme

You can use your custom theme by not using string, but an object with `name` and `path` fields.

The path should point to a [textMate theme json file](https://github.com/shikijs/textmate-grammars-themes/blob/main/packages/tm-themes/themes/dark-plus.json)

```yaml
shiki:
  theme:
    name: "custom"
    path: "path/to/custom.json"
```

```yaml
shiki:
  themes:
    dark:
      name: "custom-dark"
      path: "path/to/custom-dark.json"
    light:
      name: "custom-light"
      path: "path/to/custom-light.json"
```

