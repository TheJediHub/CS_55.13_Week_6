// Import the helper that reads markdown posts and returns them sorted by date
import { getSortedPostsData } from '../lib/posts-firebase';
// Import the Date component that formats a date string for display
import Date from '../components/date';
// Import Next.js Head to set page metadata like the document title
import Head from 'next/head';
// Import Next.js Link for client-side navigation between pages
import Link from 'next/link';
// Import the shared Layout component and the siteTitle string from layout.js
import Layout, { siteTitle } from '../components/layout';
// Import CSS module utility classes for typography/styling
import utilStyles from '../styles/utils.module.css';

// Export getStaticProps so Next.js can pre-render this page at build time
export async function getStaticProps() {
  // Call the helper to get all blog posts sorted by date
  const allPostsData = await getSortedPostsData();
  // Return an object telling Next.js what props to pass into the page component
  return {
    // props is the object that becomes the Home component's props
    props: {
      // Pass the sorted posts array into the page as allPostsData
      allPostsData,
    },
  };
}

// Export this page component as the default so Next.js can render the home route
export default function Home({ allPostsData }) {
  // Return the JSX that makes up the home page UI
  return (
    // Wrap content in Layout and pass home so the home-page header style is used
    <Layout home>
      {/* Put page-specific head tags inside Head */}
      <Head>
        {/* Set the browser tab title using the shared siteTitle value */}
        <title>{siteTitle}</title>
      </Head>
      {/* Section styled with the headingMd utility class */}
      <section className={utilStyles.headingMd}>
        {/* Short personal introduction paragraph */}
        <p>Hello!  My name is Jedidiah but you can call me Jed, and I am improving my coding and timeliness in this class!    </p>
        {/* Paragraph explaining this is a sample Next.js tutorial site */}
        <p>
          (This is a sample website - you’ll be building a site like this on{' '}
          {/* External link to the official Next.js Learn tutorial */}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
        {/* Paragraph with an internal Link to the first blog post page */}
        <p>Here is the <Link href="/posts/first-post">link</Link> to my first post!


        </p>
      </section>
      {/* Blog list section combining heading and padding utility classes */}
      <section className={` ${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        {/* Section heading for the blog post list */}
        <h2 className={utilStyles.headingLg}>Blog</h2>
        {/* Unordered list that will hold each blog post entry */}
        <ul className={utilStyles.list}>
          {/* Loop over every post and render one list item per post */}
          {allPostsData.map(({ id, date, title }) => (
            // Use the post id as React's key so list updates stay efficient
            <li className={utilStyles.listItem} key={id}>
              {/* Link to the dynamic post page using that post's id in the URL */}
              <Link href={`/posts/${id}`}>{title}</Link>
              {/* Line break between the title link and the date */}
              <br />
              {/* Smaller, lighter text wrapper around the formatted date */}
              <small className={utilStyles.lightText}>
                {/* Render the Date component with this post's date string */}
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
