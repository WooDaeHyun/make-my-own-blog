import React, { FunctionComponent, useMemo } from 'react'
import styled from '@emotion/styled'
import Introduction from 'components/Main/Introduction'
import CategoryList from 'components/Main/CategoryList'
import PostList from 'components/Main/PostList'
import { graphql } from 'gatsby'
import { PostListItemType } from 'types/PostItem.types'
import { IGatsbyImageData } from 'gatsby-plugin-image'
import queryString, { ParsedQuery } from 'query-string'
import Template from 'components/Common/Template'
import { Link } from 'gatsby'

type IndexPageProps = {
  location: {
    search: string
  }
  data: {
    allMarkdownRemark: {
      edges: PostListItemType[]
    }
    file: {
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData
      }
    }
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`

const BottomContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  margin-top: 25px;
  width: 100%;

  @media (max-width: 1400px) {
    flex-direction: column;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 50px;
    padding: 0 20px;
  }
`

const BottomLeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 60px;
  align-items: center;

  @media (max-width: 1400px) {
    flex-direction: column;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 50px;
    padding: 0 20px;
  }
`

const BottomRightContainer = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: 1400px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 50px;
    padding: 0 20px;
  }
`

const AboutMeLink = styled.a`
  display: flex;
  justify-content: center;
  font-size: 18px;
  font-weight: 400;
  align-items: center;
  margin-top: 50px;
  margin-left: 95px;
  width: 200px;
  height: 50px;
  border: 1px solid white;

  @media (max-width: 1400px) {
    flex-direction: column;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
    margin-bottom: 20px;
  }
`

const ContactInfo = styled.div`
  border: 1px solid #eaeaeb;
  width: 280px;
  height: 300px;
  margin-top: 50px;
  margin-left: 80px;
  padding: 10px 10px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    width: auto;
    margin-right: 30px;
    margin-bottom: 40px;
    padding: 50px 20px;
  }
`

const IndexPage: FunctionComponent<IndexPageProps> = function ({
  location: { search },
  data: {
    allMarkdownRemark: { edges },
    file: {
      childImageSharp: { gatsbyImageData },
    },
  },
}) {
  const parsed: ParsedQuery<string> = queryString.parse(search)
  const selectedCategory: string =
    typeof parsed.category !== 'string' || !parsed.category
      ? 'All'
      : parsed.category

  const categoryList = useMemo(
    () =>
      edges.reduce(
        (
          list: CategoryListProps['categoryList'],
          {
            node: {
              frontmatter: { categories },
            },
          }: PostType,
        ) => {
          categories.forEach(category => {
            if (list[category] === undefined) list[category] = 1
            else list[category]++
          })

          list['All']++

          return list
        },
        { All: 0 },
      ),
    [],
  )

  return (
    <Container>
      <Template>
        <Introduction profileImage={gatsbyImageData} />
        <BottomContainer>
          <BottomLeftContainer>
            <AboutMeLink href="/info">ABOUT ME</AboutMeLink>
            <CategoryList
              selectedCategory={selectedCategory}
              categoryList={categoryList}
            />
          </BottomLeftContainer>
          <BottomRightContainer>
            <PostList selectedCategory={selectedCategory} posts={edges} />
            <ContactInfo>
              <h3> ☎️ contact</h3>
              <br />
              <h3> 📨 E-mail : po668312@naver.com</h3>
              <br />
              <Link
                to="https://pinetree93.tistory.com"
                style={{ fontSize: 18, fontWeight: 400 }}
              >
                📝 Tistory : https://pinetree93.tistory.com
              </Link>
              <br />
            </ContactInfo>
          </BottomRightContainer>
        </BottomContainer>
      </Template>
    </Container>
  )
}

export default IndexPage

export const getPostList = graphql`
  query getPostList {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date, frontmatter___title] }
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            summary
            date(formatString: "YYYY.MM.DD.")
            categories
            thumbnail {
              childImageSharp {
                gatsbyImageData(width: 768, height: 400)
              }
            }
          }
        }
      }
    }
    file(name: { eq: "profile-image" }) {
      childImageSharp {
        gatsbyImageData(width: 120, height: 120)
      }
    }
  }
`
