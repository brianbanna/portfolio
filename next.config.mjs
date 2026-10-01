import { withContentlayer } from "next-contentlayer";

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "export",
	trailingSlash: true,
	env: {
		// Fixed at build so the footer year is identical on server and client
		NEXT_PUBLIC_BUILD_YEAR: String(new Date().getFullYear()),
	},
	images: {
		unoptimized: true,
	},
	pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
	experimental: {
		mdxRs: true,
	},
};

export default withContentlayer(nextConfig);
