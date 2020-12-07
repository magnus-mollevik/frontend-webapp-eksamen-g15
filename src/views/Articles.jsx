import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import {
  ArticlesSection,
  PageNumberButtonsSection,
} from '../styles/StyledComponents';
import Banner from '../components/Banner';
import ArticlesUiButtons from '../components/ArticlesUiButtons';
import ArticleCard from '../components/ArticleCard';
import Footer from '../components/Footer';
import DetailedArticle from '../components/DetailedArticle';
import CreateArticleForm from '../components/CreateArticleForm';
import {
  getCategories,
  getArticles,
  getArticleByid,
} from '../utils/articleService';

const Articles = ({ match }) => {
  const [articlesList, setArticlesList] = useState([]);
  const articlesPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageNumbers, setPageNumbers] = useState([]);
  const [detailedArticle, setDetailedArticle] = useState(null);
  const [filterValue, setFilterValue] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [showArticleForm, setShowArticleForm] = useState(false);
  

  const changePage = (e) => {
    setCurrentPage(Number(e.target.id));
  };

  const generatePageNumbers = (list) => {
    const pageNumbersGenerated = [];
    for (let i = 1; i <= Math.ceil(list.length / articlesPerPage); i++) {
      pageNumbersGenerated.push(i);
    }
    return pageNumbersGenerated;
  };

  useEffect(() => {
    const fetchArticles = async () => {
      const { data } = await getArticles();
      if (!data.success) {
        console.log(data.message);
      } else {
        console.log(data.data);
        setArticlesList(data.data);
      }
    };

    const fetchCategories = async () => {
      const { data } = await getCategories();
      if (!data.success) {
        console.log(data.message);
      } else {
        console.log(data.data);
        setCategoryList(data.data);
      }
    };
    const redirecter = async () => {
      if (match.params.id) {
        const { data } = await getArticleByid(match.params.id);
        if (data.success) {
          setDetailedArticle(data.data);
        }
      }
    };
    redirecter();
    fetchArticles();
    fetchCategories();
  }, []);

  useEffect(() => {
    const setColorOnSelectedPageNumber = () => {
      pageNumbers.forEach((id) => {
        if (document.getElementById(id) !== null) {
          document.getElementById(id).style.backgroundColor = 'gray';
          if (id === currentPage) {
            document.getElementById(id).style.backgroundColor = 'black';
          }
        }
      });
    };
    if (pageNumbers.length < 1) {
      setPageNumbers(generatePageNumbers(articlesList));
    }
    if (detailedArticle === null) {
      setColorOnSelectedPageNumber();
    }
  }, [
    pageNumbers.length,
    detailedArticle,
    articlesList,
    currentPage,
    pageNumbers,
  ]);

  useEffect(() => {
    if (filterValue.length > 1) {
      const filter = articlesList.filter(
        (article) => article.category.name === filterValue
      );
      setFilteredArticles(filter);
      setPageNumbers(generatePageNumbers(filter));
      setCurrentPage(1);
    } else {
      setPageNumbers(generatePageNumbers(articlesList));
    }
  }, [filterValue, articlesList]);

  const initCurrentArticles = (list) => {
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = list.slice(indexOfFirstArticle, indexOfLastArticle);
    return currentArticles;
  };

  return (
    <>
      {showArticleForm ? (
        <>
          <Banner bannerTitle="Ny artikkel" />
          <CreateArticleForm
            setCategoryList={setCategoryList}
            categoryList={categoryList}
            setShowArticleForm={setShowArticleForm}
            setDetailedArticle={setDetailedArticle}
          />
          <Footer orgnr="007 007 007" email="lg@lgror.no" tlf="99 00 00 00" />
        </>
      ) : (
        <>
          {detailedArticle === null ? (
            <>
              <Banner bannerTitle="Fagartikler" />
              <ArticlesSection>
                <ArticlesUiButtons
                  filterValue={filterValue}
                  setFilterValue={setFilterValue}
                  categoryList={categoryList}
                  setShowArticleForm={setShowArticleForm}
                />
                {filterValue.length > 1
                  ? initCurrentArticles(
                      filteredArticles
                    ).map((article, index) => (
                      <ArticleCard
                        key={index}
                        article={article}
                        setDetailedArticle={setDetailedArticle}
                        match={match}
                      />
                    ))
                  : initCurrentArticles(articlesList).map((article, index) => (
                      <ArticleCard
                        key={index}
                        article={article}
                        setDetailedArticle={setDetailedArticle}
                        match={match}
                      />
                    ))}
                <PageNumberButtonsSection>
                  {pageNumbers.map((number) => (
                    <button
                      type="button"
                      key={number}
                      id={number}
                      onClick={changePage}
                    >
                      {number}
                    </button>
                  ))}
                </PageNumberButtonsSection>
              </ArticlesSection>
            </>
          ) : (
            <>
              {detailedArticle.image !== undefined ? (
                <Banner
                  bannerTitle={detailedArticle.title}
                  imageurl={detailedArticle.image.file_path}
                />
              ) : (
                <Banner bannerTitle={detailedArticle.title} />
              )}
              <DetailedArticle
                detailedArticle={detailedArticle}
                setDetailedArticle={setDetailedArticle}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default Articles;
