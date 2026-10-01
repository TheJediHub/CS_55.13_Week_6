// Import the shared Layout component that wraps page content with site chrome
import Layout from '../../components/layout';
// Import helpers to list all post ids and to load one post's data by id
import { getAllPostIds, getPostData } from '../../lib/posts-firebase';
// Import Next.js Head to set page-specific metadata like the document title
import Head from 'next/head';
// Import the Date component that formats a date string for display
import Date from '../../components/date';
// Import CSS module utility classes for typography/styling
import utilStyles from '../../styles/utils.module.css';

// Export getStaticProps so Next.js can pre-render each post page at build time
export async function getStaticProps({ params }) {
  // Load the markdown post matching the dynamic [id] route param and await HTML conversion
  const postData = await getPostData(params.id);
  // Return an object telling Next.js what props to pass into the Post component
  return {
    // props is the object that becomes the Post component's props
    props: {
      // Pass the loaded post (title, date, contentHtml, etc.) into the page
      postData,
    },
  };
}

// Export getStaticPaths so Next.js knows which [id] values to pre-render
export async function getStaticPaths() {
  // Get an array of path objects like { params: { id: 'ssg-ssr' } } for every post
  const paths = await getAllPostIds();
  // Return the paths config Next.js needs for dynamic SSG routes
  return {
    // Tell Next.js to generate a static page for each path in the array
    paths,
    // If a request hits an unknown id, show a 404 instead of trying to generate it
    fallback: false,
  };
}

// Export the Post page component; Next.js passes postData from getStaticProps
export default function Post({ postData }) {
  // Return the JSX that makes up a single blog post page
  return (
    // Wrap the post in the shared Layout (no home prop, so post header style is used)
    <Layout>
      {/* Put page-specific head tags inside Head */}
      <Head>
        {/* Set the browser tab title to this post's title */}
        <title>{postData.title}</title>
      </Head>
      {/* Semantic article element wrapping the post content */}
      <article>
        {/* Large heading showing the post title */}
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        {/* Wrapper that styles the date with lighter text */}
        <div className={utilStyles.lightText}>
          {/* Render the Date component using this post's date string */}
          <Date dateString={postData.date} />
        </div>
        {/* Inject the converted markdown HTML into the page (trusted content from our posts) */}
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
}
