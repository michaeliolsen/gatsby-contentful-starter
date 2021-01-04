import React from "react"
import { Link, graphql } from "gatsby"
import { BLOCKS } from "@contentful/rich-text-types"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"

function embeddedAsset(node) {
  return (
    <img
      style={{
        maxWidth: "100%",
      }}
      src={node?.data?.target?.fields?.file["en-US"]?.url}
      alt=""
    />
  )
}

const BlogPostContentfulTemplate = ({ data, pageContext, location }) => {
  const post = data.contentfulPost
  const siteTitle = data.site.siteMetadata.title
  const { previous, next } = pageContext
  const json = post?.content?.internal?.content
  const docContent = json ? JSON.parse(json) : null
  const options = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: node => embeddedAsset(node),
    },
  }
  return (
    <Layout location={location} title={siteTitle}>
      <SEO title={post.title} description={post.subtitle} />
      <article itemScope itemType="http://schema.org/Article">
        <img src={post.image?.fluid?.src} alt="" />
        <header>
          <h1
            itemProp="headline"
            style={{
              marginTop: rhythm(1),
              marginBottom: 0,
            }}
          >
            {post.title}
          </h1>
        </header>
        {documentToReactComponents(docContent, options)}
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
        <footer>
          <Bio />
        </footer>
      </article>

      <nav>
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.slug} rel="prev">
                ← {previous.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.slug} rel="next">
                {next.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export default BlogPostContentfulTemplate

export const pageQuery = graphql`
  query BlogPostContentfulBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    contentfulPost(slug: { eq: $slug }) {
      title
      subtitle
      author
      image {
        fluid {
          src
        }
      }
      content {
        internal {
          content
        }
      }
    }
  }
`
