/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

// module.exports = nextConfig

module.exports = {
  reactStrictMode: true,
  module: {
    loaders: [
      { test: /\.css$/, loader: "style-loader!css-loader" },
    ]
  }
};