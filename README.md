# Hexo Highlight Shiki

Use [shiki](https://github.com/shikijs/shiki) as code block highlighter instead of builtin highlight.js or prism.js.

Currently only works in hexo version >= `7.0.0`, which has a better highlight extend api.

Otherwise please use official plugin [hexo-shiki-twoslash](https://github.com/shikijs/twoslash/tree/main/packages/hexo-shiki-twoslash) instead.

## Installation

1. Install thiis package.

   ```sh
   pnpm add hexo-highlight-shiki
   ```

2. Setup config

   ```yaml
   syntax_highlighter: "shiki"
   ```

3. Configure theme (default to `github-light`)

   ```yaml
   shiki:
     theme: "github-light"
   ```

4. Configure renderer if using [djot](htts://github.com/Pcrab/hexo-renderer-djot)

   ```yaml
   shiki:
     renderer: "djot"
   ```
