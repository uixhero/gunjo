// Twitter renders the same card art as Open Graph for the industry door
// pages. Re-export the OG generator so a future tweak (chip count, palette)
// happens in one place. Next.js reads `alt` / `size` / `contentType` from
// this module too, and picks up `generateStaticParams` for the slug list.
export {
    default,
    alt,
    size,
    contentType,
    generateStaticParams,
} from "./opengraph-image";
