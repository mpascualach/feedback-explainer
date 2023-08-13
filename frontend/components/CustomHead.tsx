import Head from "next/head";
import { useRouter } from "next/router";

interface CustomHeadProps {
  title: string;
}

export const CustomHead: React.FC<CustomHeadProps> = ({ title }) => {
  const router = useRouter();
  const isDev = process.env.NODE_ENV === "development";

  // Conditionally modify the title when in development
  const modifiedTitle = isDev ? `${title} - dev` : title;

  return (
    <Head>
      <title>{modifiedTitle}</title>
      {/* Add other meta tags or links here */}
    </Head>
  );
};
