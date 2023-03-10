import { getPrismicClient } from "@/services/prismic";
import { GetStaticPaths, GetStaticProps } from "next";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { RichText } from "prismic-dom";
import { ParsedUrlQuery } from "querystring";
import { useEffect } from "react";

import styles from "../post.module.scss";

interface PostPreview {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

interface Params extends ParsedUrlQuery {
  slug: string;
}

export default function PostPreview({ post }: PostPreview) {
  const { data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if(data?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [data])

  return (
    <>
      <Head>
        <title>{post.title} | ig.news</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className={`${styles.postContent} ${styles.previewContent}`}
          />
          <div className={styles.continueReading}>
            Wanna continue reading? 
            <Link href="/" legacyBehavior>
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // @ts-ignore
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID("posts", String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date!).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };

  return {
    props: {
      post,
    },
    redirect: 60 * 30 //30 minutes
  };
};
