# Oukraina / next

The public experimental space for Oukraina.

**Live:** https://next.oukraina.com  
**Repository:** https://github.com/Oukraina/next

This is where we prototype ideas, interfaces, tools and ways of connecting people, knowledge and capabilities. Experiments can remain unfinished. Only deliberately selected work needs to move to the main Oukraina website.

## Visual direction

- The ring is the basic Oukraina mark.
- Keep the visual language minimal, neutral and durable.
- Support light and dark themes.
- Avoid decorative branding and unnecessary dependencies.
- Let projects and communities develop their own visual identities.

## Identity

**Oukraina — Україна**  
**Art of the states technology**

## Development

This first version uses plain HTML, CSS and JavaScript. No build step or framework is required.

## Commit convention

Use Conventional Commits: `type: short imperative description`.

Examples:

- `feat: add hero section`
- `fix: correct footer spacing`
- `chore: update dependencies`
- `docs: describe deployment process`
- `refactor: simplify theme handling`
- `style: adjust typography`
- `test: add metadata checks`

Prefer lowercase, concise English descriptions. Keep one logical change per commit. Use `feat!` or a `BREAKING CHANGE:` footer only when a change is intentionally incompatible.

## Social previews

The homepage includes Open Graph and X card metadata. The current default preview is `/assets/og-image.svg`. Add page-specific metadata when introducing distinct shareable pages or content types.

## Deployment

GitHub Actions publishes the repository to GitHub Pages on every push to `main`. The custom domain is configured through `CNAME`.

## Working principle

Experiment openly. Learn with people. Curate deliberately.
