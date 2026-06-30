// Twitter renders the same card art as Open Graph for this page. Re-export
// the OG generator so a future tweak (e.g. tighter copy) only happens in one
// place. Next.js reads `alt`/`size`/`contentType` from this module too.
export { default, alt, size, contentType } from "./opengraph-image";
